const productArt = {
  earrings: '/products/earrings.svg',
  coasters: '/products/coasters.svg',
  lockets: '/products/lockets.svg',
  'wall-clocks': '/products/wall-clocks.svg',
  customisations: '/products/customisations.svg',
}

// Collection tile photos are stored separately so replacing a product photo
// never changes the image used on its category card.
const categoryPhotos = {
  earrings: '/categories/earrings.webp',
  coasters: '/categories/coasters.webp',
  lockets: '/categories/lockets.webp',
  'wall-clocks': '/categories/wall-clocks.jpg',
  customisations: '/categories/customisations.jpg',
}

export const categories = [
  { id: 'earrings', name: 'Earrings', tagline: 'Little blooms, made to wear.', image: categoryPhotos.earrings, alt: 'Pressed-leaf resin earrings with gold-tone hooks', tone: 'light' },
  { id: 'coasters', name: 'Coasters', tagline: 'A little colour for your table.', image: categoryPhotos.coasters, alt: 'Set of four handmade floral resin coasters', tone: 'dark' },
  { id: 'lockets', name: 'Lockets', tagline: 'Keep a flower close.', image: categoryPhotos.lockets, alt: 'Rose preserved inside a handmade resin capsule locket', tone: 'light' },
  { id: 'wall-clocks', name: 'Wall Clocks', tagline: 'Time, with a touch of nature.', image: categoryPhotos['wall-clocks'], alt: 'Ocean-inspired handmade resin wall clock', tone: 'dark' },
  { id: 'customisations', name: 'Customisations', tagline: 'Your flowers, your keepsake.', image: categoryPhotos.customisations, alt: 'Custom ocean-blue resin nameplate with gold lettering', tone: 'dark' },
]

export const getCategory = (id) => categories.find((c) => c.id === id)

const makeProduct = (id, slug, name, category, price, description, options = {}) => ({
  id, slug, name, category, price, originalPrice: options.originalPrice ?? null,
  description, images: options.images ?? [productArt[category] ?? productArt.customisations],
  colors: options.colors ?? [{ name: 'Rose pink', hex: '#c77f83' }, { name: 'Pressed floral', hex: '#d4c39d' }],
  features: ['Hand-finished in small batches', 'Made with real preserved flowers', 'Personalise the colours or add a short note', 'Gift-ready packaging included'],
  specifications: { material: 'Clear-cast resin, preserved botanicals, gold-tone findings', finish: 'Hand-polished gloss', care: 'Wipe gently with a soft dry cloth' },
  isFeatured: Boolean(options.featured), isNew: Boolean(options.isNew), stock: 60,
  releaseDate: options.releaseDate ?? '2026-09-01',
  inTheBox: ['One handcrafted resin keepsake', 'Care card', 'Gift box'],
})

