import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, FreeMode } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/free-mode'
import { brands, brandLogos } from '../data/store'
import { useApp } from '../contexts/AppContext'

function BrandTile({ brand, compact = false }: { brand: string; compact?: boolean }) {
  const { darkMode } = useApp()
  const logo = brandLogos[brand]

  return (
    <Link
      to={`/products?q=${encodeURIComponent(brand)}`}
      title={brand}
      // Tiles stay white in both themes so dark brand marks always read.
      className={`${compact ? 'h-16' : 'h-24'} rounded-2xl border bg-white flex items-center justify-center px-4 text-center transition-all duration-300 hover:border-[#D3839E] hover:shadow-md hover:-translate-y-1 ${
        darkMode ? 'border-[#3A3328]' : 'border-[#EDE4D6]'
      }`}
    >
      {logo ? (
        <img
          src={logo}
          alt={brand}
          loading="lazy"
          // Capped on both axes so square marks aren't dwarfed by wide wordmarks.
          className={`${compact ? 'max-h-9' : 'max-h-14'} max-w-full w-auto object-contain`}
        />
      ) : (
        <span
          style={{ fontFamily: 'var(--font-display)' }}
          className={`${compact ? 'text-[11px]' : 'text-sm'} font-semibold tracking-wide uppercase text-[#2A2A2A] leading-tight`}
        >
          {brand}
        </span>
      )}
    </Link>
  )
}

export default function BrandShowcase() {
  const { darkMode } = useApp()

  // "Others" is where the shop files a product whose maker is not stocked by
  // name. It belongs in the admin's brand list, not in a wall headed "Our
  // Brands" — and a tile reading "Others" would search for nothing.
  const shown = brands.filter(brand => brand !== 'Others')

  return (
    <section className={`py-20 sm:py-24 ${darkMode ? 'bg-[#1C1916]' : 'bg-[#FAF7F2]'}`}>
      <div className="max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-14 px-6 lg:px-12"
        >
          <p className="text-[#D3839E] text-xs tracking-[0.35em] uppercase font-medium mb-4">Stocked at GLOWWITHRUMI</p>
          <h2
            style={{ fontFamily: 'var(--font-display)' }}
            className={`text-3xl sm:text-4xl md:text-5xl font-medium ${darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'}`}
          >
            Our Brands
          </h2>
          <p className={`mt-4 text-sm max-w-md mx-auto leading-relaxed ${darkMode ? 'text-[#FAF7F2]/60' : 'text-[#4A4A4A]'}`}>
            Authentic Korean and international beauty brands, alongside our own Rumi essentials.
          </p>
        </motion.div>

        {/* Mobile — auto-scrolling strip, so 20 brands cost one row instead of ten */}
        <div className="sm:hidden px-6">
          <Swiper
            modules={[Autoplay, FreeMode]}
            slidesPerView={2.4}
            spaceBetween={12}
            loop
            freeMode
            speed={2600}
            autoplay={{ delay: 0, disableOnInteraction: false, pauseOnMouseEnter: true }}
            className="md:!overflow-visible"
          >
            {shown.map(brand => (
              <SwiperSlide key={brand}>
                <BrandTile brand={brand} compact />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Tablet and up — full grid */}
        <div className="hidden sm:grid grid-cols-3 lg:grid-cols-5 gap-4 px-6 lg:px-12">
          {shown.map((brand, i) => (
            <motion.div
              key={brand}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 5) * 0.05 }}
            >
              <BrandTile brand={brand} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
