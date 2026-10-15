import { useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, User } from 'lucide-react'
import { primaryNav, isActive } from './navigation'
import { SocialIcon, socialLinks } from './SocialIcons'
import { useScrollLock } from '../hooks/useScrollLock'

const EASE = [0.22, 1, 0.36, 1]

const list = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.12 } },
}
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
}

export default function MobileMenu({ open, onClose }) {
  const location = useLocation()
  const firstLink = useRef(null)

  useScrollLock(open)

  // Support Escape, move focus into the menu.
  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    const t = setTimeout(() => firstLink.current?.focus(), 50)
    return () => {
      window.removeEventListener('keydown', onKey)
      clearTimeout(t)
    }
  }, [open, onClose])

  // Close automatically if the viewport grows to desktop.
  useEffect(() => {
    if (!open) return undefined
    const mql = window.matchMedia('(min-width: 1024px)')
    const onChange = (e) => e.matches && onClose()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.25 } }}
          transition={{ duration: 0.35, ease: EASE }}
          className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-canvas pt-24 lg:hidden"
        >
          <motion.ul
            variants={list}
            initial="hidden"
            animate="show"
            className="shell flex flex-col border-t border-line"
          >
            {primaryNav.map((link, i) => {
              const active = isActive(link.to, location)
              return (
                <motion.li key={link.label} variants={item} className="border-b border-line">
                  <Link
                    ref={i === 0 ? firstLink : undefined}
                    to={link.to}
                    onClick={onClose}
                    aria-current={active ? 'page' : undefined}
                    className="group flex items-center justify-between py-5 text-[2rem] leading-none font-bold tracking-[-0.03em] sm:text-4xl"
                  >
                    <span className={active ? 'text-ink' : 'text-ink/85'}>{link.label}</span>
                    <ArrowRight
                      aria-hidden="true"
                      className="size-5 text-muted transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </Link>
                </motion.li>
              )
            })}
          </motion.ul>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.4, duration: 0.5 } }}
            className="shell mt-auto flex items-center justify-between gap-4 py-8"
          >
            <Link
              to="/login"
              onClick={onClose}
              className="inline-flex h-12 items-center gap-2.5 rounded-full border border-line-strong px-5 text-sm font-semibold"
            >
              <User aria-hidden="true" className="size-4.5" strokeWidth={1.6} />
              Account
            </Link>
            <ul className="flex items-center gap-1" aria-label="Social media">
              {socialLinks.map((s) => (
                <li key={s.name}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.name}
                    className="grid size-11 place-items-center rounded-full text-muted transition-colors hover:text-ink"
                  >
                    <SocialIcon name={s.name} />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
