import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ChevronDown, Lock } from 'lucide-react'
import CartEmpty from '../components/CartEmpty'
import { Button } from '../components/Button'
import { SelectField, TextField } from '../components/FormField'
import OrderLines from '../components/OrderLines'
import OrderTotals from '../components/OrderTotals'
import ShippingOptions from '../components/ShippingOptions'
import { countries, getShippingMethod, shippingMethods } from '../data/checkout'
import { selectSubtotal, selectTotalItems, useCartStore } from '../store/cartStore'
import {
  addBusinessDays,
  checkoutRules,
  createOrderNumber,
  formatCardNumber,
  formatCvv,
  formatExpiry,
  validateCheckout,
} from '../utils/checkout'
import { formatPrice } from '../utils/format'
import { saveLastOrder } from '../utils/orderSession'

const PROCESSING_MS = 1400
const fieldOrder = Object.keys(checkoutRules)

const initialValues = {
  email: '',
  phone: '',
  firstName: '',
  lastName: '',
  address: '',
  apartment: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'India',
  // Payment fields live only in this component's state — never persisted or sent.
  cardNumber: '',
  expiry: '',
  cvv: '',
  nameOnCard: '',
}

const formatters = { cardNumber: formatCardNumber, cvv: formatCvv }

function Section({ step, title, children, aside }) {
  return (
    <fieldset className="border-t border-line pt-8">
      <legend className="float-left mb-7 flex w-full items-baseline justify-between gap-4">
        <span className="eyebrow flex items-center gap-3 text-[0.8125rem]">
          <span className="text-muted tabular-nums">{step}</span>
          {title}
        </span>
        {aside}
      </legend>
      <div className="clear-left">{children}</div>
    </fieldset>
  )
}

function Summary({ items, subtotal, shipping, discount, total }) {
  return (
    <>
      <OrderLines items={items} />
      <OrderTotals subtotal={subtotal} shipping={shipping} discount={discount} total={total} className="mt-6 border-t border-line pt-6" />
    </>
  )
}

