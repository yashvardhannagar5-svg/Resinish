import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { ButtonLink } from './Button'
import CartItem from './CartItem'
import CartEmpty from './CartEmpty'
import { selectSubtotal, selectTotalItems, useCartStore } from '../store/cartStore'
import { useScrollLock } from '../hooks/useScrollLock'
import { formatPrice } from '../utils/format'

const EASE = [0.22, 1, 0.36, 1]

export default function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen)
  const closeCart = useCartStore((s) => s.closeCart)
  const items = useCartStore((s) => s.items)
  const totalItems = useCartStore(selectTotalItems)
  const subtotal = useCartStore(selectSubtotal)

  const closeButton = useRef(null)
  const returnFocus = useRef(null)

  useScrollLock(isOpen)

  // Escape to close; move focus in on open and back out on close.
  useEffect(() => {
    if (!isOpen) return undefined
    returnFocus.current = document.activeElement
    const onKey = (e) => e.key === 'Escape' && closeCart()
    window.addEventListener('keydown', onKey)
    const t = setTimeout(() => closeButton.current?.focus(), 60)
    return () => {
      window.removeEventListener('keydown', onKey)
      clearTimeout(t)
      const el = returnFocus.current
      if (el && document.contains(el)) el.focus?.({ preventScroll: true })
    }
  }, [isOpen, closeCart])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[70]">
          <motion.div
            aria-hidden="true"
            onClick={closeCart}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="absolute inset-0 bg-ink/35"
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-drawer-title"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.42, ease: EASE }}
            className="absolute inset-y-0 right-0 flex w-full max-w-[28rem] flex-col bg-canvas shadow-[0_0_60px_rgba(0,0,0,0.12)] max-xs:max-w-none"
          >
            <header className="flex h-18 shrink-0 items-center justify-between border-b border-line px-5 sm:px-8">
              <h2 id="cart-drawer-title" className="eyebrow text-[0.8125rem]">
                Your Cart{' '}
                <span className="text-muted tabular-nums">({totalItems})</span>
              </h2>
              <button
                ref={closeButton}
                type="button"
                onClick={closeCart}
                aria-label="Close cart"
                className="-mr-2.5 grid size-11 place-items-center rounded-full transition-colors hover:bg-black/[0.05]"
              >
                <X aria-hidden="true" className="size-5" strokeWidth={1.6} />
              </button>
            </header>

            {items.length === 0 ? (
              <div className="grid flex-1 place-items-center px-6 pb-16">
                <CartEmpty onNavigate={closeCart} />
              </div>
            ) : (
              <>
                <ul className="flex-1 overflow-y-auto overscroll-contain px-5 sm:px-8" aria-label="Items in your cart">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.li
                        key={item.key}
                        layout="position"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.15 } }}
                        transition={{ duration: 0.25 }}
                        className="border-b border-line py-6 last:border-b-0"
                      >
                        <CartItem item={item} onNavigate={closeCart} />
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>

                <footer className="shrink-0 border-t border-line px-5 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-8">
                  <dl className="space-y-2.5 text-sm">
                    <div className="flex justify-between">
                      <dt className="font-semibold">Subtotal</dt>
                      <dd className="font-semibold tabular-nums">{formatPrice(subtotal)}</dd>
                    </div>
                    <div className="flex justify-between text-muted">
                      <dt>Shipping</dt>
                      <dd>Calculated at checkout</dd>
                    </div>
                  </dl>
                  <div className="mt-6 grid gap-3">
                    <ButtonLink to="/checkout" onClick={closeCart} className="w-full">
                      Checkout
                    </ButtonLink>
                    <ButtonLink to="/cart" onClick={closeCart} variant="secondary" className="w-full">
                      View Cart
                    </ButtonLink>
                  </div>
                </footer>
              </>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  )
}
