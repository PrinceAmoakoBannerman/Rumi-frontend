import { Link, useLocation } from 'react-router-dom'
import { FiHome, FiGrid, FiShoppingBag, FiUser } from 'react-icons/fi'
import { useApp } from '../contexts/AppContext'

export default function MobileBottomNav() {
  const { darkMode, cartCount, setCartOpen } = useApp()
  const { pathname } = useLocation()

  const itemClass = (active: boolean) =>
    `flex flex-col items-center justify-center gap-1 flex-1 py-2 text-[10px] tracking-wide transition-colors ${
      active ? 'text-[#D3839E]' : darkMode ? 'text-[#FAF7F2]/60' : 'text-[#4A4A4A]'
    }`

  return (
    <nav
      className={`md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-stretch border-t ${
        darkMode ? 'bg-[#1C1916]/95 border-[#3A3328]' : 'bg-white/95 border-[#EDE4D6]'
      } backdrop-blur-xl`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <Link to="/" className={itemClass(pathname === '/')}>
        <FiHome size={19} />
        Home
      </Link>
      <Link to="/products" className={itemClass(pathname.startsWith('/products'))}>
        <FiGrid size={19} />
        Shop
      </Link>
      <button onClick={() => setCartOpen(true)} className={itemClass(false)}>
        <span className="relative">
          <FiShoppingBag size={19} />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-[#D3839E] rounded-full text-[9px] text-white font-semibold flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </span>
        Cart
      </button>
      <Link to="/contact" className={itemClass(pathname === '/contact')}>
        <FiUser size={19} />
        Contact
      </Link>
    </nav>
  )
}
