import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { products } from '../data/products'
import { whoAmI, signOut, type Account } from '../lib/auth'

export interface Review {
  id: number
  name: string
  rating: number
  text: string
  date: string
  /** A customer's photo of the product, if they added one. */
  photo?: string | null
}

export interface Product {
  id: number
  name: string
  brand: string
  category: string
  /** 0 means the price has not been set yet — the UI shows "Price on request". */
  price: number
  originalPrice?: number
  /** Units currently in stock. */
  stock: number
  size?: string
  rating: number
  reviewCount: number
  image: string
  images?: string[]
  badge?: string
  description: string
  ingredients: string[]
  /** The complete INCI list, as printed on the pack. Optional. */
  ingredientsText?: string
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
  // Account
  account: Account | null
  /** False until we have asked the backend who is signed in. */
  accountChecked: boolean
  setAccount: (account: Account | null) => void
  signOutNow: () => Promise<void>
}

const AppContext = createContext<AppContextType | null>(null)

/**
 * The basket, remembered between visits.
 *
 * It was held in React state alone, so a refresh — or being sent to Paystack
 * and back — emptied it. Only ids and quantities are stored; the products
 * themselves are matched against the live catalogue on the way back in, so a
 * basket can never show a stale price or something no longer stocked.
 */
const CART_KEY = 'gwr.cart.v1'

function loadCart(): { id: number; quantity: number }[] {
  try {
    const raw = localStorage.getItem(CART_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter(e => e && typeof e.id === 'number' && typeof e.quantity === 'number' && e.quantity > 0)
      .slice(0, 50)
  } catch {
    // Private browsing, cleared storage, or corrupt JSON. An empty basket is
    // the right answer; never let this stop the shop rendering.
    return []
  }
}

function saveCart(items: CartItem[]) {
  try {
    localStorage.setItem(
      CART_KEY,
      JSON.stringify(items.map(i => ({ id: i.product.id, quantity: i.quantity }))),
    )
  } catch {
    // Storage full or blocked — not worth interrupting the customer for.
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    // Resolve saved ids against the catalogue, which is already loaded by the
    // time this runs. Anything withdrawn since simply drops out.
    const saved = loadCart()
    if (!saved.length) return []
    return saved
      .map(entry => {
        const product = products.find(p => p.id === entry.id)
        return product ? { product, quantity: entry.quantity } : null
      })
      .filter((i): i is CartItem => i !== null)
  })

  useEffect(() => {
    saveCart(cartItems)
  }, [cartItems])

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
    GLOW10: 10,
    GLOW20: 20,
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

  // Ask the backend once who the stored token belongs to. A token kept from
  // a previous visit can have been signed out elsewhere or thrown away, so
  // it is never trusted on its own.
  const [account, setAccount] = useState<Account | null>(null)
  const [accountChecked, setAccountChecked] = useState(false)

  useEffect(() => {
    let active = true
    whoAmI()
      .then(who => active && setAccount(who))
      .finally(() => active && setAccountChecked(true))
    return () => {
      active = false
    }
  }, [])

  const signOutNow = async () => {
    await signOut()
    setAccount(null)
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
      account, accountChecked, setAccount, signOutNow,
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
