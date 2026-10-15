import { Link } from 'react-router-dom'
import SimplePage from '../components/SimplePage'
import { formatPrice } from '../utils/format'
import { readLastOrder } from '../utils/orderSession'

const shopAction = { to: '/shop', label: 'Shop resin keepsakes' }

// Content pages linked from the navbar and footer.
const pages = {
  about: {
    eyebrow: 'About',
    title: 'Made to keep close.',
    description:
      'We make thoughtful resin keepsakes that preserve the colours and details of real flowers in everyday objects and gifts.',
    sections: [
      {
        heading: 'A natural detail',
        body: 'We arrange preserved flowers by hand, then cast and polish each piece in small batches. Natural materials mean no two pieces are exactly alike.',
      },
      {
        heading: 'Made by hand',
        body: 'From earrings and lockets to coasters and wall clocks, every piece is finished with care and packed ready to gift.',
      },
      {
        heading: 'Personal by design',
        body: 'Every product can be customised. Leave a note with your colour, flower or personalisation request and we will follow up if we need to confirm the details.',
      },
    ],
    action: shopAction,
  },
  support: {
    eyebrow: 'Support',
    title: 'How can we help?',
    description: 'Questions about an order, delivery or custom design? Get in touch and we will help.',
    sections: [
      {
        heading: 'Custom requests',
        body: 'Add your flower, colour or personalisation notes on the product page. Custom designs are confirmed with you before they are made.',
      },
      {
        heading: 'Order tracking',
        body: 'Use the order number from your demo order confirmation on the Track Order page. This sample storefront stores the latest order in your browser only.',
      },
      {
        heading: 'Contact',
        body: 'Email hello@example.com or call +91 00000 00000, Monday to Saturday, 10:00–17:00 IST. Replace these sample contact details with your real business contact before launch.',
      },
    ],
    action: shopAction,
  },
  shipping: {
    eyebrow: 'Shipping',
    title: 'A little extra care.',
    description: 'Free standard shipping on orders above ₹1,000. Express delivery is available at checkout.',
    sections: [
      { heading: 'Standard — Free over ₹1,000', body: 'Tracked delivery in 3–5 business days.' },
      { heading: 'Express — ₹99', body: 'Priority, tracked delivery in 1–2 business days.' },
      {
        heading: 'Dispatch',
        body: 'These dates are demo estimates. A live store should connect this step to your courier and fulfilment process.',
      },
    ],
    action: shopAction,
  },
  returns: {
    eyebrow: 'Returns',
    title: 'Made with care.',
    description: 'Each piece is handcrafted. Contact us promptly if an item arrives damaged or if you need help with your order.',
    sections: [
      {
        heading: 'How to return',
        body: 'Contact us with your order number and photos of the issue so we can help with the next steps.',
      },
      {
        heading: 'Refunds',
        body: 'Refund and return terms should be finalised for your business before taking real orders.',
      },
      {
        heading: 'Warranty',
        body: 'Small bubbles, flower placement and colour can vary naturally from piece to piece.',
      },
    ],
    action: shopAction,
  },
  privacy: {
    eyebrow: 'Legal',
    title: 'Privacy policy.',
    description: 'This demo storefront keeps its sample cart and order information in your browser.',
    sections: [
      {
        heading: 'What we collect',
        body: 'This demo stores cart and order details only in your browser. No details are sent to a server.',
      },
      {
        heading: 'Payments',
        body: 'This storefront is a demo: card details are not processed, transmitted or stored.',
      },
      {
        heading: 'Your choices',
        body: 'The newsletter form is a local demo and does not subscribe you to a mailing list.',
      },
    ],
  },
  terms: {
    eyebrow: 'Legal',
    title: 'Terms of service.',
    description: 'The short version: fair prices, honest products and a straightforward returns policy.',
    sections: [
      {
        heading: 'Orders',
        body: 'Prices are shown in Indian rupees. The product range and shipping details are sample content for this demo.',
      },
      {
        heading: 'Demo storefront',
        body: 'This website is a frontend demonstration. No real orders are fulfilled and no payments are processed.',
      },
      {
        heading: 'Warranty and returns',
      body: 'For a live shop, publish your final warranty, returns and exchange terms before taking orders.',
      },
    ],
  },
}

function Sections({ sections }) {
  return (
    <dl className="divide-y divide-line">
      {sections.map((s) => (
        <div key={s.heading} className="grid gap-2 py-7 md:grid-cols-[14rem_1fr] md:gap-10">
          <dt className="font-semibold">{s.heading}</dt>
          <dd className="leading-relaxed text-muted">{s.body}</dd>
        </div>
      ))}
    </dl>
  )
}

function AccountPage() {
  const order = readLastOrder()
  return (
    <SimplePage
      eyebrow="Account"
      title="Guest checkout."
      description="Your cart and most recent demo order are saved in this browser. Sign in and order tracking are prototype screens without a connected account service."
      action={shopAction}
    >
      {order ? (
        <div className="flex flex-wrap items-center justify-between gap-6 py-7">
          <div>
            <p className="eyebrow text-[0.6875rem] text-muted">Most recent order</p>
            <p className="mt-2 text-lg font-semibold">
              #{order.number} · <span className="tabular-nums">{formatPrice(order.total)}</span>
            </p>
          </div>
          <Link to="/order-success" className="text-sm font-semibold underline-offset-4 hover:underline">
            View confirmation
          </Link>
        </div>
      ) : (
        <p className="py-7 text-muted">No orders placed in this session yet.</p>
      )}
    </SimplePage>
  )
}

export default function InfoPage({ page }) {
  if (page === 'account') return <AccountPage />
  const { sections, ...rest } = pages[page]
  return (
    <SimplePage {...rest}>
      <Sections sections={sections} />
    </SimplePage>
  )
}
