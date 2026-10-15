import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { srcSet, withWidth } from '../utils/image'

/**
 * Main image + thumbnails. Thumbnail click swaps the main image with a
 * short cross-fade (opacity only).
 */
export default function ProductGallery({ images, alt }) {
  const [index, setIndex] = useState(0)
  const current = images[index]

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-mist md:aspect-square lg:aspect-[4/5]">
        <AnimatePresence initial={false}>
          <motion.img
            key={current}
            src={withWidth(current, 1200)}
            srcSet={srcSet(current)}
            sizes="(min-width: 1024px) 55vw, 100vw"
            alt={`${alt} — image ${index + 1} of ${images.length}`}
            fetchPriority={index === 0 ? 'high' : undefined}
            decoding="async"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="absolute inset-0 size-full object-cover"
          />
        </AnimatePresence>
      </div>

      {images.length > 1 && (
        <ul className="flex gap-3" aria-label="Product images">
          {images.map((image, i) => {
            const active = i === index
            return (
              <li key={image}>
                <button
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Show image ${i + 1} of ${images.length}`}
                  aria-current={active ? 'true' : undefined}
                  className={`block aspect-[4/5] w-18 overflow-hidden rounded-md bg-mist transition-[opacity,box-shadow] duration-300 sm:w-22 ${
                    active ? 'opacity-100 ring-1 ring-ink ring-offset-2 ring-offset-canvas' : 'opacity-55 hover:opacity-100'
                  }`}
                >
                  <img
                    src={withWidth(image, 240)}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="size-full object-cover"
                  />
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
