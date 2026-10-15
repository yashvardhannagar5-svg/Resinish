import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { ButtonLink } from '../components/Button'
import OrderLines from '../components/OrderLines'
import OrderTotals from '../components/OrderTotals'
import SimplePage from '../components/SimplePage'
import { useCartStore } from '../store/cartStore'
import { formatPrice } from '../utils/format'
import { readLastOrder, saveLastOrder } from '../utils/orderSession'

const dayFormat = new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' })

export default function OrderSuccess() {
  const location = useLocation()
  const clearCart = useCartStore((s) => s.clearCart)
  const order = location.state?.order ?? readLastOrder()

  // Clear the cart exactly once, after the confirmation has its data.
  // The flag stops a later back/refresh from clearing a new cart.
  useEffect(() => {
    const stored = readLastOrder()
    if (stored && !stored.cartCleared) {
      clearCart()
      saveLastOrder({ ...stored, cartCleared: true })
    }
  }, [clearCart])

  if (!order) {
    return (
      <SimplePage
        eyebrow="Order"
        title="No recent order."
        description="We couldn’t find an order from this session. Your cart and keepsakes are still here."
        action={{ to: '/shop', label: 'Shop resin pieces' }}
      />
    )
  }

  const [from, to] = order.deliveryWindow.map((d) => dayFormat.format(new Date(d)))

  return (
    <section aria-labelledby="success-title" className="shell pt-28 pb-24 md:pt-36 lg:pb-32">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="grid gap-14 lg:grid-cols-12 lg:gap-8"
      >
        <div className="lg:col-span-6">
          <p className="eyebrow flex items-center gap-3 text-muted">
            <span className="grid size-6 place-items-center rounded-full bg-ink text-canvas">
              <Check aria-hidden="true" className="size-3.5" strokeWidth={2.5} />
            </span>
            Order confirmed
          </p>
          <h1 id="success-title" className="display mt-7 text-[clamp(3.25rem,8vw,6.5rem)]">
            Thank you{order.customer?.firstName ? `, ${order.customer.firstName}` : ''}.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">Your resin keepsakes are being prepared.</p>

          <dl className="mt-12 grid max-w-md grid-cols-2 gap-8 border-y border-line py-8">
            <div>
              <dt className="eyebrow text-[0.6875rem] text-muted">Order</dt>
              <dd className="mt-2 text-xl font-semibold tracking-tight">#{order.number}</dd>
            </div>
            <div>
              <dt className="eyebrow text-[0.6875rem] text-muted">Total</dt>
              <dd className="mt-2 text-xl font-semibold tracking-tight tabular-nums">{formatPrice(order.total)}</dd>
            </div>
            <div className="col-span-2">
              <dt className="eyebrow text-[0.6875rem] text-muted">Estimated delivery</dt>
              <dd className="mt-2 text-[0.9375rem]">
                {from} – {to}
                <span className="text-muted">
                  {' '}
                  · {order.shippingLabel}
                  {order.customer?.city ? ` to ${order.customer.city}` : ''}
                </span>
              </dd>
            </div>
          </dl>

          <div className="mt-10 flex flex-col gap-3 xs:flex-row">
            <ButtonLink to="/">Continue Shopping</ButtonLink>
            <ButtonLink to="/shop" variant="secondary">
              View Products
            </ButtonLink>
          </div>
          <p className="mt-8 text-xs text-muted">This was a demo order — no payment was taken.</p>
        </div>

        <aside aria-labelledby="receipt-title" className="self-start rounded-md bg-surface p-6 sm:p-8 lg:col-span-5 lg:col-start-8">
          <h2 id="receipt-title" className="eyebrow mb-7 text-[0.8125rem]">
            Order Summary
          </h2>
          <OrderLines items={order.items} />
          <OrderTotals
            subtotal={order.subtotal}
            shipping={order.shipping}
            discount={order.discount}
            total={order.total}
            className="mt-6 border-t border-line pt-6"
          />
        </aside>
      </motion.div>
    </section>
  )
}
