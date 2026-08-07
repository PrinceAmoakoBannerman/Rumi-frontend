import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowRight } from 'react-icons/fi'
import { useApp } from '../contexts/AppContext'

const values = [
  { icon: '✦', title: 'Cruelty-Free', text: 'Never tested on animals — every formula is vetted through in-vitro and clinical human trials only.' },
  { icon: '🔬', title: 'Dermatologist-Tested', text: 'Every product is clinically evaluated before it reaches you, so results are backed by evidence, not hype.' },
  { icon: '🌿', title: 'Organic Ingredients', text: 'We source the highest grade botanicals and actives, formulated at concentrations that actually work.' },
  { icon: '🌍', title: 'Worldwide Delivery', text: 'From our lab to your door in over 50 countries, with free shipping on every order over 1,280 GH₵.' },
]

const stats = [
  { stat: '2,400+', label: 'Verified Reviews' },
  { stat: '4.9/5', label: 'Average Rating' },
  { stat: '96%', label: 'Would Recommend' },
  { stat: '50+', label: 'Countries Served' },
]

export default function About() {
  const { darkMode } = useApp()

  return (
    <div className={darkMode ? 'bg-[#1C1916]' : 'bg-[#FAF7F2]'}>
      {/* Hero */}
      <section className="relative overflow-hidden pt-40 pb-24 px-6 lg:px-12">
        {!darkMode && (
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(160deg, #FBF8F4 0%, #F5EFE6 50%, #F0DFC4 100%)' }}
          />
        )}
        <div className="absolute top-24 right-[8%] w-64 h-64 rounded-full border border-[#D4B483]/20 pointer-events-none" />
        <div className="absolute bottom-10 left-[6%] w-40 h-40 rounded-full border border-dashed border-[#D4B483]/25 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative max-w-2xl mx-auto text-center"
        >
          <p className="text-[#D4B483] text-xs tracking-[0.35em] uppercase font-medium mb-5">Our Story</p>
          <h1
            style={{ fontFamily: 'var(--font-display)' }}
            className={`text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.1] mb-6 ${darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'}`}
          >
            Where Science Meets <span className="text-gold-gradient">Ritual</span>
          </h1>
          <p className={`text-base leading-relaxed ${darkMode ? 'text-[#FAF7F2]/70' : 'text-[#4A4A4A]'}`}>
            RUMI was founded on a simple belief: skincare should be both a science and a ceremony. Every formula we make sits at that intersection — clinically proven, ethically sourced, and beautiful enough to slow you down for five minutes a day.
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
              alt="RUMI skincare formulation on marble"
              className="w-full aspect-square object-cover rounded-3xl shadow-xl"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-[#D4B483] text-xs tracking-[0.35em] uppercase font-medium mb-4">Since 2019</p>
            <h2
              style={{ fontFamily: 'var(--font-display)' }}
              className={`text-3xl md:text-4xl font-medium mb-6 ${darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'}`}
            >
              Built by a small team obsessed with results
            </h2>
            <div className={`flex flex-col gap-4 text-sm leading-relaxed ${darkMode ? 'text-[#FAF7F2]/70' : 'text-[#4A4A4A]'}`}>
              <p>
                RUMI began in a small formulation lab with one question: why does luxury skincare so rarely deliver on its promises? We set out to build a line where every active is dosed at a clinically effective concentration — never diluted for shelf appeal.
              </p>
              <p>
                Today our formulas are developed alongside dermatologists and independently tested before launch. No filler ingredients, no exaggerated claims — just skincare that works, packaged the way it deserves to be.
              </p>
            </div>
            <Link to="/products">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="mt-8 bg-[#2A2A2A] text-white px-8 py-4 text-xs tracking-[0.2em] uppercase font-semibold rounded-full hover:bg-[#D4B483] transition-all duration-300 flex items-center gap-2"
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
            <p className="text-[#D4B483] text-xs tracking-[0.35em] uppercase font-medium mb-4">What We Stand For</p>
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
              <p style={{ fontFamily: 'var(--font-display)' }} className="text-4xl font-medium text-[#D4B483]">
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
