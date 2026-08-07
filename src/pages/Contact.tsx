import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMail, FiPhone, FiMapPin, FiCheck } from 'react-icons/fi'
import { useApp } from '../contexts/AppContext'

const info = [
  { icon: FiMail, label: 'Email', value: 'hello@rumiskincare.com' },
  { icon: FiPhone, label: 'Phone', value: '+233 24 000 0000' },
  { icon: FiMapPin, label: 'Studio', value: 'Airport Residential Area, Accra, Ghana' },
]

export default function Contact() {
  const { darkMode } = useApp()
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div className={`min-h-screen pt-32 pb-24 px-6 lg:px-12 ${darkMode ? 'bg-[#1C1916]' : 'bg-[#FAF7F2]'}`}>
      <div className="max-w-[1100px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <p className="text-[#D4B483] text-xs tracking-[0.35em] uppercase font-medium mb-4">Get In Touch</p>
          <h1
            style={{ fontFamily: 'var(--font-display)' }}
            className={`text-4xl md:text-5xl font-medium mb-4 ${darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'}`}
          >
            We&apos;d Love to Hear From You
          </h1>
          <p className={`text-sm max-w-md mx-auto leading-relaxed ${darkMode ? 'text-[#FAF7F2]/60' : 'text-[#4A4A4A]'}`}>
            Questions about a formula, an order, or a skin concern? Our team typically replies within one business day.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-10">
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-4"
          >
            {info.map(item => (
              <div
                key={item.label}
                className={`flex items-start gap-4 p-5 rounded-2xl border ${darkMode ? 'bg-[#252018] border-[#3A3328]' : 'bg-white border-[#F5EFE6]'}`}
              >
                <div className="w-10 h-10 rounded-full bg-[#D4B483]/10 flex items-center justify-center flex-shrink-0">
                  <item.icon size={16} className="text-[#D4B483]" />
                </div>
                <div>
                  <p className={`text-[10px] tracking-[0.2em] uppercase font-medium mb-1 ${darkMode ? 'text-[#FAF7F2]/50' : 'text-[#4A4A4A]/70'}`}>
                    {item.label}
                  </p>
                  <p className={`text-sm font-medium ${darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'}`}>{item.value}</p>
                </div>
              </div>
            ))}
            <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-[#252018] border-[#3A3328]' : 'bg-white border-[#F5EFE6]'}`}>
              <p className={`text-[10px] tracking-[0.2em] uppercase font-medium mb-2 ${darkMode ? 'text-[#FAF7F2]/50' : 'text-[#4A4A4A]/70'}`}>
                Hours
              </p>
              <p className={`text-sm ${darkMode ? 'text-[#FAF7F2]/70' : 'text-[#4A4A4A]'}`}>Mon – Fri, 9am – 6pm GMT</p>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`p-6 md:p-8 rounded-3xl border ${darkMode ? 'bg-[#252018] border-[#3A3328]' : 'bg-white border-[#F5EFE6]'}`}
          >
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  key="sent"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center text-center py-16 gap-4"
                >
                  <div className="w-14 h-14 rounded-full bg-[#D4B483] flex items-center justify-center">
                    <FiCheck size={22} className="text-white" />
                  </div>
                  <h3
                    style={{ fontFamily: 'var(--font-display)' }}
                    className={`text-xl font-medium ${darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'}`}
                  >
                    Message Sent
                  </h3>
                  <p className={`text-sm max-w-xs ${darkMode ? 'text-[#FAF7F2]/60' : 'text-[#4A4A4A]'}`}>
                    Thank you for reaching out — a member of our team will be in touch within one business day.
                  </p>
                  <button
                    onClick={() => setSent(false)}
                    className="text-[#D4B483] text-xs tracking-widest uppercase font-medium hover:underline mt-2"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <label className="flex flex-col gap-1.5">
                      <span className={`text-[10px] tracking-[0.15em] uppercase font-medium ${darkMode ? 'text-[#FAF7F2]/50' : 'text-[#4A4A4A]/70'}`}>Name</span>
                      <input
                        required
                        className={`bg-transparent border-b text-sm py-2 outline-none focus:border-[#D4B483] transition-colors ${darkMode ? 'border-[#3A3328] text-[#FAF7F2]' : 'border-[#EDE4D6] text-[#2A2A2A]'}`}
                      />
                    </label>
                    <label className="flex flex-col gap-1.5">
                      <span className={`text-[10px] tracking-[0.15em] uppercase font-medium ${darkMode ? 'text-[#FAF7F2]/50' : 'text-[#4A4A4A]/70'}`}>Email</span>
                      <input
                        type="email"
                        required
                        className={`bg-transparent border-b text-sm py-2 outline-none focus:border-[#D4B483] transition-colors ${darkMode ? 'border-[#3A3328] text-[#FAF7F2]' : 'border-[#EDE4D6] text-[#2A2A2A]'}`}
                      />
                    </label>
                  </div>
                  <label className="flex flex-col gap-1.5">
                    <span className={`text-[10px] tracking-[0.15em] uppercase font-medium ${darkMode ? 'text-[#FAF7F2]/50' : 'text-[#4A4A4A]/70'}`}>Subject</span>
                    <input
                      required
                      className={`bg-transparent border-b text-sm py-2 outline-none focus:border-[#D4B483] transition-colors ${darkMode ? 'border-[#3A3328] text-[#FAF7F2]' : 'border-[#EDE4D6] text-[#2A2A2A]'}`}
                    />
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className={`text-[10px] tracking-[0.15em] uppercase font-medium ${darkMode ? 'text-[#FAF7F2]/50' : 'text-[#4A4A4A]/70'}`}>Message</span>
                    <textarea
                      required
                      rows={5}
                      className={`bg-transparent border-b text-sm py-2 outline-none focus:border-[#D4B483] transition-colors resize-none ${darkMode ? 'border-[#3A3328] text-[#FAF7F2]' : 'border-[#EDE4D6] text-[#2A2A2A]'}`}
                    />
                  </label>
                  <motion.button
                    type="submit"
                    whileTap={{ scale: 0.98 }}
                    className="mt-2 bg-[#D4B483] hover:bg-[#B8965E] text-white text-xs tracking-[0.2em] uppercase font-semibold py-4 rounded-full transition-colors"
                  >
                    Send Message
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
