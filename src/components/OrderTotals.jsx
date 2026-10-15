import { formatPrice } from '../utils/format'

/**
 * Subtotal / shipping / total rows shared by Cart, Checkout and Order Success.
 * `shipping` may be a number or a label (e.g. "Free standard").
 */
export default function OrderTotals({ subtotal, shipping, discount = 0, total, totalLabel = 'Total', className = '' }) {
  const shippingText = typeof shipping === 'number' ? (shipping === 0 ? 'Free' : formatPrice(shipping)) : shipping
  return (
    <dl className={`space-y-3.5 text-sm ${className}`}>
      <div className="flex justify-between gap-4">
        <dt className="text-muted">Subtotal</dt>
        <dd className="font-medium tabular-nums">{formatPrice(subtotal)}</dd>
      </div>
      <div className="flex justify-between gap-4">
        <dt className="text-muted">Shipping</dt>
        <dd className="font-medium tabular-nums">{shippingText}</dd>
      </div>
      {discount > 0 && <div className="flex justify-between gap-4 text-[#47734d]"><dt>WELCOME5 discount</dt><dd className="font-medium tabular-nums">−{formatPrice(discount)}</dd></div>}
      <div className="flex justify-between gap-4 border-t border-line pt-4 text-base">
        <dt className="font-semibold">{totalLabel}</dt>
        <dd className="font-semibold tabular-nums">{formatPrice(total)}</dd>
      </div>
    </dl>
  )
}
