/**
 * Placing an order.
 *
 * Only product ids and quantities are sent. The price of anything is decided
 * by the backend from its own database — if the amount travelled from here it
 * could be edited on the way, and someone would pay 1 GH₵ for a serum.
 */

import { authHeaders } from './auth'

const API = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000'

export interface CheckoutCustomer {
  name: string
  email: string
  phone: string
  address: string
  city: string
  region: string
}

export interface BasketLine {
  product: number
  quantity: number
}

export interface CheckoutResult {
  reference: string
  /** The order's own secret. Needed to open it again without signing in. */
  token: string
  total: string
  authorizationUrl: string | null
  detail?: string
}

import type { JourneyStep } from '../components/OrderProgress'

export interface OrderLine {
  name: string
  quantity: number
  unitPrice: string
  lineTotal: string
}

export interface Order {
  reference: string
  status: string
  statusLabel: string
  isPaid: boolean
  journey: JourneyStep[]
  customerName: string
  email: string
  phone: string
  address: string
  city: string
  region: string
  subtotal: string
  discount: string
  deliveryFee: string
  total: string
  items: OrderLine[]
  paidAt: string | null
  paymentChannel: string
}

export class CheckoutError extends Error {}

/** Create the order and, if payments are set up, get the Paystack link. */
export async function startCheckout(
  customer: CheckoutCustomer,
  basket: BasketLine[],
): Promise<CheckoutResult> {
  let response: Response
  try {
    response = await fetch(`${API}/api/checkout/`, {
      method: 'POST',
      // Signed in? Then the order belongs to that account, and will show
      // up under Your orders.
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ ...customer, basket }),
    })
  } catch {
    throw new CheckoutError(
      'We could not reach the shop. Check your connection and try again.',
    )
  }

  const body = await response.json().catch(() => null)

  if (!response.ok) {
    throw new CheckoutError(readError(body) ?? 'Your order could not be placed.')
  }
  return body as CheckoutResult
}

/** Read an order back. The backend confirms with Paystack if still pending.
 *
 * The order number alone is not enough — it is short enough to guess, and an
 * order holds a name, a phone number and an address. The token comes back
 * from checkout and rides along in the link we email.
 */
export async function fetchOrder(reference: string, token?: string | null): Promise<Order> {
  const query = token ? `?token=${encodeURIComponent(token)}` : ''
  const response = await fetch(
    `${API}/api/orders/${encodeURIComponent(reference)}/${query}`,
    { headers: authHeaders() },
  )
  if (!response.ok) throw new CheckoutError('We could not find that order.')
  return (await response.json()) as Order
}

/** Pull something readable out of a DRF error body. */
function readError(body: unknown): string | null {
  if (!body || typeof body !== 'object') return null
  const data = body as Record<string, unknown>
  if (typeof data.detail === 'string') return data.detail

  // Field errors arrive as { email: ["Enter a valid email address."] }
  for (const [field, value] of Object.entries(data)) {
    const first = Array.isArray(value) ? value[0] : value
    if (typeof first === 'string') {
      return field === 'basket' ? first : `${label(field)}: ${first}`
    }
    if (first && typeof first === 'object') {
      const nested = Object.values(first as Record<string, unknown>)[0]
      const text = Array.isArray(nested) ? nested[0] : nested
      if (typeof text === 'string') return text
    }
  }
  return null
}

function label(field: string): string {
  const names: Record<string, string> = {
    name: 'Full name',
    email: 'Email',
    phone: 'Phone number',
    address: 'Street address',
    city: 'City',
    region: 'Region',
  }
  return names[field] ?? field
}
