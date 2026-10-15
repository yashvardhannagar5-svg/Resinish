import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register once, import from here everywhere.
gsap.registerPlugin(ScrollTrigger)

gsap.defaults({ ease: 'power3.out', duration: 1 })

export const EASE = {
  out: 'expo.out',
}

// Shared media query conditions for gsap.matchMedia().
export const MQ = {
  desktop: '(min-width: 1024px)',
  motion: '(prefers-reduced-motion: no-preference)',
  finePointer: '(pointer: fine)',
}

export { gsap, ScrollTrigger }

