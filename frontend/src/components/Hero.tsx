
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import { useApp } from '../contexts/AppContext'

const slides = [
  {
    eyebrow: 'Rumi Soap',
    alt: 'GLOWWITHRUMI Rumi Soap — a deep-cleansing face and body soap',
    focus: 'center',
    desc: 'Our deep-cleansing face and body soap, for clear, smooth and radiant skin. Gentle enough for every day.',
    image: '/hero/rumi-soap.jpg',
    cta: 'Shop The Range',
    to: '/products',
  },
  {
    eyebrow: 'Glow Oil',
    alt: 'GLOWWITHRUMI Glow Oil — a brightening face and body oil',
    focus: 'center',
    desc: 'A lightweight oil that hydrates, brightens and gives your skin a healthy glow. For face and body.',
    image: '/hero/rumi-glow.jpg',
    cta: 'Shop The Range',
    to: '/products',
  },
  {
    eyebrow: 'Body Scrub',
    alt: 'GLOWWITHRUMI Body Scrub — a brightening turmeric body scrub',
    focus: 'center',
    desc: 'Exfoliate, brighten and smooth with our turmeric body scrub, made for radiant skin head to toe.',
    image: '/hero/rumi-body.jpg',
    cta: 'Shop The Range',
    to: '/products',
  },
]

export default function Hero() {
  const { darkMode } = useApp()
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

      <div className="relative max-w-[1400px] mx-auto px-0 sm:px-6 lg:px-12 pt-[184px] pb-8">
        <Swiper
          modules={[Pagination, Autoplay]}
          pagination={{ el: '.hero-pagination', clickable: true }}
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          loop
        >
          {slides.map((slide, i) => (
            <SwiperSlide key={i}>
              {/* Copy sits beside the photo, so the line-up is shown whole
                  instead of being cropped to a letterbox. */}
              <div className="grid lg:grid-cols-[0.85fr_1.3fr] gap-8 lg:gap-12 items-center [&>*]:min-w-0">
                <div className="order-2 lg:order-1 text-center lg:text-left px-6 sm:px-0">
                  <h1 className="text-[#D3839E] text-xs tracking-[0.35em] uppercase font-medium mb-4">
                    {slide.eyebrow}
                  </h1>
                  <p className={`text-base sm:text-lg leading-relaxed max-w-md mx-auto lg:mx-0 mb-7 ${darkMode ? 'text-[#FAF7F2]/75' : 'text-[#4A4A4A]'}`}>
                    {slide.desc}
                  </p>
                  <Link
                    to={slide.to}
                    className="inline-block bg-[#2A2A2A] text-white px-8 py-3.5 rounded-full text-xs tracking-[0.2em] uppercase font-semibold hover:bg-[#B85E75] transition-colors duration-300"
                  >
                    {slide.cta}
                  </Link>
                </div>

                <div className="order-1 lg:order-2 flex justify-center">
                  {/* Both shots share one square frame and fill it, so the
                      carousel keeps a steady size as it swipes. */}
                  <motion.div
                    key={slide.image}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="overflow-hidden bg-[#F2EADF] w-full aspect-square rounded-none max-w-none sm:rounded-[2rem] sm:max-w-[440px] lg:max-w-[560px]"
                    style={{ boxShadow: '0 30px 80px rgba(184,94,117,0.18)' }}
                  >
                    <img
                      src={slide.image}
                      alt={slide.alt}
                      className="w-full h-full object-cover"
                      style={{ objectPosition: slide.focus }}
                    />
                  </motion.div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Dots only — the carousel advances on its own and can be swiped */}
        <div className="hero-pagination flex items-center justify-center gap-2 mt-6" />
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
