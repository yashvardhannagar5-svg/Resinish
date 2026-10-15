import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, Search, ShoppingBag, User, X } from 'lucide-react'
import Logo from './Logo'
import MobileMenu from './MobileMenu'
import { primaryNav, isActive } from './navigation'
import { useScrolled } from '../hooks/useScrolled'
import { useCartStore, selectTotalItems } from '../store/cartStore'

const iconButton =
  'relative grid size-11 place-items-center rounded-full transition-colors duration-300 hover:bg-black/[0.05]'

export default function Navbar({ menuOpen, onToggleMenu, onCloseMenu, inert }) {
  const scrolled = useScrolled(16)
  const location = useLocation()
  const cartCount = useCartStore(selectTotalItems)
  const openCart = useCartStore((s) => s.openCart)
  const solid = scrolled || menuOpen

  return (
    <>
      <header
        inert={inert}
        style={{ paddingRight: 'var(--scrollbar-gap, 0px)' }}
        className={`fixed inset-x-0 top-8 z-50 border-b transition-[background-color,border-color] duration-500 ease-premium ${
          solid
            ? 'border-line bg-canvas/85 backdrop-blur-md supports-[not(backdrop-filter:blur(0))]:bg-canvas'
            : 'border-transparent bg-transparent'
        }`}
      >
        <nav
          aria-label="Primary"
          className={`shell grid grid-cols-[1fr_auto_1fr] items-center transition-[height] duration-500 ease-premium ${
            scrolled ? 'h-16' : 'h-18 lg:h-22'
          }`}
        >
          <div className="justify-self-start">
            <Logo onClick={onCloseMenu} />
          </div>

          <ul className="hidden items-center gap-10 lg:flex">
            {primaryNav.map((item) => {
              const active = isActive(item.to, location)
              return (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    aria-current={active ? 'page' : undefined}
                    className={`relative py-2 text-sm font-medium transition-colors duration-300 hover:text-ink after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:bg-ink after:transition-transform after:duration-500 after:ease-premium ${
                      active
                        ? 'text-ink after:scale-x-100'
                        : 'text-ink/65 after:scale-x-0 hover:after:scale-x-100'
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>

          <div className="col-start-3 flex items-center justify-self-end gap-0.5 sm:gap-1">
            <Link to="/shop" state={{ focusSearch: true }} aria-label="Search products" className={iconButton}>
              <Search aria-hidden="true" className="size-5" strokeWidth={1.6} />
            </Link>
            <Link to="/login" aria-label="Sign in" className={`${iconButton} hidden sm:grid`}>
              <User aria-hidden="true" className="size-5" strokeWidth={1.6} />
            </Link>
            <button
              type="button"
              onClick={openCart}
              aria-label={`Open cart, ${cartCount} ${cartCount === 1 ? 'item' : 'items'}`}
              aria-haspopup="dialog"
              className={iconButton}
            >
              <ShoppingBag aria-hidden="true" className="size-5" strokeWidth={1.6} />
              <AnimatePresence initial={false}>
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    aria-hidden="true"
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.6, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="absolute top-1 right-0.5 grid h-4.5 min-w-4.5 place-items-center rounded-full bg-ink px-1 text-[0.625rem] leading-none font-bold text-canvas tabular-nums"
                  >
                    {cartCount > 99 ? '99+' : cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            <button
              type="button"
              onClick={onToggleMenu}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              className={`${iconButton} lg:hidden`}
            >
              {menuOpen ? (
                <X aria-hidden="true" className="size-5" strokeWidth={1.6} />
              ) : (
                <Menu aria-hidden="true" className="size-5" strokeWidth={1.6} />
              )}
            </button>
          </div>
        </nav>
      </header>

      <MobileMenu open={menuOpen} onClose={onCloseMenu} />
    </>
  )
}
