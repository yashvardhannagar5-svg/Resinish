import { memo, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Check } from 'lucide-react'
import Price from './Price'
import ColorSwatches from './ColorSwatches'
import { getCategory } from '../data/products'
import { useCartStore } from '../store/cartStore'
import { srcSet, withWidth } from '../utils/image'

const CARD_SIZES = '(min-width: 1024px) 24vw, (min-width: 768px) 46vw, 78vw'

function ProductCard({ product, className = '', sizes = CARD_SIZES }) {
  const addItem = useCartStore((state) => state.addItem)
  const openCart = useCartStore((state) => state.openCart)
  const [added, setAdded] = useState(false)
  const timer = useRef(0)

  useEffect(() => () => clearTimeout(timer.current), [])

  const href = `/product/${product.slug}`
  const image = product.images[0]
  const categoryName = getCategory(product.category)?.name

  const handleAdd = () => {
    addItem(product, product.colors?.[0])
    openCart()
    setAdded(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setAdded(false), 1800)
  }

  return (
    <article className={`group/card flex flex-col ${className}`}>
      {/* Decorative duplicate of the title link: hidden from AT and tab order. */}
      <Link
        to={href}
        tabIndex={-1}
        aria-hidden="true"
        className="relative block aspect-[4/5] overflow-hidden rounded-md bg-mist"
      >
        <img
          src={withWidth(image, 800)}
          srcSet={srcSet(image, [400, 600, 800, 1100])}
          sizes={sizes}
          alt=""
          loading="lazy"
          decoding="async"
          className="size-full object-cover transition-transform duration-[900ms] ease-premium group-hover/card:-translate-y-1 group-hover/card:scale-[1.03]"
        />
        {product.isNew && (
          <span className="eyebrow absolute top-4 left-4 rounded-full bg-canvas/90 px-2.5 py-1.5 text-[0.625rem]">
            New
          </span>
        )}
      </Link>

      <div className="mt-5 flex flex-1 flex-col">
        <p className="eyebrow text-[0.6875rem] text-muted">{categoryName}</p>
        <h3 className="mt-2 text-lg leading-snug font-semibold tracking-tight">
          <Link
            to={href}
            className="decoration-1 underline-offset-4 hover:underline"
          >
            {product.name}
          </Link>
        </h3>
        <div className="mt-2.5 flex items-center justify-between gap-4">
          <Price price={product.price} originalPrice={product.originalPrice} className="font-semibold" />
          <ColorSwatches colors={product.colors} />
        </div>

        <button
          type="button"
          onClick={handleAdd}
          aria-label={`Add ${product.name} to cart`}
          className="mt-5 inline-flex h-12 w-full items-center justify-center overflow-hidden rounded-full border border-line-strong text-[0.6875rem] font-semibold tracking-[0.16em] uppercase transition-[background-color,color,border-color] duration-300 ease-premium hover:border-ink hover:bg-ink hover:text-canvas"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={added ? 'added' : 'add'}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2"
            >
              {added ? (
                <>
                  <Check aria-hidden="true" className="size-3.5" strokeWidth={2.5} /> Added
                </>
              ) : (
                'Add to cart'
              )}
            </motion.span>
          </AnimatePresence>
        </button>
        <span className="sr-only" role="status">
          {added ? `${product.name} added to cart` : ''}
        </span>
      </div>
    </article>
  )
}

export default memo(ProductCard)
