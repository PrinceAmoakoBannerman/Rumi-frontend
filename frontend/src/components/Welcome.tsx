import { motion } from 'framer-motion'
import { useApp } from '../contexts/AppContext'

export default function Welcome() {
  const { darkMode } = useApp()

  return (
    <section className={`py-20 px-6 lg:px-12 ${darkMode ? 'bg-[#1C1916]' : 'bg-[#FAF7F2]'}`}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-2xl mx-auto text-center"
      >
        <p className="text-[#D3839E] text-xs tracking-[0.35em] uppercase font-medium mb-4">Welcome</p>
        <h2
          style={{ fontFamily: 'var(--font-display)' }}
          className={`text-3xl md:text-4xl lg:text-5xl font-medium mb-5 ${darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'}`}
        >
          Welcome to <span className="text-blush-gradient">GLOWWITHRUMI</span>
        </h2>
        <p className={`text-sm md:text-base leading-relaxed ${darkMode ? 'text-[#FAF7F2]/70' : 'text-[#4A4A4A]'}`}>
          Discover skincare that fits your routine. From our signature Rumi skincare products to carefully selected Korean and international beauty essentials, we&apos;re here to help you shop for your skincare needs with confidence.
        </p>
      </motion.div>
    </section>
  )
}
