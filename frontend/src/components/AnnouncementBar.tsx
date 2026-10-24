import { useState, useEffect, useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { store } from '../data/store'
import { activePromo } from '../data/products'

/** A short countdown like "2d 03h 14m" to the promo's end, or null. */
function countdown(endsAt: string | null): string | null {
  if (!endsAt) return null
  const ms = new Date(endsAt).getTime() - Date.now()
  if (ms <= 0) return null
  const d = Math.floor(ms / 86_400_000)
  const h = Math.floor((ms % 86_400_000) / 3_600_000)
  const m = Math.floor((ms % 3_600_000) / 60_000)
  const pad = (n: number) => String(n).padStart(2, '0')
  return (d > 0 ? `${d}d ` : '') + `${pad(h)}h ${pad(m)}m`
}

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0)
  const [tick, setTick] = useState(0) // re-renders the countdown each minute

  // The promo rides at the front of the rotation when a code is running, so
  // the whole shop shows the offer without a second fixed bar fighting the
  // header for space.
  const messages = useMemo(() => {
    const base = store.announcements
    if (!activePromo) return base
    const ends = countdown(activePromo.endsAt)
    const promoText =
      `✨ ${activePromo.label} — code ${activePromo.code}` +
      (ends ? ` — ends in ${ends}` : '')
    return [promoText, ...base]
    // tick is in the deps so the countdown text refreshes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick])

  useEffect(() => {
    const rotate = setInterval(() => setIndex(i => (i + 1) % messages.length), 4000)
    return () => clearInterval(rotate)
  }, [messages.length])

  useEffect(() => {
    if (!activePromo?.endsAt) return
    const t = setInterval(() => setTick(n => n + 1), 60_000)
    return () => clearInterval(t)
  }, [])

  const message = messages[index % messages.length]
  const isPromo = activePromo && index % messages.length === 0

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-40 h-9 flex items-center justify-center overflow-hidden ${
        isPromo ? 'bg-gradient-to-r from-[#B85E75] via-[#D3839E] to-[#B85E75]' : 'bg-[#2A2A2A]'
      } text-white`}
    >
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4 }}
          className="text-[11px] tracking-[0.18em] uppercase font-medium px-6 text-center"
        >
          {message}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}
