// Central store settings — edit these values to update them across the whole site.

export let store = {
  name: 'GLOWWITHRUMI',
  tagline: 'Skincare & Beauty',

  // As the owner gave it. Note this is 11 digits — Ghana mobile numbers are
  // normally 10 (0XX XXX XXXX) — so it is worth checking before launch.
  phoneLocal: '05494469052',
  // Same number in international form for wa.me: leading 0 swapped for 233.
  whatsappNumber: '2335494469052',
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
}

export let whatsappLink = `https://wa.me/${store.whatsappNumber}?text=${encodeURIComponent(store.whatsappGreeting)}`

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
