/**
 * Leaving a review.
 *
 * A review is sent as multipart, because it may carry a photo. Only the name,
 * rating and words are required. Nothing appears on the shop until the owner
 * approves it, so the success message says so rather than pretending it is
 * already live.
 */

import { authHeaders } from './auth'

const API = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000'

export class ReviewError extends Error {}

export async function submitReview(
  productId: number,
  review: { name: string; rating: number; text: string; photo?: File | null },
): Promise<string> {
  const form = new FormData()
  form.append('name', review.name)
  form.append('rating', String(review.rating))
  form.append('text', review.text)
  if (review.photo) form.append('photo', review.photo)

  let response: Response
  try {
    response = await fetch(`${API}/api/products/${productId}/reviews/`, {
      method: 'POST',
      // No Content-Type: the browser sets the multipart boundary itself.
      headers: { ...authHeaders() },
      body: form,
    })
  } catch {
    throw new ReviewError('We could not reach the shop. Check your connection and try again.')
  }

  const body = await response.json().catch(() => null)
  if (!response.ok) {
    throw new ReviewError(readError(body) ?? 'Your review could not be sent.')
  }
  return (body?.detail as string) ?? 'Thank you! Your review will appear once it has been checked.'
}

function readError(body: unknown): string | null {
  if (!body || typeof body !== 'object') return null
  const data = body as Record<string, unknown>
  if (typeof data.detail === 'string') return data.detail
  for (const value of Object.values(data)) {
    const first = Array.isArray(value) ? value[0] : value
    if (typeof first === 'string') return first
  }
  return null
}
