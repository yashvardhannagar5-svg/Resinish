import { memo } from 'react'
import { Link } from 'react-router-dom'
import QuantityStepper from './QuantityStepper'
import { maxQuantityFor, useCartStore } from '../store/cartStore'
import { formatPrice } from '../utils/format'
import { withWidth } from '../utils/image'

/**
 * One cart line. `compact` for the drawer, `full` for the cart page.
 * Reads actions from the store directly, so both views stay in sync.
 */
function CartItem({ item, variant = 'compact', onNavigate }) {
  const increaseQuantity = useCartStore((s) => s.increaseQuantity)
  const decreaseQuantity = useCartStore((s) => s.decreaseQuantity)
  const removeItem = useCartStore((s) => s.removeItem)

  const full = variant === 'full'
  const href = `/product/${item.slug}`
  const lineTotal = item.price * item.quantity

  return (
    <div className={`flex gap-4 ${full ? 'sm:gap-6' : ''}`}>
      <Link
        to={href}
        onClick={onNavigate}
        tabIndex={-1}
        aria-hidden="true"
        className={`block shrink-0 overflow-hidden rounded-md bg-mist ${
          full ? 'aspect-[4/5] w-24 sm:w-32' : 'aspect-[4/5] w-20'
        }`}
      >
        <img
          src={withWidth(item.image, full ? 320 : 200)}
          alt=""
          loading="lazy"
          decoding="async"
          className="size-full object-cover"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className={`font-semibold tracking-tight ${full ? 'text-lg' : 'text-[0.9375rem]'}`}>
              <Link to={href} onClick={onNavigate} className="decoration-1 underline-offset-4 hover:underline">
                {item.name}
              </Link>
            </h3>
            {item.color && (
              <p className="mt-1 flex items-center gap-2 text-sm text-muted">
                <span
                  aria-hidden="true"
                  className="size-2.5 rounded-full ring-1 ring-black/10 ring-inset"
                  style={{ backgroundColor: item.color.hex }}
                />
                {item.color.name}
              </p>
            )}
            {item.customNote && <p className="mt-1 text-sm text-muted">Custom request: {item.customNote}</p>}
            {full && <p className="mt-1 text-sm text-muted tabular-nums">{formatPrice(item.price)} each</p>}
          </div>
          <p className="shrink-0 text-[0.9375rem] font-semibold tabular-nums">
            <span className="sr-only">Line total </span>
            {formatPrice(lineTotal)}
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between gap-4 pt-4">
          <QuantityStepper
            value={item.quantity}
            max={maxQuantityFor(item)}
            onDecrease={() => decreaseQuantity(item.key)}
            onIncrease={() => increaseQuantity(item.key)}
            label={`${item.name} quantity`}
          />
          <button
            type="button"
            onClick={() => removeItem(item.key)}
            aria-label={`Remove ${item.name}${item.color ? ` (${item.color.name})` : ''} from cart`}
            className="-mr-2 px-2 py-3 text-xs font-semibold tracking-[0.14em] text-muted uppercase underline-offset-4 transition-colors hover:text-ink hover:underline"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  )
}

export default memo(CartItem)
