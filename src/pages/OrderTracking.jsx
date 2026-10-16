import { useState } from 'react'
import { Link } from 'react-router-dom'
import { trackOrder } from '../lib/orders'
import { useAuthStore } from '../store/authStore'
import { formatPrice } from '../utils/format'

const statusText = {
  received: 'Received — your handmade pieces are being prepared.',
  preparing: 'Preparing — your pieces are being finished by hand.',
  shipped: 'Shipped — your order is on its way.',
  delivered: 'Delivered — we hope you love it.',
  cancelled: 'Cancelled.',
}

const dayFormat = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short' })

export default function OrderTracking() {
  const user = useAuthStore((s) => s.user)
  const [number, setNumber] = useState('')
  const [email, setEmail] = useState('')
  const [state, setState] = useState({ phase: 'idle' }) // idle | loading | found | missing | error
  const inputClass = 'h-12 min-w-0 flex-1 rounded-md border border-line-strong bg-transparent px-4'

  const submit = async (event) => {
    event.preventDefault()
    setState({ phase: 'loading' })
    try {
      const order = await trackOrder(number, user ? '' : email)
      setState(order ? { phase: 'found', order } : { phase: 'missing' })
    } catch (error) {
      setState({ phase: 'error', message: error.message })
    }
  }

  const { phase, order } = state
  return <section className="shell min-h-[75svh] pt-32 pb-24 md:pt-40">
    <p className="eyebrow text-muted">Order tracking</p>
    <h1 className="display mt-5 text-[clamp(3rem,8vw,5rem)]">Where is it?</h1>
    <p className="mt-5 max-w-lg text-muted">
      {user ? 'Enter the order number from your confirmation.' : 'Enter the order number from your confirmation and the email you used at checkout.'}
    </p>
    <form className="mt-10 flex max-w-xl flex-col gap-3" onSubmit={submit}>
      <label className="sr-only" htmlFor="order-number">Order number</label>
      <input id="order-number" value={number} onChange={(e) => setNumber(e.target.value)} placeholder="e.g. RS-10001" className={inputClass} required />
      {!user && <>
        <label className="sr-only" htmlFor="order-email">Email</label>
        <input id="order-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email used at checkout" className={inputClass} required />
      </>}
      <button className="h-12 rounded-full bg-ink px-6 text-sm font-semibold text-canvas disabled:cursor-wait" type="submit" disabled={phase === 'loading'}>
        {phase === 'loading' ? 'Looking…' : 'Track order'}
      </button>
    </form>
    {phase === 'found' && <div className="mt-8 max-w-xl border-t border-line pt-6">
      <p className="font-semibold">Order #{order.order_number} · {formatPrice(Number(order.total))}</p>
      <p className="mt-2 text-sm text-muted">Status: {statusText[order.status] ?? order.status}</p>
      {order.delivery_from && order.delivery_to && <p className="mt-1 text-sm text-muted">Estimated delivery: {dayFormat.format(new Date(order.delivery_from))} – {dayFormat.format(new Date(order.delivery_to))} · {order.shipping_label}</p>}
      <ul className="mt-4 space-y-1 text-sm">{order.items.map((item, i) => <li key={i}>{item.quantity} × {item.name}</li>)}</ul>
    </div>}
    {phase === 'missing' && <p role="status" className="mt-8 text-sm text-muted">We couldn’t find an order matching those details. Check the number{user ? '' : ' and email'} and try again. <Link to="/shop" className="underline">Keep shopping</Link></p>}
    {phase === 'error' && <p role="alert" className="mt-8 text-sm text-accent">{state.message}</p>}
  </section>
}
