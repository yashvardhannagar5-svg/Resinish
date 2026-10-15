import { useId, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'
import ScrollReveal from '../components/ScrollReveal'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const EASE = [0.22, 1, 0.36, 1]

function validate(value) {
  const email = value.trim()
  if (!email) return 'Please enter your email address.'
  if (!EMAIL_PATTERN.test(email)) return 'Please enter a valid email address.'
  return ''
}

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const inputId = useId()
  const errorId = useId()

  const handleSubmit = (e) => {
    e.preventDefault()
    const message = validate(email)
    setError(message)
    if (!message) setSubmitted(true) // Frontend only — no request is sent.
  }

  const handleChange = (e) => {
    setEmail(e.target.value)
    if (error) setError(validate(e.target.value))
  }

  return (
    <section aria-labelledby="newsletter-title" className="section-y">
      <ScrollReveal className="shell grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-8">
        <div className="lg:col-span-6">
          <p data-reveal className="eyebrow mb-6 text-muted">
            Newsletter
          </p>
          <h2 data-reveal id="newsletter-title" className="display text-[clamp(3rem,7vw,6rem)]">
            Stay in
            <br />
            the loop.
          </h2>
        </div>

        <div data-reveal className="lg:col-span-5 lg:col-start-8">
          <p className="mb-8 max-w-md text-base leading-relaxed text-muted">
            New releases, listening guides and early access to limited editions. One email a month,
            never more.
          </p>

          <div className="min-h-[7.5rem]">
            <AnimatePresence mode="wait" initial={false}>
              {submitted ? (
                <motion.div
                  key="success"
                  role="status"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="flex items-start gap-4 border-t border-ink pt-6"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-ink text-canvas">
                    <Check aria-hidden="true" className="size-4" strokeWidth={2.5} />
                  </span>
                  <div>
                    <p className="font-semibold">You’re on the list.</p>
                    <p className="mt-1 text-sm text-muted">
                      We’ll be in touch at <span className="text-ink">{email.trim()}</span>.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  noValidate
                  onSubmit={handleSubmit}
                  exit={{ opacity: 0, y: -12, transition: { duration: 0.25 } }}
                >
                  <label htmlFor={inputId} className="sr-only">
                    Email address
                  </label>
                  <div
                    className={`flex items-center gap-3 border-b transition-colors duration-300 focus-within:border-ink ${
                      error ? 'border-accent' : 'border-line-strong'
                    }`}
                  >
                    <input
                      id={inputId}
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      placeholder="Email address"
                      value={email}
                      onChange={handleChange}
                      aria-invalid={Boolean(error)}
                      aria-describedby={error ? errorId : undefined}
                      className="h-14 min-w-0 flex-1 bg-transparent text-lg placeholder:text-muted/70 focus:outline-none focus-visible:outline-none"
                    />
                    <button
                      type="submit"
                      className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-ink px-5 text-[0.75rem] font-semibold tracking-[0.16em] text-canvas uppercase transition-colors duration-300 hover:bg-[#2a2a2a]"
                    >
                      Subscribe
                      <ArrowRight aria-hidden="true" className="hidden size-4 xs:block" />
                    </button>
                  </div>
                  <p id={errorId} aria-live="polite" className="mt-3 min-h-5 text-sm text-accent">
                    {error}
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </ScrollReveal>
    </section>
  )
}
