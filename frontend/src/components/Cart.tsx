import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiPlus, FiMinus, FiTrash2, FiTag } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'
import { formatPrice } from '../lib/currency'

export default function Cart() {
  const { cartItems, cartOpen, setCartOpen, removeFromCart, updateQty, cartTotal, cartCount, coupon, applyCoupon, removeCoupon, discount, darkMode } = useApp()
  const [couponInput, setCouponInput] = useState('')
  const [couponError, setCouponError] = useState<string | null>(null)
  const [applying, setApplying] = useState(false)

  const handleCoupon = async () => {
    if (!couponInput.trim() || applying) return
    setApplying(true)
    const error = await applyCoupon(couponInput, cartTotal)
    setCouponError(error)
    if (!error) setCouponInput('')
    setApplying(false)
  }

  // The backend gives the saving in cedis; never more than the basket.
  const discountAmount = Math.min(discount, cartTotal)
  const finalTotal = cartTotal - discountAmount

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.35 }}
            className={`fixed right-0 top-0 bottom-0 z-50 w-full max-w-[420px] flex flex-col ${darkMode ? 'bg-[#1C1916]' : 'bg-[#FAF7F2]'} shadow-2xl`}
          >
            {/* Header */}
            <div className={`flex items-center justify-between px-6 py-5 border-b ${darkMode ? 'border-[#3A3328]' : 'border-[#EDE4D6]'}`}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)' }} className={`text-xl font-medium ${darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'}`}>
                  Your Cart
                </h2>
                <p className={`text-xs mt-0.5 ${darkMode ? 'text-[#FAF7F2]/40' : 'text-[#4A4A4A]/60'}`}>
                  {cartCount} {cartCount === 1 ? 'item' : 'items'}
                </p>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${darkMode ? 'hover:bg-[#3A3328] text-[#FAF7F2]' : 'hover:bg-[#EDE4D6] text-[#2A2A2A]'}`}
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
              {cartItems.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-4 py-20">
                  <span className="text-5xl opacity-30">🛍️</span>
                  <p className={`text-sm ${darkMode ? 'text-[#FAF7F2]/40' : 'text-[#4A4A4A]/60'}`}>Your cart is empty</p>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="text-[#D3839E] text-xs tracking-widest uppercase font-medium hover:underline"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cartItems.map(item => (
                  <motion.div
                    key={item.product.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className={`flex gap-4 p-4 rounded-2xl border ${darkMode ? 'border-[#3A3328] bg-[#252018]' : 'border-[#EDE4D6] bg-white'}`}
                  >
                    <Link to={`/products/${item.product.id}`} onClick={() => setCartOpen(false)}>
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-xl flex-shrink-0 bg-[#F5EFE6]"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <p className={`text-[10px] tracking-widest uppercase text-[#D3839E] font-medium mb-0.5`}>
                        {item.product.category}
                      </p>
                      <p
                        style={{ fontFamily: 'var(--font-display)' }}
                        className={`text-sm font-medium leading-snug truncate ${darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'}`}
                      >
                        {item.product.name}
                      </p>
                      <p className="text-[#D3839E] font-semibold text-sm mt-1">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <div className={`flex items-center rounded-full border overflow-hidden ${darkMode ? 'border-[#3A3328]' : 'border-[#EDE4D6]'}`}>
                          <button
                            onClick={() => updateQty(item.product.id, item.quantity - 1)}
                            className={`w-7 h-7 flex items-center justify-center hover:bg-[#D3839E]/10 transition-colors ${darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'}`}
                          >
                            <FiMinus size={11} />
                          </button>
                          <span className={`w-7 text-center text-xs font-medium ${darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'}`}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQty(item.product.id, item.quantity + 1)}
                            className={`w-7 h-7 flex items-center justify-center hover:bg-[#D3839E]/10 transition-colors ${darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'}`}
                          >
                            <FiPlus size={11} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-red-400/60 hover:text-red-400 transition-colors"
                          aria-label="Remove"
                        >
                          <FiTrash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className={`px-6 py-5 border-t ${darkMode ? 'border-[#3A3328]' : 'border-[#EDE4D6]'} flex flex-col gap-4`}>
                {/* Coupon */}
                <div className="flex gap-2">
                  <div className={`flex-1 flex items-center gap-2 border rounded-full px-4 ${darkMode ? 'border-[#3A3328] bg-[#252018]' : 'border-[#EDE4D6] bg-white'} ${couponError ? 'border-red-400/50' : ''}`}>
                    <FiTag size={13} className="text-[#D3839E]" />
                    <input
                      value={couponInput}
                      onChange={e => { setCouponInput(e.target.value); setCouponError(null) }}
                      placeholder={coupon ? `Applied: ${coupon}` : 'Coupon code'}
                      disabled={!!coupon}
                      className={`flex-1 bg-transparent text-xs py-2.5 outline-none ${darkMode ? 'text-[#FAF7F2] placeholder-[#FAF7F2]/30' : 'text-[#2A2A2A] placeholder-[#4A4A4A]/40'}`}
                    />
                  </div>
                  {coupon ? (
                    <button
                      onClick={removeCoupon}
                      className="text-[#D3839E] text-xs px-4 py-2.5 rounded-full hover:underline"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      onClick={handleCoupon}
                      disabled={applying}
                      className="bg-[#2A2A2A] text-white text-xs px-4 py-2.5 rounded-full hover:bg-[#D3839E] disabled:opacity-60 transition-colors"
                    >
                      {applying ? '…' : 'Apply'}
                    </button>
                  )}
                </div>
                {couponError && <p className="text-red-400 text-xs px-1">{couponError}</p>}

                {/* Totals */}
                <div className={`space-y-2 text-sm ${darkMode ? 'text-[#FAF7F2]/70' : 'text-[#4A4A4A]'}`}>
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(cartTotal)}</span>
                  </div>
                  {discountAmount > 0 && (
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

                <Link to="/checkout" onClick={() => setCartOpen(false)}>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-[#D3839E] hover:bg-[#B85E75] text-white text-xs tracking-[0.2em] uppercase font-semibold py-4 rounded-full transition-colors"
                  >
                    Checkout — {formatPrice(finalTotal)}
                  </motion.button>
                </Link>

                <button
                  onClick={() => setCartOpen(false)}
                  className={`text-center text-xs tracking-widest uppercase font-medium transition-colors ${darkMode ? 'text-[#FAF7F2]/40 hover:text-[#FAF7F2]' : 'text-[#4A4A4A]/60 hover:text-[#2A2A2A]'}`}
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
