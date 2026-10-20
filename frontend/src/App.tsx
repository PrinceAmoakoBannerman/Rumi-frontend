import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './contexts/AppContext'
import Navbar from './components/Navbar'
import AnnouncementBar from './components/AnnouncementBar'
import SearchBar from './components/SearchBar'
import Cart from './components/Cart'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import SignIn from './pages/SignIn'
import Account from './pages/Account'
import Checkout from './pages/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'
import About from './pages/About'
import Contact from './pages/Contact'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <ScrollToTop />
        <AnnouncementBar />
        <Navbar />
        <SearchBar />
        <Cart />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignIn joining />} />
          <Route path="/account" element={<Account />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </AppProvider>
  )
}
