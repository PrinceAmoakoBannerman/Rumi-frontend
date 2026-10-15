import { useRef } from 'react'
import { motion } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import { testimonials } from '../data/products'
import { useApp } from '../contexts/AppContext'

export default function Testimonials() {
  const { darkMode } = useApp()

  // Hidden until real customer reviews are added — see data/products.ts
  if (testimonials.length === 0) return null

  return (
    <section id="testimonials" className={`py-24 px-6 lg:px-12 overflow-hidden ${darkMode ? 'bg-[#252018]' : 'bg-[#F5EFE6]'}`}>
      <div className="max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-[#D3839E] text-xs tracking-[0.35em] uppercase font-medium mb-4">Real Results</p>
          <h2
            style={{ fontFamily: 'var(--font-display)' }}
            className={`text-4xl md:text-5xl font-medium ${darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'}`}
          >
            What Our Community Says
          </h2>
        </motion.div>

        <Swiper
          modules={[Pagination, Autoplay]}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            768: { slidesPerView: 2 },
            1100: { slidesPerView: 3 },
          }}
          className="pb-14"
        >
          {testimonials.map((t, i) => (
            <SwiperSlide key={t.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`p-8 rounded-3xl h-full flex flex-col gap-5 border ${darkMode ? 'bg-[#1C1916] border-[#3A3328]' : 'bg-white border-[#EDE4D6]'}`}
              >
                {/* Stars */}
                <div className="flex gap-0.5">
                  {[...Array(t.rating)].map((_, s) => (
                    <span key={s} className="text-[#D3839E] text-base">★</span>
                  ))}
                </div>

                {/* Quote */}
                <p className={`text-sm leading-relaxed italic flex-1 ${darkMode ? 'text-[#FAF7F2]/80' : 'text-[#4A4A4A]'}`} style={{ fontFamily: 'var(--font-display)' }}>
                  &ldquo;{t.text}&rdquo;
                </p>

                {/* Product tag */}
                <div className={`text-[10px] tracking-[0.2em] uppercase text-[#D3839E] font-medium px-3 py-1.5 rounded-full self-start border border-[#D3839E]/30`}>
                  {t.product}
                </div>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-11 h-11 rounded-full object-cover border-2 border-[#D3839E]/30"
                  />
                  <div>
                    <p className={`font-medium text-sm ${darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'}`}>{t.name}</p>
                    <p className={`text-xs ${darkMode ? 'text-[#FAF7F2]/40' : 'text-[#4A4A4A]/60'}`}>{t.location}</p>
                  </div>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-8 mt-12"
        >
          {[
            { stat: '2,400+', label: 'Verified Reviews' },
            { stat: '4.9/5', label: 'Average Rating' },
            { stat: '96%', label: 'Would Recommend' },
            { stat: '50+', label: 'Countries Served' },
          ].map(item => (
            <div key={item.label} className="text-center">
              <p
                style={{ fontFamily: 'var(--font-display)' }}
                className="text-3xl font-medium text-[#D3839E]"
              >
                {item.stat}
              </p>
              <p className={`text-xs tracking-[0.12em] uppercase mt-1 ${darkMode ? 'text-[#FAF7F2]/50' : 'text-[#4A4A4A]'}`}>
                {item.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
