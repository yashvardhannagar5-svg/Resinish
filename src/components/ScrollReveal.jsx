import { useLayoutEffect, useRef } from 'react'
import { gsap, EASE, MQ } from '../utils/gsap'

/**
 * Reveals content as it scrolls into view (opacity 0 → 1, y → 0).
 *
 * By default it animates descendants marked with `data-reveal`, staggered.
 * If none exist, the wrapper itself is revealed.
 * Motion is skipped entirely when the user prefers reduced motion.
 * Avoid nesting ScrollReveal inside another ScrollReveal.
 */
export default function ScrollReveal({
  as: Tag = 'div',
  children,
  y = 28,
  duration = 1.1,
  delay = 0,
  stagger = 0.09,
  start = 'top 85%',
  selector = '[data-reveal]',
  ...rest
}) {
  const ref = useRef(null)

  useLayoutEffect(() => {
    const root = ref.current
    if (!root) return undefined

    const mm = gsap.matchMedia()
    mm.add(MQ.motion, () => {
      const found = root.querySelectorAll(selector)
      const targets = found.length ? found : root
      gsap.from(targets, {
        autoAlpha: 0,
        y,
        duration,
        delay,
        stagger,
        ease: EASE.out,
        clearProps: 'transform,opacity,visibility',
        scrollTrigger: { trigger: root, start, once: true },
      })
    })

    return () => mm.revert()
  }, [y, duration, delay, stagger, start, selector])

  return (
    <Tag ref={ref} {...rest}>
      {children}
    </Tag>
  )
}
