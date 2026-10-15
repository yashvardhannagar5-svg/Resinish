import { useLayoutEffect, useRef } from 'react'
import { ArrowRight } from 'lucide-react'
import { ButtonLink } from '../components/Button'
import ScrollReveal from '../components/ScrollReveal'
import { media } from '../data/media'
import { srcSet, withWidth } from '../utils/image'
import { gsap, MQ } from '../utils/gsap'

export default function LifestyleBanner() {
  const frame = useRef(null)
  const image = useRef(null)

  // Slow parallax inside the frame — the photo settles as you scroll past.
  useLayoutEffect(() => {
    const mm = gsap.matchMedia()
    mm.add(MQ.motion, () => {
      gsap.fromTo(
        image.current,
        { yPercent: -6, scale: 1.12 },
        {
          yPercent: 6,
          scale: 1.02,
          ease: 'none',
          scrollTrigger: { trigger: frame.current, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      )
    })
    return () => mm.revert()
  }, [])

  return (
    <section aria-labelledby="lifestyle-title" className="section-y">
      <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div
          ref={frame}
          className="relative aspect-[4/5] overflow-hidden rounded-md bg-mist sm:aspect-[5/4] lg:col-span-7 lg:aspect-auto lg:h-[min(88svh,56rem)]"
        >
          <img
            ref={image}
            src={withWidth(media.lifestyle.src, 1400)}
            srcSet={srcSet(media.lifestyle.src, [640, 960, 1280, 1600, 2000])}
            sizes="(min-width: 1024px) 58vw, 100vw"
            alt={media.lifestyle.alt}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 size-full object-cover object-[50%_55%] will-change-transform"
          />
        </div>

        <ScrollReveal className="flex flex-col justify-end lg:col-span-4 lg:col-start-9 lg:pb-4">
          <p data-reveal className="eyebrow mb-6 text-muted">
            Made for you
          </p>
          <h2
            data-reveal
            id="lifestyle-title"
            className="display text-[clamp(3rem,7.5vw,6.5rem)] lg:text-[clamp(3.5rem,5.4vw,6rem)]"
          >
            <span className="block">Your flowers.</span>
            <span className="block">Your story.</span>
          </h2>
          <p data-reveal className="mt-8 max-w-sm text-base leading-relaxed text-muted sm:text-lg">
            Thoughtful little details make each handcrafted piece feel personal. Add a colour, a flower choice or a note for our maker.
          </p>
          <div data-reveal className="mt-10">
            <ButtonLink to="/about" variant="secondary">
              Our story
              <ArrowRight aria-hidden="true" className="size-4" />
            </ButtonLink>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
