// Central store settings — edit these values to update them across the whole site.

export const store = {
  name: 'GLOWWITHRUMI',
  tagline: 'Skincare & Beauty',

  // TODO: replace with the real GLOWWITHRUMI WhatsApp number (international format, digits only).
  whatsappNumber: '233000000000',
  whatsappGreeting: 'Hello GLOWWITHRUMI! I would like to ask about a product.',

  // Rotating messages in the announcement bar at the very top of the site.
  announcements: [
    'Nationwide delivery across Ghana 🇬🇭',
    'Free delivery on orders over 500 GH₵',
    'Need help choosing? Message us on WhatsApp',
  ],
}

export const whatsappLink = `https://wa.me/${store.whatsappNumber}?text=${encodeURIComponent(store.whatsappGreeting)}`

// Brands are derived from the catalogue itself — add a product with a new
// brand in data/products.ts and it appears here automatically.
export { brandList as brands } from './products'

/**
 * Official brand logos, served from `public/brands/`.
 * A brand with no entry here falls back to its name set in the display font.
 * To add one: drop the file in `public/brands/` and map the brand name to it.
 */
export const brandLogos: Record<string, string> = {
  'Anua': '/brands/anua.png',
  'Acwell': '/brands/acwell.png',
  'Beauty of Joseon': '/brands/beauty-of-joseon.png',
  'Celimax': '/brands/celimax.jpg',
  'COSRX': '/brands/cosrx.png',
  'Isntree': '/brands/isntree.png',
  'K Secret': '/brands/k-secret.png',
  'Medicube': '/brands/medicube.svg',
  'Missha': '/brands/missha.png',
  'Nivea': '/brands/nivea.svg',
  'Numbuzin': '/brands/numbuzin.jpg',
  'Purito': '/brands/purito.png',
  'SKIN1004': '/brands/skin1004.png',
  'TONYMOLY': '/brands/tonymoly.png',
  // Still needed: Some By Mi, The Ordinary, Haruharu Wonder, Jumiso, APLB, Nineless
}
