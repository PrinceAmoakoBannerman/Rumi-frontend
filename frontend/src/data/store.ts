// Central store settings — edit these values to update them across the whole site.

export let store = {
  name: 'GLOWWITHRUMI',
  tagline: 'Skincare & Beauty',

  phoneLocal: '0594469052',
  // Same number in international form for wa.me: leading 0 swapped for 233.
  whatsappNumber: '233594469052',
  whatsappGreeting: 'Hello GLOWWITHRUMI! I would like to ask about a product.',

  address: 'Grace Nkansah Apartment, Dome, Accra',

  // TODO: replace with the real GLOWWITHRUMI address for customer email.
  email: 'hello@rumiskincare.com',

  // Rotating messages in the announcement bar at the very top of the site.
  announcements: [
    'Nationwide delivery across Ghana 🇬🇭',
    'Free delivery on orders over 500 GH₵',
    'Personalised skincare recommendations',
  ],

  // Delivery charges, by region. The real amounts come from the admin through
  // the API; these bundled defaults are 0 on purpose, so that if an older
  // backend (which does not send them) is live, the checkout shows no fee —
  // matching what that backend would charge — rather than a figure it would
  // not. Once the backend sends real amounts, they take over. Numbers here,
  // though the API sends them as strings.
  deliveryAccra: 0 as number | string,
  deliveryOther: 0 as number | string,
  freeDeliveryFrom: 0 as number | string,
}

export let whatsappLink = `https://wa.me/${store.whatsappNumber}?text=${encodeURIComponent(store.whatsappGreeting)}`

/**
 * What delivery costs for a region and basket size — the same rule the backend
 * applies, so the estimate on the checkout page matches the amount charged.
 * Free once the basket reaches the free-delivery amount (when one is set).
 */
export function deliveryFeeFor(region: string, subtotal: number): number {
  const accra = Number(store.deliveryAccra) || 0
  const other = Number(store.deliveryOther) || 0
  const freeFrom = Number(store.freeDeliveryFrom) || 0
  if (freeFrom > 0 && subtotal >= freeFrom) return 0
  const inAccra = ['greater accra', 'accra'].includes((region || '').trim().toLowerCase())
  return inAccra ? accra : other
}

// Brands are derived from the catalogue itself — add a product with a new
// brand in data/products.ts and it appears here automatically.
export { brandList as brands } from './products'

/**
 * Official brand logos, served from `public/brands/`.
 * A brand with no entry here falls back to its name set in the display font.
 * To add one: drop the file in `public/brands/` and map the brand name to it.
 */
export let brandLogos: Record<string, string> = {
  'Acwell': '/brands/acwell.png',
  'Anua': '/brands/anua.png',
  'APLB': '/brands/aplb.png',
  'Beauty of Joseon': '/brands/beauty-of-joseon.png',
  'Celimax': '/brands/celimax.jpg',
  'COSRX': '/brands/cosrx.png',
  'EOS': '/brands/eos.png',
  'Eucerin': '/brands/eucerin.svg',
  'Haruharu Wonder': '/brands/haruharu-wonder.png',
  'Jergens': '/brands/jergens.svg',
  'Isntree': '/brands/isntree.png',
  'K Secret': '/brands/k-secret.png',
  'Medicube': '/brands/medicube.svg',
  'Missha': '/brands/missha.png',
  'Nivea': '/brands/nivea.svg',
  'Numbuzin': '/brands/numbuzin.jpg',
  'Purito': '/brands/purito.png',
  'SKIN1004': '/brands/skin1004.png',
  'Some By Mi': '/brands/some-by-mi.png',
  'The Ordinary': '/brands/the-ordinary.svg',
  'TONYMOLY': '/brands/tonymoly.png',
  // Still needed. Jumiso and Nineless have no live official site (both domains
  // are parked) and no retailer publishes their mark. La Roche-Posay's site
  // renders its logo too late to scrape, so that one needs supplying by hand.
}


/**
 * Replace the bundled shop details with whatever the admin holds.
 * Live bindings again, so importers see the new values without changing.
 */
export function applyStore(next: {
  settings?: Partial<typeof store>
  brandLogos?: Record<string, string>
}) {
  if (next.settings) {
    store = { ...store, ...next.settings }
    whatsappLink = `https://wa.me/${store.whatsappNumber}?text=${encodeURIComponent(store.whatsappGreeting)}`
  }
  if (next.brandLogos && Object.keys(next.brandLogos).length) {
    brandLogos = next.brandLogos
  }
}
