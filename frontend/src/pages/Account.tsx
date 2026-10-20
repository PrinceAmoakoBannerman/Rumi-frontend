import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiLogOut, FiPackage, FiCheck, FiClock, FiAlertCircle } from 'react-icons/fi'
import { useApp } from '../contexts/AppContext'
import { formatPrice } from '../lib/currency'
import { myOrders, saveDetails, AuthError, type PastOrder } from '../lib/auth'
import { Field } from '../components/AuthShell'
import OrderProgress from '../components/OrderProgress'

const regions = [
  'Greater Accra', 'Ashanti', 'Western', 'Central', 'Eastern', 'Volta',
  'Northern', 'Upper East', 'Upper West', 'Bono', 'Bono East', 'Ahafo',
  'Western North', 'Oti', 'North East', 'Savannah',
]

export default function Account() {
  const { darkMode, account, accountChecked, setAccount, signOutNow } = useApp()
  const navigate = useNavigate()

  const [orders, setOrders] = useState<PastOrder[] | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Wait until the token has been checked before deciding nobody is signed in,
  // or a refresh would bounce a signed-in shopper back to the form.
  useEffect(() => {
    if (accountChecked && !account) navigate('/signin?next=/account', { replace: true })
  }, [accountChecked, account, navigate])

  useEffect(() => {
    if (!account) return
    let active = true
    myOrders()
      .then(result => active && setOrders(result))
      .catch(() => active && setOrders([]))
    return () => {
      active = false
    }
  }, [account])

  if (!account) return null

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (saving) return
    setError(null)
    setSaved(false)
    setSaving(true)

    const form = new FormData(e.currentTarget)
    try {
      const updated = await saveDetails({
        name: String(form.get('name') ?? ''),
        phone: String(form.get('phone') ?? ''),
        address: String(form.get('address') ?? ''),
        city: String(form.get('city') ?? ''),
        region: String(form.get('region') ?? ''),
      })
      setAccount(updated)
      setSaved(true)
    } catch (err) {
      setError(err instanceof AuthError ? err.message : 'Your details could not be saved.')
    } finally {
      setSaving(false)
    }
  }

  const card = `rounded-3xl border p-6 sm:p-8 ${
    darkMode ? 'bg-[#252018] border-[#3A3328]' : 'bg-white border-[#F5EFE6]'
  }`

  return (
    <div className={`min-h-screen pt-[196px] pb-24 px-6 lg:px-12 ${darkMode ? 'bg-[#1C1916]' : 'bg-[#FAF7F2]'}`}>
      <div className="max-w-[1100px] mx-auto">
        <p className="text-[#D3839E] text-xs tracking-[0.35em] uppercase font-medium mb-3">Your account</p>
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <h1
            style={{ fontFamily: 'var(--font-display)' }}
            className={`text-4xl md:text-5xl font-medium ${darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'}`}
          >
            {account.name || 'Hello'}
          </h1>
          <button
            onClick={async () => {
              await signOutNow()
              navigate('/', { replace: true })
            }}
            className={`flex items-center gap-2 text-xs tracking-widest uppercase font-medium hover:text-[#D3839E] transition-colors ${
              darkMode ? 'text-[#FAF7F2]/55' : 'text-[#4A4A4A]/70'
            }`}
          >
            <FiLogOut size={14} /> Sign out
          </button>
        </div>

        <div className="grid lg:grid-cols-[380px_1fr] gap-8 items-start [&>*]:min-w-0">
          {/* Details */}
          <section className={card}>
            <h2
              style={{ fontFamily: 'var(--font-display)' }}
              className={`text-lg font-medium mb-1 ${darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'}`}
            >
              Your details
            </h2>
            <p className={`text-xs mb-6 ${darkMode ? 'text-[#FAF7F2]/45' : 'text-[#4A4A4A]/60'}`}>
              Filled in for you at checkout.
            </p>

            <form onSubmit={handleSave} className="flex flex-col gap-5">
              <Field label="Full name" name="name" defaultValue={account.name} darkMode={darkMode} />
              <Field label="Phone number" name="phone" type="tel" defaultValue={account.phone} darkMode={darkMode} />
              <Field label="Street address" name="address" defaultValue={account.address} darkMode={darkMode} />
              <Field label="City / Town" name="city" defaultValue={account.city} darkMode={darkMode} />

              <label className="flex flex-col gap-1.5">
                <span className={`text-[10px] tracking-[0.15em] uppercase font-medium ${darkMode ? 'text-[#FAF7F2]/50' : 'text-[#4A4A4A]/70'}`}>
                  Region
                </span>
                <select
                  name="region"
                  defaultValue={account.region}
                  className={`w-full bg-transparent border-b text-sm py-2 outline-none focus:border-[#D3839E] transition-colors ${
                    darkMode ? 'border-[#3A3328] text-[#FAF7F2]' : 'border-[#EDE4D6] text-[#2A2A2A]'
                  }`}
                >
                  <option value="">Select…</option>
                  {regions.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </label>

              <p className={`text-[11px] ${darkMode ? 'text-[#FAF7F2]/35' : 'text-[#4A4A4A]/50'}`}>
                Signed in as {account.email}
              </p>

              {error && (
                <p role="alert" className="text-sm text-[#C0392B] bg-[#C0392B]/8 border border-[#C0392B]/25 rounded-xl px-4 py-3">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-[#2A2A2A] hover:bg-[#B85E75] disabled:opacity-60 text-white text-xs tracking-[0.2em] uppercase font-semibold py-3.5 rounded-full transition-colors"
              >
                {saving ? 'Saving…' : saved ? 'Saved' : 'Save details'}
              </button>
            </form>
          </section>

          {/* Orders */}
          <section className={card}>
            <h2
              style={{ fontFamily: 'var(--font-display)' }}
              className={`text-lg font-medium mb-1 ${darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'}`}
            >
              Your orders
            </h2>
            <p className={`text-xs mb-6 ${darkMode ? 'text-[#FAF7F2]/45' : 'text-[#4A4A4A]/60'}`}>
              Orders placed while signed in.
            </p>

            {orders === null && (
              <p className={`text-sm ${darkMode ? 'text-[#FAF7F2]/50' : 'text-[#4A4A4A]/70'}`}>Loading…</p>
            )}

            {orders?.length === 0 && (
              <div className="text-center py-10">
                <FiPackage size={26} className={`mx-auto mb-4 ${darkMode ? 'text-[#FAF7F2]/25' : 'text-[#4A4A4A]/25'}`} />
                <p className={`text-sm mb-5 ${darkMode ? 'text-[#FAF7F2]/55' : 'text-[#4A4A4A]'}`}>
                  Nothing here yet.
                </p>
                <Link to="/products" className="text-[#D3839E] text-xs tracking-widest uppercase font-medium hover:underline">
                  Start shopping
                </Link>
              </div>
            )}

            <div className="flex flex-col gap-4">
              {orders?.map((order, i) => (
                <motion.div
                  key={order.reference}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`rounded-2xl p-5 ${darkMode ? 'bg-[#1C1916]' : 'bg-[#FAF7F2]'}`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <span className={`text-sm font-semibold ${darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'}`}>
                      {order.reference}
                    </span>
                    <StatusPill order={order} />
                  </div>
                  {order.items.map((line, n) => (
                    <div key={n} className="flex justify-between gap-4 py-0.5">
                      <span className={`text-xs ${darkMode ? 'text-[#FAF7F2]/60' : 'text-[#4A4A4A]/80'}`}>
                        {line.quantity} × {line.name}
                      </span>
                      <span className={`text-xs whitespace-nowrap ${darkMode ? 'text-[#FAF7F2]/60' : 'text-[#4A4A4A]/80'}`}>
                        {formatPrice(Number(line.lineTotal))}
                      </span>
                    </div>
                  ))}
                  {order.isPaid && (
                    <div className={`mt-4 pt-3 border-t ${darkMode ? 'border-[#3A3328]' : 'border-[#EDE4D6]'}`}>
                      <OrderProgress journey={order.journey} darkMode={darkMode} compact />
                    </div>
                  )}
                  <div className={`flex justify-between mt-3 pt-3 border-t ${darkMode ? 'border-[#3A3328]' : 'border-[#EDE4D6]'}`}>
                    <span className={`text-xs ${darkMode ? 'text-[#FAF7F2]/45' : 'text-[#4A4A4A]/60'}`}>
                      {new Date(order.placedOn).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <span className={`text-sm font-semibold ${darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'}`}>
                      {formatPrice(Number(order.total))}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

function StatusPill({ order }: { order: PastOrder }) {
  const paid = order.isPaid
  const pending = order.status === 'pending'
  const colour = paid ? '#4C9A6A' : pending ? '#B8860B' : '#C0392B'
  const Icon = paid ? FiCheck : pending ? FiClock : FiAlertCircle
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[10px] tracking-widest uppercase font-semibold px-2.5 py-1 rounded-full"
      style={{ color: colour, background: `${colour}18` }}
    >
      <Icon size={11} /> {order.statusLabel}
    </span>
  )
}
