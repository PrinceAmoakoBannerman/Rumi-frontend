import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useApp } from '../contexts/AppContext'
import type { Product } from '../contexts/AppContext'
import { formatPrice } from '../lib/currency'

interface Props {
  product: Product
  layout?: 'grid' | 'slide'
}

export default function ProductCard({ product, layout = 'grid' }: Props) {
  const { darkMode } = useApp()
  const [imageLoaded, setImageLoaded] = useState(false)
  const tagline = product.description.split('. ')[0]

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className={`group flex flex-col items-center text-center ${layout === 'slide' ? 'min-w-[220px] sm:min-w-[260px]' : ''}`}
    >
      {/* Image */}
      <Link to={`/products/${product.id}`} className="block w-full px-4 pt-2">
        <div className="relative aspect-square overflow-hidden rounded-2xl">
          {!imageLoaded && <div className="skeleton absolute inset-0" />}
          <img
            src={product.image}
            alt={product.name}
            onLoad={() => setImageLoaded(true)}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            style={{ filter: 'drop-shadow(0 18px 28px rgba(42,42,42,0.12))' }}
          />
        </div>
      </Link>

      {/* Tag */}
      <span
        className={`mt-6 inline-block border rounded px-3 py-1.5 text-[10px] tracking-[0.2em] uppercase font-medium ${darkMode ? 'border-[#D4B483]/40 text-[#D4B483]' : 'border-[#D4B483]/50 text-[#B8965E]'}`}
      >
        {product.badge || product.category}
      </span>

      {/* Name */}
      <Link to={`/products/${product.id}`}>
        <h3
          style={{ fontFamily: 'var(--font-display)' }}
          className={`mt-3 text-sm sm:text-base font-semibold tracking-wide uppercase hover:text-[#D4B483] transition-colors ${darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'}`}
        >
          {product.name}
        </h3>
      </Link>

      {/* Tagline */}
      <p className={`mt-1.5 text-xs sm:text-sm max-w-[240px] line-clamp-1 ${darkMode ? 'text-[#FAF7F2]/50' : 'text-[#4A4A4A]/70'}`}>
        {tagline}
      </p>

      {/* Price */}
      <div className="mt-2.5 flex items-center gap-2">
        <span className={`text-sm font-medium ${darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'}`}>{formatPrice(product.price)}</span>
        {product.originalPrice && (
          <span className={`text-xs line-through ${darkMode ? 'text-[#FAF7F2]/40' : 'text-[#4A4A4A]/50'}`}>{formatPrice(product.originalPrice)}</span>
        )}
      </div>
    </motion.div>
  )
}
