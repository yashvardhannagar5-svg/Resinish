import { formatPrice } from '../utils/format'
import { withWidth } from '../utils/image'

/** Read-only list of ordered items (checkout summary, order confirmation). */
export default function OrderLines({ items, className = '' }) {
  return (
    <ul className={`divide-y divide-line ${className}`}>
      {items.map((item) => (
        <li key={item.key} className="flex gap-4 py-4 first:pt-0">
          <div className="relative shrink-0">
            <img
              src={withWidth(item.image, 160)}
              alt=""
              loading="lazy"
              decoding="async"
              className="aspect-[4/5] w-16 rounded-md bg-mist object-cover"
            />
            <span className="absolute -top-2 -right-2 grid h-5 min-w-5 place-items-center rounded-full bg-ink px-1 text-[0.6875rem] font-bold text-canvas tabular-nums">
              <span className="sr-only">Quantity </span>
              {item.quantity}
            </span>
          </div>
          <div className="min-w-0 flex-1 text-sm">
            <p className="font-semibold">{item.name}</p>
            {item.color && <p className="mt-0.5 text-muted">{item.color.name}</p>}
            {item.customNote && <p className="mt-0.5 text-muted">Custom request: {item.customNote}</p>}
            <p className="mt-0.5 text-muted tabular-nums">
              {item.quantity} × {formatPrice(item.price)}
            </p>
          </div>
          <p className="shrink-0 text-sm font-semibold tabular-nums">{formatPrice(item.price * item.quantity)}</p>
        </li>
      ))}
    </ul>
  )
}
