import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from './Navbar'
import Footer from './Footer'
import CartDrawer from './CartDrawer'
import VisitLoginModal from './VisitLoginModal'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '../store/authStore'
import { ScrollTrigger } from '../utils/gsap'

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [visitLoginOpen, setVisitLoginOpen] = useState(() => !sessionStorage.getItem('resin-visit-login-dismissed'))
  const cartOpen = useCartStore((s) => s.isOpen)
  const closeCart = useCartStore((s) => s.closeCart)
  const authReady = useAuthStore((s) => s.ready)
  const signedIn = useAuthStore((s) => Boolean(s.user))
  const checkedSession = useRef(false)
  const { pathname } = useLocation()

  const closeMenu = useCallback(() => setMenuOpen(false), [])
  const toggleMenu = useCallback(() => setMenuOpen((open) => !open), [])
  const dismissVisitLogin = useCallback(() => {
    sessionStorage.setItem('resin-visit-login-dismissed', 'yes')
    setVisitLoginOpen(false)
  }, [])

  // Returning visitors who are already signed in don't need the welcome dialog.
  useEffect(() => {
    if (!authReady || checkedSession.current) return
    checkedSession.current = true
    if (signedIn) dismissVisitLogin()
  }, [authReady, signedIn, dismissVisitLogin])

  // New page: close overlays, reset scroll, re-measure scroll animations.
  useEffect(() => {
    setMenuOpen(false)
    closeCart()
    window.scrollTo(0, 0)
    const id = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(id)
  }, [pathname, closeCart])

  // Opening the cart replaces the mobile menu.
  useEffect(() => {
    if (cartOpen) setMenuOpen(false)
  }, [cartOpen])

  const pageInert = menuOpen || cartOpen || visitLoginOpen
  // The homepage has its own hero intro, so it skips the page fade.
  const isHome = pathname === '/'

  return (
    <>
      <a
        href="#main"
        className="sr-only z-[80] rounded-full bg-ink px-5 py-3 text-sm font-semibold text-canvas focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        Skip to content
      </a>
      <Navbar menuOpen={menuOpen} onToggleMenu={toggleMenu} onCloseMenu={closeMenu} inert={cartOpen || visitLoginOpen} />
      <div className="fixed inset-x-0 top-0 z-[60] flex h-8 items-center justify-center bg-ink px-4 text-center text-[0.625rem] font-semibold tracking-[0.12em] text-canvas uppercase sm:text-xs">
        Take 5% off your first order with code WELCOME5 · Free shipping above ₹1,000
      </div>
      <main id="main" inert={pageInert}>
        <Suspense fallback={<div className="min-h-svh" />}>
          <motion.div
            key={pathname}
            initial={isHome ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <Outlet />
          </motion.div>
        </Suspense>
      </main>
      <Footer inert={pageInert} />
      <CartDrawer />
      <VisitLoginModal open={visitLoginOpen} onClose={dismissVisitLogin} />
    </>
  )
}
