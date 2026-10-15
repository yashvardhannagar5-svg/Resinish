import { useRef } from 'react'

/**
 * Accessible colour radio group (arrow keys move the selection).
 */
export default function ColorSelector({ colors, value, onChange }) {
  const refs = useRef([])
  const selectedIndex = Math.max(0, colors.findIndex((c) => c.name === value?.name))

  const onKeyDown = (e) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key]
    if (!step) return
    e.preventDefault()
    const next = (selectedIndex + step + colors.length) % colors.length
    onChange(colors[next])
    refs.current[next]?.focus()
  }

  return (
    <fieldset>
      <legend className="text-sm">
        <span className="font-semibold">Colour</span>
        <span className="text-muted"> — {value?.name}</span>
      </legend>
      <div role="radiogroup" aria-label="Colour" className="mt-4 flex flex-wrap gap-3" onKeyDown={onKeyDown}>
        {colors.map((color, i) => {
          const checked = i === selectedIndex
          return (
            <button
              key={color.name}
              ref={(el) => (refs.current[i] = el)}
              type="button"
              role="radio"
              aria-checked={checked}
              aria-label={color.name}
              title={color.name}
              tabIndex={checked ? 0 : -1}
              onClick={() => onChange(color)}
              className={`grid size-11 place-items-center rounded-full transition-shadow duration-300 ${
                checked ? 'ring-[1.5px] ring-ink' : 'ring-1 ring-transparent hover:ring-line-strong'
              }`}
            >
              <span
                className="size-8 rounded-full ring-1 ring-black/10 ring-inset"
                style={{ backgroundColor: color.hex }}
              />
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
