import { Lock, RotateCcw, ShieldCheck, Truck } from 'lucide-react'
import ScrollReveal from '../components/ScrollReveal'

const benefits = [
  { icon: Truck, title: 'Free Shipping', text: 'Free tracked shipping on orders above ₹1,000.' },
  { icon: RotateCcw, title: 'Made to order', text: 'Handmade to order with care and clear delivery updates.' },
  { icon: ShieldCheck, title: '1-Year Warranty', text: 'We will help with care questions and custom requests.' },
  { icon: Lock, title: 'Secure Checkout', text: 'Demo checkout only. No payment is processed.' },
]

export default function Benefits() {
  return (
    <section aria-label="Why shop our resin keepsakes" className="border-y border-line">
      <div className="shell">
        <ScrollReveal
          as="ul"
          className="grid grid-cols-2 gap-x-6 gap-y-12 py-16 md:py-20 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-line"
        >
          {benefits.map(({ icon: Icon, title, text }) => (
            <li key={title} data-reveal className="lg:px-10 lg:first:pl-0 lg:last:pr-0">
              <Icon aria-hidden="true" className="size-5.5" strokeWidth={1.5} />
              <h3 className="mt-5 text-[0.9375rem] font-semibold tracking-tight">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
            </li>
          ))}
        </ScrollReveal>
      </div>
    </section>
  )
}
