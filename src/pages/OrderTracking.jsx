import { useState } from 'react'
import { Link } from 'react-router-dom'
import { readLastOrder } from '../utils/orderSession'
import { formatPrice } from '../utils/format'

export default function OrderTracking() {
  const saved = readLastOrder()
  const [number, setNumber] = useState('')
  const [searched, setSearched] = useState(false)
  const match = saved && number.trim().toUpperCase() === saved.number.toUpperCase()
  return <section className="shell min-h-[75svh] pt-32 pb-24 md:pt-40">
    <p className="eyebrow text-muted">Order tracking</p>
    <h1 className="display mt-5 text-[clamp(3rem,8vw,5rem)]">Where is it?</h1>
    <p className="mt-5 max-w-lg text-muted">Enter the order number from your confirmation. This demo can show the most recent order saved in this browser.</p>
    <form className="mt-10 flex max-w-xl flex-col gap-3 sm:flex-row" onSubmit={(e) => { e.preventDefault(); setSearched(true) }}>
      <label className="sr-only" htmlFor="order-number">Order number</label>
      <input id="order-number" value={number} onChange={(e) => setNumber(e.target.value)} placeholder="e.g. RS-12345" className="h-12 min-w-0 flex-1 rounded-md border border-line-strong bg-transparent px-4" required />
      <button className="h-12 rounded-full bg-ink px-6 text-sm font-semibold text-canvas" type="submit">Track order</button>
    </form>
    {searched && (match ? <div className="mt-8 max-w-xl border-t border-line pt-6">
      <p className="font-semibold">Order #{saved.number} · {formatPrice(saved.total)}</p>
      <p className="mt-2 text-sm text-muted">Status: Received — your handmade pieces are being prepared.</p>
      <Link to="/order-success" className="mt-4 inline-block text-sm font-semibold underline">View order details</Link>
    </div> : <p role="status" className="mt-8 text-sm text-muted">We couldn’t find that number in this browser’s demo order. Check the number or place a sample order.</p>)}
  </section>
}
