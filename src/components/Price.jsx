import { formatPrice } from '../utils/format'

export default function Price({ price, originalPrice, className = '' }) {
  const onSale = originalPrice && originalPrice > price
  return (
    <p className={`flex items-baseline gap-2 tabular-nums ${className}`}>
      <span className={onSale ? 'text-accent' : undefined}>
        {onSale && <span className="sr-only">Sale price </span>}
        {formatPrice(price)}
      </span>
      {onSale && (
        <s className="text-sm text-muted">
          <span className="sr-only">Original price </span>
          {formatPrice(originalPrice)}
        </s>
      )}
    </p>
  )
}
