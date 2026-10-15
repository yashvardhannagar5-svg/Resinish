import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import { Button } from './Button'

export default function VisitLoginModal({ open, onClose }) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [signedIn, setSignedIn] = useState(false)

  useEffect(() => {
    if (!open) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  const submit = (event) => {
    event.preventDefault()
    const cleanEmail = email.trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError('Enter a valid email address.')
      return
    }
    localStorage.setItem('resin-demo-customer', cleanEmail)
    setError('')
    setSignedIn(true)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-ink/55 p-4 backdrop-blur-sm sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}
        >
          <motion.section
            role="dialog"
            aria-modal="true"
            aria-labelledby="visit-login-title"
            className="relative my-auto grid w-full max-w-4xl overflow-hidden rounded-lg bg-canvas shadow-2xl md:grid-cols-[0.9fr_1.1fr]"
            initial={{ opacity: 0, y: 28, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative hidden min-h-[28rem] overflow-hidden bg-[#eadbd4] p-10 md:flex md:flex-col md:justify-between">
              <div className="absolute -top-16 -right-12 size-72 rounded-full border border-white/60" />
              <div className="absolute top-20 -right-5 size-52 rounded-full border border-white/50" />
              <div className="absolute -bottom-24 -left-10 size-64 rounded-full bg-[#c78683]/20 blur-2xl" />
              <p className="eyebrow relative z-10 text-graphite">Resin &amp; Reverie</p>
              <div className="relative z-10 max-w-xs">
                <p className="eyebrow text-graphite/70">Made to hold a moment</p>
                <p className="display mt-4 text-5xl text-graphite">A little piece of nature, made yours.</p>
                <p className="mt-5 text-sm leading-relaxed text-graphite/75">Discover hand-finished resin keepsakes, made with flowers and details you love.</p>
              </div>
              <span className="relative z-10 text-xs tracking-[0.16em] text-graphite/65 uppercase">Handmade in small batches</span>
            </div>

            <div className="relative flex min-h-[30rem] items-center px-6 py-14 sm:px-12">
              <button type="button" onClick={onClose} aria-label="Close sign-in dialog" className="absolute top-5 right-5 rounded-full p-2 text-muted transition hover:bg-mist hover:text-ink">
                <X size={20} aria-hidden="true" />
              </button>
              <div className="w-full max-w-md">
                <p className="eyebrow text-muted">A warm welcome</p>
                <h2 id="visit-login-title" className="display mt-4 text-4xl sm:text-5xl">{signedIn ? 'You’re on the list.' : 'Come on in.'}</h2>
                {signedIn ? (
                  <div role="status" className="mt-6">
                    <p className="leading-relaxed text-muted">You’re signed in for this demo as <span className="font-semibold text-ink">{email.trim()}</span>.</p>
                    <Button type="button" onClick={onClose} className="mt-8 w-full">Explore the collection</Button>
                  </div>
                ) : (
                  <>
                    <p className="mt-4 leading-relaxed text-muted">Sign in for a smoother checkout and an easy way to follow your keepsakes.</p>
                    <form onSubmit={submit} className="mt-7 space-y-4">
                      <label className="block text-sm font-semibold">Email address
                        <input type="email" autoComplete="email" autoFocus value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 block h-12 w-full rounded-md border border-line-strong bg-white px-4 font-normal" required />
                      </label>
                      <label className="block text-sm font-semibold">Password
                        <input type="password" autoComplete="current-password" className="mt-2 block h-12 w-full rounded-md border border-line-strong bg-white px-4 font-normal" required />
                      </label>
                      {error && <p role="alert" className="text-sm text-accent">{error}</p>}
                      <Button type="submit" className="w-full">Sign in</Button>
                    </form>
                    <p className="mt-4 text-xs leading-relaxed text-muted">Demo sign-in only. No password is saved and no account service is connected.</p>
                    <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5 text-sm">
                      <button type="button" onClick={onClose} className="font-semibold underline underline-offset-4">Continue as guest</button>
                      <Link to="/login" onClick={onClose} className="text-muted underline underline-offset-4 hover:text-ink">Account page</Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
