import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { FiInstagram, FiYoutube, FiFacebook, FiChevronDown, FiCheck, FiArrowRight } from 'react-icons/fi'
import { useApp } from '../contexts/AppContext'
import { store, whatsappLink } from '../data/store'
import { joinEarlyAccess } from '../lib/earlyAccess'
import logo from '../assets/logo.png'

/** A small round Ghana flag, drawn so it looks the same on every device. */
function GhanaFlag({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <clipPath id="gh-circle"><circle cx="12" cy="12" r="12" /></clipPath>
      </defs>
      <g clipPath="url(#gh-circle)">
        <rect width="24" height="8" y="0" fill="#CE1126" />
        <rect width="24" height="8" y="8" fill="#FCD116" />
        <rect width="24" height="8" y="16" fill="#006B3F" />
        <path
          d="M12 8.6 12.78 10.92 15.23 10.95 13.27 12.41 14 14.75 12 13.33 10 14.75 10.73 12.41 8.77 10.95 11.22 10.92Z"
          fill="#000"
        />
      </g>
    </svg>
  )
}

/**
 * One footer section. On a phone it is a tap-to-open accordion; from large
 * screens up it is a plain column — the toggle and the dividing line fall away,
 * and the links are simply shown.
 */
function Section({
  title,
  defaultOpen = false,
  darkMode,
  children,
}: {
  title: string
  defaultOpen?: boolean
  darkMode: boolean
  children: ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className={`border-t lg:border-t-0 ${darkMode ? 'border-[#2E2820]' : 'border-[#E7DCCB]'}`}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full relative flex items-center justify-center lg:justify-start py-5 lg:py-0 lg:pointer-events-none"
        aria-expanded={open}
      >
        <span className={`text-[11px] tracking-[0.3em] uppercase font-semibold ${darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'}`}>
          {title}
        </span>
        <FiChevronDown
          size={18}
          className={`lg:hidden absolute right-1 transition-transform duration-300 ${open ? 'rotate-180' : ''} ${
            darkMode ? 'text-[#FAF7F2]/55' : 'text-[#2A2A2A]/45'
          }`}
        />
      </button>
      <div className={`${open ? 'block' : 'hidden'} lg:block pb-6 lg:pb-0 lg:mt-5`}>{children}</div>
    </div>
  )
}

/** The newsletter sign-up inside the footer — posts to the early-access list. */
function SignUp({ darkMode }: { darkMode: boolean }) {
  const [email, setEmail] = useState('')
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const [err, setErr] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || busy) return
    setBusy(true)
    setErr('')
    try {
      await joinEarlyAccess(email.trim(), 'newsletter')
      setDone(true)
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : 'Please try again in a moment.')
    } finally {
      setBusy(false)
    }
  }

  if (done) {
    return (
      <p className={`flex items-center justify-center lg:justify-start gap-2 text-sm ${darkMode ? 'text-[#FAF7F2]/80' : 'text-[#2A2A2A]'}`}>
        <span className="w-5 h-5 rounded-full bg-[#D3839E] flex items-center justify-center">
          <FiCheck size={12} className="text-white" />
        </span>
        You&apos;re subscribed — thank you!
      </p>
    )
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-2.5">
      <p className={`text-[13px] leading-relaxed text-center lg:text-left ${darkMode ? 'text-[#FAF7F2]/55' : 'text-[#5A5A5A]'}`}>
        First word on new drops, restocks and offers.
      </p>
      <div
        className={`flex items-center h-11 rounded-full border overflow-hidden pl-4 pr-1.5 ${
          darkMode ? 'bg-[#1C1916] border-[#3A3328] focus-within:border-[#D3839E]' : 'bg-white border-[#E7DCCB] focus-within:border-[#D3839E]'
        }`}
      >
        <input
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Your email"
          className={`flex-1 min-w-0 bg-transparent text-sm outline-none ${
            darkMode ? 'text-[#FAF7F2] placeholder-[#FAF7F2]/35' : 'text-[#2A2A2A] placeholder-[#2A2A2A]/35'
          }`}
        />
        <button
          type="submit"
          disabled={busy}
          aria-label="Subscribe"
          className="shrink-0 w-8 h-8 rounded-full bg-[#2A2A2A] hover:bg-[#B85E75] disabled:opacity-60 text-white flex items-center justify-center transition-colors"
        >
          <FiArrowRight size={15} />
        </button>
      </div>
      {err && <p className="text-xs text-[#C0392B] text-center lg:text-left">{err}</p>}
    </form>
  )
}

