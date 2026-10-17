import { motion } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import { FiArrowRight, FiClock, FiUser } from 'react-icons/fi'
import { blogPosts } from '../data/products'
import { useApp } from '../contexts/AppContext'

type Post = (typeof blogPosts)[number]

function PostCard({ post, compact = false }: { post: Post; compact?: boolean }) {
  const { darkMode } = useApp()

  return (
    <article
      className={`group h-full rounded-2xl overflow-hidden border cursor-pointer ${
        darkMode ? 'bg-[#1C1916] border-[#3A3328]' : 'bg-white border-[#EDE4D6]'
      }`}
    >
      {/* The artwork is one of our own product shots, which sits on pure
          white — so it is contained rather than cropped to fill. */}
      <div className={`overflow-hidden bg-white ${compact ? 'aspect-[16/9]' : 'aspect-[16/10]'}`}>
        <img
          src={post.image}
          alt={post.title}
          loading="lazy"
          className="w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <div className={compact ? 'p-5' : 'p-6'}>
        <span className="text-[10px] tracking-[0.25em] uppercase text-[#D3839E] font-medium bg-[#D3839E]/10 px-3 py-1.5 rounded-full">
          {post.category}
        </span>
        <h3
          style={{ fontFamily: 'var(--font-display)' }}
          className={`${compact ? 'text-base' : 'text-xl'} font-medium mt-4 mb-2.5 leading-snug group-hover:text-[#D3839E] transition-colors ${
            darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'
          }`}
        >
          {post.title}
        </h3>
        <p className={`text-sm leading-relaxed mb-4 line-clamp-2 ${darkMode ? 'text-[#FAF7F2]/60' : 'text-[#4A4A4A]'}`}>
          {post.excerpt}
        </p>
        <div className={`flex items-center gap-4 text-xs ${darkMode ? 'text-[#FAF7F2]/40' : 'text-[#4A4A4A]/60'}`}>
          <span className="flex items-center gap-1.5">
            <FiUser size={11} />
            {post.author}
          </span>
          <span className="flex items-center gap-1.5">
            <FiClock size={11} />
            {post.readTime}
          </span>
        </div>
      </div>
    </article>
  )
}

export default function Blog() {
  const { darkMode } = useApp()

  return (
    <section id="blog" className={`py-20 sm:py-24 ${darkMode ? 'bg-[#252018]' : 'bg-[#F5EFE6]'}`}>
      <div className="max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-14 gap-5 px-6 lg:px-12"
        >
          <div>
            <p className="text-[#D3839E] text-xs tracking-[0.35em] uppercase font-medium mb-4">The Journal</p>
            <h2
              style={{ fontFamily: 'var(--font-display)' }}
              className={`text-3xl sm:text-4xl md:text-5xl font-medium ${darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'}`}
            >
              Skincare Insights
            </h2>
          </div>
          <button className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase font-medium text-[#D3839E] hover:gap-3 transition-all duration-200">
            All Articles <FiArrowRight size={14} />
          </button>
        </motion.div>

        {/* Mobile — one article at a time, swipeable */}
        <div className="md:hidden px-6">
          <Swiper
            modules={[Pagination, Autoplay]}
            slidesPerView={1.1}
            spaceBetween={14}
            pagination={{ clickable: true }}
            autoplay={{ delay: 6000, disableOnInteraction: false }}
            className="!pb-11"
          >
            {blogPosts.map(post => (
              <SwiperSlide key={post.id} className="!h-auto">
                <PostCard post={post} compact />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Tablet and up — grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 px-6 lg:px-12">
          {blogPosts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <PostCard post={post} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
