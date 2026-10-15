import SectionHeading from '../components/SectionHeading'
import ScrollReveal from '../components/ScrollReveal'
import ProductGrid from '../components/ProductGrid'
import { getBestSellers } from '../data/products'

const bestSellers = getBestSellers(4)

export default function BestSellers() {
  return (
    <section aria-labelledby="bestsellers-title" className="section-y border-t border-line bg-surface">
      <div className="shell">
        <ScrollReveal>
          <SectionHeading
            id="bestsellers-title"
            eyebrow="More to explore"
            title="Small pieces, lasting meaning."
            description="Thoughtful resin gifts made with real flowers and a personal touch."
            link={{ to: '/shop', label: 'Shop keepsakes' }}
          />
        </ScrollReveal>
        <ProductGrid products={bestSellers} label="Popular resin keepsakes" />
      </div>
    </section>
  )
}
