import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { store } from '../data/store'

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setIndex(i => (i + 1) % store.announcements.length)
    }, 4000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-40 h-9 bg-[#2A2A2A] text-white flex items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4 }}
          className="text-[11px] tracking-[0.18em] uppercase font-medium px-6 text-center"
        >
          {store.announcements[index]}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}
