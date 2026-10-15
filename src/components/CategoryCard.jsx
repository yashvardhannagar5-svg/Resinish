import { memo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { srcSet, withWidth } from '../utils/image'

// Each category photo is either dark or light; the overlay adapts to it.
const tones = {
  dark: {
    text: 'text-canvas',
    sub: 'text-white/75',
    scrim: 'bg-gradient-to-t from-black/65 via-black/20 to-transparent',
    chip: 'bg-canvas text-ink',
  },
  light: {
    text: 'text-ink',
    sub: 'text-ink/65',
    scrim: 'bg-gradient-to-t from-white/80 via-white/20 to-transparent',
    chip: 'bg-ink text-canvas',
  },
}

function CategoryCard({ category, count, sizes, className = '', imageClassName = '' }) {
  const tone = tones[category.tone] ?? tones.dark

  return (
    <Link
      to={`/shop?category=${category.id}`}
      className={`group relative isolate block overflow-hidden rounded-md bg-mist ${className}`}
    >
      <img
        src={withWidth(category.image, 900)}
        srcSet={srcSet(category.image, [480, 720, 960, 1280])}
        sizes={sizes}
        alt={category.alt}
        loading="lazy"
        decoding="async"
        className={`absolute inset-0 -z-10 size-full object-cover transition-transform duration-[1200ms] ease-premium group-hover:scale-[1.03] ${imageClassName}`}
      />
      <div aria-hidden="true" className={`absolute inset-x-0 bottom-0 -z-10 h-2/3 ${tone.scrim}`} />

      <div className="flex h-full items-end justify-between gap-4 p-6 md:p-8">
        <div className={tone.text}>
          <p className={`eyebrow mb-3 text-[0.6875rem] ${tone.sub}`}>
            {String(count).padStart(2, '0')} {count === 1 ? 'model' : 'models'}
          </p>
          <h3 className="text-2xl font-bold tracking-tight md:text-3xl">{category.name}</h3>
          <p className={`mt-1.5 text-sm ${tone.sub}`}>{category.tagline}</p>
        </div>
        <span
          aria-hidden="true"
          className={`grid size-11 shrink-0 place-items-center rounded-full transition-transform duration-500 ease-premium group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${tone.chip}`}
        >
          <ArrowUpRight className="size-4.5" />
        </span>
      </div>
    </Link>
  )
}

export default memo(CategoryCard)
