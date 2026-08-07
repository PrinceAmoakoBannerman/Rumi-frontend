import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'

const collections = [
  {
    name: 'Cleansers',
    description: 'Gentle formulas that respect your skin barrier',
    image: 'https://images.unsplash.com/photo-1748639320154-6ba118bccc74?w=600&h=700&fit=crop&auto=format',
    count: '4 Products',
  },
  {
    name: 'Serums',
    description: 'Concentrated actives for visible, lasting results',
    image: 'https://images.unsplash.com/photo-1679394270597-e90694d70350?w=600&h=700&fit=crop&auto=format',
    count: '6 Products',
  },
  {
    name: 'Moisturizers',
    description: 'Deep hydration that lasts all day',
    image: 'https://images.unsplash.com/photo-1785581778868-79100f7fe56c?w=600&h=700&fit=crop&auto=format',
    count: '5 Products',
  },
  {
    name: 'Sunscreens',
    description: 'Invisible protection for every skin tone',
    image: 'https://images.unsplash.com/photo-1594332322527-08753d4473c1?w=600&h=700&fit=crop&auto=format',
    count: '3 Products',
  },
  {
    name: 'Anti-aging',
    description: 'Science-backed formulas that turn back time',
    image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=600&h=700&fit=crop&auto=format',
    count: '5 Products',
  },
]

export default function FeaturedCollections() {
  const { darkMode } = useApp()

  return (
    <section id="collections" className={`py-24 px-6 lg:px-12 ${darkMode ? 'bg-[#1C1916]' : 'bg-[#FAF7F2]'}`}>
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-[#D4B483] text-xs tracking-[0.35em] uppercase font-medium mb-4">Explore</p>
          <h2
            style={{ fontFamily: 'var(--font-display)' }}
            className={`text-4xl md:text-5xl font-medium ${darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'}`}
          >
            Featured Collections
          </h2>
          <p className={`mt-4 text-sm max-w-md mx-auto leading-relaxed ${darkMode ? 'text-[#FAF7F2]/60' : 'text-[#4A4A4A]'}`}>
            Curated ranges formulated with the finest botanical and scientifically advanced ingredients.
          </p>
        </motion.div>

        {/* Grid — asymmetric layout */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Large featured card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="col-span-2 lg:col-span-1 row-span-2 group relative overflow-hidden rounded-2xl cursor-pointer"
            style={{ minHeight: '480px' }}
          >
            <img
              src={collections[1].image}
              alt={collections[1].name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2A2A2A]/80 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <p className="text-[#D4B483] text-[10px] tracking-[0.3em] uppercase font-medium mb-2">{collections[1].count}</p>
              <h3 style={{ fontFamily: 'var(--font-display)' }} className="text-white text-3xl font-medium mb-2">{collections[1].name}</h3>
              <p className="text-white/70 text-sm mb-4">{collections[1].description}</p>
              <Link to="/products?category=Serums">
                <span className="inline-block border border-[#D4B483] text-[#D4B483] text-[10px] tracking-[0.25em] uppercase px-5 py-2.5 rounded-full hover:bg-[#D4B483] hover:text-white transition-all duration-300">
                  Explore
                </span>
              </Link>
            </div>
          </motion.div>

          {/* Remaining cards */}
          {[0, 2, 3, 4].map((idx, i) => (
            <motion.div
              key={collections[idx].name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 + i * 0.1 }}
              className="group relative overflow-hidden rounded-2xl cursor-pointer"
              style={{ minHeight: '220px' }}
            >
              <img
                src={collections[idx].image}
                alt={collections[idx].name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2A2A2A]/70 via-[#2A2A2A]/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-[#D4B483] text-[9px] tracking-[0.25em] uppercase font-medium mb-1">{collections[idx].count}</p>
                <h3 style={{ fontFamily: 'var(--font-display)' }} className="text-white text-xl font-medium">{collections[idx].name}</h3>
                <p className="text-white/60 text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {collections[idx].description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
