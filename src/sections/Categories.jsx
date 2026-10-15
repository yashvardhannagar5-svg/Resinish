import SectionHeading from '../components/SectionHeading'
import ScrollReveal from '../components/ScrollReveal'
import CategoryCard from '../components/CategoryCard'
import { categories, getProductsByCategory } from '../data/products'

// Editorial mosaic: layout per card gives each category its own presence.
const layout = [
  {
    id: 'earrings',
    className: 'h-[26rem] md:col-span-2 md:h-[30rem] lg:col-span-7 lg:h-[38rem]',
    imageClassName: 'object-[50%_45%]',
    sizes: '(min-width: 1024px) 56vw, 100vw',
  },
  {
    id: 'coasters',
    className: 'h-[26rem] md:h-[24rem] lg:col-span-5 lg:h-[38rem]',
    imageClassName: 'object-[50%_60%]',
    sizes: '(min-width: 1024px) 40vw, (min-width: 768px) 50vw, 100vw',
  },
  {
    id: 'lockets',
    className: 'h-[22rem] md:h-[24rem] lg:col-span-4 lg:h-[28rem]',
    imageClassName: 'object-[50%_30%]',
    sizes: '(min-width: 1024px) 32vw, (min-width: 768px) 50vw, 100vw',
  },
  {
    id: 'wall-clocks',
    className: 'h-[22rem] md:h-[24rem] lg:col-span-4 lg:h-[28rem]',
    imageClassName: 'object-[60%_50%]',
    sizes: '(min-width: 1024px) 32vw, (min-width: 768px) 50vw, 100vw',
  },
  {
    id: 'customisations',
    className: 'h-[22rem] md:h-[24rem] lg:col-span-4 lg:h-[28rem]',
    imageClassName: 'object-[40%_60%]',
    sizes: '(min-width: 1024px) 32vw, (min-width: 768px) 50vw, 100vw',
  },
]

const cards = layout.map((entry) => ({
  ...entry,
  category: categories.find((c) => c.id === entry.id),
  count: getProductsByCategory(entry.id).length,
}))

export default function Categories() {
  return (
    <section aria-labelledby="categories-title" className="section-y">
      <div className="shell">
        <ScrollReveal>
          <SectionHeading
            id="categories-title"
            eyebrow="Categories"
            title="Find your keepsake."
          />
        </ScrollReveal>
        <ScrollReveal as="ul" className="grid gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-12" aria-label="Resin product categories">
          {cards.map(({ id, category, count, className, imageClassName, sizes }) => (
            <li key={id} data-reveal className={className}>
              <CategoryCard
                category={category}
                count={count}
                sizes={sizes}
                imageClassName={imageClassName}
                className="h-full"
              />
            </li>
          ))}
        </ScrollReveal>
      </div>
    </section>
  )
}
