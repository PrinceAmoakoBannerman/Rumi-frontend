import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'
import { FiFilter, FiX } from 'react-icons/fi'
import ProductCard from '../components/ProductCard'
import { products, categories } from '../data/products'
import { useApp } from '../contexts/AppContext'
import { formatPrice } from '../lib/currency'

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'newest', label: "What's New" },
]

export default function Products() {
  const { darkMode } = useApp()
  const [searchParams] = useSearchParams()
  const queryParam = searchParams.get('q') || ''
  const catParam = searchParams.get('category') || ''

  const [activeCategory, setActiveCategory] = useState(catParam || 'All')
  const [sort, setSort] = useState('featured')
  const [priceMax, setPriceMax] = useState(2500)
  const [filterOpen, setFilterOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState(queryParam)

  const filtered = useMemo(() => {
    let result = [...products]
    if (activeCategory !== 'All') result = result.filter(p => p.category === activeCategory)
    if (searchQuery) result = result.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase()))
    result = result.filter(p => p.price <= priceMax)
    switch (sort) {
      case 'price-asc': result.sort((a, b) => a.price - b.price); break
      case 'price-desc': result.sort((a, b) => b.price - a.price); break
      case 'rating': result.sort((a, b) => b.rating - a.rating); break
      case 'newest': result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)); break
    }
    return result
  }, [activeCategory, sort, priceMax, searchQuery])

  return (
    <div className={`min-h-screen pt-28 pb-24 px-6 lg:px-12 ${darkMode ? 'bg-[#1C1916]' : 'bg-[#FAF7F2]'}`}>
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <p className="text-[#D4B483] text-xs tracking-[0.35em] uppercase font-medium mb-3">RUMI Collection</p>
          <h1
            style={{ fontFamily: 'var(--font-display)' }}
            className={`text-4xl md:text-5xl font-medium ${darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'}`}
          >
            All Products
          </h1>
        </motion.div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-start md:items-center justify-between">
          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-xs tracking-[0.15em] uppercase font-medium transition-all duration-200 border ${
                  activeCategory === cat
                    ? 'bg-[#D4B483] border-[#D4B483] text-white'
                    : darkMode
                    ? 'border-[#3A3328] text-[#FAF7F2]/70 hover:border-[#D4B483] hover:text-[#D4B483]'
                    : 'border-[#D4B483]/30 text-[#4A4A4A] hover:border-[#D4B483] hover:text-[#D4B483]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* Sort */}
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className={`text-xs px-4 py-2.5 rounded-full border outline-none transition-colors ${darkMode ? 'bg-[#252018] border-[#3A3328] text-[#FAF7F2]' : 'bg-white border-[#D4B483]/30 text-[#2A2A2A]'}`}
            >
              {sortOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            {/* Filter toggle */}
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full border text-xs transition-colors ${darkMode ? 'border-[#3A3328] text-[#FAF7F2]/70 hover:border-[#D4B483] hover:text-[#D4B483]' : 'border-[#D4B483]/30 text-[#4A4A4A] hover:border-[#D4B483] hover:text-[#D4B483]'}`}
            >
              <FiFilter size={12} />
              Filter
            </button>
          </div>
        </div>

        {/* Filter panel */}
        {filterOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-2xl border mb-8 grid sm:grid-cols-2 gap-6 ${darkMode ? 'bg-[#252018] border-[#3A3328]' : 'bg-white border-[#EDE4D6]'}`}
          >
            <div>
              <label className={`text-xs tracking-[0.15em] uppercase font-medium mb-3 block ${darkMode ? 'text-[#FAF7F2]/60' : 'text-[#4A4A4A]'}`}>
                Search products
              </label>
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="e.g. serum, retinol..."
                className={`w-full bg-transparent border-b text-sm px-1 py-2 outline-none ${darkMode ? 'border-[#3A3328] text-[#FAF7F2] placeholder-[#FAF7F2]/20' : 'border-[#EDE4D6] text-[#2A2A2A] placeholder-[#4A4A4A]/40'} focus:border-[#D4B483]`}
              />
            </div>
            <div>
              <label className={`text-xs tracking-[0.15em] uppercase font-medium mb-3 flex justify-between ${darkMode ? 'text-[#FAF7F2]/60' : 'text-[#4A4A4A]'}`}>
                Max price
                <span className="text-[#D4B483]">{formatPrice(priceMax)}</span>
              </label>
              <input
                type="range"
                min={500}
                max={2500}
                step={10}
                value={priceMax}
                onChange={e => setPriceMax(Number(e.target.value))}
                className="w-full accent-[#D4B483]"
              />
            </div>
          </motion.div>
        )}

        {/* Results count */}
        <p className={`text-xs mb-6 ${darkMode ? 'text-[#FAF7F2]/40' : 'text-[#4A4A4A]/60'}`}>
          Showing {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
        </p>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-12">
            {filtered.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <span className="text-5xl opacity-20">🔍</span>
            <p className={`text-sm ${darkMode ? 'text-[#FAF7F2]/40' : 'text-[#4A4A4A]/60'}`}>
              No products found matching your filters
            </p>
            <button
              onClick={() => { setActiveCategory('All'); setSearchQuery(''); setPriceMax(200) }}
              className="flex items-center gap-2 text-[#D4B483] text-xs tracking-widest uppercase font-medium hover:underline"
            >
              <FiX size={12} /> Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
