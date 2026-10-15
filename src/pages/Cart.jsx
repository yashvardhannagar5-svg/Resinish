import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, Lock } from 'lucide-react'
import { ButtonLink } from '../components/Button'
import CartItem from '../components/CartItem'
import CartEmpty from '../components/CartEmpty'
import { selectSubtotal, selectTotalItems, useCartStore } from '../store/cartStore'
import OrderTotals from '../components/OrderTotals'

export default function Cart() {
  const items = useCartStore((s) => s.items)
  const clearCart = useCartStore((s) => s.clearCart)
  const totalItems = useCartStore(selectTotalItems)
  const subtotal = useCartStore(selectSubtotal)

  return (
    <section aria-labelledby="cart-title" className="shell pt-28 pb-24 md:pt-36 lg:pb-32">
      <header className="flex flex-wrap items-end justify-between gap-6 border-b border-line pb-8 md:pb-10">
        <div>
          <p className="eyebrow mb-5 text-muted">
            {totalItems} {totalItems === 1 ? 'item' : 'items'}
          </p>
          <h1 id="cart-title" className="display text-[clamp(2.75rem,7vw,5.5rem)]">
            Your cart.
          </h1>
        </div>
        {items.length > 0 && (
          <Link to="/shop" className="inline-flex items-center gap-2 pb-2 text-sm font-semibold hover:underline">
            <ArrowLeft aria-hidden="true" className="size-4" />
            Continue shopping
          </Link>
        )}
      </header>

      {items.length === 0 ? (
        <CartEmpty className="py-28" />
      ) : (
        <div className="mt-4 grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7 xl:col-span-8">
            <ul aria-label="Items in your cart">
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.li
                    key={item.key}
                    layout="position"
                    exit={{ opacity: 0, transition: { duration: 0.15 } }}
                    className="border-b border-line py-8"
                  >
                    <CartItem item={item} variant="full" />
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
            <button
              type="button"
              onClick={clearCart}
              className="mt-4 py-3 text-xs font-semibold tracking-[0.14em] text-muted uppercase underline-offset-4 hover:text-ink hover:underline"
            >
              Clear cart
            </button>
          </div>

          <aside
            aria-labelledby="summary-title"
            className="self-start rounded-md bg-surface p-6 sm:p-8 lg:sticky lg:top-24 lg:col-span-5 lg:mt-8 xl:col-span-4"
          >
            <h2 id="summary-title" className="eyebrow text-[0.8125rem]">
              Order Summary
            </h2>
            <OrderTotals subtotal={subtotal} shipping="Calculated at checkout" total={subtotal} totalLabel="Estimated total" className="mt-8" />
            <p className="mt-3 text-xs text-muted">Free standard shipping above ₹1,000. Express available at checkout.</p>
            <ButtonLink to="/checkout" className="mt-8 w-full">
              Proceed to checkout
            </ButtonLink>
            <p className="mt-5 flex items-center justify-center gap-2 text-xs text-muted">
              <Lock aria-hidden="true" className="size-3.5" strokeWidth={1.75} />
              Demo checkout · card details not stored
            </p>
          </aside>
        </div>
      )}
    </section>
  )
}
