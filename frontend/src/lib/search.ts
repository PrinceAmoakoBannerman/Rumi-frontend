import { products, categories } from '../data/products'
import type { Product } from '../contexts/AppContext'

/**
 * Shared product search, used by both the search row under the navbar and the
 * one inside the mobile drawer, so they always behave the same way.
 *
 * Name matches rank above brand and category ones, so typing a product name
 * does not get buried under everything else by the same brand.
 */
export function searchProducts(query: string, limit = 6): Product[] {
  const q = query.trim().toLowerCase()
  if (q.length < 2) return []

  const scored = products
    .map(p => {
      const name = p.name.toLowerCase()
      if (name.startsWith(q)) return { p, score: 0 }
      if (name.includes(q)) return { p, score: 1 }
      if (p.brand.toLowerCase().includes(q)) return { p, score: 2 }
      if (p.category.toLowerCase().includes(q)) return { p, score: 3 }
      return null
    })
    .filter(r => r !== null)

  scored.sort((a, b) => a.score - b.score)
  return scored.slice(0, limit).map(r => r.p)
}

export interface CategoryTile {
  /** Matches the `category` field on a product, and the ?category= URL param. */
  category: string
  /** What the shopper reads — plainer than the internal category name. */
  label: string
  /** A real product shot from that category, used as the thumbnail. */
  image: string
}

/** Friendlier wording for the browse list; anything unlisted keeps its own name. */
const tileLabels: Record<string, string> = {
  Serums: 'Face Serums',
  Toners: 'Toners & Pads',
  Cleansers: 'Cleansers',
  Sunscreens: 'Sunscreens',
  Moisturizers: 'Facial Creams',
  Masks: 'Masks',
  Body: 'Body Care',
}

function buildCategoryTiles(): CategoryTile[] {
  return categories
    .filter(c => c !== 'All')
    .map(category => {
      const first = products.find(p => p.category === category && p.image)
      return first ? { category, label: tileLabels[category] ?? category, image: first.image } : null
    })
    .filter(t => t !== null)
}

/**
 * One tile per category that actually has stock, each illustrated with a real
 * product shot from inside it. Derived from the catalogue so a new category —
 * or a product photo swap — carries through without touching the navbar.
 */
export let categoryTiles: CategoryTile[] = buildCategoryTiles()

/**
 * Recompute after the catalogue is replaced by the API. This is built once at
 * import time, which happens before the fetch finishes, so it would otherwise
 * keep describing the bundled catalogue.
 */
export function rebuildCategoryTiles() {
  categoryTiles = buildCategoryTiles()
}
