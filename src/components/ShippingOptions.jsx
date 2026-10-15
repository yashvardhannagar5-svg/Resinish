import { formatPrice } from '../utils/format'

/** Radio cards for the shipping method. */
export default function ShippingOptions({ methods, value, onChange }) {
  return (
    <div className="grid gap-3">
      {methods.map((method) => {
        const checked = method.id === value
        return (
          <label
            key={method.id}
            className={`flex cursor-pointer items-center gap-4 rounded-md border bg-surface px-5 py-4.5 transition-colors duration-200 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink ${
              checked ? 'border-ink' : 'border-line-strong hover:border-ink/40'
            }`}
          >
            <input
              type="radio"
              name="shippingMethod"
              value={method.id}
              checked={checked}
              onChange={() => onChange(method.id)}
              className="sr-only"
            />
            <span
              aria-hidden="true"
              className={`grid size-4.5 shrink-0 place-items-center rounded-full border transition-colors ${
                checked ? 'border-ink' : 'border-line-strong'
              }`}
            >
              <span className={`size-2 rounded-full bg-ink transition-transform duration-200 ${checked ? 'scale-100' : 'scale-0'}`} />
            </span>
            <span className="flex-1">
              <span className="block text-[0.9375rem] font-semibold">{method.label}</span>
              <span className="block text-sm text-muted">{method.description}</span>
            </span>
            <span className="text-[0.9375rem] font-semibold tabular-nums">
              {method.price === 0 ? 'Free' : formatPrice(method.price)}
            </span>
          </label>
        )
      })}
    </div>
  )
}
