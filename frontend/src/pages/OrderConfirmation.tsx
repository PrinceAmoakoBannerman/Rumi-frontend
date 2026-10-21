import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiCheck, FiClock, FiAlertCircle, FiPackage, FiMail } from 'react-icons/fi'
import { useApp } from '../contexts/AppContext'
import { formatPrice } from '../lib/currency'
import { fetchOrder, type Order } from '../lib/checkout'
import OrderProgress from '../components/OrderProgress'

/**
 * Shown when the customer comes back from Paystack.
 *
 * The order is fetched from the backend rather than read from the page's own
 * navigation state. Anyone can open this URL, so what it says has to come
 * from the server, which checks with Paystack before calling anything paid.
 */
export default function OrderConfirmation() {
  const { darkMode } = useApp()
  const navigate = useNavigate()
  const [params] = useSearchParams()

  // Paystack appends ?reference=..., and we add it ourselves when payments
  // are not configured.
  const reference = params.get('reference') ?? params.get('trxref')
  // The order's own secret, put there by the checkout callback or by the
  // link in the customer's email.
  const token = params.get('t')

  const [order, setOrder] = useState<Order | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (!reference) {
      navigate('/', { replace: true })
      return
    }
    let active = true
    fetchOrder(reference, token)
      .then(result => active && setOrder(result))
      .catch(() => active && setFailed(true))
    return () => {
      active = false
    }
  }, [reference, token, navigate])

  const card = `w-full max-w-lg rounded-3xl border p-10 text-center ${
    darkMode ? 'bg-[#252018] border-[#3A3328]' : 'bg-white border-[#F5EFE6]'
  }`
  const page = `min-h-screen pt-[212px] pb-24 px-6 flex items-center justify-center ${
    darkMode ? 'bg-[#1C1916]' : 'bg-[#FAF7F2]'
  }`

  if (!reference) return null

  if (failed) {
    return (
      <div className={page}>
        <div className={card}>
          <FiAlertCircle size={34} className="text-[#C0392B] mx-auto mb-5" />
          <h1 style={{ fontFamily: 'var(--font-display)' }} className={`text-2xl font-medium mb-3 ${darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'}`}>
            We could not find that order
          </h1>
          <p className={`text-sm mb-7 ${darkMode ? 'text-[#FAF7F2]/60' : 'text-[#4A4A4A]'}`}>
            If you were charged, keep the order number <b>{reference}</b> and contact us — we will sort it out.
            Order links expire from your browser history, so open the one in your email.
          </p>
          <Link to="/contact" className="text-[#D3839E] text-xs tracking-widest uppercase font-medium hover:underline">
            Contact us
          </Link>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className={page}>
        <div className={card}>
          <div
            className="w-9 h-9 rounded-full mx-auto mb-5"
            style={{ border: '3px solid #EDE4D6', borderTopColor: '#D3839E', animation: 'spin 0.8s linear infinite' }}
          />
          <p className={`text-sm ${darkMode ? 'text-[#FAF7F2]/60' : 'text-[#4A4A4A]'}`}>Confirming your payment…</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      </div>
    )
  }

  const paid = order.isPaid
  const pending = order.status === 'pending'

  return (
    <div className={page}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={card}
        style={{ boxShadow: '0 20px 60px rgba(42,42,42,0.08)' }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: paid ? '#4C9A6A' : pending ? '#B8860B' : '#C0392B' }}
        >
          {paid ? <FiCheck size={28} className="text-white" />
                : pending ? <FiClock size={26} className="text-white" />
                : <FiAlertCircle size={26} className="text-white" />}
        </motion.div>

        <p className="text-[#D3839E] text-xs tracking-[0.35em] uppercase font-medium mb-3">
          {paid ? order.statusLabel : pending ? 'Awaiting Payment' : 'Payment Not Completed'}
        </p>
        <h1
          style={{ fontFamily: 'var(--font-display)' }}
          className={`text-3xl font-medium mb-3 ${darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'}`}
        >
          {paid ? 'Thank you' : pending ? 'Almost there' : 'Something went wrong'}
        </h1>
        <p className={`text-sm leading-relaxed mb-7 ${darkMode ? 'text-[#FAF7F2]/70' : 'text-[#4A4A4A]'}`}>
          {paid
            ? order.status === 'delivered'
              ? 'Your order has been delivered. We hope you love it.'
              : order.status === 'shipped'
                ? `Your order is on its way. We will call ${order.phone} to arrange handover.`
                : `We have your order and will be in touch on ${order.phone} to arrange delivery.`
            : pending
              ? 'Your order is saved. If you have just paid, this page will update shortly — or we will contact you.'
              : 'Your payment did not go through, so you have not been charged. Your basket is still safe.'}
        </p>

        {/* The path only applies once there is money; a failed payment has
            no journey to show. */}
        {paid && (
          <div className="mb-8">
            <OrderProgress journey={order.journey} darkMode={darkMode} />
          </div>
        )}

        <div className={`rounded-2xl p-5 mb-7 text-left ${darkMode ? 'bg-[#1C1916]' : 'bg-[#FAF7F2]'}`}>
          <Row label="Order number" value={order.reference} darkMode={darkMode} strong />
          {order.items.map((line, i) => (
            <Row
              key={i}
              label={`${line.quantity} × ${line.name}`}
              value={formatPrice(Number(line.lineTotal))}
              darkMode={darkMode}
              muted
            />
          ))}
          <div className={`mt-3 pt-3 border-t ${darkMode ? 'border-[#3A3328]' : 'border-[#EDE4D6]'}`}>
            <Row label="Total" value={formatPrice(Number(order.total))} darkMode={darkMode} strong />
          </div>
          {paid && order.paymentChannel && (
            <Row label="Paid by" value={order.paymentChannel.replace('_', ' ')} darkMode={darkMode} muted />
          )}
        </div>

        <div className={`flex flex-col gap-2 mb-8 text-xs ${darkMode ? 'text-[#FAF7F2]/50' : 'text-[#4A4A4A]/70'}`}>
          <span className="flex items-center justify-center gap-2">
            <FiPackage size={13} /> Nationwide delivery across Ghana
          </span>
          <span className="flex items-center justify-center gap-2">
            <FiMail size={13} /> Keep your order number for any questions
          </span>
        </div>

        <Link
          to="/products"
          className="inline-block bg-[#2A2A2A] text-white px-8 py-3.5 rounded-full text-xs tracking-[0.2em] uppercase font-semibold hover:bg-[#B85E75] transition-colors"
        >
          Continue Shopping
        </Link>
      </motion.div>
    </div>
  )
}

function Row({ label, value, darkMode, strong, muted }: {
  label: string; value: string; darkMode: boolean; strong?: boolean; muted?: boolean
}) {
  return (
    <div className="flex justify-between items-baseline gap-4 py-1">
      <span className={`text-xs ${muted ? (darkMode ? 'text-[#FAF7F2]/50' : 'text-[#4A4A4A]/70') : (darkMode ? 'text-[#FAF7F2]/70' : 'text-[#4A4A4A]')}`}>
        {label}
      </span>
      <span className={`text-sm whitespace-nowrap ${strong ? 'font-semibold' : ''} ${darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'}`}>
        {value}
      </span>
    </div>
  )
}
