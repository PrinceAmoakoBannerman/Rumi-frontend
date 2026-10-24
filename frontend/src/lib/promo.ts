/**
 * Checking a discount code.
 *
 * The browser asks the backend whether a code is good and what it takes off,
 * and shows that — but the real discount is applied by the backend at
 * checkout, so nothing here decides the money.
 */

const API = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000'

export interface PromoResult {
  ok: boolean
  code: string
  discount: number
  label?: string
  error?: string
}

export async function checkPromo(code: string, subtotal: number): Promise<PromoResult> {
  let response: Response
  try {
    response = await fetch(`${API}/api/promo/check/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, subtotal }),
    })
  } catch {
    return { ok: false, code, discount: 0, error: 'Could not reach the shop. Try again.' }
  }
  const body = await response.json().catch(() => null)
  if (!response.ok || !body?.ok) {
    return { ok: false, code, discount: 0, error: body?.detail ?? 'That code could not be applied.' }
  }
  return { ok: true, code: body.code, discount: Number(body.discount), label: body.label }
}
