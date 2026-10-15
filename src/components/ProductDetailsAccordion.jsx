import Accordion from './Accordion'
import { specLabels } from '../data/products'

function SpecTable({ product }) {
  return <dl className="grid text-sm sm:grid-cols-2 sm:gap-x-10">
    {Object.entries(product.specifications).map(([key, value]) => <div key={key} className="flex justify-between gap-6 border-b border-line py-3.5">
      <dt className="text-muted">{specLabels[key] ?? key}</dt><dd className="text-right font-medium">{value}</dd>
    </div>)}
  </dl>
}

export default function ProductDetailsAccordion({ product }) {
  const items = [
    { id: 'features', title: 'Details', content: <ul className="grid gap-3 text-base sm:grid-cols-2 sm:gap-x-10">{product.features.map((feature) => <li key={feature} className="flex gap-3"><span aria-hidden="true" className="mt-2.5 h-px w-3 shrink-0 bg-ink" />{feature}</li>)}</ul> },
    { id: 'specs', title: 'Materials & care', content: <SpecTable product={product} /> },
    { id: 'box', title: 'What’s in the box', content: <ul className="grid gap-3 text-base sm:grid-cols-2 sm:gap-x-10">{product.inTheBox.map((thing) => <li key={thing} className="flex gap-3"><span aria-hidden="true" className="mt-2.5 h-px w-3 shrink-0 bg-ink" />{thing}</li>)}</ul> },
    { id: 'custom', title: 'Customise this piece', content: <p className="max-w-2xl leading-relaxed text-muted">Every piece can be personalised. Add your flower, colour, initials or other request in the “Make it yours” box above. Natural flower placement varies, and we’ll contact you to confirm a custom design before making it.</p> },
  ]
  return <Accordion items={items} defaultOpen={['features']} />
}
