import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { products } from '../data/products'
import { useApp } from '../contexts/AppContext'
import { PLACEHOLDER_IMAGE } from '../lib/currency'

const collections = [
  { name: 'Serums', description: 'Targeted treatments for dark spots, texture and glow' },
  { name: 'Toners', description: 'Balance, hydrate and prep skin after cleansing' },
  { name: 'Cleansers', description: 'Oils and foams that clear pores without stripping' },
  { name: 'Sunscreens', description: 'Zero white cast protection for deeper skin tones' },
  { name: 'Moisturizers', description: 'Creams and lotions that lock in moisture and repair' },
]

/** Real product shots from the category — fills in as more photos are added. */
function imagesFor(category: string, count: number) {
  return products
    .filter(p => p.category === category)
    .slice(0, count)
    .map(p => ({ id: p.id, src: p.image, name: p.name }))
}

const onImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  e.currentTarget.src = PLACEHOLDER_IMAGE
}

export default function FeaturedCollections() {
  const { darkMode } = useApp()
  const countFor = (name: string) => products.filter(p => p.category === name).length

  const featured = collections[0]
  const featuredImages = imagesFor(featured.name, 2)

  return (
    <section id="collections" className={`py-24 px-6 lg:px-12 ${darkMode ? 'bg-[#1C1916]' : 'bg-[#FAF7F2]'}`}>
      <div className="max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-[#D3839E] text-xs tracking-[0.35em] uppercase font-medium mb-4">Explore</p>
          <h2
            style={{ fontFamily: 'var(--font-display)' }}
            className={`text-3xl sm:text-4xl md:text-5xl font-medium ${darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'}`}
          >
            Shop by Category
          </h2>
          <p className={`mt-4 text-sm max-w-md mx-auto leading-relaxed ${darkMode ? 'text-[#FAF7F2]/60' : 'text-[#4A4A4A]'}`}>
            Find exactly what your routine needs, from first cleanse to final sunscreen.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Featured category — shows two products side by side */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="col-span-2 lg:col-span-1 row-span-2"
          >
            <Link
              to={`/products?category=${featured.name}`}
              className={`group h-full flex flex-col rounded-2xl border bg-white overflow-hidden transition-all duration-300 hover:border-[#D3839E] hover:shadow-lg ${
                darkMode ? 'border-[#3A3328]' : 'border-[#EDE4D6]'
              }`}
              style={{ minHeight: '420px' }}
            >
              <div className="flex-1 flex items-center justify-center gap-3 p-8">
                {featuredImages.map(img => (
                  <img
                    key={img.id}
                    src={img.src}
                    alt={img.name}
                    onError={onImgError}
                    loading="lazy"
                    className="w-1/2 max-h-60 object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                ))}
              </div>
              <div className="px-7 pb-7 text-center">
                <p className="text-[#D3839E] text-[10px] tracking-[0.3em] uppercase font-medium mb-2">
                  {countFor(featured.name)} Products
                </p>
                <h3 style={{ fontFamily: 'var(--font-display)' }} className="text-[#2A2A2A] text-2xl font-medium mb-2">
                  {featured.name}
                </h3>
                <p className="text-[#4A4A4A]/70 text-sm mb-5">{featured.description}</p>
                <span className="inline-block border border-[#D3839E] text-[#B85E75] text-[10px] tracking-[0.25em] uppercase px-5 py-2.5 rounded-full group-hover:bg-[#D3839E] group-hover:text-white transition-all duration-300">
                  Explore
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Remaining categories */}
          {collections.slice(1).map((collection, i) => {
            const img = imagesFor(collection.name, 1)[0]
            return (
              <motion.div
                key={collection.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 + i * 0.08 }}
              >
                <Link
                  to={`/products?category=${collection.name}`}
                  className={`group h-full flex items-center gap-4 rounded-2xl border bg-white p-5 transition-all duration-300 hover:border-[#D3839E] hover:shadow-md ${
                    darkMode ? 'border-[#3A3328]' : 'border-[#EDE4D6]'
                  }`}
                  style={{ minHeight: '198px' }}
                >
                  {img && (
                    <img
                      src={img.src}
                      alt={img.name}
                      onError={onImgError}
                      loading="lazy"
                      className="w-24 sm:w-28 h-32 object-contain shrink-0 transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                  <div className="min-w-0">
                    <p className="text-[#D3839E] text-[9px] tracking-[0.25em] uppercase font-medium mb-1.5">
                      {countFor(collection.name)} Products
                    </p>
                    <h3 style={{ fontFamily: 'var(--font-display)' }} className="text-[#2A2A2A] text-lg font-medium leading-tight">
                      {collection.name}
                    </h3>
                    <p className="text-[#4A4A4A]/70 text-xs mt-1.5 leading-relaxed">
                      {collection.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
