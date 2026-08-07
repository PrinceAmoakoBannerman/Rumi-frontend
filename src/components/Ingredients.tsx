import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../contexts/AppContext'

const ingredients = [
  {
    name: 'Hyaluronic Acid',
    role: 'Hydration',
    icon: '💧',
    color: '#E8F4FD',
    darkColor: '#1A2E3D',
    description: 'A naturally occurring sugar molecule that holds up to 1,000 times its weight in water. It draws moisture from the environment into the skin, providing immediate and long-lasting plumping effect.',
    benefits: ['72-hour deep hydration', 'Plumps fine lines', 'Strengthens skin barrier', 'Suitable for all skin types'],
    image: 'https://images.unsplash.com/photo-1573575155376-b5010099301b?w=500&h=400&fit=crop&auto=format',
  },
  {
    name: 'Vitamin C',
    role: 'Brightening',
    icon: '✨',
    color: '#FFF8E7',
    darkColor: '#2E2A15',
    description: 'L-Ascorbic Acid at 15% concentration — the most bioavailable form of Vitamin C. It neutralizes free radicals, stimulates collagen synthesis, and inhibits melanin production for a visibly brighter, more even complexion.',
    benefits: ['Fades dark spots', 'Boosts collagen', 'Antioxidant protection', 'Evens skin tone'],
    image: 'https://images.unsplash.com/photo-1741896135512-084b251887f7?w=500&h=400&fit=crop&auto=format',
  },
  {
    name: 'Niacinamide',
    role: 'Balancing',
    icon: '⚖️',
    color: '#F0FBF4',
    darkColor: '#152215',
    description: 'Vitamin B3 in its most stable form. It regulates sebum production, minimizes pore appearance, reduces redness, and strengthens the skin barrier — making it ideal for sensitive and combination skin types.',
    benefits: ['Minimizes pores', 'Controls oil', 'Reduces redness', 'Brightens complexion'],
    image: 'https://images.unsplash.com/photo-1715750968540-841103c78d47?w=500&h=400&fit=crop&auto=format',
  },
  {
    name: 'Retinol',
    role: 'Renewal',
    icon: '🔬',
    color: '#FDF0F8',
    darkColor: '#2A1520',
    description: 'Encapsulated 0.5% retinol — a Vitamin A derivative clinically proven to accelerate skin cell turnover, stimulate collagen production, and visibly reduce the appearance of wrinkles and uneven texture.',
    benefits: ['Reduces wrinkles', 'Refines texture', 'Stimulates collagen', 'Fades sun damage'],
    image: 'https://images.unsplash.com/photo-1633423411797-9a7317784d2b?w=500&h=400&fit=crop&auto=format',
  },
  {
    name: 'Peptides',
    role: 'Firming',
    icon: '🧬',
    color: '#F5F0FF',
    darkColor: '#1A1525',
    description: 'A tri-peptide complex that sends targeted signals to skin cells to produce more collagen and elastin. The result is visibly firmer, more resilient skin with a lifted, sculpted appearance over time.',
    benefits: ['Firms skin', 'Lifts contours', 'Boosts elasticity', 'Reduces sagging'],
    image: 'https://images.unsplash.com/photo-1785581778868-79100f7fe56c?w=500&h=400&fit=crop&auto=format',
  },
]

export default function Ingredients() {
  const { darkMode } = useApp()
  const [active, setActive] = useState(0)

  return (
    <section id="ingredients" className={`py-24 px-6 lg:px-12 ${darkMode ? 'bg-[#1C1916]' : 'bg-white'}`}>
      <div className="max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-[#D4B483] text-xs tracking-[0.35em] uppercase font-medium mb-4">What&apos;s Inside</p>
          <h2
            style={{ fontFamily: 'var(--font-display)' }}
            className={`text-4xl md:text-5xl font-medium ${darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'}`}
          >
            Power Ingredients
          </h2>
          <p className={`mt-4 text-sm max-w-md mx-auto leading-relaxed ${darkMode ? 'text-[#FAF7F2]/60' : 'text-[#4A4A4A]'}`}>
            Every RUMI formula is built around clinically proven actives at concentrations that make a real difference.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Tabs */}
          <div className="flex flex-col gap-3">
            {ingredients.map((ing, i) => (
              <motion.button
                key={ing.name}
                onClick={() => setActive(i)}
                whileTap={{ scale: 0.98 }}
                className={`text-left p-5 rounded-2xl border transition-all duration-300 ${
                  active === i
                    ? 'border-[#D4B483] shadow-lg'
                    : darkMode
                    ? 'border-[#3A3328] hover:border-[#D4B483]/40'
                    : 'border-[#F5EFE6] hover:border-[#D4B483]/40'
                }`}
                style={{
                  background: active === i
                    ? darkMode ? ing.darkColor : ing.color
                    : darkMode ? '#252018' : '#FAFAFA',
                }}
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl w-10 h-10 flex items-center justify-center rounded-full bg-[#D4B483]/10">
                    {ing.icon}
                  </span>
                  <div>
                    <p className={`font-semibold text-sm ${darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'}`} style={{ fontFamily: 'var(--font-display)' }}>
                      {ing.name}
                    </p>
                    <p className="text-[10px] tracking-[0.2em] uppercase text-[#D4B483] font-medium">{ing.role}</p>
                  </div>
                  {active === i && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-auto w-2 h-2 rounded-full bg-[#D4B483]"
                    />
                  )}
                </div>
              </motion.button>
            ))}
          </div>

          {/* Detail panel */}
          <div className="sticky top-28">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className={`rounded-3xl overflow-hidden border ${darkMode ? 'border-[#3A3328] bg-[#252018]' : 'border-[#F5EFE6] bg-[#FAFAFA]'}`}
              >
                <div className="aspect-[16/9] overflow-hidden bg-[#F5EFE6]">
                  <img
                    src={ingredients[active].image}
                    alt={ingredients[active].name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{ingredients[active].icon}</span>
                    <div>
                      <h3
                        style={{ fontFamily: 'var(--font-display)' }}
                        className={`text-2xl font-medium ${darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'}`}
                      >
                        {ingredients[active].name}
                      </h3>
                      <p className="text-[10px] tracking-[0.25em] uppercase text-[#D4B483] font-medium">
                        {ingredients[active].role}
                      </p>
                    </div>
                  </div>
                  <p className={`text-sm leading-relaxed mb-6 ${darkMode ? 'text-[#FAF7F2]/70' : 'text-[#4A4A4A]'}`}>
                    {ingredients[active].description}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {ingredients[active].benefits.map(b => (
                      <div key={b} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D4B483] flex-shrink-0" />
                        <span className={`text-xs ${darkMode ? 'text-[#FAF7F2]/60' : 'text-[#4A4A4A]'}`}>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
