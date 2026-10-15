import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { getProductById } from '../data/products'

/**
 * Cart store — the single source of truth for the cart.
 *
 * Each line item stores only what the cart UI needs (a small snapshot of the
 * product plus the chosen variant), keyed by `productId:colorName` so adding
 * the same configuration again increases quantity instead of duplicating.
 * Only `items` are persisted; the drawer's open state is session UI.
 */

const STORAGE_KEY = 'resin-reverie-cart'

const lineKey = (productId, colorName) => `${productId}:${colorName ?? 'default'}`

/** Resolve a colour (object or name) to one the product actually offers. */
function resolveColor(product, selected) {
  if (!product.colors?.length) return null
  const name = typeof selected === 'string' ? selected : selected?.name
  return product.colors.find((c) => c.name === name) ?? product.colors[0]
}

const clampQty = (qty, max) => Math.max(1, Math.min(Math.floor(qty) || 1, max ?? Infinity))

function toLineItem(product, color, quantity, customNote = '') {
  return {
    key: `${lineKey(product.id, color?.name)}:${customNote.trim().toLowerCase() || 'standard'}`,
    productId: product.id,
    slug: product.slug,
    name: product.name,
    price: product.price,
    image: product.images[0],
    color: color ? { name: color.name, hex: color.hex } : null,
    customNote,
    quantity: clampQty(quantity, product.stock),
  }
}

/**
 * Validate persisted items against the current catalogue: drop unknown
 * products, refresh price/name/image, merge any duplicate keys.
 */
function sanitize(items) {
  if (!Array.isArray(items)) return []
  const merged = new Map()
  for (const raw of items) {
    const product = getProductById(raw?.productId)
    if (!product) continue
    const colorName = typeof raw.color === 'string' ? raw.color : raw.color?.name
    const color = resolveColor(product, colorName)
    const item = toLineItem(product, color, raw.quantity, raw.customNote ?? '')
    const existing = merged.get(item.key)
    merged.set(
      item.key,
      existing ? { ...existing, quantity: clampQty(existing.quantity + item.quantity, product.stock) } : item,
    )
  }
  return [...merged.values()]
}

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, selectedColor, quantity = 1, customNote = '') =>
        set((state) => {
          const color = resolveColor(product, selectedColor)
          const key = `${lineKey(product.id, color?.name)}:${customNote.trim().toLowerCase() || 'standard'}`
          const existing = state.items.find((item) => item.key === key)
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.key === key
                  ? { ...item, quantity: clampQty(item.quantity + quantity, product.stock) }
                  : item,
              ),
            }
          }
          return { items: [...state.items, toLineItem(product, color, quantity, customNote)] }
        }),

      removeItem: (key) => set((state) => ({ items: state.items.filter((item) => item.key !== key) })),

      increaseQuantity: (key) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.key === key
              ? { ...item, quantity: clampQty(item.quantity + 1, getProductById(item.productId)?.stock) }
              : item,
          ),
        })),

      // Never below 1 — removing is an explicit action.
      decreaseQuantity: (key) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.key === key ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item,
          ),
        })),

      clearCart: () => set({ items: [] }),

      // No-ops when unchanged, so route changes don't trigger storage writes.
      openCart: () => !get().isOpen && set({ isOpen: true }),
      closeCart: () => get().isOpen && set({ isOpen: false }),
    }),
    {
      name: STORAGE_KEY,
      version: 2,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
      // Unversioned (v0) carts stored { key, productId, color: 'Name', quantity }.
      migrate: (persisted) => ({ items: sanitize(persisted?.items) }),
      // Replace (never append) with validated items, so hydration can't duplicate.
      merge: (persisted, current) => ({ ...current, items: sanitize(persisted?.items) }),
    },
  ),
)

// Keep multiple tabs in sync.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === STORAGE_KEY) useCartStore.persist.rehydrate()
  })
}

/* ------------------------------------------------------------------
   Selectors (derived, never stored)
   ------------------------------------------------------------------ */
export const selectTotalItems = (state) => state.items.reduce((total, item) => total + item.quantity, 0)

export const selectSubtotal = (state) =>
  state.items.reduce((total, item) => total + item.price * item.quantity, 0)

export const maxQuantityFor = (item) => getProductById(item.productId)?.stock ?? Infinity
