import { Minus, Plus } from 'lucide-react'

const sizes = {
  sm: { box: 'h-9', btn: 'w-9', icon: 'size-3.5', text: 'w-7 text-sm' },
  md: { box: 'h-13', btn: 'w-12', icon: 'size-4', text: 'w-8 text-base' },
}

/**
 * [-] quantity [+]. Controlled; the parent decides what min/max mean.
 */
export default function QuantityStepper({
  value,
  onDecrease,
  onIncrease,
  min = 1,
  max = Infinity,
  label = 'Quantity',
  size = 'sm',
  className = '',
}) {
  const s = sizes[size]
  const btn = `grid ${s.btn} h-full place-items-center rounded-full transition-colors duration-200 hover:bg-black/[0.05] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent`

  return (
    <div
      role="group"
      aria-label={label}
      className={`inline-flex ${s.box} items-center rounded-full border border-line-strong ${className}`}
    >
      <button
        type="button"
        onClick={onDecrease}
        disabled={value <= min}
        aria-label={`Decrease ${label.toLowerCase()}`}
        className={btn}
      >
        <Minus aria-hidden="true" className={s.icon} strokeWidth={1.75} />
      </button>
      <output aria-live="polite" className={`${s.text} text-center font-semibold tabular-nums`}>
        {value}
      </output>
      <button
        type="button"
        onClick={onIncrease}
        disabled={value >= max}
        aria-label={`Increase ${label.toLowerCase()}`}
        className={btn}
      >
        <Plus aria-hidden="true" className={s.icon} strokeWidth={1.75} />
      </button>
    </div>
  )
}
