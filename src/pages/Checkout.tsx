import { useState } from 'react'
import type { InputHTMLAttributes, ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiCreditCard, FiSmartphone, FiCheck } from 'react-icons/fi'
import { useApp } from '../contexts/AppContext'
import { formatPrice } from '../lib/currency'

const regions = [
  'Greater Accra', 'Ashanti', 'Western', 'Central', 'Eastern', 'Volta',
  'Northern', 'Upper East', 'Upper West', 'Bono', 'Bono East', 'Ahafo',
  'Western North', 'Oti', 'North East', 'Savannah',
]

const momoNetworks = ['MTN Mobile Money', 'Vodafone Cash', 'AirtelTigo Money']

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  darkMode: boolean
  wrapperClassName?: string
}

function Field({ label, darkMode, wrapperClassName, ...props }: FieldProps) {
  return (
    <label className={`flex flex-col gap-1.5 min-w-0 ${wrapperClassName || ''}`}>
      <span className={`text-[10px] tracking-[0.15em] uppercase font-medium ${darkMode ? 'text-[#FAF7F2]/50' : 'text-[#4A4A4A]/70'}`}>{label}</span>
      <input
        {...props}
        className={`w-full min-w-0 bg-transparent border-b text-sm py-2 outline-none focus:border-[#D3839E] transition-colors ${darkMode ? 'border-[#3A3328] text-[#FAF7F2] placeholder-[#FAF7F2]/20' : 'border-[#EDE4D6] text-[#2A2A2A] placeholder-[#4A4A4A]/30'}`}
      />
    </label>
  )
}

function SelectField({ label, darkMode, wrapperClassName, options, required }: { label: string; darkMode: boolean; wrapperClassName?: string; options: string[]; required?: boolean }) {
  return (
    <label className={`flex flex-col gap-1.5 min-w-0 ${wrapperClassName || ''}`}>
      <span className={`text-[10px] tracking-[0.15em] uppercase font-medium ${darkMode ? 'text-[#FAF7F2]/50' : 'text-[#4A4A4A]/70'}`}>{label}</span>
      <select
        required={required}
        defaultValue=""
        className={`w-full min-w-0 bg-transparent border-b text-sm py-2 outline-none focus:border-[#D3839E] transition-colors ${darkMode ? 'border-[#3A3328] text-[#FAF7F2]' : 'border-[#EDE4D6] text-[#2A2A2A]'}`}
      >
        <option value="" disabled>Select…</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  )
}

function Section({ title, darkMode, children }: { title: string; darkMode: boolean; children: ReactNode }) {
  return (
    <section className={`rounded-3xl p-6 md:p-8 border ${darkMode ? 'bg-[#252018] border-[#3A3328]' : 'bg-white border-[#F5EFE6]'}`}>
      <h2 style={{ fontFamily: 'var(--font-display)' }} className={`text-lg font-medium mb-5 ${darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'}`}>
        {title}
      </h2>
      {children}
    </section>
  )
}

