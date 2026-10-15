/* ------------------------------------------------------------------
   Input formatting
   ------------------------------------------------------------------ */
const digitsOnly = (value) => value.replace(/\D/g, '')

export const formatCardNumber = (value) =>
  digitsOnly(value)
    .slice(0, 19)
    .replace(/(\d{4})(?=\d)/g, '$1 ')

export function formatExpiry(value, previous = '') {
  const digits = digitsOnly(value).slice(0, 4)
  // Let backspace remove the slash naturally.
  if (value.length < previous.length && previous.endsWith('/') && digits.length === 2) return digits.slice(0, 1)
  if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`
  if (digits.length === 2 && value.length > previous.length) return `${digits}/`
  return digits
}

export const formatCvv = (value) => digitsOnly(value).slice(0, 4)

/* ------------------------------------------------------------------
   Validation
   ------------------------------------------------------------------ */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const POSTAL = /^[A-Za-z0-9][A-Za-z0-9 -]{1,9}$/

function luhn(number) {
  let sum = 0
  let double = false
  for (let i = number.length - 1; i >= 0; i -= 1) {
    let d = Number(number[i])
    if (double) {
      d *= 2
      if (d > 9) d -= 9
    }
    sum += d
    double = !double
  }
  return sum % 10 === 0
}

function expiryError(value, now = new Date()) {
  const match = /^(\d{2})\/(\d{2})$/.exec(value)
  if (!match) return 'Use the format MM/YY.'
  const month = Number(match[1])
  const year = 2000 + Number(match[2])
  if (month < 1 || month > 12) return 'Enter a valid month.'
  const endOfMonth = new Date(year, month, 1)
  if (endOfMonth <= now) return 'This card has expired.'
  if (year > now.getFullYear() + 20) return 'Enter a valid expiry year.'
  return ''
}

const required = (label) => (v) => (v.trim() ? '' : `${label} is required.`)

/** Field order doubles as the focus order for the first invalid field. */
export const checkoutRules = {
  email: (v) => (!v.trim() ? 'Email is required.' : EMAIL.test(v.trim()) ? '' : 'Enter a valid email address.'),
  phone: (v) => {
    if (!v.trim()) return 'Phone number is required.'
    const n = digitsOnly(v).length
    return /^[+\d\s().-]+$/.test(v.trim()) && n >= 7 && n <= 15 ? '' : 'Enter a valid phone number.'
  },
  firstName: required('First name'),
  lastName: required('Last name'),
  address: required('Address'),
  apartment: () => '',
  city: required('City'),
  state: required('State / region'),
  postalCode: (v) => (!v.trim() ? 'Postal code is required.' : POSTAL.test(v.trim()) ? '' : 'Enter a valid postal code.'),
  country: required('Country'),
  cardNumber: (v) => {
    const n = digitsOnly(v)
    if (!n) return 'Card number is required.'
    return n.length >= 13 && n.length <= 19 && luhn(n) ? '' : 'Enter a valid card number.'
  },
  expiry: (v) => (v ? expiryError(v) : 'Expiry date is required.'),
  cvv: (v) => (!v ? 'Security code is required.' : /^\d{3,4}$/.test(v) ? '' : 'Enter 3 or 4 digits.'),
  nameOnCard: required('Name on card'),
}

export function validateCheckout(values) {
  const errors = {}
  for (const [field, rule] of Object.entries(checkoutRules)) {
    const message = rule(values[field] ?? '')
    if (message) errors[field] = message
  }
  return errors
}

/* ------------------------------------------------------------------
   Demo order
   ------------------------------------------------------------------ */
export const createOrderNumber = () => `RS-${Math.floor(10000 + Math.random() * 90000)}`

/** Adds business days (skipping weekends). */
export function addBusinessDays(date, days) {
  const d = new Date(date)
  let added = 0
  while (added < days) {
    d.setDate(d.getDate() + 1)
    const day = d.getDay()
    if (day !== 0 && day !== 6) added += 1
  }
  return d
}
