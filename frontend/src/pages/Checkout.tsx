import { useState } from 'react'
import type { InputHTMLAttributes, ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiCreditCard, FiSmartphone, FiCheck, FiLock } from 'react-icons/fi'
import { useApp } from '../contexts/AppContext'
import { formatPrice } from '../lib/currency'
import { startCheckout, CheckoutError } from '../lib/checkout'

const regions = [
  'Greater Accra', 'Ashanti', 'Western', 'Central', 'Eastern', 'Volta',
  'Northern', 'Upper East', 'Upper West', 'Bono', 'Bono East', 'Ahafo',
  'Western North', 'Oti', 'North East', 'Savannah',
]

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

function SelectField({ label, darkMode, wrapperClassName, options, required, name, value }: { label: string; darkMode: boolean; wrapperClassName?: string; options: string[]; required?: boolean; name?: string; value?: string }) {
  return (
    <label className={`flex flex-col gap-1.5 min-w-0 ${wrapperClassName || ''}`}>
      <span className={`text-[10px] tracking-[0.15em] uppercase font-medium ${darkMode ? 'text-[#FAF7F2]/50' : 'text-[#4A4A4A]/70'}`}>{label}</span>
      <select
        name={name}
        required={required}
        defaultValue={value ?? ''}
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
  const { darkMode, cartItems, cartTotal, discount, coupon, clearCart, account } = useApp()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const discountAmount = Math.min(discount, cartTotal)
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (submitting) return

    setError(null)
    setSubmitting(true)

    const form = new FormData(e.currentTarget)
    const customer = {
      name: String(form.get('name') ?? ''),
      email: String(form.get('email') ?? ''),
      phone: String(form.get('phone') ?? ''),
      address: String(form.get('address') ?? ''),
      city: String(form.get('city') ?? ''),
      region: String(form.get('region') ?? ''),
    }

    // Only what is being bought, never what it costs — the backend prices it.
    const basket = cartItems.map(item => ({
      product: item.product.id,
      quantity: item.quantity,
    }))

    try {
      const result = await startCheckout(customer, basket, coupon ?? undefined)

      if (result.authorizationUrl) {
        // Card and mobile money details are entered on Paystack's own page,
        // so they never touch this site.
        clearCart()
        window.location.href = result.authorizationUrl
        return
      }

      // Payments are not configured yet; the order was still recorded.
      clearCart()
      navigate(
        `/order-confirmation?reference=${encodeURIComponent(result.reference)}` +
          `&t=${encodeURIComponent(result.token)}`,
      )
    } catch (err) {
      setError(
        err instanceof CheckoutError
          ? err.message
          : 'Something went wrong placing your order. Please try again.',
      )
      setSubmitting(false)
    }
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

        {/* Who is signed in is only known once the backend has answered, which
            is after this first renders. The key rebuilds the fields when the
            answer arrives, so the saved details actually appear. */}
        <form
          key={account?.email ?? 'guest'}
          onSubmit={handleSubmit}
          className="grid lg:grid-cols-[1fr_400px] gap-8 items-start [&>*]:min-w-0"
        >
          <div className="flex flex-col gap-8">
            <Section title="Contact" darkMode={darkMode}>
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Full name" name="name" autoComplete="name" darkMode={darkMode} required defaultValue={account?.name ?? ''} />
                <Field label="Phone number" name="phone" type="tel" autoComplete="tel" darkMode={darkMode} required defaultValue={account?.phone ?? ''} />
                <Field label="Email" name="email" type="email" autoComplete="email" darkMode={darkMode} required wrapperClassName="sm:col-span-2" defaultValue={account?.email ?? ''} />
              </div>
            </Section>

            <Section title="Shipping Address" darkMode={darkMode}>
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Street address" name="address" autoComplete="street-address" darkMode={darkMode} required wrapperClassName="sm:col-span-2" defaultValue={account?.address ?? ''} />
                <Field label="City / Town" name="city" autoComplete="address-level2" darkMode={darkMode} required defaultValue={account?.city ?? ''} />
                <SelectField label="Region" name="region" darkMode={darkMode} options={regions} required value={account?.region ?? ''} />
              </div>
            </Section>

            {/* Paystack collects the payment itself, on its own page. Asking
                for a card number here would be both pointless and reckless:
                it would put this site in scope for card-data rules it is in
                no position to satisfy. */}
            <Section title="Payment" darkMode={darkMode}>
              <p className={`text-sm leading-relaxed mb-5 ${darkMode ? 'text-[#FAF7F2]/70' : 'text-[#4A4A4A]'}`}>
                You will be taken to Paystack to pay. Choose mobile money or card there —
                your details are entered on their secure page and never reach this site.
              </p>
              <div className={`flex flex-wrap items-center gap-x-6 gap-y-2 text-xs ${darkMode ? 'text-[#FAF7F2]/55' : 'text-[#4A4A4A]/75'}`}>
                <span className="flex items-center gap-2"><FiSmartphone size={14} /> MTN, Telecel &amp; AirtelTigo</span>
                <span className="flex items-center gap-2"><FiCreditCard size={14} /> Visa &amp; Mastercard</span>
                <span className="flex items-center gap-2"><FiLock size={14} /> Secured by Paystack</span>
              </div>
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
                  <span>Discount{coupon ? ` (${coupon})` : ''}</span>
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

            {error && (
              <p
                role="alert"
                className="mt-5 text-sm leading-relaxed text-[#C0392B] bg-[#C0392B]/8 border border-[#C0392B]/25 rounded-xl px-4 py-3"
              >
                {error}
              </p>
            )}

            <motion.button
              type="submit"
              disabled={submitting}
              whileTap={submitting ? undefined : { scale: 0.98 }}
              className="w-full mt-6 bg-[#D3839E] hover:bg-[#B85E75] disabled:bg-[#D3839E]/55 disabled:cursor-not-allowed text-white text-xs tracking-[0.2em] uppercase font-semibold py-4 rounded-full transition-colors flex items-center justify-center gap-2"
            >
              {submitting ? 'Taking you to payment…' : <><FiCheck size={14} /> Pay {formatPrice(finalTotal)}</>}
            </motion.button>
            <p className={`text-[10px] text-center mt-3 ${darkMode ? 'text-[#FAF7F2]/30' : 'text-[#4A4A4A]/40'}`}>
              You will be taken to Paystack to pay. Your card details never reach this site.
            </p>
          </aside>
        </form>
      </div>
    </div>
  )
}