export default function Checkout() {
  const { darkMode, cartItems, cartTotal, discount, clearCart } = useApp()
  const navigate = useNavigate()
  const [paymentMethod, setPaymentMethod] = useState<'momo' | 'card'>('momo')

  const discountAmount = discount ? (cartTotal * discount) / 100 : 0
  const finalTotal = cartTotal - discountAmount

  if (cartItems.length === 0) {
    return (
      <div className={`min-h-screen pt-[244px] pb-24 px-6 text-center flex flex-col items-center gap-4 ${darkMode ? 'bg-[#1C1916]' : 'bg-[#FAF7F2]'}`}>
        <span className="text-5xl opacity-30">🛍️</span>
        <p className={darkMode ? 'text-[#FAF7F2]/60' : 'text-[#4A4A4A]'}>Your cart is empty — add something before checking out.</p>
        <Link to="/products" className="text-[#D3839E] text-xs tracking-widest uppercase font-medium hover:underline">
          Continue Shopping
        </Link>
      </div>
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const orderNumber = `GWR-${Math.floor(100000 + Math.random() * 900000)}`
    const total = finalTotal
    clearCart()
    navigate('/order-confirmation', { state: { orderNumber, total } })
  }

  return (
    <div className={`min-h-screen pt-[196px] pb-24 px-6 lg:px-12 ${darkMode ? 'bg-[#1C1916]' : 'bg-[#FAF7F2]'}`}>
      <div className="max-w-[1200px] mx-auto">
        <p className="text-[#D3839E] text-xs tracking-[0.35em] uppercase font-medium mb-3">Secure Checkout</p>
        <h1
          style={{ fontFamily: 'var(--font-display)' }}
          className={`text-4xl md:text-5xl font-medium mb-12 ${darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'}`}
        >
          Checkout
        </h1>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-[1fr_400px] gap-8 items-start [&>*]:min-w-0">
          <div className="flex flex-col gap-8">
            <Section title="Contact" darkMode={darkMode}>
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Full name" darkMode={darkMode} required />
                <Field label="Phone number" type="tel" darkMode={darkMode} required />
                <Field label="Email" type="email" darkMode={darkMode} required wrapperClassName="sm:col-span-2" />
              </div>
            </Section>

            <Section title="Shipping Address" darkMode={darkMode}>
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Street address" darkMode={darkMode} required wrapperClassName="sm:col-span-2" />
                <Field label="City / Town" darkMode={darkMode} required />
                <SelectField label="Region" darkMode={darkMode} options={regions} required />
              </div>
            </Section>

            <Section title="Payment Method" darkMode={darkMode}>
              <div className="flex gap-3 mb-6">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('momo')}
                  className={`flex-1 min-w-0 flex items-center justify-center gap-2 py-3 rounded-xl border text-[11px] sm:text-xs tracking-[0.1em] uppercase font-medium transition-colors ${
                    paymentMethod === 'momo'
                      ? 'bg-[#D3839E] border-[#D3839E] text-white'
                      : darkMode ? 'border-[#3A3328] text-[#FAF7F2]/70' : 'border-[#EDE4D6] text-[#4A4A4A]'
                  }`}
                >
                  <FiSmartphone size={14} /> Mobile Money
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`flex-1 min-w-0 flex items-center justify-center gap-2 py-3 rounded-xl border text-[11px] sm:text-xs tracking-[0.1em] uppercase font-medium transition-colors ${
                    paymentMethod === 'card'
                      ? 'bg-[#D3839E] border-[#D3839E] text-white'
                      : darkMode ? 'border-[#3A3328] text-[#FAF7F2]/70' : 'border-[#EDE4D6] text-[#4A4A4A]'
                  }`}
                >
                  <FiCreditCard size={14} /> Card
                </button>
              </div>

              {paymentMethod === 'momo' ? (
                <div className="grid sm:grid-cols-2 gap-5">
                  <SelectField label="Network" darkMode={darkMode} options={momoNetworks} required />
                  <Field label="Mobile money number" type="tel" placeholder="024 XXX XXXX" darkMode={darkMode} required />
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-5">
                  <Field label="Card number" placeholder="1234 5678 9012 3456" darkMode={darkMode} required wrapperClassName="sm:col-span-2" />
                  <Field label="Expiry" placeholder="MM/YY" darkMode={darkMode} required />
                  <Field label="CVV" placeholder="123" darkMode={darkMode} required />
                </div>
              )}
            </Section>
          </div>

          {/* Order summary */}
          <aside className={`rounded-3xl p-6 md:p-8 border lg:sticky lg:top-28 ${darkMode ? 'bg-[#252018] border-[#3A3328]' : 'bg-white border-[#F5EFE6]'}`}>
            <h2 style={{ fontFamily: 'var(--font-display)' }} className={`text-lg font-medium mb-5 ${darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'}`}>
              Order Summary
            </h2>
            <div className="flex flex-col gap-4 max-h-72 overflow-y-auto pr-1">
              {cartItems.map(item => (
                <div key={item.product.id} className="flex gap-3 items-center">
                  <img src={item.product.image} alt={item.product.name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm truncate ${darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'}`}>{item.product.name}</p>
                    <p className="text-xs text-[#D3839E]">Qty {item.quantity}</p>
                  </div>
                  <p className={`text-sm font-medium whitespace-nowrap ${darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'}`}>
                    {formatPrice(item.product.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className={`mt-6 pt-5 border-t space-y-2 text-sm ${darkMode ? 'border-[#3A3328] text-[#FAF7F2]/70' : 'border-[#EDE4D6] text-[#4A4A4A]'}`}>
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-[#D3839E]">
                  <span>Discount ({discount}%)</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-500 text-xs font-medium">Free</span>
              </div>
              <div className={`flex justify-between font-semibold text-base pt-2 border-t ${darkMode ? 'border-[#3A3328] text-[#FAF7F2]' : 'border-[#EDE4D6] text-[#2A2A2A]'}`}>
                <span>Total</span>
                <span>{formatPrice(finalTotal)}</span>
              </div>
            </div>

            <motion.button
              type="submit"
              whileTap={{ scale: 0.98 }}
              className="w-full mt-6 bg-[#D3839E] hover:bg-[#B85E75] text-white text-xs tracking-[0.2em] uppercase font-semibold py-4 rounded-full transition-colors flex items-center justify-center gap-2"
            >
              <FiCheck size={14} /> Place Order
            </motion.button>
            <p className={`text-[10px] text-center mt-3 ${darkMode ? 'text-[#FAF7F2]/30' : 'text-[#4A4A4A]/40'}`}>
              Demo checkout — no real payment will be processed.
            </p>
          </aside>
        </form>
      </div>
    </div>
  )
}