export default function Checkout() {
  const items = useCartStore((s) => s.items)
  const subtotal = useCartStore(selectSubtotal)
  const totalItems = useCartStore(selectTotalItems)
  const navigate = useNavigate()

  const [values, setValues] = useState(initialValues)
  const [touched, setTouched] = useState({})
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [shippingId, setShippingId] = useState(shippingMethods[0].id)
  const [promoCode, setPromoCode] = useState('')
  const [status, setStatus] = useState('idle') // idle | processing
  const formRef = useRef(null)
  const submitting = useRef(false)
  const timer = useRef(0)

  useEffect(() => () => clearTimeout(timer.current), [])

  const errors = useMemo(() => validateCheckout(values), [values])
  const shipping = getShippingMethod(shippingId)
  const shippingPrice = shipping.id === 'standard' && subtotal >= 1000 ? 0 : shipping.price
  const discount = promoCode.trim().toUpperCase() === 'WELCOME5' ? Math.round(subtotal * 0.05) : 0
  const total = subtotal + shippingPrice - discount
  const visibleError = (name) => (touched[name] || submitAttempted ? errors[name] : undefined)

  const setValue = (name, value) => setValues((prev) => ({ ...prev, [name]: value }))

  const bind = (name) => ({
    value: values[name],
    onChange: (e) => {
      const raw = e.target.value
      if (name === 'expiry') setValue(name, formatExpiry(raw, values.expiry))
      else setValue(name, formatters[name] ? formatters[name](raw) : raw)
    },
    onBlur: () => setTouched((prev) => (prev[name] ? prev : { ...prev, [name]: true })),
    error: visibleError(name),
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (submitting.current) return
    setSubmitAttempted(true)

    const firstInvalid = fieldOrder.find((name) => errors[name])
    if (firstInvalid) {
      formRef.current?.elements.namedItem(firstInvalid)?.focus()
      return
    }

    submitting.current = true
    setStatus('processing')

    timer.current = setTimeout(() => {
      const placedAt = new Date()
      const order = {
        number: createOrderNumber(),
        placedAt: placedAt.toISOString(),
        items: items.map(({ key, name, price, quantity, color, image, customNote }) => ({ key, name, price, quantity, color, image, customNote })),
        subtotal,
        discount,
        shipping: shippingPrice,
        shippingLabel: shipping.label,
        total,
        deliveryWindow: shipping.days.map((d) => addBusinessDays(placedAt, d).toISOString()),
        customer: { firstName: values.firstName.trim(), email: values.email.trim(), city: values.city.trim() },
        cartCleared: false,
      }
      saveLastOrder(order)
      // The confirmation page clears the cart once it has the order in hand.
      navigate('/order-success', { replace: true, state: { order } })
    }, PROCESSING_MS)
  }

  if (items.length === 0) {
    return (
      <section aria-labelledby="checkout-title" className="shell pt-28 pb-24 md:pt-36">
        <h1 id="checkout-title" className="sr-only">
          Checkout
        </h1>
        <CartEmpty
          className="py-24"
          title="Nothing to check out."
          text="Your cart is empty. Add a resin keepsake to get started."
          cta="Shop resin pieces"
        />
      </section>
    )
  }

  const processing = status === 'processing'
  const hasVisibleErrors = submitAttempted && Object.keys(errors).length > 0

  return (
    <section aria-labelledby="checkout-title" className="shell pt-28 pb-24 md:pt-36 lg:pb-32">
      <header className="flex flex-wrap items-end justify-between gap-6 pb-10">
        <div>
          <p className="eyebrow mb-5 text-muted">
            {totalItems} {totalItems === 1 ? 'item' : 'items'}
          </p>
          <h1 id="checkout-title" className="display text-[clamp(2.75rem,7vw,5.5rem)]">
            Checkout.
          </h1>
        </div>
        <Link to="/cart" className="inline-flex items-center gap-2 py-2 text-sm font-semibold hover:underline">
          <ArrowLeft aria-hidden="true" className="size-4" />
          Back to cart
        </Link>
      </header>

      <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
        {/* Mobile / tablet summary */}
        <details className="group rounded-md bg-surface lg:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4.5 [&::-webkit-details-marker]:hidden">
            <span className="flex items-center gap-2 text-sm font-semibold">
              Order summary
              <ChevronDown aria-hidden="true" className="size-4 transition-transform group-open:rotate-180" />
            </span>
            <span className="font-semibold tabular-nums">{formatPrice(total)}</span>
          </summary>
          <div className="border-t border-line px-5 py-6">
            <Summary items={items} subtotal={subtotal} shipping={shippingPrice} discount={discount} total={total} />
          </div>
        </details>

        <form ref={formRef} noValidate onSubmit={handleSubmit} className="space-y-12 lg:col-span-7">
          <Section step="01" title="Contact">
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField id="email" label="Email" type="email" inputMode="email" autoComplete="email" {...bind('email')} />
              <TextField id="phone" label="Phone" type="tel" inputMode="tel" autoComplete="tel" {...bind('phone')} />
            </div>
          </Section>

          <Section step="02" title="Shipping address">
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField id="firstName" label="First name" autoComplete="given-name" {...bind('firstName')} />
              <TextField id="lastName" label="Last name" autoComplete="family-name" {...bind('lastName')} />
              <TextField id="address" label="Address" autoComplete="address-line1" className="sm:col-span-2" {...bind('address')} />
              <TextField
                id="apartment"
                label="Apartment / suite"
                optional
                autoComplete="address-line2"
                className="sm:col-span-2"
                {...bind('apartment')}
              />
              <TextField id="city" label="City" autoComplete="address-level2" {...bind('city')} />
              <TextField id="state" label="State / region" autoComplete="address-level1" {...bind('state')} />
              <TextField id="postalCode" label="Postal code" autoComplete="postal-code" {...bind('postalCode')} />
              <SelectField id="country" label="Country" autoComplete="country-name" options={countries} {...bind('country')} />
            </div>
          </Section>

          <Section step="03" title="Shipping method">
            {subtotal >= 1000 && <p className="mb-4 text-sm text-[#47734d]">Your order qualifies for free shipping.</p>}
            <ShippingOptions methods={shippingMethods} value={shippingId} onChange={setShippingId} />
          </Section>

          <div className="-mt-5 border-t border-line pt-6">
            <label htmlFor="promo-code" className="block text-sm font-semibold">Offer code</label>
            <div className="mt-2 flex gap-3"><input id="promo-code" value={promoCode} onChange={(event) => setPromoCode(event.target.value)} placeholder="WELCOME5" className="h-12 min-w-0 flex-1 rounded-md border border-line-strong bg-transparent px-4" /><button type="button" onClick={() => setPromoCode(promoCode.trim().toUpperCase())} className="rounded-full border border-line-strong px-5 text-sm font-semibold">Apply</button></div>
            {promoCode.trim() && promoCode.trim().toUpperCase() !== 'WELCOME5' && <p role="status" className="mt-2 text-sm text-accent">That code isn’t recognised. Try WELCOME5.</p>}
            {discount > 0 && <p role="status" className="mt-2 text-sm text-[#47734d]">WELCOME5 applied — you saved {formatPrice(discount)}.</p>}
          </div>

          <Section
            step="04"
            title="Payment"
            aside={
              <span className="inline-flex items-center gap-1.5 text-xs text-muted">
                <Lock aria-hidden="true" className="size-3.5" strokeWidth={1.75} />
                Demo only
              </span>
            }
          >
            <p className="mb-6 rounded-md bg-mist px-4 py-3.5 text-sm leading-relaxed text-muted">
              Demo payment only. No payment is processed and card details are not sent or stored — try
              <span className="font-medium text-ink"> 4242 4242 4242 4242</span>.
            </p>
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField
                id="cardNumber"
                label="Card number"
                inputMode="numeric"
                autoComplete="off"
                placeholder="1234 1234 1234 1234"
                className="sm:col-span-2"
                {...bind('cardNumber')}
              />
              <TextField id="expiry" label="Expiry" inputMode="numeric" autoComplete="off" placeholder="MM/YY" {...bind('expiry')} />
              <TextField id="cvv" label="CVV" inputMode="numeric" autoComplete="off" placeholder="123" {...bind('cvv')} />
              <TextField id="nameOnCard" label="Name on card" autoComplete="off" className="sm:col-span-2" {...bind('nameOnCard')} />
            </div>
          </Section>

          <div className="border-t border-line pt-8">
            {hasVisibleErrors && (
              <p role="alert" className="mb-5 text-sm text-accent">
                Please check the highlighted fields.
              </p>
            )}
            <Button type="submit" disabled={processing} aria-busy={processing} className="w-full disabled:cursor-wait">
              {processing ? (
                <>
                  <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-canvas/30 border-t-canvas" />
                  Processing…
                </>
              ) : (
                <>Place order · {formatPrice(total)}</>
              )}
            </Button>
            <p className="mt-4 text-center text-xs text-muted">
              By placing this demo order you agree to our{' '}
              <Link to="/terms" className="underline underline-offset-2 hover:text-ink">
                terms
              </Link>
              .
            </p>
          </div>
        </form>

        {/* Desktop summary */}
        <aside
          aria-labelledby="checkout-summary-title"
          className="hidden self-start rounded-md bg-surface p-8 lg:sticky lg:top-24 lg:col-span-5 lg:block xl:col-span-4 xl:col-start-9"
        >
          <h2 id="checkout-summary-title" className="eyebrow mb-7 text-[0.8125rem]">
            Order Summary
          </h2>
          <Summary items={items} subtotal={subtotal} shipping={shippingPrice} discount={discount} total={total} />
        </aside>
      </div>
    </section>
  )
}
