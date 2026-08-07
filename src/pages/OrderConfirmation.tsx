import { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiCheck, FiPackage, FiMail } from 'react-icons/fi'
import { useApp } from '../contexts/AppContext'
import { formatPrice } from '../lib/currency'

interface OrderState {
  orderNumber: string
  total: number
}

export default function OrderConfirmation() {
  const { darkMode } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as OrderState | null

  useEffect(() => {
    if (!state) navigate('/', { replace: true })
  }, [state, navigate])

  if (!state) return null

  return (
    <div className={`min-h-screen pt-32 pb-24 px-6 flex items-center justify-center ${darkMode ? 'bg-[#1C1916]' : 'bg-[#FAF7F2]'}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`w-full max-w-lg rounded-3xl border p-10 text-center ${darkMode ? 'bg-[#252018] border-[#3A3328]' : 'bg-white border-[#F5EFE6]'}`}
        style={{ boxShadow: '0 20px 60px rgba(42,42,42,0.08)' }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
          className="w-16 h-16 rounded-full bg-[#D4B483] flex items-center justify-center mx-auto mb-6"
        >
          <FiCheck size={28} className="text-white" />
        </motion.div>

        <p className="text-[#D4B483] text-xs tracking-[0.35em] uppercase font-medium mb-3">Order Confirmed</p>
        <h1
          style={{ fontFamily: 'var(--font-display)' }}
          className={`text-3xl font-medium mb-4 ${darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'}`}
        >
          Thank You
        </h1>
        <p className={`text-sm leading-relaxed mb-8 ${darkMode ? 'text-[#FAF7F2]/60' : 'text-[#4A4A4A]'}`}>
          Your ritual is on its way. We&apos;ve sent a confirmation to your email with everything you need to track your order.
        </p>

        <div className={`rounded-2xl border p-5 flex flex-col gap-3 text-left mb-8 ${darkMode ? 'border-[#3A3328]' : 'border-[#EDE4D6]'}`}>
          <div className="flex justify-between items-center">
            <span className={`text-xs tracking-[0.15em] uppercase ${darkMode ? 'text-[#FAF7F2]/50' : 'text-[#4A4A4A]/70'}`}>Order Number</span>
            <span className={`text-sm font-semibold ${darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'}`}>{state.orderNumber}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className={`text-xs tracking-[0.15em] uppercase ${darkMode ? 'text-[#FAF7F2]/50' : 'text-[#4A4A4A]/70'}`}>Total Paid</span>
            <span className="text-sm font-semibold text-[#D4B483]">{formatPrice(state.total)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className={`text-xs tracking-[0.15em] uppercase ${darkMode ? 'text-[#FAF7F2]/50' : 'text-[#4A4A4A]/70'}`}>Estimated Delivery</span>
            <span className={`text-sm font-semibold ${darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'}`}>3–5 business days</span>
          </div>
        </div>

        <div className={`flex items-center justify-center gap-6 text-xs mb-8 ${darkMode ? 'text-[#FAF7F2]/40' : 'text-[#4A4A4A]/50'}`}>
          <span className="flex items-center gap-1.5"><FiPackage size={13} /> Free shipping</span>
          <span className="flex items-center gap-1.5"><FiMail size={13} /> Email receipt sent</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/products"
            className="flex-1 bg-[#2A2A2A] hover:bg-[#D4B483] text-white text-xs tracking-[0.2em] uppercase font-semibold py-4 rounded-full transition-all duration-300"
          >
            Continue Shopping
          </Link>
          <Link
            to="/"
            className={`flex-1 border text-xs tracking-[0.2em] uppercase font-semibold py-4 rounded-full transition-colors ${darkMode ? 'border-[#3A3328] text-[#FAF7F2]' : 'border-[#EDE4D6] text-[#2A2A2A]'}`}
          >
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