export const products = [
  makeProduct('rs-001', 'rose-capsule-locket', 'Rose Capsule Locket', 'lockets', 450, 'A real rosebud, preserved inside a clear resin capsule and finished with a delicate gold-tone chain. A little reminder of a moment worth keeping.', { images: ['/products/rose-capsule-locket.webp', '/products/rose-capsule-locket-detail.webp'], featured: true, originalPrice: 520 }),
  makeProduct('rs-002', 'forget-me-not-locket', 'Forget-Me-Not Locket', 'lockets', 499, 'Tiny blue forget-me-not blossoms are set by hand in clear resin to make a light-catching keepsake for everyday wear.', { images: ['/products/forget-me-not-locket.webp'], featured: true, isNew: true }),
  makeProduct('rs-003', 'sunlit-petal-drops', 'Sunlit Petal Drops', 'earrings', 599, 'Translucent resin drops with delicate preserved petals and warm gold-tone hooks. Each pair has its own natural arrangement.', { images: ['/products/sunlit-petal-drops.webp', '/products/sunlit-petal-drops-detail.webp'], featured: true, originalPrice: 699 }),
  makeProduct('rs-004', 'meadow-stud-earrings', 'Meadow Stud Earrings', 'earrings', 399, 'Small botanical studs that bring a hint of the garden to your everyday look. Choose a flower colour when ordering.', { images: ['/products/meadow-stud-earrings.webp', '/products/meadow-stud-earrings-detail.webp'], isNew: true }),
  makeProduct('rs-005', 'wildflower-coaster-set', 'Wildflower Coaster Set', 'coasters', 1299, 'A set of four hand-poured floral resin coasters. Each set has a one-of-a-kind petal pattern.', { images: ['/products/wildflower-coaster-set.webp', '/products/wildflower-coaster-set-detail.webp'], featured: true, originalPrice: 1499 }),
  makeProduct('rs-006', 'rose-gold-coasters', 'Rose Garden Coasters', 'coasters', 1199, 'Hand-poured floral resin coasters with rich rose petals and a glossy finish. A thoughtful housewarming or host gift.', { images: ['/products/rose-garden-coasters.webp'] }),
  makeProduct('rs-007', 'botanical-round-clock', 'Botanical Round Clock', 'wall-clocks', 2499, 'A statement round resin clock with pressed flowers and Roman numerals. Each handmade design can include a personal photo.', { images: ['/products/botanical-round-clock.jpg'], featured: true, isNew: true }),
  makeProduct('rs-008', 'ocean-bloom-clock', 'Ocean Bloom Wall Clock', 'wall-clocks', 2799, 'A handmade wall clock with ocean-blue resin, a sandy shoreline and delicate botanical details.', { images: ['/products/ocean-bloom-clock.jpg', '/products/ocean-bloom-clock-detail.webp'] }),
  makeProduct('rs-009', 'your-bloom-earrings', 'Your Bloom Earrings', 'customisations', 699, 'Choose your flower, colour palette and metal tone. We will make a one-of-a-kind resin pair to your brief; share your request at checkout.', { images: ['/products/your-bloom-earrings.webp'], isNew: true }),
  makeProduct('rs-010', 'memory-flower-locket', 'Memory Flower Locket', 'customisations', 799, 'Turn a meaningful dried flower or petal into a personal keepsake. Custom flower inclusion is subject to a quick design check with our maker.', { images: ['/products/memory-flower-locket.jpg'] }),
  makeProduct('rs-011', 'personalised-coaster-set', 'Personalised Coaster Set', 'customisations', 1599, 'A personalised resin keepsake set with preserved flowers, a photo and a little gold detail. Add your preferred name or message at checkout.', { images: ['/products/personalised-coaster-set.jpg', '/products/personalised-coaster-set-detail.jpg'] }),
  makeProduct('rs-012', 'custom-botanical-clock', 'Custom Botanical Clock', 'customisations', 2999, 'Choose your colours, keepsake photo and flower details for a resin wall clock made especially for your home.', { images: ['/products/custom-botanical-clock.jpg'] }),
  makeProduct('rs-013', 'pressed-flower-locket-pair', 'Pressed Flower Locket Pair', 'lockets', 650, 'A pair of round resin pendants with pressed blooms in contrasting colours, finished with gold-tone chains.', { images: ['/products/pressed-flower-lockets.webp'] }),
  makeProduct('rs-014', 'custom-resin-nameplate', 'Custom Resin Nameplate', 'customisations', 1499, 'A vibrant ocean-inspired resin nameplate with a personalised name and beach details. Add the names and colours you would like at checkout.', { images: ['/products/custom-resin-nameplate.jpg'], isNew: true }),
  makeProduct('rs-015', 'custom-flower-bookmark', 'Custom Flower Bookmark', 'customisations', 499, 'A clear resin bookmark with preserved rose petals, gold accents and a tassel. Personalise it with a flower or a small keepsake.', { images: ['/products/custom-flower-bookmark.jpg'], isNew: true }),
]

export const getProductBySlug = (slug) => products.find((p) => p.slug === slug)
export const getFeaturedProducts = () => products.filter((p) => p.isFeatured)
export const getBestSellers = (limit = 4) => products.filter((p) => !p.isFeatured).slice(0, limit)
export const getProductsByCategory = (categoryId) => products.filter((p) => p.category === categoryId)
export const startingPrice = Math.min(...products.map((p) => p.price))
export const getProductById = (id) => products.find((p) => p.id === id)
export const getRelatedProducts = (product, limit = 4) => {
  const others = products.filter((p) => p.id !== product.id)
  return [...others.filter((p) => p.category === product.category), ...others.filter((p) => p.category !== product.category)].slice(0, limit)
}

export const sortOptions = [
  { id: 'featured', label: 'Featured' }, { id: 'newest', label: 'Newest' },
  { id: 'price-asc', label: 'Price: Low to High' }, { id: 'price-desc', label: 'Price: High to Low' },
]
const byRelease = (a, b) => b.releaseDate.localeCompare(a.releaseDate)
const sorters = {
  featured: (a, b) => Number(b.isFeatured) - Number(a.isFeatured) || byRelease(a, b),
  newest: byRelease, 'price-asc': (a, b) => a.price - b.price || byRelease(a, b),
  'price-desc': (a, b) => b.price - a.price || byRelease(a, b),
}
const matchesSearch = (product, term) => !term || `${product.name} ${getCategory(product.category)?.name ?? ''}`.toLowerCase().includes(term.toLowerCase())
export function queryProducts({ category = 'all', sort = 'featured', onlyNew = false, search = '' } = {}) {
  return products.filter((p) => category === 'all' || p.category === category).filter((p) => !onlyNew || p.isNew).filter((p) => matchesSearch(p, search.trim())).sort(sorters[sort] ?? sorters.featured)
}
export const specLabels = { material: 'Materials', finish: 'Finish', care: 'Care' }
