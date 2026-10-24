/**
 * Load the catalogue from the admin backend.
 *
 * The shop ships with its catalogue bundled, which is what it has always
 * rendered. This replaces that at start-up with whatever the owner currently
 * has in the admin, so a price typed there shows on the next page load.
 *
 * If the backend is unreachable the bundled copy stays in place, so the shop
 * never renders empty — a customer sees slightly stale prices rather than a
 * blank page.
 */

import type { Product } from '../contexts/AppContext'
import { applyCatalogue, type BlogPost, type FeaturedReview } from '../data/products'
import { applyStore } from '../data/store'
import { rebuildCategoryTiles } from './search'

const API = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000'
const TIMEOUT_MS = 5000

interface ApiCategory {
  name: string
  label: string
  display_order: number
}

interface ApiBrand {
  name: string
  logo: string | null
}

interface ApiPayload {
  products: Product[]
  categories: ApiCategory[]
  brands: ApiBrand[]
  journal: (BlogPost & { date: string | null })[]
  featuredReviews?: FeaturedReview[]
  settings: Record<string, unknown>
}

export async function loadCatalogue(): Promise<'api' | 'bundled'> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const response = await fetch(`${API}/api/catalogue/`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    })
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`)

    const data: ApiPayload = await response.json()
    if (!Array.isArray(data.products) || data.products.length === 0) {
      throw new Error('the backend returned no products')
    }

    applyCatalogue({
      products: data.products,
      // 'All' is the storefront's own filter chip, not a stored category.
      categories: ['All', ...data.categories.map(c => c.name)],
      blogPosts: data.journal.map(post => ({ ...post, date: post.date ?? '' })),
      featuredReviews: data.featuredReviews ?? [],
    })

    applyStore({
      settings: data.settings as never,
      brandLogos: Object.fromEntries(
        data.brands.filter(b => b.logo).map(b => [b.name, b.logo as string]),
      ),
    })

    rebuildCategoryTiles()
    return 'api'
  } catch (error) {
    // Expected whenever the backend is not running; the shop carries on.
    console.warn(
      '[catalogue] using the bundled copy —',
      error instanceof Error ? error.message : error,
    )
    return 'bundled'
  } finally {
    clearTimeout(timer)
  }
}
