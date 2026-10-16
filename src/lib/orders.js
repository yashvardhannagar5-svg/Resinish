import { NOT_CONFIGURED_MESSAGE, supabase } from './supabase'

/**
 * Saves an order through the place_order database function (see supabase/schema.sql).
 * Card details are intentionally NOT part of this payload — they never leave the checkout form.
 */
export async function placeOrder({ values, items, shipping, shippingPrice, subtotal, discount, total, promoCode, deliveryWindow }) {
  if (!supabase) throw new Error(NOT_CONFIGURED_MESSAGE)
  const { data, error } = await supabase.rpc('place_order', {
    p_order: {
      email: values.email.trim(),
      phone: values.phone.trim(),
      first_name: values.firstName.trim(),
      last_name: values.lastName.trim(),
      address: values.address.trim(),
      apartment: values.apartment.trim(),
      city: values.city.trim(),
      state: values.state.trim(),
      postal_code: values.postalCode.trim(),
      country: values.country,
      shipping_method: shipping.id,
      shipping_label: shipping.label,
      promo_code: discount > 0 ? promoCode.trim().toUpperCase() : null,
      subtotal,
      discount,
      shipping_cost: shippingPrice,
      total,
      delivery_from: deliveryWindow[0],
      delivery_to: deliveryWindow[1],
    },
    p_items: items.map((item) => ({
      product_id: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      color_name: item.color?.name ?? null,
      custom_note: item.customNote || null,
      image: item.image ?? null,
    })),
  })
  if (error) throw new Error(error.message)
  return data // { id, order_number }
}

/** Looks up an order by number plus the email it was placed with (or the signed-in owner). */
export async function trackOrder(orderNumber, email) {
  if (!supabase) throw new Error(NOT_CONFIGURED_MESSAGE)
  const { data, error } = await supabase.rpc('track_order', {
    p_order_number: orderNumber.trim(),
    p_email: email.trim(),
  })
  if (error) throw new Error(error.message)
  return data // null when nothing matches
}
