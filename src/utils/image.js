/**
 * Image helpers for the Unsplash (imgix) CDN.
 * Product data stores a base URL; these helpers add width-specific params
 * so every <img> gets a responsive srcSet without duplicating URLs.
 */
const CDN = 'https://images.unsplash.com'

export function unsplash(id, params = '') {
  const extra = params ? `&${params}` : ''
  return `${CDN}/photo-${id}?auto=format&fit=crop&q=80${extra}`
}

export function withWidth(url, width) {
  return `${url}${url.includes('?') ? '&' : '?'}w=${width}`
}

const DEFAULT_WIDTHS = [480, 720, 960, 1280, 1600]

export function srcSet(url, widths = DEFAULT_WIDTHS) {
  return widths.map((w) => `${withWidth(url, w)} ${w}w`).join(', ')
}
