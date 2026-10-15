import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ChevronRight } from 'lucide-react'
import { ButtonLink } from '../components/Button'
import ProductGallery from '../components/ProductGallery'
import ProductPurchase from '../components/ProductPurchase'
import ProductDetailsAccordion from '../components/ProductDetailsAccordion'
import ProductGrid from '../components/ProductGrid'
import SectionHeading from '../components/SectionHeading'
import { getCategory, getFeaturedProducts, getProductBySlug, getRelatedProducts } from '../data/products'

function Breadcrumbs({ product }) {
  const category = getCategory(product.category)
  const crumbs = [
    { label: 'Shop', to: '/shop' },
    { label: category.name, to: `/shop?category=${category.id}` },
  ]
  return (
    <nav aria-label="Breadcrumb" className="mb-8 lg:mb-10">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted">
        {crumbs.map((c) => (
          <li key={c.to} className="flex items-center gap-1.5">
            <Link to={c.to} className="inline-block py-1 transition-colors hover:text-ink">
              {c.label}
            </Link>
            <ChevronRight aria-hidden="true" className="size-3.5" />
          </li>
        ))}
        <li aria-current="page" className="text-ink">
          {product.name}
        </li>
      </ol>
    </nav>
  )
}

function ProductNotFound() {
  return (
    <>
      <section className="shell flex min-h-[70svh] flex-col justify-center pt-36 pb-16">
        <p className="eyebrow mb-6 text-muted">Product not found</p>
        <h1 className="display max-w-4xl text-[clamp(2.75rem,7vw,6rem)]">
          This one’s gone quiet.
        </h1>
        <p className="mt-8 max-w-lg text-lg leading-relaxed text-muted">
          The product you’re looking for may have been renamed or is no longer available.
        </p>
        <div className="mt-12 flex flex-wrap gap-3">
          <ButtonLink to="/shop">Browse all keepsakes</ButtonLink>
          <ButtonLink to="/" variant="secondary">
            <ArrowLeft aria-hidden="true" className="size-4" />
            Back to home
          </ButtonLink>
        </div>
      </section>
      <section aria-labelledby="nf-featured" className="shell pb-24 lg:pb-32">
        <SectionHeading id="nf-featured" eyebrow="Featured" title="Perhaps one of these." />
        <ProductGrid products={getFeaturedProducts().slice(0, 4)} label="Featured resin keepsakes" />
      </section>
    </>
  )
}

function ProductView({ product }) {
  const related = getRelatedProducts(product, 4)

  return (
    <>
      <section className="shell pt-24 pb-20 md:pt-28 lg:pt-32 lg:pb-28">
        <Breadcrumbs product={product} />
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <ProductGallery images={product.images} alt={product.name} />
          </div>
          <div className="lg:sticky lg:top-24 lg:col-span-5 lg:self-start xl:col-span-4 xl:col-start-9">
            <ProductPurchase product={product} />
          </div>
        </div>
      </section>

      <section id="details" aria-labelledby="details-title" className="shell scroll-mt-24 pb-20 lg:pb-28">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <p className="eyebrow mb-5 text-muted">Details</p>
            <h2 id="details-title" className="heading text-[clamp(2rem,3.4vw,3rem)]">
              Everything about {product.name}.
            </h2>
          </div>
          <div className="lg:col-span-8">
            <ProductDetailsAccordion product={product} />
          </div>
        </div>
      </section>

      <section aria-labelledby="related-title" className="section-y border-t border-line bg-surface">
        <div className="shell">
          <SectionHeading
            id="related-title"
            eyebrow="You may also like"
            title="Find your next keepsake."
            link={{ to: '/shop', label: 'View all pieces' }}
          />
          <ProductGrid products={related} label="Related resin keepsakes" />
        </div>
      </section>
    </>
  )
}

export default function ProductDetails() {
  const { slug } = useParams()
  const product = getProductBySlug(slug)
  if (!product) return <ProductNotFound />
  // Keyed so colour/quantity/gallery state resets when moving between products.
  return <ProductView key={product.id} product={product} />
}
