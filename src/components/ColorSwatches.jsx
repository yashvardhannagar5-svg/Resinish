export default function ColorSwatches({ colors, className = '' }) {
  if (!colors?.length) return null
  const label = `Available in ${colors.map((c) => c.name).join(', ')}`
  return (
    <ul className={`flex items-center gap-1.5 ${className}`} aria-label={label}>
      {colors.map((color) => (
        <li
          key={color.name}
          title={color.name}
          className="size-3 rounded-full ring-1 ring-black/10 ring-inset"
          style={{ backgroundColor: color.hex }}
        />
      ))}
    </ul>
  )
}
