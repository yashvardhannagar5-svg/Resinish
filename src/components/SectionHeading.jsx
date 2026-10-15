import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

/**
 * Consistent section header: eyebrow, title and an optional trailing link.
 */
export default function SectionHeading({ eyebrow, title, description, link, id }) {
  return (
    <div className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl" data-reveal>
        {eyebrow && <p className="eyebrow mb-5 text-muted">{eyebrow}</p>}
        <h2 id={id} className="heading">
          {title}
        </h2>
        {description && (
          <p className="mt-5 max-w-md text-base leading-relaxed text-muted">{description}</p>
        )}
      </div>
      {link && (
        <Link
          to={link.to}
          data-reveal
          className="group inline-flex items-center gap-2 self-start py-2 text-sm font-semibold md:self-auto"
        >
          <span className="border-b border-transparent pb-0.5 transition-colors duration-300 group-hover:border-ink">
            {link.label}
          </span>
          <ArrowRight
            aria-hidden="true"
            className="size-4 transition-transform duration-300 ease-(--ease-premium) group-hover:translate-x-1"
          />
        </Link>
      )}
    </div>
  )
}
