import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, RotateCcw, ShieldCheck, Truck } from 'lucide-react'
import { Button } from './Button'
import ColorSelector from './ColorSelector'
import Price from './Price'
import QuantityStepper from './QuantityStepper'
import { getCategory } from '../data/products'
import { useCartStore } from '../store/cartStore'

const LOW_STOCK = 25

function StockState({ stock }) {
  const state =
    stock <= 0
      ? { dot: 'bg-ink/30', text: 'Out of stock' }
      : stock <= LOW_STOCK
        ? { dot: 'bg-accent', text: `Low stock — only ${stock} left` }
        : { dot: 'bg-[#3c7a4f]', text: 'In stock, ready to ship' }
  return (
    <p className="flex items-center gap-2.5 text-sm">
      <span aria-hidden="true" className={`size-2 rounded-full ${state.dot}`} />
      {state.text}
    </p>
  )
}

const delivery = [
  { icon: Truck, title: 'Free standard delivery', text: 'Delivery estimate shown at checkout.' },
  { icon: RotateCcw, title: 'Handcrafted with care', text: 'Made to order with custom options.' },
  { icon: ShieldCheck, title: 'Personalised service', text: 'Questions about your custom piece? Contact our maker.' },
]

/**
 * Right-hand product information: title, price, variant + quantity
 * selection and purchase actions.
 */
export default function ProductPurchase({ product }) {
  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)
  const navigate = useNavigate()

  const [color, setColor] = useState(product.colors?.[0] ?? null)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [customNote, setCustomNote] = useState('')
  const timer = useRef(0)
  useEffect(() => () => clearTimeout(timer.current), [])

  const category = getCategory(product.category)
  const soldOut = product.stock <= 0
  const maxQty = Math.max(1, product.stock)

  const addToCart = () => {
    addItem(product, color, quantity, customNote.trim())
  }

  const handleAdd = () => {
    addToCart()
    openCart()
    setAdded(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setAdded(false), 1800)
  }

  const handleBuyNow = () => {
    addToCart()
    navigate('/checkout')
  }

  return (
    <div>
      <p className="eyebrow text-muted">
        <Link to={`/shop?category=${category.id}`} className="inline-block py-1 hover:text-ink">
          {category.name}
        </Link>
      </p>
      <h1 className="display mt-5 text-[clamp(2.75rem,5vw,4.5rem)]">{product.name}</h1>

      <p className="mt-4 text-sm text-muted">Handmade in small batches · Customise your piece</p>

      <Price
        price={product.price}
        originalPrice={product.originalPrice}
        className="mt-6 text-2xl font-semibold"
      />

      <p className="mt-6 text-base leading-relaxed text-muted">{product.description}</p>

      <div className="mt-8 space-y-8 border-t border-line pt-8">
        {product.colors?.length > 0 && (
          <ColorSelector colors={product.colors} value={color} onChange={setColor} />
        )}

        <label className="block text-sm font-semibold" htmlFor="custom-note">
          Make it yours <span className="font-normal text-muted">(optional)</span>
          <textarea id="custom-note" value={customNote} onChange={(event) => setCustomNote(event.target.value)} maxLength={180} rows={3} placeholder="Flower, colour, initials, or a note for our maker" className="mt-3 block w-full resize-y rounded-md border border-line-strong bg-transparent px-4 py-3 font-normal placeholder:text-muted/70 focus:border-ink focus:outline-none" />
        </label>

        <div>
          <p className="mb-4 text-sm font-semibold">Quantity</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
            <QuantityStepper
              size="md"
              value={quantity}
              max={maxQty}
              onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
              onIncrease={() => setQuantity((q) => Math.min(maxQty, q + 1))}
            />
            <StockState stock={product.stock} />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Button onClick={handleAdd} disabled={soldOut} className="w-full disabled:opacity-40">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={added ? 'added' : 'add'}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
                className="inline-flex items-center gap-2"
              >
                {added ? (
                  <>
                    <Check aria-hidden="true" className="size-4" strokeWidth={2.5} /> Added
                  </>
                ) : (
                  'Add to cart'
                )}
              </motion.span>
            </AnimatePresence>
          </Button>
          <Button variant="secondary" onClick={handleBuyNow} disabled={soldOut} className="w-full disabled:opacity-40">
            Buy now
          </Button>
        </div>
        <span className="sr-only" role="status">
          {added ? `${quantity} × ${product.name}${color ? `, ${color.name},` : ''} added to cart` : ''}
        </span>
      </div>

      <ul className="mt-10 space-y-5 border-t border-line pt-8">
        {delivery.map(({ icon: Icon, title, text }) => (
          <li key={title} className="flex gap-4">
            <Icon aria-hidden="true" className="mt-0.5 size-5 shrink-0" strokeWidth={1.5} />
            <div className="text-sm">
              <p className="font-semibold">{title}</p>
              <p className="mt-0.5 text-muted">{text}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
