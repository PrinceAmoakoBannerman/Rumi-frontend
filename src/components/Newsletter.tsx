import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiCheck } from 'react-icons/fi'
import { useApp } from '../contexts/AppContext'

export default function Newsletter() {
  const { darkMode } = useApp()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) setSubmitted(true)
  }

  return (
    <section className="py-24 px-6 lg:px-12 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2A2A2A] via-[#3A2029] to-[#2A2A2A]" />
      <div className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(211,131,158,0.3) 0%, transparent 60%), radial-gradient(circle at 80% 50%, rgba(211,131,158,0.15) 0%, transparent 60%)',
        }}
      />

      <div className="relative max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-[#D3839E] text-xs tracking-[0.35em] uppercase font-medium mb-5">Be the First to Know</p>
          <h2
            style={{ fontFamily: 'var(--font-display)' }}
            className="text-4xl md:text-5xl font-medium text-white mb-4"
          >
            Join the GLOWWITHRUMI Community
          </h2>
          <p className="text-white/60 text-sm leading-relaxed mb-10 max-w-sm mx-auto">
            Subscribe for exclusive offers, early access to new launches, and personalized skincare tips delivered to your inbox.
          </p>

          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.form
                key="form"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
              >
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your name"
                  className="flex-1 bg-white/10 border border-white/20 text-white placeholder-white/30 text-sm px-5 py-4 rounded-full outline-none focus:border-[#D3839E] transition-colors"
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="flex-1 bg-white/10 border border-white/20 text-white placeholder-white/30 text-sm px-5 py-4 rounded-full outline-none focus:border-[#D3839E] transition-colors"
                />
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  className="bg-[#D3839E] hover:bg-[#B85E75] text-white text-xs tracking-[0.2em] uppercase font-semibold px-8 py-4 rounded-full transition-colors whitespace-nowrap"
                >
                  Subscribe
                </motion.button>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="w-14 h-14 rounded-full bg-[#D3839E] flex items-center justify-center">
                  <FiCheck size={24} className="text-white" />
                </div>
                <p className="text-white text-lg" style={{ fontFamily: 'var(--font-display)' }}>
                  Welcome to the GLOWWITHRUMI community, {name || 'beautiful'}!
                </p>
                <p className="text-white/50 text-sm">We&apos;ll be in touch with something special soon.</p>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-white/30 text-xs mt-5">
            No spam. Unsubscribe anytime. We respect your privacy.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
