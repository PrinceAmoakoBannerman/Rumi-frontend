/**
 * The early-access sign-up, posted to the backend.
 *
 * Mirrors the other API clients: it reads the same VITE_API_URL and fails with
 * a human message the popup can show, rather than a raw status code.
 */

const API = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000'

export async function joinEarlyAccess(email: string, source = 'early_access'): Promise<string> {
  const res = await fetch(`${API}/api/early-access/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, source }),
  })

  let data: { detail?: string; email?: string[] } = {}
  try {
    data = await res.json()
  } catch {
    // A non-JSON body (a gateway error page, say) — fall through to a generic
    // message below.
  }

  if (!res.ok) {
    const reason =
      (Array.isArray(data.email) && data.email[0]) ||
      data.detail ||
      'Something went wrong. Please try again in a moment.'
    throw new Error(reason)
  }

  return data.detail ?? "You're on the list!"
}
