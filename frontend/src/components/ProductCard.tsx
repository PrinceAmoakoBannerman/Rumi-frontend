import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiHeart } from 'react-icons/fi'
import { useApp } from '../contexts/AppContext'
import type { Product } from '../contexts/AppContext'
import { formatPrice, formatProductPrice, PLACEHOLDER_IMAGE } from '../lib/currency'

interface Props {
  product: Product
  layout?: 'grid' | 'slide'
}

export default function ProductCard({ product, layout = 'grid' }: Props) {
  const { darkMode, addToCart, wishlist, toggleWishlist } = useApp()
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageSrc, setImageSrc] = useState(product.image)
  const wishlisted = wishlist.includes(product.id)

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0
  const soldOut = product.stock === 0
  const lowStock = product.stock > 0 && product.stock <= 5

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25 }}
      className={`group flex flex-col h-full ${layout === 'slide' ? 'min-w-[220px] sm:min-w-[260px]' : ''}`}
    >
      {/* Image — product alone on pure white */}
      <div className="relative bg-white rounded-xl overflow-hidden">
        <Link to={`/products/${product.id}`} className="block">
          <div className="relative aspect-square p-1">
            {!imageLoaded && <div className="skeleton absolute inset-0" />}
            <img
              src={imageSrc}
              alt={product.name}
              onLoad={() => setImageLoaded(true)}
              onError={() => { setImageSrc(PLACEHOLDER_IMAGE); setImageLoaded(true) }}
              className={`w-full h-full object-contain transition-transform duration-500 group-hover:scale-105 ${soldOut ? 'opacity-60' : ''}`}
            />
          </div>
        </Link>

        {/* Badges, stacked top-left */}
        <div className="absolute top-2.5 left-2.5 flex flex-col items-start gap-1.5">
          {discount > 0 && (
            <span className="bg-[#4C9A6A] text-white text-[10px] font-semibold tracking-wide px-2.5 py-1 rounded-full">
              -{discount}%
            </span>
          )}
          {soldOut && (
            <span className="bg-[#C0392B] text-white text-[10px] font-semibold tracking-[0.08em] uppercase px-2.5 py-1 rounded-full">
              Sold Out
            </span>
          )}
          {!soldOut && product.badge && (
            <span className="bg-[#D3839E] text-white text-[9px] font-semibold tracking-[0.12em] uppercase px-2.5 py-1 rounded-full">
              {product.badge}
            </span>
          )}
        </div>

        <button
          onClick={() => toggleWishlist(product.id)}
          aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          className="absolute top-2.5 right-2.5 w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center transition-transform hover:scale-110"
        >
          <FiHeart size={15} className={wishlisted ? 'fill-[#D3839E] text-[#D3839E]' : 'text-[#2A2A2A]/45'} />
        </button>
      </div>

      {/* Details — name carries the brand already, so no separate brand line */}
      <div className="flex flex-col flex-1 items-center text-center px-2 pt-4">
        <Link to={`/products/${product.id}`}>
          <h3
            style={{ fontFamily: 'var(--font-display)' }}
            className={`text-sm leading-snug font-medium line-clamp-3 hover:text-[#D3839E] transition-colors ${
              darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'
            }`}
          >
            {product.name}
          </h3>
        </Link>

        <p className={`mt-1.5 text-xs ${darkMode ? 'text-[#FAF7F2]/40' : 'text-[#4A4A4A]/60'}`}>
          {product.category}
          {product.size && ` · ${product.size}`}
        </p>

        <div className="mt-2.5 flex flex-wrap items-baseline justify-center gap-x-2 gap-y-0.5">
          {product.originalPrice && product.price > 0 && (
            <span className={`text-xs line-through whitespace-nowrap ${darkMode ? 'text-[#FAF7F2]/40' : 'text-[#4A4A4A]/45'}`}>
              {formatPrice(product.originalPrice)}
            </span>
          )}
          <span className={`text-sm sm:text-base font-semibold whitespace-nowrap ${darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'}`}>
            {formatProductPrice(product.price)}
          </span>
        </div>

        {lowStock && (
          <p className="mt-1 text-[11px] font-medium text-[#B85E75]">Only {product.stock} left</p>
        )}

        {/* Sold-out items show no action, matching how stores signal unavailability */}
        <div className="mt-auto pt-3.5 pb-1 min-h-[34px] flex items-start">
          {!soldOut && (
            <button
              onClick={() => addToCart(product)}
              className="text-[11px] tracking-[0.18em] uppercase font-semibold text-[#B85E75] hover:text-[#D3839E] transition-colors"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
