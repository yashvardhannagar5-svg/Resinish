import { Link } from 'react-router-dom'
import AuthForm from '../components/AuthForm'
import { Button } from '../components/Button'
import { signOut, useAuthStore } from '../store/authStore'

export default function Login() {
  const user = useAuthStore((s) => s.user)
  const ready = useAuthStore((s) => s.ready)
  return <section className="shell flex min-h-[80svh] items-center justify-center pt-32 pb-20">
    <div className="w-full max-w-lg">
      <p className="eyebrow text-muted">Your account</p>
      <h1 className="display mt-5 text-[clamp(3rem,8vw,5rem)]">{user ? 'Hello again.' : 'Welcome back.'}</h1>
      <p className="mt-5 max-w-md text-muted">Sign in to keep your details handy and follow your keepsakes.</p>
      <div className="mt-10">
        {!ready ? <p role="status" className="text-sm text-muted">Checking your session…</p> : user ? (
          <div role="status" className="rounded-md bg-surface p-6">
            <p className="font-semibold">You’re signed in.</p>
            <p className="mt-2 text-sm text-muted">{user.email}</p>
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <Link className="text-sm font-semibold underline" to="/track-order">Track an order</Link>
              <Button variant="secondary" onClick={signOut}>Sign out</Button>
            </div>
          </div>
        ) : <AuthForm />}
      </div>
    </div>
  </section>
}
