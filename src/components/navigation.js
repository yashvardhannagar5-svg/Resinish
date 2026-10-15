export const primaryNav = [
  { label: 'Shop', to: '/shop' },
  { label: 'Collections', to: '/shop?category=lockets' },
  { label: 'New Arrivals', to: '/shop?filter=new' },
  { label: 'About', to: '/about' },
  { label: 'Track Order', to: '/track-order' },
]

export const footerNav = [
  {
    title: 'Shop',
    links: [
      { label: 'All Collections', to: '/shop' },
      { label: 'Coasters', to: '/shop?category=coasters' },
      { label: 'Wall Clocks', to: '/shop?category=wall-clocks' },
      { label: 'New Arrivals', to: '/shop?filter=new' },
      { label: 'Earrings', to: '/shop?category=earrings' },
      { label: 'Lockets', to: '/shop?category=lockets' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Support', to: '/support' },
      { label: 'Shipping', to: '/shipping' },
      { label: 'Returns', to: '/returns' },
      { label: 'Contact', to: '/support' },
      { label: 'Track Order', to: '/track-order' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', to: '/about' },
      { label: 'Privacy', to: '/privacy' },
      { label: 'Terms', to: '/terms' },
      { label: 'Sign in', to: '/login' },
    ],
  },
]

/** True when a nav target matches the current location (path + query). */
export function isActive(to, location) {
  const [path, query = ''] = to.split('?')
  const current = location.search.replace(/^\?/, '')
  return location.pathname === path && current === query
}