export default function Footer() {
  const { darkMode } = useApp()

  const aboutLinks = [
    { label: 'About us', to: '/about' },
    { label: 'Contact us', to: '/contact' },
    { label: 'Shop all', to: '/products' },
    { label: 'Privacy policy', to: '/privacy' },
    { label: 'Terms & conditions', to: '/terms' },
  ]
  const helpLinks: { label: string; to?: string; href?: string }[] = [
    { label: 'Track your order', to: '/account' },
    { label: 'Shipping & returns', to: '/contact' },
    { label: 'FAQs', to: '/contact' },
    { label: 'WhatsApp us', href: whatsappLink },
  ]

  const payments = [
    { label: 'MTN MoMo', bg: '#FFCB05', fg: '#1A1A1A' },
    { label: 'Telecel Cash', bg: '#E2241A', fg: '#FFFFFF' },
    { label: 'AT Money', bg: '#0A6FB5', fg: '#FFFFFF' },
    { label: 'VISA', bg: '#1A1F71', fg: '#FFFFFF', italic: true },
    { label: 'Mastercard', bg: '#1A1A1A', fg: '#FFFFFF' },
  ]

  const linkClass = `text-sm transition-colors ${darkMode ? 'text-[#FAF7F2]/55 hover:text-[#FAF7F2]' : 'text-[#5A5A5A] hover:text-[#2A2A2A]'}`

  const socials = [
    { icon: <FiInstagram size={16} />, label: 'Instagram' },
    { icon: <FiFacebook size={16} />, label: 'Facebook' },
    { icon: <FiYoutube size={16} />, label: 'YouTube' },
    {
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.35 6.35 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.63a8.17 8.17 0 0 0 4.77 1.52V6.69a4.85 4.85 0 0 1-1-.01z" />
        </svg>
      ),
      label: 'TikTok',
    },
  ]

  return (
    <footer className={`border-t ${darkMode ? 'bg-[#141210] border-[#2E2820]' : 'bg-[#F5EFE6] border-[#E7DCCB]'}`}>
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12 pt-14 pb-10">
        {/* Brand */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="flex items-center gap-2.5 mb-4">
            <span className="h-11 w-11 rounded-full bg-white flex items-center justify-center overflow-hidden shrink-0 border border-[#E7DCCB]">
              <img src={logo} alt="" aria-hidden="true" className="h-9 w-9 object-contain" />
            </span>
            <span className="flex flex-col leading-none items-start">
              <span style={{ fontFamily: 'var(--font-display)' }} className={`text-lg font-semibold tracking-[0.06em] ${darkMode ? 'text-white' : 'text-[#2A2A2A]'}`}>
                GLOWWITHRUMI
              </span>
              <span className="text-[9px] tracking-[0.35em] uppercase text-[#D3839E] font-medium mt-1">Skincare &amp; Beauty</span>
            </span>
          </div>
          <p className={`text-sm leading-relaxed max-w-md ${darkMode ? 'text-[#FAF7F2]/55' : 'text-[#5A5A5A]'}`}>
            Skincare you can trust — our signature Rumi range and carefully chosen Korean and international favourites, delivered across Ghana.
          </p>
          <div className="flex gap-3 mt-6">
            {socials.map(s => (
              <a
                key={s.label}
                href="#"
                aria-label={s.label}
                className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-200 ${
                  darkMode
                    ? 'border-[#3A3328] text-[#FAF7F2]/55 hover:text-[#D3839E] hover:border-[#D3839E]/50'
                    : 'border-[#E0D4C2] text-[#5A5A5A] hover:text-[#B85E75] hover:border-[#D3839E]/60'
                }`}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Sections — accordions on a phone, four columns from large up */}
        <div className="grid lg:grid-cols-4 lg:gap-10 border-b lg:border-b-0 lg:border-t border-[#E7DCCB] lg:pt-12 mb-10">
          <Section title="More about us" defaultOpen darkMode={darkMode}>
            <ul className="flex flex-col gap-3 text-center lg:text-left">
              {aboutLinks.map(l => (
                <li key={l.label}>
                  <Link to={l.to} className={linkClass}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Extra help" darkMode={darkMode}>
            <ul className="flex flex-col gap-3 text-center lg:text-left">
              {helpLinks.map(l => (
                <li key={l.label}>
                  {l.href ? (
                    <a href={l.href} target="_blank" rel="noopener noreferrer" className={linkClass}>{l.label}</a>
                  ) : (
                    <Link to={l.to!} className={linkClass}>{l.label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Delivery options" darkMode={darkMode}>
            <ul className={`flex flex-col gap-3 text-center lg:text-left text-sm ${darkMode ? 'text-[#FAF7F2]/55' : 'text-[#5A5A5A]'}`}>
              <li>Nationwide, all 16 regions</li>
              <li>Express &amp; priority available</li>
              <li>Pay with MoMo or card</li>
              <li>Fast, tracked &amp; reliable</li>
            </ul>
          </Section>

          <Section title="Sign up and save" darkMode={darkMode}>
            <SignUp darkMode={darkMode} />
          </Section>
        </div>

        {/* Language / region */}
        <div className={`flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mb-8 text-sm ${darkMode ? 'text-[#FAF7F2]/70' : 'text-[#2A2A2A]'}`}>
          <span>English</span>
          <span className="flex items-center gap-2">
            <GhanaFlag size={18} />
            Ghana (GH₵)
          </span>
        </div>

        {/* Payment badges */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-10">
          {payments.map(p => (
            <span
              key={p.label}
              className="px-3.5 py-1.5 rounded-lg text-[11px] font-bold tracking-wide shadow-sm"
              style={{ background: p.bg, color: p.fg, fontStyle: p.italic ? 'italic' : 'normal' }}
            >
              {p.label}
            </span>
          ))}
        </div>

        {/* Copyright */}
        <div className={`pt-7 border-t text-center ${darkMode ? 'border-[#2E2820]' : 'border-[#E7DCCB]'}`}>
          <p className={`text-xs ${darkMode ? 'text-[#FAF7F2]/40' : 'text-[#2A2A2A]/45'}`}>
            © {new Date().getFullYear()} {store.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
