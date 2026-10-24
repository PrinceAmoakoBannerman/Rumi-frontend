import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay, EffectCoverflow } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/effect-coverflow'
import { featuredReviews } from '../data/products'
import { useApp } from '../contexts/AppContext'

/**
 * The homepage review slideshow.
 *
 * Real approved reviews, the ones with a customer's own photo first — a
 * picture of the product in a real hand is the whole point. It hides itself
 * when there are no reviews yet, so the shop never shows an empty section or
 * invented praise.
 */
export default function Testimonials() {
  const { darkMode } = useApp()
  const reviews = featuredReviews

  if (reviews.length === 0) return null

  const withPhoto = reviews.filter(r => r.photo)
  const count = reviews.length
  const average = (reviews.reduce((s, r) => s + r.rating, 0) / count).toFixed(1)
  // Only count stars actually given; never invent a round number.

  return (
    <section
      id="testimonials"
      className={`py-24 px-6 lg:px-12 overflow-hidden ${darkMode ? 'bg-[#252018]' : 'bg-[#F5EFE6]'}`}
    >
      <div className="max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-[#D3839E] text-xs tracking-[0.35em] uppercase font-medium mb-4">Loved by our customers</p>
          <h2
            style={{ fontFamily: 'var(--font-display)' }}
            className={`text-4xl md:text-5xl font-medium ${darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'}`}
          >
            Real reviews, real results
          </h2>
          <div className="flex items-center justify-center gap-2 mt-5">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map(s => (
                <span
                  key={s}
                  className={s <= Math.round(Number(average)) ? 'text-[#D3839E]' : darkMode ? 'text-[#3A3328]' : 'text-[#D3839E]/25'}
                >
                  ★
                </span>
              ))}
            </div>
            <span className={`text-sm ${darkMode ? 'text-[#FAF7F2]/70' : 'text-[#4A4A4A]'}`}>
              {average} from {count} review{count === 1 ? '' : 's'}
            </span>
          </div>
        </motion.div>

        {/* The slideshow. Coverflow gives the professional, centre-weighted
            feel; it steps one review at a time and pauses when hovered. */}
        <Swiper
          modules={[Pagination, Autoplay, EffectCoverflow]}
          effect="coverflow"
          centeredSlides
          grabCursor
          loop={reviews.length > 2}
          coverflowEffect={{ rotate: 0, stretch: 0, depth: 120, modifier: 2, slideShadows: false }}
          pagination={{ clickable: true }}
          autoplay={{ delay: 4500, disableOnInteraction: false, pauseOnMouseEnter: true }}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{ 768: { slidesPerView: 2 }, 1100: { slidesPerView: 3 } }}
          className="pb-16"
        >
          {reviews.map(r => (
            <SwiperSlide key={r.id} className="h-auto">
              <article
                className={`h-full flex flex-col rounded-3xl overflow-hidden border ${
                  darkMode ? 'bg-[#1C1916] border-[#3A3328]' : 'bg-white border-[#EDE4D6]'
                }`}
                style={{ boxShadow: '0 18px 50px rgba(42,42,42,0.08)' }}
              >
                {r.photo && (
                  <Link to={`/products/${r.productId}`} className="block">
                    <img
                      src={r.photo}
                      alt={`${r.name}'s photo of ${r.product}`}
                      loading="lazy"
                      className="w-full h-56 object-cover"
                    />
                  </Link>
                )}
                <div className="p-7 flex flex-col gap-4 flex-1">
                  <div className="flex gap-0.5">
                    {[...Array(r.rating)].map((_, s) => (
                      <span key={s} className="text-[#D3839E] text-base">★</span>
                    ))}
                  </div>
                  {r.text && (
                    <p
                      className={`text-sm leading-relaxed italic flex-1 ${darkMode ? 'text-[#FAF7F2]/80' : 'text-[#4A4A4A]'}`}
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      &ldquo;{r.text}&rdquo;
                    </p>
                  )}
                  <div className="flex items-center justify-between gap-3 pt-1">
                    <div className="min-w-0">
                      <p className={`font-medium text-sm truncate ${darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'}`}>
                        {r.name}
                      </p>
                      <p className={`text-xs ${darkMode ? 'text-[#FAF7F2]/40' : 'text-[#4A4A4A]/55'}`}>{r.date}</p>
                    </div>
                    <Link
                      to={`/products/${r.productId}`}
                      className="text-[10px] tracking-[0.18em] uppercase text-[#D3839E] font-medium px-3 py-1.5 rounded-full border border-[#D3839E]/30 hover:bg-[#D3839E]/10 transition-colors whitespace-nowrap max-w-[48%] truncate"
                      title={r.product}
                    >
                      {r.product}
                    </Link>
                  </div>
                </div>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Honest numbers only — the real count and average, and how many
            came with a photo. Nothing invented. */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-10 sm:gap-16 mt-6"
        >
          {[
            { stat: average, label: 'Average rating' },
            { stat: `${count}`, label: count === 1 ? 'Review' : 'Reviews' },
            ...(withPhoto.length ? [{ stat: `${withPhoto.length}`, label: 'With photos' }] : []),
          ].map(item => (
            <div key={item.label} className="text-center">
              <p style={{ fontFamily: 'var(--font-display)' }} className="text-3xl font-medium text-[#D3839E]">
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
