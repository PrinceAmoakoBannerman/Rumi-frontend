import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/css'
import 'swiper/css/pagination'
import { FiArrowLeft, FiArrowRight, FiPlay, FiPause } from 'react-icons/fi'
import { useApp } from '../contexts/AppContext'

const slides = [
  {
    eyebrow: 'Luxury Skincare Collection',
    line1: 'Reveal Your',
    line2: 'Natural Glow',
    desc: 'Scientifically formulated skincare crafted with nature’s finest ingredients.',
    image: 'https://images.unsplash.com/photo-1772987714654-2df39af2c658?w=900&h=900&fit=crop&auto=format',
    cta: 'Discover',
  },
  {
    eyebrow: 'Clinically Proven',
    line1: 'Radiant Results,',
    line2: 'Every Day',
    desc: 'Concentrated actives at real, effective concentrations — no filler formulas.',
    image: 'https://images.unsplash.com/photo-1785581778868-79100f7fe56c?w=900&h=900&fit=crop&auto=format',
    cta: 'Shop Serums',
  },
  {
    eyebrow: 'Effortless Ritual',
    line1: 'Your Skin,',
    line2: 'Elevated',
    desc: 'A pared-back routine that does more — morning, night, every season.',
    image: 'https://images.unsplash.com/photo-1779437141537-62577b216307?w=900&h=900&fit=crop&auto=format',
    cta: 'Shop All',
  },
]

export default function Hero() {
  const { darkMode } = useApp()
  const prevRef = useRef<HTMLButtonElement>(null)
  const nextRef = useRef<HTMLButtonElement>(null)
  const swiperRef = useRef<SwiperType | null>(null)
  const [playing, setPlaying] = useState(true)

  const togglePlay = () => {
    if (!swiperRef.current) return
    if (playing) {
      swiperRef.current.autoplay.stop()
    } else {
      swiperRef.current.autoplay.start()
    }
    setPlaying(p => !p)
  }

  return (
    <section className={`relative overflow-hidden ${darkMode ? 'bg-[#1C1916]' : ''}`}>
      {/* Pastel gradient backdrop */}
      {!darkMode && (
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(160deg, #FBF8F4 0%, #F5EFE6 42%, #F0C4D3 78%, #E8A0B8 100%)' }}
        />
      )}

      {/* Decorative shapes */}
      <motion.div
        animate={{ scale: [1, 1.06, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-24 left-[6%] w-72 h-72 rounded-full border border-[#D3839E]/25 pointer-events-none"
      />
      <div className="absolute top-40 left-[10%] w-40 h-40 rounded-full border border-dashed border-[#D3839E]/30 pointer-events-none" />
      <div className="absolute bottom-16 right-[8%] w-24 h-24 rounded-full bg-[#D3839E]/10 pointer-events-none" />
      <div className="absolute top-1/3 right-[14%] flex items-center justify-center w-14 h-14 rounded-full border border-[#D3839E]/40 pointer-events-none">
        <span className="text-[#D3839E] text-base">✦</span>
      </div>

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12 pt-[212px] pb-8">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          onSwiper={s => { swiperRef.current = s }}
          navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
          onBeforeInit={swiper => {
            if (swiper.params.navigation && typeof swiper.params.navigation !== 'boolean') {
              swiper.params.navigation.prevEl = prevRef.current
              swiper.params.navigation.nextEl = nextRef.current
            }
          }}
          pagination={{ el: '.hero-pagination', clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop
        >
          {slides.map((slide, i) => (
            <SwiperSlide key={i}>
              <div className="grid md:grid-cols-[1fr_auto] gap-6 items-start mb-6">
                <div className="order-2 md:order-1 max-w-md text-center md:text-left mx-auto md:mx-0">
                  <p className="text-[#D3839E] text-xs tracking-[0.35em] uppercase font-medium mb-4">
                    {slide.eyebrow}
                  </p>
                  <p className={`text-sm leading-relaxed ${darkMode ? 'text-[#FAF7F2]/70' : 'text-[#4A4A4A]'}`}>
                    {slide.desc}
                  </p>
                </div>
                <h1
                  style={{ fontFamily: 'var(--font-display)' }}
                  className={`order-1 md:order-2 text-center md:text-right text-4xl sm:text-5xl lg:text-6xl font-medium leading-[1.1] ${darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'}`}
                >
                  {slide.line1}
                  <br />
                  <span className="text-blush-gradient">{slide.line2}</span>
                </h1>
              </div>

              <div className="relative flex justify-center py-6">
                <motion.img
                  key={slide.image}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  src={slide.image}
                  alt={`GLOWWITHRUMI — ${slide.line1} ${slide.line2}`}
                  className="w-full max-w-2xl aspect-[16/9] object-cover rounded-[2rem] shadow-2xl"
                  style={{ boxShadow: '0 40px 100px rgba(211,131,158,0.25)' }}
                />

                <Link
                  to="/products"
                  className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white text-[#2A2A2A] px-8 py-4 rounded-xl text-xs tracking-[0.2em] uppercase font-semibold shadow-xl hover:bg-[#D3839E] hover:text-white transition-colors duration-300"
                >
                  {slide.cta}
                </Link>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Carousel controls */}
        <div className="flex items-center justify-between mt-6">
          <div className="hero-pagination flex items-center gap-2" />
          <div className="flex items-center gap-3">
            <button
              ref={prevRef}
              aria-label="Previous slide"
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors ${darkMode ? 'border-[#3A3328] text-[#FAF7F2] hover:bg-[#252018]' : 'border-[#2A2A2A]/15 text-[#2A2A2A] hover:bg-white'}`}
            >
              <FiArrowLeft size={15} />
            </button>
            <button
              onClick={togglePlay}
              aria-label={playing ? 'Pause autoplay' : 'Play autoplay'}
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors ${darkMode ? 'border-[#3A3328] text-[#FAF7F2] hover:bg-[#252018]' : 'border-[#2A2A2A]/15 text-[#2A2A2A] hover:bg-white'}`}
            >
              {playing ? <FiPause size={14} /> : <FiPlay size={14} />}
            </button>
            <button
              ref={nextRef}
              aria-label="Next slide"
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors ${darkMode ? 'border-[#3A3328] text-[#FAF7F2] hover:bg-[#252018]' : 'border-[#2A2A2A]/15 text-[#2A2A2A] hover:bg-white'}`}
            >
              <FiArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .hero-pagination .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: ${darkMode ? '#3A3328' : 'rgba(42,42,42,0.2)'};
          opacity: 1;
        }
        .hero-pagination .swiper-pagination-bullet-active {
          background: #D3839E !important;
        }
      `}</style>
    </section>
  )
}
