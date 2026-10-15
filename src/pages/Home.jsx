import Hero from '../sections/Hero'
import FeaturedProducts from '../sections/FeaturedProducts'
import ProductStory from '../sections/ProductStory'
import Categories from '../sections/Categories'
import BestSellers from '../sections/BestSellers'
import LifestyleBanner from '../sections/LifestyleBanner'
import Benefits from '../sections/Benefits'
import Newsletter from '../sections/Newsletter'
import OurWork from '../sections/OurWork'

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedProducts />
      <ProductStory />
      <Categories />
      <BestSellers />
      <OurWork />
      <LifestyleBanner />
      <Benefits />
      <Newsletter />
    </>
  )
}
