export const shippingMethods = [
  {
    id: 'standard',
    label: 'Standard Shipping',
    description: '3–5 business days',
    price: 79,
    days: [3, 5],
  },
  {
    id: 'express',
    label: 'Express Shipping',
    description: '1–2 business days',
    price: 99,
    days: [1, 2],
  },
]

export const getShippingMethod = (id) => shippingMethods.find((m) => m.id === id) ?? shippingMethods[0]

export const countries = [
  'India',
  'United States',
  'Canada',
  'United Kingdom',
  'Ireland',
  'Denmark',
  'Germany',
  'France',
  'Netherlands',
  'Sweden',
  'Norway',
  'Australia',
  'New Zealand',
  'Japan',
  'Singapore',
]
