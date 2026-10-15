import { useRef } from 'react'
import { motion } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi'
import ProductCard from './ProductCard'
import { products } from '../data/products'
import { useApp } from '../contexts/AppContext'

export default function SaleClearance() {
  const { darkMode } = useApp()
  const prevRef = useRef<HTMLButtonElement>(null)
  const nextRef = useRef<HTMLButtonElement>(null)
  const onSale = products.filter(p => p.originalPrice && p.originalPrice > p.price)

  if (onSale.length === 0) return null

  return (
    <section className={`py-24 overflow-hidden ${darkMode ? 'bg-[#252018]' : 'bg-[#FDF6F8]'}`}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6"
        >
          <div>
            <span className="inline-block bg-[#B85E75] text-white text-[10px] tracking-[0.25em] uppercase font-semibold px-3 py-1.5 rounded-full mb-4">
              Limited Time
            </span>
            <h2
              style={{ fontFamily: 'var(--font-display)' }}
              className={`text-4xl md:text-5xl font-medium ${darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'}`}
            >
              Sale &amp; Clearance
            </h2>
            <p className={`mt-3 text-sm ${darkMode ? 'text-[#FAF7F2]/60' : 'text-[#4A4A4A]'}`}>
              Special prices on selected favourites — while stocks last.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              ref={prevRef}
              aria-label="Previous deals"
              className={`w-11 h-11 rounded-full border flex items-center justify-center transition-all duration-200 hover:bg-[#D3839E] hover:border-[#D3839E] hover:text-white ${darkMode ? 'border-[#3A3328] text-[#FAF7F2]' : 'border-[#2A2A2A]/20 text-[#2A2A2A]'}`}
            >
              <FiArrowLeft size={16} />
            </button>
            <button
              ref={nextRef}
              aria-label="Next deals"
              className={`w-11 h-11 rounded-full border flex items-center justify-center transition-all duration-200 hover:bg-[#D3839E] hover:border-[#D3839E] hover:text-white ${darkMode ? 'border-[#3A3328] text-[#FAF7F2]' : 'border-[#2A2A2A]/20 text-[#2A2A2A]'}`}
            >
              <FiArrowRight size={16} />
            </button>
          </div>
        </motion.div>

        <Swiper
          modules={[Navigation, Autoplay]}
          navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
          onBeforeInit={swiper => {
            if (swiper.params.navigation && typeof swiper.params.navigation !== 'boolean') {
              swiper.params.navigation.prevEl = prevRef.current
              swiper.params.navigation.nextEl = nextRef.current
            }
          }}
          spaceBetween={24}
          slidesPerView={1.2}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          breakpoints={{
            540: { slidesPerView: 2 },
            900: { slidesPerView: 3 },
            1200: { slidesPerView: 5 },
          }}
          className="!overflow-visible"
        >
          {onSale.map(product => (
            <SwiperSlide key={product.id}>
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}
