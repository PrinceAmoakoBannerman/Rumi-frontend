import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSearch, FiUser, FiHeart, FiShoppingBag, FiMenu, FiX, FiMoon, FiSun } from 'react-icons/fi'
import { useApp } from '../contexts/AppContext'
import { formatPrice } from '../lib/currency'
import logo from '../assets/logo.png'

const navLinks = [
  { label: 'Shop', path: '/products' },
  { label: 'Skin Quiz', path: '/#quiz' },
  { label: 'Journal', path: '/#blog' },
]

export default function Navbar() {
  const { cartCount, cartTotal, wishlist, setCartOpen, searchOpen, setSearchOpen, searchQuery, setSearchQuery, darkMode, toggleDarkMode } = useApp()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
    }
  }

  // The logo artwork has a solid white background, so the bar stays white in
  // both themes — that is what lets the logo sit on it with no visible edge.
  const iconColor = 'text-[#2A2A2A]'

  return (
    <>
      <motion.nav
        className={`fixed top-9 left-0 right-0 z-50 bg-white transition-shadow duration-300 ${
          scrolled ? 'shadow-md' : 'shadow-sm'
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
                onClick={() => setSearchOpen(!searchOpen)}
                className="flex items-center gap-2 h-10 px-2.5 rounded-full hover:bg-[#D3839E]/10 transition-colors"
                aria-label="Search"
              >
                <FiSearch size={18} className={iconColor} />
                <span className={`hidden xl:inline text-xs tracking-[0.12em] uppercase font-medium ${iconColor}`}>
                  Search
                </span>
              </button>
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
                <span className={`hidden xl:inline text-xs font-medium tabular-nums ${iconColor}`}>
                  {formatPrice(cartTotal)}
                </span>
              </button>
              <button
                onClick={toggleDarkMode}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#D3839E]/10 transition-colors"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <FiSun size={18} className={iconColor} /> : <FiMoon size={18} className={iconColor} />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-[116px] left-0 right-0 z-40 px-6 py-6 bg-white shadow-md"
          >
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex gap-3">
              <input
                autoFocus
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by product or brand — Anua, COSRX, sunscreen..."
                className="flex-1 bg-transparent border-b-2 border-[#D3839E] text-base px-3 py-2 outline-none placeholder-[#D3839E]/50 text-[#2A2A2A]"
              />
              <button
                type="submit"
                className="bg-[#D3839E] text-white px-6 py-2 text-sm tracking-widest uppercase font-medium hover:bg-[#B85E75] transition-colors rounded"
              >
                Search
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.35 }}
            className={`fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] ${darkMode ? 'bg-[#1C1916]' : 'bg-[#FAF7F2]'} shadow-2xl flex flex-col pt-24 px-8`}
          >
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-6 right-6"
              aria-label="Close menu"
            >
              <FiX size={24} className={darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'} />
            </button>
            <div className="flex flex-col gap-6">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setMobileOpen(false)}
                    className={`text-sm tracking-[0.15em] uppercase font-medium hover:text-[#D3839E] transition-colors ${darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'}`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="mt-auto pb-10 flex items-center gap-4">
              <button onClick={toggleDarkMode} className="flex items-center gap-2 text-xs text-[#D3839E]">
                {darkMode ? <FiSun size={16} /> : <FiMoon size={16} />}
                {darkMode ? 'Light mode' : 'Dark mode'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
