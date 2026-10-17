export function formatPrice(amount: number): string {
  return `${Math.round(amount).toLocaleString('en-US')} GH₵`
}

/**
 * Price as shown on a product. A price of 0 means it has not been set yet,
 * so we ask the shopper to get in touch rather than advertising "0 GH₵".
 */
export function formatProductPrice(amount: number): string {
  return amount > 0 ? formatPrice(amount) : 'Price on request'
}

/** Photo shown until a real product image is added to `public/products/`. */
export const PLACEHOLDER_IMAGE = '/products/_placeholder.svg'
