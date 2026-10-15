import { Link } from 'react-router-dom'

export default function Logo({ className = '', onClick }) {
  return (
    <Link
      to="/"
      onClick={onClick}
      aria-label="Resin & Reverie — home"
      className={`inline-flex items-center gap-2 text-sm font-extrabold tracking-[0.12em] ${className}`}
    >
      <span aria-hidden="true" className="block size-2 rounded-full bg-accent" />
      RESIN & REVERIE
    </Link>
  )
}
