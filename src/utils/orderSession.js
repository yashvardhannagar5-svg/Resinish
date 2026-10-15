/**
 * The last demo order lives in sessionStorage so the confirmation page
 * survives a refresh after the cart is cleared. It never contains
 * payment details — only what the confirmation page displays.
 */
const KEY = 'resin-reverie-last-order'

export function saveLastOrder(order) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(order))
  } catch {
    // Storage unavailable (private mode): navigation state still carries the order.
  }
}

export function readLastOrder() {
  try {
    return JSON.parse(sessionStorage.getItem(KEY) ?? 'null')
  } catch {
    return null
  }
}
