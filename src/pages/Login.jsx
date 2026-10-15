import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/Button'

export default function Login() {
  const [email, setEmail] = useState('')
  const [signedIn, setSignedIn] = useState(false)
  const [error, setError] = useState('')
  const submit = (event) => {
    event.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError('Enter a valid email address.')
    localStorage.setItem('resin-demo-customer', email.trim())
    setError('')
    setSignedIn(true)
  }
  return <section className="shell flex min-h-[80svh] items-center justify-center pt-32 pb-20">
    <div className="w-full max-w-lg">
      <p className="eyebrow text-muted">Your account</p>
      <h1 className="display mt-5 text-[clamp(3rem,8vw,5rem)]">Welcome back.</h1>
      <p className="mt-5 max-w-md text-muted">Sign in to keep your details handy and follow your keepsakes.</p>
      {signedIn ? <div role="status" className="mt-10 rounded-md bg-surface p-6"><p className="font-semibold">You’re signed in for this demo.</p><p className="mt-2 text-sm text-muted">{email.trim()}</p><Link className="mt-5 inline-block text-sm font-semibold underline" to="/track-order">Track an order</Link></div> : <form onSubmit={submit} className="mt-10 space-y-5">
        <label className="block text-sm font-semibold">Email address<input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 block h-12 w-full rounded-md border border-line-strong bg-transparent px-4 font-normal" required /></label>
        <label className="block text-sm font-semibold">Password<input type="password" autoComplete="current-password" className="mt-2 block h-12 w-full rounded-md border border-line-strong bg-transparent px-4 font-normal" required /></label>
        {error && <p role="alert" className="text-sm text-accent">{error}</p>}
        <Button type="submit" className="w-full">Sign in</Button>
        <p className="text-xs leading-relaxed text-muted">Demo sign-in only. No password is sent or saved, and there is no connected account service.</p>
      </form>}
    </div>
  </section>
}
