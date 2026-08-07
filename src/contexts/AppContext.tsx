import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

export interface Review {
  id: number
  name: string
  rating: number
  text: string
  date: string
}

export interface Product {
  id: number
  name: string
  category: string
  price: number
  originalPrice?: number
  rating: number
  reviewCount: number
  image: string
  images?: string[]
  badge?: string
  description: string
  ingredients: string[]
  usage: string
  isNew?: boolean
  isBestseller?: boolean
  reviews?: Review[]
}

export interface CartItem {
  product: Product
  quantity: number
}

interface AppContextType {
  // Cart
  cartItems: CartItem[]
  cartOpen: boolean
  setCartOpen: (open: boolean) => void
  addToCart: (product: Product, qty?: number) => void
  removeFromCart: (id: number) => void
  updateQty: (id: number, qty: number) => void
  clearCart: () => void
  cartTotal: number
  cartCount: number
  // Wishlist
  wishlist: number[]
  toggleWishlist: (id: number) => void
  // Dark mode
  darkMode: boolean
  toggleDarkMode: () => void
  // Search
  searchOpen: boolean
  setSearchOpen: (open: boolean) => void
  searchQuery: string
  setSearchQuery: (q: string) => void
  // Coupon
  coupon: string | null
  applyCoupon: (code: string) => boolean
  discount: number
  // Recently viewed
  recentlyViewed: number[]
  addRecentlyViewed: (id: number) => void
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [wishlist, setWishlist] = useState<number[]>([])
  const [darkMode, setDarkMode] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [coupon, setCoupon] = useState<string | null>(null)
  const [discount, setDiscount] = useState(0)
  const [recentlyViewed, setRecentlyViewed] = useState<number[]>([])

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark')
    } else {
      document.body.classList.remove('dark')
    }
  }, [darkMode])

  const addToCart = (product: Product, qty = 1) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.product.id === product.id)
      if (existing) {
        return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + qty } : i)
      }
      return [...prev, { product, quantity: qty }]
    })
    setCartOpen(true)
  }

  const removeFromCart = (id: number) => {
    setCartItems(prev => prev.filter(i => i.product.id !== id))
  }

  const updateQty = (id: number, qty: number) => {
    if (qty <= 0) { removeFromCart(id); return }
    setCartItems(prev => prev.map(i => i.product.id === id ? { ...i, quantity: qty } : i))
  }

  const clearCart = () => {
    setCartItems([])
    setCoupon(null)
    setDiscount(0)
  }

  const cartTotal = cartItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0)

  const toggleWishlist = (id: number) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const toggleDarkMode = () => setDarkMode(d => !d)

  const COUPONS: Record<string, number> = {
    RUMI10: 10,
    RUMI20: 20,
    WELCOME15: 15,
  }

  const applyCoupon = (code: string): boolean => {
    const pct = COUPONS[code.toUpperCase()]
    if (pct) {
      setCoupon(code.toUpperCase())
      setDiscount(pct)
      return true
    }
    return false
  }

  const addRecentlyViewed = (id: number) => {
    setRecentlyViewed(prev => [id, ...prev.filter(x => x !== id)].slice(0, 6))
  }

  return (
    <AppContext.Provider value={{
      cartItems, cartOpen, setCartOpen, addToCart, removeFromCart, updateQty, clearCart,
      cartTotal, cartCount,
      wishlist, toggleWishlist,
      darkMode, toggleDarkMode,
      searchOpen, setSearchOpen, searchQuery, setSearchQuery,
      coupon, applyCoupon, discount,
      recentlyViewed, addRecentlyViewed,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
