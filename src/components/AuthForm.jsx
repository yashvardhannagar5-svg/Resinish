import { useState } from 'react'
import { Button } from './Button'
import { signIn, signUp } from '../store/authStore'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/** Sign in / create account form, shared by the login page and the welcome dialog. */
export default function AuthForm({ inputClass = 'bg-transparent', autoFocus = false, onDone }) {
  const [mode, setMode] = useState('signin') // signin | signup
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)
  const isSignUp = mode === 'signup'
  const field = `mt-2 block h-12 w-full rounded-md border border-line-strong px-4 font-normal ${inputClass}`

  const submit = async (event) => {
    event.preventDefault()
    if (busy) return
    const cleanEmail = email.trim()
    if (!EMAIL.test(cleanEmail)) return setError('Enter a valid email address.')
    if (password.length < 6) return setError('Password must be at least 6 characters.')
    setBusy(true)
    setError('')
    setNotice('')
    const result = isSignUp ? await signUp(cleanEmail, password) : await signIn(cleanEmail, password)
    setBusy(false)
    if (result.error) return setError(result.error)
    if (result.needsConfirmation) {
      setNotice('Almost there — check your inbox and confirm your email, then sign in.')
      setMode('signin')
      setPassword('')
      return
    }
    onDone?.(cleanEmail)
  }

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <label className="block text-sm font-semibold">
        Email address
        <input type="email" autoComplete="email" autoFocus={autoFocus} value={email} onChange={(e) => setEmail(e.target.value)} className={field} required />
      </label>
      <label className="block text-sm font-semibold">
        Password
        <input type="password" autoComplete={isSignUp ? 'new-password' : 'current-password'} value={password} onChange={(e) => setPassword(e.target.value)} className={field} required />
      </label>
      {error && <p role="alert" className="text-sm text-accent">{error}</p>}
      {notice && <p role="status" className="text-sm text-[#47734d]">{notice}</p>}
      <Button type="submit" disabled={busy} aria-busy={busy} className="w-full disabled:cursor-wait">
        {busy ? 'Please wait…' : isSignUp ? 'Create account' : 'Sign in'}
      </Button>
      <p className="text-sm text-muted">
        {isSignUp ? 'Already have an account?' : 'New here?'}{' '}
        <button type="button" onClick={() => { setMode(isSignUp ? 'signin' : 'signup'); setError(''); setNotice('') }} className="font-semibold text-ink underline underline-offset-4">
          {isSignUp ? 'Sign in' : 'Create an account'}
        </button>
      </p>
    </form>
  )
}
