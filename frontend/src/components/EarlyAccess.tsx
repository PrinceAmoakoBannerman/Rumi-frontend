import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiCheck } from 'react-icons/fi'
import { useLocation } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'
import { joinEarlyAccess } from '../lib/earlyAccess'

/**
 * The homepage "Get early access" popup.
 *
 * It appears once, a couple of seconds after the shop settles, and only on the
 * home page. Whether a visitor signs up or closes it, we remember that in the
 * browser so it never nags them again. The address goes to the backend, where
 * the owner collects it — the shop does not send anything on its own.
 */
const SEEN_KEY = 'gwr_early_access_v1'
const DELAY_MS = 2500

type Status = 'idle' | 'sending' | 'done' | 'error'

export default function EarlyAccess() {
  const { darkMode } = useApp()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (pathname !== '/') return
    let seen = false
    try {
      seen = localStorage.getItem(SEEN_KEY) === '1'
    } catch {
      // Private mode or blocked storage — showing it once is no harm.
    }
    if (seen) return
    const timer = setTimeout(() => setOpen(true), DELAY_MS)
    return () => clearTimeout(timer)
  }, [pathname])

  const remember = () => {
    try {
      localStorage.setItem(SEEN_KEY, '1')
    } catch {
      // Nothing to do; worst case it shows again next visit.
    }
  }

  const dismiss = useCallback(() => {
    setOpen(false)
    remember()
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, dismiss])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || status === 'sending') return
    setStatus('sending')
    setMessage('')
    try {
      const detail = await joinEarlyAccess(email.trim())
      setMessage(detail)
      setStatus('done')
      remember()
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Please try again in a moment.')
      setStatus('error')
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={dismiss}
            className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Get early access"
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            className={`relative w-full max-w-lg overflow-hidden rounded-[1.75rem] shadow-2xl grid grid-cols-[34%_66%] ${
              darkMode ? 'bg-[#211C17]' : 'bg-[#FBF6EF]'
            }`}
          >
            {/* The product shot is on a white backdrop, so the strip is white
                too and the bottle is shown whole with object-contain — the way
                products appear everywhere else in the shop. */}
            <div className="flex items-center justify-center bg-white p-3">
              <img
                src="/products/anua-niacinamide-dark-spot-serum.png"
                alt="Anua Niacinamide Dark Spot Serum"
                className="max-h-56 w-full object-contain"
              />
            </div>

            <div className="relative p-6 sm:p-8">
              <button
                onClick={dismiss}
                aria-label="Close"
                className={`absolute top-3.5 right-3.5 w-8 h-8 inline-flex items-center justify-center rounded-full transition-colors ${
                  darkMode ? 'text-[#FAF7F2]/60 hover:bg-white/10' : 'text-[#2A2A2A]/50 hover:bg-black/5'
                }`}
              >
                <FiX size={18} />
              </button>

              {status !== 'done' ? (
                <>
                  <h2
                    style={{ fontFamily: 'var(--font-display)' }}
                    className={`text-xl sm:text-2xl font-medium leading-tight tracking-tight mb-2.5 pr-6 ${
                      darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'
                    }`}
                  >
                    Get Early Access
                  </h2>
                  <p className={`text-[13px] leading-relaxed mb-5 ${darkMode ? 'text-[#FAF7F2]/65' : 'text-[#5A5A5A]'}`}>
                    Be first to new drops and restocks — before they go public.
                  </p>

                  <form onSubmit={submit} className="flex flex-col gap-2.5">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="Your email"
                      className={`w-full text-sm px-4 py-3 rounded-xl outline-none border transition-colors ${
                        darkMode
                          ? 'bg-[#1A1611] border-[#3A3328] text-[#FAF7F2] placeholder-[#FAF7F2]/30 focus:border-[#D3839E]'
                          : 'bg-white border-[#E4D9C9] text-[#2A2A2A] placeholder-[#2A2A2A]/35 focus:border-[#D3839E]'
                      }`}
                    />
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={status === 'sending'}
                      className="w-full bg-[#2A2A2A] hover:bg-[#B85E75] disabled:opacity-60 text-white text-[11px] tracking-[0.2em] uppercase font-semibold px-6 py-3.5 rounded-xl transition-colors"
                    >
                      {status === 'sending' ? 'Joining…' : 'Get Early Access'}
                    </motion.button>
                  </form>

                  {status === 'error' && (
                    <p className="text-[12px] text-[#C0392B] mt-2.5">{message}</p>
                  )}

                  <p className={`text-[10px] mt-3 ${darkMode ? 'text-[#FAF7F2]/35' : 'text-[#2A2A2A]/40'}`}>
                    No spam. Unsubscribe anytime.
                  </p>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-start gap-3 py-2"
                >
                  <span className="w-11 h-11 rounded-full bg-[#D3839E] flex items-center justify-center">
                    <FiCheck size={20} className="text-white" />
                  </span>
                  <h2
                    style={{ fontFamily: 'var(--font-display)' }}
                    className={`text-xl font-medium ${darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'}`}
                  >
                    You&apos;re on the list
                  </h2>
                  <p className={`text-[13px] leading-relaxed ${darkMode ? 'text-[#FAF7F2]/65' : 'text-[#5A5A5A]'}`}>
                    {message}
                  </p>
                  <button
                    onClick={() => setOpen(false)}
                    className="mt-1 text-[11px] tracking-[0.2em] uppercase font-semibold text-[#B85E75] hover:text-[#D3839E] transition-colors"
                  >
                    Keep shopping →
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
