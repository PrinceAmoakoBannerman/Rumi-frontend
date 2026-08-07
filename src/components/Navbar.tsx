import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSearch, FiUser, FiHeart, FiShoppingBag, FiMenu, FiX, FiMoon, FiSun } from 'react-icons/fi'
import { useApp } from '../contexts/AppContext'

const navLinks = [
  { label: 'Shop', path: '/products' },
  { label: 'Collections', path: '/#collections' },
  { label: 'Ingredients', path: '/#ingredients' },
  { label: 'Skin Quiz', path: '/#quiz' },
  { label: 'Journal', path: '/#blog' },
]

export default function Navbar() {
  const { cartCount, wishlist, setCartOpen, searchOpen, setSearchOpen, searchQuery, setSearchQuery, darkMode, toggleDarkMode } = useApp()
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

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? darkMode
              ? 'bg-[#1C1916]/90 backdrop-blur-xl shadow-lg border-b border-[#3A3328]'
              : 'bg-[#FAF7F2]/90 backdrop-blur-xl shadow-sm border-b border-[#D4B483]/20'
            : 'bg-transparent'
        }`}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-12">
              {/* Logo */}
              <Link to="/" className="flex flex-col leading-none">
                <span
                  style={{ fontFamily: 'var(--font-display)', color: darkMode ? '#FAF7F2' : '#2A2A2A' }}
                  className="text-2xl font-semibold tracking-[0.15em]"
                >
                  RUMI
                </span>
                <span className="text-[9px] tracking-[0.35em] uppercase text-[#D4B483] font-medium">
                  Skincare
                </span>
              </Link>

              {/* Desktop nav */}
              <div className="hidden lg:flex items-center gap-8">
                {navLinks.map(link => (
                  <Link
                    key={link.label}
                    to={link.path}
                    className="text-xs tracking-[0.12em] uppercase font-medium text-[#2A2A2A] hover:text-[#D4B483] transition-colors duration-200"
                    style={{ color: darkMode ? '#FAF7F2' : undefined }}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Icons */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="flex items-center gap-2 h-10 px-3 rounded-full hover:bg-[#D4B483]/10 transition-colors"
                aria-label="Search"
              >
                <FiSearch size={18} className={darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'} />
                <span className={`hidden lg:inline text-xs tracking-[0.12em] uppercase font-medium ${darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'}`}>
                  Search
                </span>
              </button>
              <button
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#D4B483]/10 transition-colors hidden sm:flex"
                aria-label="Account"
              >
                <FiUser size={18} className={darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'} />
              </button>
              <button
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#D4B483]/10 transition-colors relative hidden sm:flex"
                aria-label="Wishlist"
              >
                <FiHeart size={18} className={darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'} />
                {wishlist.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#D4B483] rounded-full text-[9px] text-white font-semibold flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setCartOpen(true)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#D4B483]/10 transition-colors relative"
                aria-label="Cart"
              >
                <FiShoppingBag size={18} className={darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'} />
                {cartCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#D4B483] rounded-full text-[9px] text-white font-semibold flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
              <button
                onClick={toggleDarkMode}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#D4B483]/10 transition-colors"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <FiSun size={18} className="text-[#FAF7F2]" /> : <FiMoon size={18} className="text-[#2A2A2A]" />}
              </button>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#D4B483]/10 transition-colors lg:hidden"
                aria-label="Menu"
              >
                {mobileOpen ? <FiX size={20} className={darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'} /> : <FiMenu size={20} className={darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'} />}
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
            className={`fixed top-20 left-0 right-0 z-40 px-6 py-6 ${darkMode ? 'bg-[#1C1916]/95 backdrop-blur-xl border-b border-[#3A3328]' : 'bg-[#FAF7F2]/95 backdrop-blur-xl border-b border-[#D4B483]/20'}`}
          >
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex gap-3">
              <input
                autoFocus
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search for serums, moisturizers, ingredients..."
                className={`flex-1 bg-transparent border-b-2 border-[#D4B483] text-base px-3 py-2 outline-none placeholder-[#D4B483]/50 ${darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'}`}
              />
              <button
                type="submit"
                className="bg-[#D4B483] text-white px-6 py-2 text-sm tracking-widest uppercase font-medium hover:bg-[#B8965E] transition-colors rounded"
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
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.35 }}
            className={`fixed inset-y-0 right-0 z-50 w-80 max-w-[85vw] ${darkMode ? 'bg-[#1C1916]' : 'bg-[#FAF7F2]'} shadow-2xl flex flex-col pt-24 px-8`}
          >
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-6 right-6"
            >
              <FiX size={24} className={darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'} />
            </button>
            <div className="flex flex-col gap-6">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setMobileOpen(false)}
                    className={`text-sm tracking-[0.15em] uppercase font-medium hover:text-[#D4B483] transition-colors ${darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'}`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="mt-auto pb-10 flex items-center gap-4">
              <button onClick={toggleDarkMode} className="flex items-center gap-2 text-xs text-[#D4B483]">
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
