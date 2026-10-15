import ProductCard from './ProductCard'
import ScrollReveal from './ScrollReveal'

/**
 * Product listing used by homepage showcases.
 * Mobile: horizontal snap rail (keeps the page short, cards stay large).
 * Tablet: 2 columns. Desktop: 4 columns.
 */
export default function ProductGrid({ products, label }) {
  return (
    <ScrollReveal
      as="ul"
      aria-label={label}
      className="no-scrollbar -mx-5 flex max-md:[contain:paint] snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-2 sm:-mx-8 sm:scroll-px-8 sm:px-8 md:mx-0 md:grid md:grid-cols-2 md:gap-x-6 md:gap-y-14 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-4"
    >
      {products.map((product) => (
        <li
          key={product.id}
          data-reveal
          className="w-[78vw] max-w-[22rem] shrink-0 snap-start md:w-auto md:max-w-none"
        >
          <ProductCard product={product} className="h-full" />
        </li>
      ))}
    </ScrollReveal>
  )
}
