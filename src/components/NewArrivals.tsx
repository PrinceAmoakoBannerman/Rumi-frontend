import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'
import ProductCard from './ProductCard'
import { products } from '../data/products'
import { useApp } from '../contexts/AppContext'

export default function NewArrivals() {
  const { darkMode } = useApp()
  // Newest first, falling back to the rest of the catalogue so the grid is never sparse.
  const arrivals = [...products].sort((a, b) => Number(b.isNew) - Number(a.isNew)).slice(0, 10)

  if (arrivals.length === 0) return null

  return (
    <section className={`py-24 px-6 lg:px-12 ${darkMode ? 'bg-[#1C1916]' : 'bg-white'}`}>
      <div className="max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-5"
        >
          <div>
            <p className="text-[#D3839E] text-xs tracking-[0.35em] uppercase font-medium mb-3">Just In</p>
            <h2
              style={{ fontFamily: 'var(--font-display)' }}
              className={`text-4xl md:text-5xl font-medium ${darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'}`}
            >
              New Arrivals
            </h2>
          </div>
          <Link
            to="/products?sort=newest"
            className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase font-semibold text-[#B85E75] hover:gap-3 transition-all duration-300"
          >
            View All Products
            <FiArrowRight size={14} />
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-5 gap-y-10">
          {arrivals.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 4) * 0.08 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
