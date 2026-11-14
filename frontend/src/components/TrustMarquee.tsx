import { useApp } from '../contexts/AppContext'

/**
 * A quiet, endlessly scrolling strip of the reasons to buy — delivery,
 * payment, support. Two identical halves slide left as one; shifting the track
 * by exactly half its width makes the loop seamless with no visible jump.
 *
 * It pauses on hover and holds still for anyone who prefers reduced motion.
 */
const items = [
  'Nationwide delivery',
  'Pay with MoMo or card',
  'WhatsApp support',
  'Cruelty-free',
  'Fast & reliable delivery',
  'Secure checkout',
]

export default function TrustMarquee() {
  const { darkMode } = useApp()
  // Two copies, so the track can scroll one full copy and reset invisibly.
  const loop = [...items, ...items]

  return (
    <div
      className={`gwr-marquee relative overflow-hidden border-y ${
        darkMode ? 'bg-[#211C17] border-[#3A3328]' : 'bg-white border-[#EFE6DA]'
      }`}
    >
      <div className="gwr-marquee-track flex w-max items-center py-4">
        {loop.map((label, i) => (
          <span
            key={i}
            aria-hidden={i >= items.length}
            className={`flex items-center whitespace-nowrap text-[11px] sm:text-xs tracking-[0.25em] uppercase font-medium ${
              darkMode ? 'text-[#FAF7F2]/45' : 'text-[#9A8E82]'
            }`}
          >
            <span className="text-[#D3839E] px-6 sm:px-9">·</span>
            {label}
          </span>
        ))}
      </div>

      <style>{`
        @keyframes gwr-marquee-slide { to { transform: translateX(-50%); } }
        .gwr-marquee-track { animation: gwr-marquee-slide 32s linear infinite; }
        .gwr-marquee:hover .gwr-marquee-track { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) {
          .gwr-marquee-track { animation: none; }
        }
      `}</style>
    </div>
  )
}
