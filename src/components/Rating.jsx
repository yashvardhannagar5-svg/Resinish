import { Star } from 'lucide-react'

const Stars = ({ className }) =>
  Array.from({ length: 5 }, (_, i) => (
    <Star key={i} aria-hidden="true" className={className} strokeWidth={1.5} />
  ))

/** Five stars with fractional fill. */
export default function Rating({ value, size = 'size-3.5', className = '' }) {
  const pct = Math.max(0, Math.min(100, (value / 5) * 100))
  return (
    <span
      role="img"
      aria-label={`Rated ${value} out of 5`}
      className={`relative inline-flex shrink-0 ${className}`}
    >
      <span className="flex gap-0.5 text-ink/20">
        <Stars className={`${size} fill-current`} />
      </span>
      <span className="absolute inset-0 flex gap-0.5 overflow-hidden text-ink" style={{ width: `${pct}%` }}>
        <Stars className={`${size} shrink-0 fill-current`} />
      </span>
    </span>
  )
}
