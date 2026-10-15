import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/css'
import 'swiper/css/pagination'
import { FiArrowLeft, FiArrowRight, FiPlay, FiPause } from 'react-icons/fi'
import { useApp } from '../contexts/AppContext'

const slides = [
  {
    eyebrow: 'Now In Stock',
    line1: 'Authentic Korean',
    line2: 'Skincare',
    desc: 'The full Anua range — toners, serums, cleansers and sunscreens — ready to ship anywhere in Ghana.',
    image: '/hero/anua-range.jpg',
    cta: 'Shop Anua',
    to: '/products?q=Anua',
  },
  {
    eyebrow: 'Build Your Routine',
    line1: 'Every Step,',
    line2: 'Covered',
    desc: 'From first cleanse to final sunscreen, find the pieces that fit the routine you already have.',
    image: '/hero/anua-routine.jpg',
    cta: 'Shop All Products',
    to: '/products',
  },
]

export default function Hero() {
  const { darkMode } = useApp()
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
      {/* Soft blush backdrop — kept light so the product shots stay the focus */}
      {!darkMode && (
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(160deg, #FFFFFF 0%, #FDF6F8 48%, #F6DFE6 100%)' }}
        />
      )}

      {/* Decorative shapes */}
      <motion.div
        animate={{ scale: [1, 1.06, 1], opacity: [0.25, 0.45, 0.25] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-32 left-[3%] w-64 h-64 rounded-full border border-[#D3839E]/25 pointer-events-none hidden lg:block"
      />
      <div className="absolute bottom-24 right-[5%] w-24 h-24 rounded-full bg-[#D3839E]/10 pointer-events-none hidden lg:block" />

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12 pt-[212px] pb-14">
        <Swiper
          modules={[Pagination, Autoplay]}
          onSwiper={s => { swiperRef.current = s }}
          pagination={{ el: '.hero-pagination', clickable: true }}
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          loop
        >
          {slides.map((slide, i) => (
            <SwiperSlide key={i}>
              {/* Copy sits beside the photo, so the line-up is shown whole
                  instead of being cropped to a letterbox. */}
              <div className="grid lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-16 items-center [&>*]:min-w-0">
                <div className="order-2 lg:order-1 text-center lg:text-left">
                  <p className="text-[#D3839E] text-xs tracking-[0.35em] uppercase font-medium mb-4">
                    {slide.eyebrow}
                  </p>
                  <h1
                    style={{ fontFamily: 'var(--font-display)' }}
                    className={`text-4xl sm:text-5xl lg:text-6xl font-medium leading-[1.08] mb-5 ${darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'}`}
                  >
                    {slide.line1}
                    <br />
                    <span className="text-blush-gradient">{slide.line2}</span>
                  </h1>
                  <p className={`text-sm sm:text-base leading-relaxed max-w-md mx-auto lg:mx-0 mb-8 ${darkMode ? 'text-[#FAF7F2]/70' : 'text-[#4A4A4A]'}`}>
                    {slide.desc}
                  </p>
                  <Link
                    to={slide.to}
                    className="inline-block bg-[#2A2A2A] text-white px-9 py-4 rounded-full text-xs tracking-[0.2em] uppercase font-semibold hover:bg-[#B85E75] transition-colors duration-300"
                  >
                    {slide.cta}
                  </Link>
                </div>

                <div className="order-1 lg:order-2 flex justify-center">
                  {/* Frame hugs the photo: the two shots have different aspect
                      ratios, so a fixed box would letterbox one of them. */}
                  <motion.div
                    key={slide.image}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="rounded-[2rem] overflow-hidden bg-white inline-block"
                    style={{ boxShadow: '0 30px 80px rgba(184,94,117,0.18)' }}
                  >
                    <img
                      src={slide.image}
                      alt={`${slide.line1} ${slide.line2}`}
                      className="block h-[320px] sm:h-[400px] lg:h-[460px] w-auto max-w-full object-contain"
                    />
                  </motion.div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Carousel controls */}
        <div className="flex items-center justify-between mt-8">
          <div className="hero-pagination flex items-center gap-2" />
          <div className="flex items-center gap-3">
            <button
              onClick={() => swiperRef.current?.slidePrev()}
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
              onClick={() => swiperRef.current?.slideNext()}
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
