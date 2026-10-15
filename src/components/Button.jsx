import { Link } from 'react-router-dom'

const base =
  'inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-full h-13 px-7 text-[0.75rem] font-semibold uppercase tracking-[0.16em] ' +
  'transition-[background-color,color,border-color] duration-300 ease-(--ease-premium) select-none'

const variants = {
  primary: 'bg-ink text-canvas hover:bg-[#2a2a2a]',
  secondary: 'border border-line-strong text-ink hover:border-ink hover:bg-ink hover:text-canvas',
  inverse: 'bg-canvas text-ink hover:bg-white',
  'inverse-outline': 'border border-white/25 text-canvas hover:border-canvas hover:bg-canvas hover:text-ink',
}

function buttonClasses(variant = 'primary', className = '') {
  return `${base} ${variants[variant]} ${className}`
}

export function ButtonLink({ to, variant = 'primary', className = '', children, ...rest }) {
  return (
    <Link to={to} className={buttonClasses(variant, className)} {...rest}>
      {children}
    </Link>
  )
}

export function Button({ variant = 'primary', className = '', type = 'button', children, ...rest }) {
  return (
    <button type={type} className={buttonClasses(variant, className)} {...rest}>
      {children}
    </button>
  )
}
