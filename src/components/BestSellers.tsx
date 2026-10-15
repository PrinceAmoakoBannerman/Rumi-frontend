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

export default function BestSellers() {
  const { darkMode } = useApp()
  const prevRef = useRef<HTMLButtonElement>(null)
  const nextRef = useRef<HTMLButtonElement>(null)
  const bestsellers = products.filter(p => p.isBestseller)

  return (
    <section className={`relative py-24 overflow-hidden ${darkMode ? 'bg-[#1C1916]' : 'bg-white'}`}>
      {/* Monogram badge */}
      <div
        className={`hidden sm:flex absolute bottom-8 right-6 lg:right-12 w-16 h-16 rounded-full border items-center justify-center ${darkMode ? 'border-[#D3839E]/30' : 'border-[#D3839E]/40'}`}
      >
        <span
          style={{ fontFamily: 'var(--font-display)' }}
          className="text-xl text-[#D3839E]"
        >
          R
        </span>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6"
        >
          <div>
            <p className="text-[#D3839E] text-xs tracking-[0.35em] uppercase font-medium mb-3">Customer Favourites</p>
            <h2
              style={{ fontFamily: 'var(--font-display)' }}
              className={`text-4xl md:text-5xl font-medium ${darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'}`}
            >
              Best Sellers
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              ref={prevRef}
              className={`w-11 h-11 rounded-full border flex items-center justify-center transition-all duration-200 hover:bg-[#D3839E] hover:border-[#D3839E] hover:text-white ${darkMode ? 'border-[#3A3328] text-[#FAF7F2]' : 'border-[#2A2A2A]/20 text-[#2A2A2A]'}`}
            >
              <FiArrowLeft size={16} />
            </button>
            <button
              ref={nextRef}
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
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          breakpoints={{
            540: { slidesPerView: 2 },
            900: { slidesPerView: 3 },
            1200: { slidesPerView: 5 },
          }}
          className="md:!overflow-visible"
        >
          {bestsellers.map(product => (
            <SwiperSlide key={product.id}>
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}
