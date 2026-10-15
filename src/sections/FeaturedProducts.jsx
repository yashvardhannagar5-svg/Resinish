import SectionHeading from '../components/SectionHeading'
import ScrollReveal from '../components/ScrollReveal'
import ProductGrid from '../components/ProductGrid'
import { getFeaturedProducts } from '../data/products'

const featured = getFeaturedProducts().slice(0, 4)

export default function FeaturedProducts() {
  return (
    <section aria-labelledby="featured-title" className="section-y">
      <div className="shell">
        <ScrollReveal>
          <SectionHeading id="featured-title" eyebrow="Handpicked for you" title="Keepsakes with a story." link={{ to: '/shop', label: 'View all pieces' }} />
        </ScrollReveal>
        <ProductGrid products={featured} label="Featured resin pieces" />
      </div>
    </section>
  )
}
