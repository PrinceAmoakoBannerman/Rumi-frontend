import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useApp } from '../contexts/AppContext'

/**
 * Shown for an address that does not exist — a mistyped link, or a product
 * that has since been removed. A real page with a way back, not a dead end.
 */
export default function NotFound() {
  const { darkMode } = useApp()

  return (
    <div
      className={`min-h-screen pt-[200px] pb-24 px-6 flex flex-col items-center justify-center text-center gap-5 ${
        darkMode ? 'bg-[#1C1916]' : 'bg-[#FAF7F2]'
      }`}
    >
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-[#D3839E] text-xs tracking-[0.35em] uppercase font-medium"
      >
        Page not found
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        style={{ fontFamily: 'var(--font-display)' }}
        className={`text-5xl md:text-6xl font-medium ${darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'}`}
      >
        404
      </motion.h1>
      <p className={`text-sm leading-relaxed max-w-sm ${darkMode ? 'text-[#FAF7F2]/60' : 'text-[#4A4A4A]'}`}>
        We could not find that page. It may have moved, or the link might be
        slightly off. Let us point you back to the good stuff.
      </p>
      <div className="flex flex-wrap gap-3 justify-center mt-2">
        <Link
          to="/"
          className="bg-[#2A2A2A] hover:bg-[#B85E75] text-white text-xs tracking-[0.2em] uppercase font-semibold px-7 py-3.5 rounded-full transition-colors"
        >
          Home
        </Link>
        <Link
          to="/products"
          className="border border-[#D3839E] text-[#B85E75] hover:bg-[#D3839E]/10 text-xs tracking-[0.2em] uppercase font-semibold px-7 py-3.5 rounded-full transition-colors"
        >
          Shop all products
        </Link>
      </div>
    </div>
  )
}
