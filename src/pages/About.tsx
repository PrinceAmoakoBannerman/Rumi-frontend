import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowRight } from 'react-icons/fi'
import { useApp } from '../contexts/AppContext'

const values = [
  { icon: '✦', title: 'Cruelty-Free', text: 'We only carry brands and formulas that are never tested on animals.' },
  { icon: '🔬', title: 'Chosen for Results', text: 'Every product we stock is chosen for real, visible results — backed by reviews, not hype.' },
  { icon: '🌿', title: 'Carefully Curated', text: 'From our own signature Rumi line to trusted Korean and international favorites, every brand is handpicked.' },
  { icon: '🇬🇭', title: 'Nationwide Delivery', text: 'From our store to your door anywhere in Ghana, with fast and reliable delivery nationwide.' },
]

const stats = [
  { stat: '2,400+', label: 'Verified Reviews' },
  { stat: '4.9/5', label: 'Average Rating' },
  { stat: '96%', label: 'Would Recommend' },
  { stat: '16', label: 'Regions Covered' },
]

export default function About() {
  const { darkMode } = useApp()

  return (
    <div className={darkMode ? 'bg-[#1C1916]' : 'bg-[#FAF7F2]'}>
      {/* Hero */}
      <section className="relative overflow-hidden pt-[196px] pb-24 px-6 lg:px-12">
        {!darkMode && (
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(160deg, #FBF8F4 0%, #F5EFE6 50%, #F0C4D3 100%)' }}
          />
        )}
        <div className="absolute top-24 right-[8%] w-64 h-64 rounded-full border border-[#D3839E]/20 pointer-events-none" />
        <div className="absolute bottom-10 left-[6%] w-40 h-40 rounded-full border border-dashed border-[#D3839E]/25 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative max-w-2xl mx-auto text-center"
        >
          <p className="text-[#D3839E] text-xs tracking-[0.35em] uppercase font-medium mb-5">Our Story</p>
          <h1
            style={{ fontFamily: 'var(--font-display)' }}
            className={`text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.1] mb-6 ${darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'}`}
          >
            Skincare That <span className="text-blush-gradient">Fits You</span>
          </h1>
          <p className={`text-base leading-relaxed ${darkMode ? 'text-[#FAF7F2]/70' : 'text-[#4A4A4A]'}`}>
            GLOWWITHRUMI was founded on a simple belief: finding skincare you can trust shouldn&apos;t be complicated. From our signature Rumi skincare products to carefully selected Korean and international beauty essentials, every item we carry is chosen with your skin — and your routine — in mind.
          </p>
        </motion.div>
      </section>

      {/* Story */}
      <section className="py-24 px-6 lg:px-12">
        <div className="max-w-[1200px] mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <img
              src="https://images.unsplash.com/photo-1785581778868-79100f7fe56c?w=900&h=900&fit=crop&auto=format"
              alt="GLOWWITHRUMI skincare essentials"
              className="w-full aspect-square object-cover rounded-3xl shadow-xl"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-[#D3839E] text-xs tracking-[0.35em] uppercase font-medium mb-4">Our Journey</p>
            <h2
              style={{ fontFamily: 'var(--font-display)' }}
              className={`text-3xl md:text-4xl font-medium mb-6 ${darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'}`}
            >
              A skincare destination built on trust
            </h2>
            <div className={`flex flex-col gap-4 text-sm leading-relaxed ${darkMode ? 'text-[#FAF7F2]/70' : 'text-[#4A4A4A]'}`}>
              <p>
                GLOWWITHRUMI began with a simple question: how do we make it easier to find skincare and beauty products you can actually trust? We started with our own Rumi skincare line, then grew into a curated selection of Korean and international beauty essentials — so you can shop for everything you need in one place.
              </p>
              <p>
                Every product on our shelves is chosen for real results, not hype. From personalised recommendations to nationwide delivery across Ghana, we&apos;re here to support you from your first order to your last empty bottle.
              </p>
            </div>
            <Link to="/products">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="mt-8 bg-[#2A2A2A] text-white px-8 py-4 text-xs tracking-[0.2em] uppercase font-semibold rounded-full hover:bg-[#D3839E] transition-all duration-300 flex items-center gap-2"
              >
                Shop the Collection
                <FiArrowRight size={14} />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className={`py-24 px-6 lg:px-12 ${darkMode ? 'bg-[#252018]' : 'bg-white'}`}>
        <div className="max-w-[1200px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-[#D3839E] text-xs tracking-[0.35em] uppercase font-medium mb-4">What We Stand For</p>
            <h2
              style={{ fontFamily: 'var(--font-display)' }}
              className={`text-3xl md:text-4xl font-medium ${darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'}`}
            >
              Our Values
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`p-6 rounded-2xl border text-center ${darkMode ? 'bg-[#1C1916] border-[#3A3328]' : 'bg-[#FAF7F2] border-[#F5EFE6]'}`}
              >
                <span className="text-2xl mb-4 inline-block">{v.icon}</span>
                <h3
                  style={{ fontFamily: 'var(--font-display)' }}
                  className={`text-base font-medium mb-2 ${darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'}`}
                >
                  {v.title}
                </h3>
                <p className={`text-xs leading-relaxed ${darkMode ? 'text-[#FAF7F2]/60' : 'text-[#4A4A4A]'}`}>{v.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-[1000px] mx-auto flex flex-wrap justify-center gap-10 lg:gap-16"
        >
          {stats.map(item => (
            <div key={item.label} className="text-center">
              <p style={{ fontFamily: 'var(--font-display)' }} className="text-4xl font-medium text-[#D3839E]">
                {item.stat}
              </p>
              <p className={`text-xs tracking-[0.12em] uppercase mt-1 ${darkMode ? 'text-[#FAF7F2]/50' : 'text-[#4A4A4A]'}`}>
                {item.label}
              </p>
            </div>
          ))}
        </motion.div>
      </section>
    </div>
  )
}
