-- Resin & Reverie: orders schema for Supabase.
-- Run this once in the Supabase dashboard: SQL Editor > New query > paste > Run.
-- Customer accounts come from Supabase Auth (auth.users), so no users table is needed.

create sequence if not exists public.order_number_seq start 10001;

create table if not exists public.orders (
  id             uuid primary key default gen_random_uuid(),
  order_number   text not null unique,
  user_id        uuid references auth.users (id) on delete set null,  -- null for guest checkout
  status         text not null default 'received'
                 check (status in ('received', 'preparing', 'shipped', 'delivered', 'cancelled')),
  payment_status text not null default 'demo',  -- no real payment is taken yet
  email          text not null,
  phone          text not null,
  first_name     text not null,
  last_name      text not null,
  address        text not null,
  apartment      text,
  city           text not null,
  state          text not null,
  postal_code    text not null,
  country        text not null,
  shipping_method text not null,
  shipping_label text not null,
  promo_code     text,
  subtotal       numeric(10, 2) not null check (subtotal >= 0),
  discount       numeric(10, 2) not null default 0 check (discount >= 0),
  shipping_cost  numeric(10, 2) not null default 0 check (shipping_cost >= 0),
  total          numeric(10, 2) not null check (total >= 0),
  delivery_from  timestamptz,
  delivery_to    timestamptz,
  created_at     timestamptz not null default now()
);

create table if not exists public.order_items (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid not null references public.orders (id) on delete cascade,
  product_id  text not null,
  name        text not null,
  price       numeric(10, 2) not null check (price >= 0),
  quantity    int not null check (quantity between 1 and 99),
  color_name  text,
  custom_note text,
  image       text
);

create index if not exists orders_user_id_idx on public.orders (user_id);
create index if not exists orders_email_idx on public.orders (lower(email));
create index if not exists order_items_order_id_idx on public.order_items (order_id);

-- Row Level Security: browsers can only READ their own orders. All writes go through place_order().
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

drop policy if exists "Customers read own orders" on public.orders;
create policy "Customers read own orders" on public.orders
  for select to authenticated using (user_id = auth.uid());

drop policy if exists "Customers read own order items" on public.order_items;
create policy "Customers read own order items" on public.order_items
  for select to authenticated
  using (exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid()));

revoke all on public.orders, public.order_items from anon, authenticated;
grant select on public.orders, public.order_items to authenticated;

-- place_order: used by checkout (guests and signed-in customers).
create or replace function public.place_order(p_order jsonb, p_items jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_number text;
  v_items_total numeric;
begin
  if jsonb_typeof(p_items) is distinct from 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'Your cart is empty.';
  end if;
  if jsonb_array_length(p_items) > 50 then
    raise exception 'Too many items in one order.';
  end if;
  if coalesce(p_order->>'email', '') !~ '^[^\s@]+@[^\s@]+\.[^\s@]{2,}$' then
    raise exception 'Enter a valid email address.';
  end if;

  select coalesce(sum((i->>'price')::numeric * (i->>'quantity')::int), 0)
    into v_items_total from jsonb_array_elements(p_items) i;

  -- Basic consistency checks on the totals the browser sent.
  if v_items_total <> (p_order->>'subtotal')::numeric then
    raise exception 'Order totals do not match. Please refresh and try again.';
  end if;
  if (p_order->>'subtotal')::numeric + (p_order->>'shipping_cost')::numeric - (p_order->>'discount')::numeric
     <> (p_order->>'total')::numeric then
    raise exception 'Order totals do not match. Please refresh and try again.';
  end if;

  v_number := 'RS-' || nextval('public.order_number_seq');

  insert into public.orders (
    order_number, user_id, email, phone, first_name, last_name, address, apartment, city, state,
    postal_code, country, shipping_method, shipping_label, promo_code,
    subtotal, discount, shipping_cost, total, delivery_from, delivery_to
  ) values (
    v_number, auth.uid(),
    trim(p_order->>'email'), trim(p_order->>'phone'), trim(p_order->>'first_name'), trim(p_order->>'last_name'),
    trim(p_order->>'address'), nullif(trim(p_order->>'apartment'), ''), trim(p_order->>'city'),
    trim(p_order->>'state'), trim(p_order->>'postal_code'), trim(p_order->>'country'),
    p_order->>'shipping_method', p_order->>'shipping_label', nullif(p_order->>'promo_code', ''),
    (p_order->>'subtotal')::numeric, (p_order->>'discount')::numeric, (p_order->>'shipping_cost')::numeric,
    (p_order->>'total')::numeric,
    nullif(p_order->>'delivery_from', '')::timestamptz, nullif(p_order->>'delivery_to', '')::timestamptz
  ) returning id into v_id;

  insert into public.order_items (order_id, product_id, name, price, quantity, color_name, custom_note, image)
  select v_id, i->>'product_id', i->>'name', (i->>'price')::numeric, (i->>'quantity')::int,
         i->>'color_name', i->>'custom_note', i->>'image'
  from jsonb_array_elements(p_items) i;

  return jsonb_build_object('id', v_id, 'order_number', v_number);
end;
$$;

-- track_order: order number + the email it was placed with (or the signed-in owner).
create or replace function public.track_order(p_order_number text, p_email text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.orders;
begin
  select * into v_order
  from public.orders o
  where upper(o.order_number) = upper(trim(p_order_number))
    and (lower(o.email) = lower(trim(p_email)) or (auth.uid() is not null and o.user_id = auth.uid()));

  if not found then
    return null;
  end if;

  return jsonb_build_object(
    'order_number', v_order.order_number,
    'status', v_order.status,
    'total', v_order.total,
    'created_at', v_order.created_at,
    'delivery_from', v_order.delivery_from,
    'delivery_to', v_order.delivery_to,
    'shipping_label', v_order.shipping_label,
    'items', (
      select coalesce(jsonb_agg(jsonb_build_object('name', i.name, 'quantity', i.quantity)), '[]'::jsonb)
      from public.order_items i where i.order_id = v_order.id
    )
  );
end;
$$;

revoke all on function public.place_order(jsonb, jsonb) from public;
revoke all on function public.track_order(text, text) from public;
grant execute on function public.place_order(jsonb, jsonb) to anon, authenticated;
grant execute on function public.track_order(text, text) to anon, authenticated;
