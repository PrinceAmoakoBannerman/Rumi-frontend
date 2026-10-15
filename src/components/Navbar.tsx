import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiUser, FiHeart, FiShoppingBag, FiMenu, FiX, FiHome, FiGrid, FiSearch, FiMail } from 'react-icons/fi'
import { useApp } from '../contexts/AppContext'
import { formatPrice } from '../lib/currency'
import logo from '../assets/logo.png'

const navLinks = [
  { label: 'Shop', path: '/products' },
  { label: 'Skin Quiz', path: '/#quiz' },
  { label: 'Journal', path: '/#blog' },
]

const drawerLinks = [
  { label: 'Home', path: '/', icon: <FiHome size={16} /> },
  { label: 'Shop', path: '/products', icon: <FiGrid size={16} /> },
  { label: 'Skin Quiz', path: '/#quiz', icon: null },
  { label: 'Journal', path: '/#blog', icon: null },
  { label: 'Wishlist', path: '/products', icon: <FiHeart size={16} /> },
  { label: 'Contact', path: '/contact', icon: <FiMail size={16} /> },
  { label: 'About Us', path: '/about', icon: null },
]

export default function Navbar() {
  const { cartCount, cartTotal, wishlist, setCartOpen, searchQuery, setSearchQuery } = useApp()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock background scrolling while the drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const handleDrawerSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const q = searchQuery.trim()
    setMobileOpen(false)
    navigate(q ? `/products?q=${encodeURIComponent(q)}` : '/products')
  }

  // The logo artwork has a solid white background, so the bar stays white in
  // both themes — that is what lets the logo sit on it with no visible edge.
  const iconColor = 'text-[#2A2A2A]'

  return (
    <>
      <motion.nav
        className={`fixed top-9 left-0 right-0 z-50 bg-white transition-shadow duration-300 ${
          scrolled ? 'shadow-md' : ''
        }`}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center h-20 gap-2">
            {/* Left — nav links (desktop) / menu button (mobile) */}
            <div className="flex items-center justify-start">
              <div className="hidden lg:flex items-center gap-7">
                {navLinks.map(link => (
                  <Link
                    key={link.label}
                    to={link.path}
                    className="text-xs tracking-[0.12em] uppercase font-medium text-[#2A2A2A] hover:text-[#D3839E] transition-colors duration-200 whitespace-nowrap"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#D3839E]/10 transition-colors lg:hidden"
                aria-label="Menu"
              >
                {mobileOpen ? <FiX size={20} className={iconColor} /> : <FiMenu size={20} className={iconColor} />}
              </button>
            </div>

            {/* Centre — logo lockup */}
            <Link to="/" className="flex items-center gap-2.5 justify-self-center leading-none">
              <img src={logo} alt="" aria-hidden="true" className="h-11 w-auto shrink-0" />
              <span className="flex flex-col">
                <span
                  style={{ fontFamily: 'var(--font-display)' }}
                  className="text-base sm:text-lg font-semibold tracking-[0.08em] text-[#2A2A2A] whitespace-nowrap"
                >
                  GLOWWITHRUMI
                </span>
                <span className="text-[8px] sm:text-[9px] tracking-[0.3em] uppercase text-[#D3839E] font-medium">
                  Skincare &amp; Beauty
                </span>
              </span>
            </Link>

            {/* Right — actions */}
            <div className="flex items-center justify-end gap-0.5">
              <button
                className="w-10 h-10 items-center justify-center rounded-full hover:bg-[#D3839E]/10 transition-colors hidden sm:flex"
                aria-label="Account"
              >
                <FiUser size={18} className={iconColor} />
              </button>
              <button
                className="w-10 h-10 items-center justify-center rounded-full hover:bg-[#D3839E]/10 transition-colors relative hidden sm:flex"
                aria-label="Wishlist"
              >
                <FiHeart size={18} className={iconColor} />
                {wishlist.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#D3839E] rounded-full text-[9px] text-white font-semibold flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setCartOpen(true)}
                className="flex items-center gap-2 h-10 px-2.5 rounded-full hover:bg-[#D3839E]/10 transition-colors relative"
                aria-label={`Cart, ${cartCount} items, ${formatPrice(cartTotal)}`}
              >
                <span className="relative">
                  <FiShoppingBag size={18} className={iconColor} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-[#D3839E] rounded-full text-[9px] text-white font-semibold flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </span>
                <span className={`hidden lg:inline text-xs font-medium tabular-nums ${iconColor}`}>
                  {formatPrice(cartTotal)}
                </span>
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-50 bg-black/40 lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed inset-y-0 left-0 z-50 w-[78%] max-w-sm bg-white shadow-2xl flex flex-col lg:hidden"
            >
              <div className="flex justify-end px-5 py-4 border-b border-[#EDE4D6]">
                <button
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 text-sm font-medium text-[#2A2A2A]"
                  aria-label="Close menu"
                >
                  <FiX size={20} />
                  Close
                </button>
              </div>

              <form onSubmit={handleDrawerSearch} className="flex items-center gap-2 px-5 py-3 border-b border-[#EDE4D6]">
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search"
                  aria-label="Search for products"
                  className="flex-1 min-w-0 bg-transparent text-[#2A2A2A] placeholder-[#4A4A4A]/45 outline-none"
                />
                {searchQuery && (
                  <button type="button" onClick={() => setSearchQuery('')} aria-label="Clear search">
                    <FiX size={16} className="text-[#4A4A4A]/60" />
                  </button>
                )}
                <span className="w-px h-5 bg-[#EDE4D6]" />
                <button type="submit" aria-label="Search">
                  <FiSearch size={18} className="text-[#2A2A2A]" />
                </button>
              </form>

              <nav className="flex flex-col">
                {drawerLinks.map(link => (
                  <Link
                    key={link.label}
                    to={link.path}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-5 py-4 border-b border-[#EDE4D6] text-sm tracking-[0.1em] uppercase font-medium text-[#2A2A2A] active:bg-[#D3839E]/10 transition-colors"
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
