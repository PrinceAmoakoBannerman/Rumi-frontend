import { Link } from 'react-router-dom'
import { FiInstagram, FiYoutube, FiFacebook } from 'react-icons/fi'
import { useApp } from '../contexts/AppContext'

export default function Footer() {
  const { darkMode } = useApp()

  return (
    <footer className={`pt-16 pb-8 px-6 lg:px-12 border-t ${darkMode ? 'bg-[#141210] border-[#3A3328]' : 'bg-[#2A2A2A] border-[#3A3A3A]'}`}>
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-14">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2">
            <div className="mb-5">
              <p style={{ fontFamily: 'var(--font-display)' }} className="text-2xl font-semibold tracking-[0.15em] text-white">RUMI</p>
              <p className="text-[9px] tracking-[0.35em] uppercase text-[#D4B483] font-medium">Skincare</p>
            </div>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs mb-6">
              Luxury skincare formulated with nature&apos;s finest ingredients and the most advanced scientific research. Because your skin deserves the extraordinary.
            </p>
            <div className="flex gap-3">
              {[
                { icon: <FiInstagram size={16} />, label: 'Instagram' },
                { icon: <FiFacebook size={16} />, label: 'Facebook' },
                { icon: <FiYoutube size={16} />, label: 'YouTube' },
                {
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.35 6.35 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.63a8.17 8.17 0 0 0 4.77 1.52V6.69a4.85 4.85 0 0 1-1-.01z"/>
                    </svg>
                  ),
                  label: 'TikTok',
                },
              ].map(s => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-[#D4B483] hover:border-[#D4B483]/50 transition-all duration-200"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <p className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#D4B483] mb-5">Company</p>
            <ul className="flex flex-col gap-3">
              {[
                { label: 'About Us', path: '/about' },
                { label: 'Careers', path: '/' },
                { label: 'Contact Us', path: '/contact' },
                { label: 'Press', path: '/' },
              ].map(l => (
                <li key={l.label}>
                  <Link to={l.path} className="text-white/50 text-sm hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <p className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#D4B483] mb-5">Support</p>
            <ul className="flex flex-col gap-3">
              {['Shipping', 'Returns', 'FAQs', 'Track Order'].map(l => (
                <li key={l}>
                  <Link to="/" className="text-white/50 text-sm hover:text-white transition-colors">{l}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#D4B483] mb-5">Legal</p>
            <ul className="flex flex-col gap-3">
              {['Privacy Policy', 'Terms & Conditions', 'Cookie Policy'].map(l => (
                <li key={l}>
                  <Link to="/" className="text-white/50 text-sm hover:text-white transition-colors">{l}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={`pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4`}>
          <p className="text-white/30 text-xs">
            © 2026 RUMI Skincare. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {['Visa', 'Mastercard', 'PayPal', 'Apple Pay'].map(p => (
              <span key={p} className="text-white/30 text-[10px] tracking-wider uppercase">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
