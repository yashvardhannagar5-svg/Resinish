import { useLayoutEffect, useRef } from 'react'
import { ArrowRight } from 'lucide-react'
import { ButtonLink } from '../components/Button'
import { media } from '../data/media'
import { startingPrice } from '../data/products'
import { formatPrice } from '../utils/format'
import { srcSet, withWidth } from '../utils/image'
import { gsap, EASE, MQ } from '../utils/gsap'

export default function Hero() {
  const root = useRef(null)
  const scrollLayer = useRef(null) // scroll-driven transform
  const pointerLayer = useRef(null) // pointer-driven transform
  const product = useRef(null) // intro transform

  useLayoutEffect(() => {
    const mm = gsap.matchMedia()

    mm.add(MQ.motion, () => {
      const q = gsap.utils.selector(root)

      // Intro
      const tl = gsap.timeline({ defaults: { ease: EASE.out } })
      tl.from(product.current, { autoAlpha: 0, scale: 0.94, duration: 1.8, ease: 'power2.out' }, 0)
        .from(q('[data-hero-line]'), { autoAlpha: 0, y: 30, duration: 1.3, stagger: 0.09 }, 0.15)
        .from(q('[data-hero-copy]'), { autoAlpha: 0, y: 20, duration: 1.2 }, 0.55)
        .from(q('[data-hero-cta]'), { autoAlpha: 0, y: 20, duration: 1.2, stagger: 0.08 }, 0.7)

      // Scroll: gentle drift, never a spin.
      gsap.to(scrollLayer.current, {
        yPercent: 8,
        scale: 1.04,
        rotation: -4,
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6,
        },
      })
      gsap.to(q('[data-hero-text]'), {
        yPercent: -10,
        autoAlpha: 0.2,
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6,
        },
      })
    })

    // Pointer parallax: desktop + fine pointer only, a few pixels at most.
    mm.add(`${MQ.motion} and ${MQ.desktop} and ${MQ.finePointer}`, () => {
      const el = pointerLayer.current
      const xTo = gsap.quickTo(el, 'x', { duration: 1.2, ease: 'power3.out' })
      const yTo = gsap.quickTo(el, 'y', { duration: 1.2, ease: 'power3.out' })
      const onMove = (e) => {
        const nx = e.clientX / window.innerWidth - 0.5
        const ny = e.clientY / window.innerHeight - 0.5
        xTo(nx * 14)
        yTo(ny * 10)
      }
      const section = root.current
      const onLeave = () => {
        xTo(0)
        yTo(0)
      }
      section.addEventListener('pointermove', onMove)
      section.addEventListener('pointerleave', onLeave)
      return () => {
        section.removeEventListener('pointermove', onMove)
        section.removeEventListener('pointerleave', onLeave)
      }
    })

    return () => mm.revert()
  }, [])

  return (
    <section
      ref={root}
      aria-labelledby="hero-title"
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-20 pb-12 lg:pt-24 lg:pb-16"
    >
      <div className="shell grid items-center gap-y-6 lg:grid-cols-12 lg:gap-x-8">
        <div data-hero-text className="relative z-10 lg:col-span-6 xl:col-span-6">
          <h1
            id="hero-title"
            className="display text-[clamp(3.25rem,13.5vw,4.5rem)] sm:text-[clamp(4.5rem,11vw,6rem)] lg:text-[clamp(4.75rem,6.4vw,7.25rem)]"
          >
            <span data-hero-line className="block">Flowers.</span>
            <span data-hero-line className="block">Held in</span>
            <span data-hero-line className="block">Resin.</span>
          </h1>

          <p
            data-hero-copy
            className="mt-7 max-w-md text-base leading-relaxed text-muted sm:text-lg lg:mt-9"
          >
            Handcrafted resin keepsakes with real flowers, made to hold a little piece of nature close.
            Choose a ready-made design or make one yours with a personal touch.
          </p>

          <div className="mt-9 flex flex-col gap-3 xs:flex-row xs:flex-wrap sm:items-center lg:mt-11">
            <div data-hero-cta>
              <ButtonLink to="/shop" className="w-full xs:w-auto">
                Shop the collection
                <ArrowRight aria-hidden="true" className="size-4" />
              </ButtonLink>
            </div>
            <div data-hero-cta>
              <ButtonLink to="/shop?filter=new" variant="secondary" className="w-full xs:w-auto">
                Customise a keepsake
              </ButtonLink>
            </div>
          </div>

          <p data-hero-cta className="mt-8 text-sm text-muted">
            From <span className="font-semibold text-ink">{formatPrice(startingPrice)}</span>
            <span aria-hidden="true" className="mx-3 inline-block h-3 w-px translate-y-0.5 bg-line-strong" />
            Free shipping on orders above ₹1,000
          </p>
        </div>

        <div className="relative -order-1 lg:order-none lg:col-span-6 xl:col-span-6">
          <div ref={scrollLayer} className="will-change-transform">
            <div ref={pointerLayer}>
              <div
                ref={product}
                className="relative mx-auto aspect-[2798/3130] bg-canvas w-[min(72vw,36svh)] sm:w-[min(60vw,46svh)] lg:w-full lg:max-w-[40rem]"
              >
                <img
                  src={withWidth(media.hero.src, 1200)}
                  srcSet={srcSet(media.hero.src, [600, 900, 1200, 1600])}
                  sizes="(min-width: 1024px) 45vw, 70vw"
                  alt={media.hero.alt}
                  fetchPriority="high"
                  decoding="async"
                  className="fade-hero size-full object-contain mix-blend-multiply"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
