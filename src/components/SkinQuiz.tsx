import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiRefreshCw } from 'react-icons/fi'
import { useApp } from '../contexts/AppContext'
import { products } from '../data/products'
import { formatPrice } from '../lib/currency'

const steps = [
  {
    question: 'What is your skin type?',
    options: ['Oily', 'Dry', 'Combination', 'Normal', 'Sensitive'],
  },
  {
    question: 'What is your age range?',
    options: ['Under 25', '25–34', '35–44', '45–54', '55+'],
  },
  {
    question: 'How sensitive is your skin?',
    options: ['Not sensitive', 'Slightly sensitive', 'Moderately sensitive', 'Very sensitive'],
  },
  {
    question: 'What is your primary skin concern?',
    options: ['Hydration', 'Anti-aging', 'Brightening', 'Acne & pores', 'Uneven tone'],
  },
]

const concernMap: Record<string, string[]> = {
  Hydration: ['Moisturizers', 'Toners'],
  'Anti-aging': ['Serums', 'Moisturizers'],
  Brightening: ['Serums', 'Sunscreens'],
  'Acne & pores': ['Cleansers', 'Toners'],
  'Uneven tone': ['Serums', 'Toners'],
}

export default function SkinQuiz() {
  const { darkMode } = useApp()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [done, setDone] = useState(false)

  const handleAnswer = (answer: string) => {
    const next = [...answers, answer]
    setAnswers(next)
    if (step < steps.length - 1) {
      setStep(s => s + 1)
    } else {
      setDone(true)
    }
  }

  const reset = () => {
    setStep(0)
    setAnswers([])
    setDone(false)
  }

  const concern = answers[3] || 'Hydration'
  const cats = concernMap[concern] || ['Serums', 'Moisturizers']
  const recommended = products.filter(p => cats.includes(p.category)).slice(0, 3)

  return (
    <section id="quiz" className={`py-24 px-6 lg:px-12 relative overflow-hidden ${darkMode ? 'bg-[#1C1916]' : 'bg-[#FAF7F2]'}`}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#D3839E]/5 translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[#D3839E]/5 -translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="max-w-3xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-[#D3839E] text-xs tracking-[0.35em] uppercase font-medium mb-4">Personalized for You</p>
          <h2
            style={{ fontFamily: 'var(--font-display)' }}
            className={`text-4xl md:text-5xl font-medium ${darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'}`}
          >
            Skin Analysis
          </h2>
          <p className={`mt-4 text-sm max-w-sm mx-auto leading-relaxed ${darkMode ? 'text-[#FAF7F2]/60' : 'text-[#4A4A4A]'}`}>
            Answer 4 quick questions and we&apos;ll recommend your ideal GLOWWITHRUMI routine.
          </p>
        </motion.div>

        <div className={`rounded-3xl p-5 sm:p-8 md:p-12 border ${darkMode ? 'bg-[#252018] border-[#3A3328]' : 'bg-white border-[#F5EFE6]'}`} style={{ boxShadow: '0 20px 60px rgba(42,42,42,0.08)' }}>
          <AnimatePresence mode="wait">
            {!done ? (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
              >
                {/* Progress */}
                <div className="flex gap-2 mb-8">
                  {steps.map((_, i) => (
                    <div
                      key={i}
                      className="flex-1 h-1 rounded-full transition-all duration-500"
                      style={{ background: i <= step ? '#D3839E' : darkMode ? '#3A3328' : '#F5EFE6' }}
                    />
                  ))}
                </div>

                <p className={`text-xs tracking-[0.2em] uppercase text-[#D3839E] font-medium mb-3`}>
                  Question {step + 1} of {steps.length}
                </p>
                <h3
                  style={{ fontFamily: 'var(--font-display)' }}
                  className={`text-2xl md:text-3xl font-medium mb-8 ${darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'}`}
                >
                  {steps[step].question}
                </h3>

                <div className="flex flex-wrap gap-3">
                  {steps[step].options.map(opt => (
                    <motion.button
                      key={opt}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleAnswer(opt)}
                      className={`px-6 py-3 rounded-full border text-sm font-medium transition-all duration-200 hover:bg-[#D3839E] hover:border-[#D3839E] hover:text-white ${darkMode ? 'border-[#3A3328] text-[#FAF7F2]' : 'border-[#D3839E]/30 text-[#2A2A2A]'}`}
                    >
                      {opt}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <div className="text-center mb-8">
                  <span className="text-4xl mb-4 block">✨</span>
                  <h3
                    style={{ fontFamily: 'var(--font-display)' }}
                    className={`text-2xl font-medium mb-2 ${darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'}`}
                  >
                    Your Personalized Routine
                  </h3>
                  <p className={`text-sm ${darkMode ? 'text-[#FAF7F2]/60' : 'text-[#4A4A4A]'}`}>
                    Based on your answers, we recommend these products for <strong className="text-[#D3839E]">{concern.toLowerCase()}</strong>.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-8">
                  {recommended.map(p => (
                    <Link to={`/products/${p.id}`} key={p.id}>
                      <motion.div
                        whileHover={{ y: -4 }}
                        className={`rounded-2xl overflow-hidden border ${darkMode ? 'border-[#3A3328]' : 'border-[#F5EFE6]'}`}
                      >
                        <img src={p.image} alt={p.name} className="w-full aspect-square object-cover" />
                        <div className="p-3">
                          <p className={`text-xs font-medium line-clamp-2 ${darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'}`} style={{ fontFamily: 'var(--font-display)' }}>
                            {p.name}
                          </p>
                          <p className="text-[#D3839E] text-sm font-semibold mt-1">{formatPrice(p.price)}</p>
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>

                <div className="flex gap-3 justify-center">
                  <Link to="/products">
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      className="bg-[#D3839E] text-white px-8 py-3 rounded-full text-xs tracking-widest uppercase font-semibold hover:bg-[#B85E75] transition-colors flex items-center gap-2"
                    >
                      Shop All <FiArrowRight size={13} />
                    </motion.button>
                  </Link>
                  <button
                    onClick={reset}
                    className={`px-6 py-3 rounded-full text-xs tracking-widest uppercase font-medium border transition-colors flex items-center gap-2 ${darkMode ? 'border-[#3A3328] text-[#FAF7F2]/60 hover:text-[#FAF7F2]' : 'border-[#D3839E]/30 text-[#4A4A4A] hover:text-[#2A2A2A]'}`}
                  >
                    <FiRefreshCw size={12} />
                    Retake
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
