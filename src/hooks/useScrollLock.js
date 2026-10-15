import { useEffect } from 'react'

// Shared counter so overlapping overlays (menu + drawer) don't unlock early.
let locks = 0
let previous = { overflow: '', gap: '' }

function lock() {
  const root = document.documentElement
  if (locks === 0) {
    const gap = window.innerWidth - root.clientWidth
    previous = { overflow: root.style.overflow, gap: root.style.getPropertyValue('--scrollbar-gap') }
    root.style.setProperty('--scrollbar-gap', `${gap}px`)
    root.style.overflow = 'hidden'
  }
  locks += 1
}

function unlock() {
  locks = Math.max(0, locks - 1)
  if (locks === 0) {
    const root = document.documentElement
    root.style.overflow = previous.overflow
    if (previous.gap) root.style.setProperty('--scrollbar-gap', previous.gap)
    else root.style.removeProperty('--scrollbar-gap')
  }
}

/**
 * Prevents the page behind an overlay from scrolling.
 * Compensates for the disappearing scrollbar to avoid a layout jump
 * (fixed elements can use `var(--scrollbar-gap)`).
 */
export function useScrollLock(active) {
  useEffect(() => {
    if (!active) return undefined
    lock()
    return unlock
  }, [active])
}
