/**
 * Customer accounts.
 *
 * An account is never required to buy something — it only saves a shopper
 * typing their details again and lets them look back at what they ordered.
 *
 * The token is kept in localStorage. It is sent on request, never read by
 * the page for anything else, and thrown away by the server on sign out.
 */

const API = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000'
const TOKEN_KEY = 'gwr.token.v1'

export interface Account {
  name: string
  email: string
  phone: string
  address: string
  city: string
  region: string
}

export interface PastOrderLine {
  name: string
  quantity: number
  unitPrice: string
  lineTotal: string
}

export interface PastOrder {
  journey: import('../components/OrderProgress').JourneyStep[]
  reference: string
  status: string
  statusLabel: string
  isPaid: boolean
  total: string
  placedOn: string
  items: PastOrderLine[]
}

export class AuthError extends Error {}

export function readToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    // Private windows and blocked site data both throw here.
    return null
  }
}

function keepToken(token: string) {
  try {
    localStorage.setItem(TOKEN_KEY, token)
  } catch {
    // Signing in still works for this visit; it just will not be remembered.
  }
}

export function forgetToken() {
  try {
    localStorage.removeItem(TOKEN_KEY)
  } catch {
    /* nothing to do */
  }
}

/** Headers carrying the token, when there is one. */
export function authHeaders(): Record<string, string> {
  const token = readToken()
  return token ? { Authorization: `Token ${token}` } : {}
}

async function send(path: string, init: RequestInit = {}): Promise<unknown> {
  let response: Response
  try {
    response = await fetch(`${API}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
        ...(init.headers ?? {}),
      },
    })
  } catch {
    throw new AuthError('We could not reach the shop. Check your connection and try again.')
  }

  if (response.status === 204) return null

  const body = await response.json().catch(() => null)
  if (!response.ok) {
    if (response.status === 401) {
      // The token is no longer good for anything.
      forgetToken()
    }
    throw new AuthError(readError(body) ?? 'Something went wrong. Please try again.')
  }
  return body
}

export async function signUp(details: {
  name: string
  email: string
  password: string
  phone?: string
}): Promise<Account> {
  const body = (await send('/api/auth/register/', {
    method: 'POST',
    body: JSON.stringify(details),
  })) as { token: string; user: Account }
  keepToken(body.token)
  return body.user
}

export async function signIn(email: string, password: string): Promise<Account> {
  const body = (await send('/api/auth/login/', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })) as { token: string; user: Account }
  keepToken(body.token)
  return body.user
}

export async function signOut(): Promise<void> {
  try {
    await send('/api/auth/logout/', { method: 'POST' })
  } finally {
    // Whatever the server said, this browser is signed out.
    forgetToken()
  }
}

/** Who is signed in, or null. Used once at start-up. */
export async function whoAmI(): Promise<Account | null> {
  if (!readToken()) return null
  try {
    return (await send('/api/auth/me/')) as Account
  } catch {
    return null
  }
}

export async function saveDetails(changes: Partial<Account>): Promise<Account> {
  return (await send('/api/auth/me/', {
    method: 'PATCH',
    body: JSON.stringify(changes),
  })) as Account
}

export async function myOrders(): Promise<PastOrder[]> {
  return (await send('/api/auth/orders/')) as PastOrder[]
}

/** Pull something a person can act on out of a DRF error body. */
function readError(body: unknown): string | null {
  if (!body || typeof body !== 'object') return null
  const data = body as Record<string, unknown>
  if (typeof data.detail === 'string') return data.detail

  for (const [field, value] of Object.entries(data)) {
    const first = Array.isArray(value) ? value[0] : value
    if (typeof first === 'string') {
      return field === 'password' || field === 'email' || field === 'name'
        ? first
        : `${field}: ${first}`
    }
  }
  return null
}
