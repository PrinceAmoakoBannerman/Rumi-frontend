import { motion } from 'framer-motion'
import { FiArrowRight, FiClock, FiUser } from 'react-icons/fi'
import { blogPosts } from '../data/products'
import { useApp } from '../contexts/AppContext'

export default function Blog() {
  const { darkMode } = useApp()

  return (
    <section id="blog" className={`py-24 px-6 lg:px-12 ${darkMode ? 'bg-[#252018]' : 'bg-[#F5EFE6]'}`}>
      <div className="max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6"
        >
          <div>
            <p className="text-[#D4B483] text-xs tracking-[0.35em] uppercase font-medium mb-4">The Journal</p>
            <h2
              style={{ fontFamily: 'var(--font-display)' }}
              className={`text-4xl md:text-5xl font-medium ${darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'}`}
            >
              Skincare Insights
            </h2>
          </div>
          <button className={`flex items-center gap-2 text-xs tracking-[0.2em] uppercase font-medium text-[#D4B483] hover:gap-3 transition-all duration-200`}>
            All Articles <FiArrowRight size={14} />
          </button>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {blogPosts.map((post, i) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`group rounded-2xl overflow-hidden border cursor-pointer ${darkMode ? 'bg-[#1C1916] border-[#3A3328]' : 'bg-white border-[#EDE4D6]'}`}
            >
              <div className="overflow-hidden aspect-[16/10]">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <span className="text-[10px] tracking-[0.25em] uppercase text-[#D4B483] font-medium bg-[#D4B483]/10 px-3 py-1.5 rounded-full">
                  {post.category}
                </span>
                <h3
                  style={{ fontFamily: 'var(--font-display)' }}
                  className={`text-xl font-medium mt-4 mb-3 leading-snug group-hover:text-[#D4B483] transition-colors ${darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'}`}
                >
                  {post.title}
                </h3>
                <p className={`text-sm leading-relaxed mb-5 line-clamp-2 ${darkMode ? 'text-[#FAF7F2]/60' : 'text-[#4A4A4A]'}`}>
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
                  <span className="ml-auto text-[#D4B483]">{post.date}</span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
