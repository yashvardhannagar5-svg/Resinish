import { ShoppingBag } from 'lucide-react'
import { ButtonLink } from './Button'

export default function CartEmpty({
  onNavigate,
  className = '',
  title = 'Your cart is empty.',
  text = 'Find something worth listening to.',
  cta = 'Explore Resin Pieces',
}) {
  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      <span className="grid size-16 place-items-center rounded-full bg-mist">
        <ShoppingBag aria-hidden="true" className="size-6" strokeWidth={1.4} />
      </span>
      <p className="mt-8 text-2xl font-bold tracking-[-0.03em] uppercase sm:text-[1.75rem]">{title}</p>
      <p className="mt-3 max-w-xs text-base text-muted">{text}</p>
      <ButtonLink to="/shop" onClick={onNavigate} className="mt-9">
        {cta}
      </ButtonLink>
    </div>
  )
}
