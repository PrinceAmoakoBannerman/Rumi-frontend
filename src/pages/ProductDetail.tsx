import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiHeart, FiShoppingBag, FiArrowLeft, FiZoomIn, FiX, FiMinus, FiPlus } from 'react-icons/fi'
import ProductCard from '../components/ProductCard'
import { products } from '../data/products'
import { useApp } from '../contexts/AppContext'
import type { Review } from '../contexts/AppContext'
import { formatPrice, formatProductPrice, PLACEHOLDER_IMAGE } from '../lib/currency'

const tabs = ['Description', 'Ingredients', 'Usage', 'Reviews']

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {[1,2,3,4,5].map(s => (
          <span key={s} className={s <= Math.round(rating) ? 'star-filled text-lg' : 'star-empty text-lg'}>★</span>
        ))}
      </div>
      <span className="text-sm text-[#D3839E] font-medium">{rating}</span>
      <span className="text-xs text-[#4A4A4A]/60">({count} reviews)</span>
    </div>
  )
}

export default function ProductDetail() {
  const { id } = useParams()
  const { darkMode, addToCart, toggleWishlist, wishlist, addRecentlyViewed, recentlyViewed } = useApp()
  const product = products.find(p => p.id === Number(id))
  const [activeImg, setActiveImg] = useState(0)
  const [qty, setQty] = useState(1)
  const [activeTab, setActiveTab] = useState('Description')
  const [lightbox, setLightbox] = useState(false)
  const [myReviews, setMyReviews] = useState<Review[]>([])
  const [reviewForm, setReviewForm] = useState({ name: '', rating: 5, text: '' })
  const [showReviewForm, setShowReviewForm] = useState(false)

  useEffect(() => {
    if (product) addRecentlyViewed(product.id)
    setActiveImg(0)
    setMyReviews([])
    setShowReviewForm(false)
    setReviewForm({ name: '', rating: 5, text: '' })
  }, [id])

  if (!product) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-[#1C1916]' : 'bg-[#FAF7F2]'}`}>
        <div className="text-center">
          <p className={`text-lg ${darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'}`}>Product not found.</p>
          <Link to="/products" className="text-[#D3839E] text-sm hover:underline mt-2 block">← Back to products</Link>
        </div>
      </div>
    )
  }

  const images = product.images || [product.image]
  const liked = wishlist.includes(product.id)
  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4)
  const recentProducts = products.filter(p => recentlyViewed.includes(p.id) && p.id !== product.id).slice(0, 4)
  const allReviews = [...myReviews, ...(product.reviews || [])]

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!reviewForm.name.trim() || !reviewForm.text.trim()) return
    setMyReviews(prev => [
      { id: Date.now(), name: reviewForm.name.trim(), rating: reviewForm.rating, text: reviewForm.text.trim(), date: 'Just now' },
      ...prev,
    ])
    setReviewForm({ name: '', rating: 5, text: '' })
    setShowReviewForm(false)
  }

  return (
    <div className={`min-h-screen pt-[180px] pb-24 ${darkMode ? 'bg-[#1C1916]' : 'bg-white'}`}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-10 text-xs">
          <Link to="/" className={`hover:text-[#D3839E] transition-colors ${darkMode ? 'text-[#FAF7F2]/40' : 'text-[#4A4A4A]/60'}`}>Home</Link>
          <span className="text-[#D3839E]/40">/</span>
          <Link to="/products" className={`hover:text-[#D3839E] transition-colors ${darkMode ? 'text-[#FAF7F2]/40' : 'text-[#4A4A4A]/60'}`}>Products</Link>
          <span className="text-[#D3839E]/40">/</span>
          <span className={`${darkMode ? 'text-[#FAF7F2]/60' : 'text-[#4A4A4A]'}`}>{product.name}</span>
        </div>

        {/* Main grid */}
        {/* min-w-0 on the children: grid items default to min-width:auto and
            otherwise refuse to shrink below their content, overflowing phones */}
        <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 [&>*]:min-w-0">
          {/* Gallery */}
          <div>
            {/* Main image */}
            <div className="relative rounded-3xl overflow-hidden aspect-square mb-4 group bg-white border border-[#EDE4D6]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImg}
                  src={images[activeImg]}
                  alt={product.name}
                  onError={e => { (e.currentTarget as HTMLImageElement).src = PLACEHOLDER_IMAGE }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full object-contain p-8"
                />
              </AnimatePresence>
              <button
                onClick={() => setLightbox(true)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/80 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <FiZoomIn size={16} className="text-[#2A2A2A]" />
              </button>
              {product.badge && (
                <span className="absolute top-4 left-4 bg-[#D3839E] text-white text-[10px] tracking-widest uppercase font-semibold px-3 py-1.5 rounded-full">
                  {product.badge}
                </span>
              )}
            </div>
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 bg-white transition-all ${activeImg === i ? 'border-[#D3839E]' : darkMode ? 'border-[#3A3328]' : 'border-[#EDE4D6]'}`}
                  >
                    <img
                      src={img}
                      alt=""
                      onError={e => { (e.currentTarget as HTMLImageElement).src = PLACEHOLDER_IMAGE }}
                      className="w-full h-full object-contain p-1.5"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-[#D3839E] text-xs tracking-[0.3em] uppercase font-medium mb-2">
                {product.brand} · {product.category}
              </p>
              <h1
                style={{ fontFamily: 'var(--font-display)' }}
                className={`text-3xl md:text-4xl font-medium leading-tight mb-4 ${darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'}`}
              >
                {product.name}
              </h1>
              {product.reviewCount > 0 && <StarRating rating={product.rating} count={product.reviewCount} />}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className={`text-3xl font-semibold ${darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'}`}>
                {formatProductPrice(product.price)}
              </span>
              {product.originalPrice && product.price > 0 && (
                <>
                  <span className={`text-xl line-through ${darkMode ? 'text-[#FAF7F2]/30' : 'text-[#4A4A4A]/40'}`}>{formatPrice(product.originalPrice)}</span>
                  <span className="bg-[#D3839E]/15 text-[#B85E75] text-xs font-semibold px-2.5 py-1 rounded-full">
                    Save {formatPrice(product.originalPrice - product.price)}
                  </span>
                </>
              )}
            </div>

            {/* Stock + size */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
              {product.size && (
                <span className={darkMode ? 'text-[#FAF7F2]/60' : 'text-[#4A4A4A]'}>Size: {product.size}</span>
              )}
              {product.stock === 0 ? (
                <span className="font-medium text-[#4A4A4A]/60">Out of stock</span>
              ) : product.stock <= 5 ? (
                <span className="font-medium text-[#B85E75]">Only {product.stock} left in stock</span>
              ) : (
                <span className="font-medium text-green-600">In stock</span>
              )}
            </div>

            {/* Short description */}
            <p className={`text-sm leading-relaxed ${darkMode ? 'text-[#FAF7F2]/70' : 'text-[#4A4A4A]'}`}>
              {product.description.split('.')[0]}.
            </p>

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <span className={`text-xs tracking-[0.2em] uppercase font-medium ${darkMode ? 'text-[#FAF7F2]/60' : 'text-[#4A4A4A]'}`}>Qty</span>
              <div className={`flex items-center rounded-full border ${darkMode ? 'border-[#3A3328]' : 'border-[#EDE4D6]'}`}>
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  className={`w-11 h-11 flex items-center justify-center rounded-l-full hover:bg-[#D3839E]/10 transition-colors ${darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'}`}
                >
                  <FiMinus size={14} />
                </button>
                <span className={`w-12 text-center text-base font-medium ${darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'}`}>{qty}</span>
                <button
                  onClick={() => setQty(q => q + 1)}
                  className={`w-11 h-11 flex items-center justify-center rounded-r-full hover:bg-[#D3839E]/10 transition-colors ${darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'}`}
                >
                  <FiPlus size={14} />
                </button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => addToCart(product, qty)}
                className="flex-1 bg-[#2A2A2A] hover:bg-[#D3839E] text-white text-xs tracking-[0.2em] uppercase font-semibold py-4 rounded-full transition-all duration-300 flex items-center justify-center gap-2"
              >
                <FiShoppingBag size={14} />
                Add to Cart
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                className="flex-1 bg-[#D3839E] hover:bg-[#B85E75] text-white text-xs tracking-[0.2em] uppercase font-semibold py-4 rounded-full transition-all duration-300"
              >
                Buy Now
              </motion.button>
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${liked ? 'bg-[#D3839E] border-[#D3839E] text-white' : darkMode ? 'border-[#3A3328] text-[#FAF7F2]' : 'border-[#EDE4D6] text-[#2A2A2A]'}`}
              >
                <FiHeart size={18} />
              </button>
            </div>

            {/* Trust signals */}
            <div className={`flex flex-wrap gap-4 text-xs ${darkMode ? 'text-[#FAF7F2]/40' : 'text-[#4A4A4A]/60'}`}>
              {['✓ 100% authentic products', '✓ Nationwide delivery in Ghana', '✓ WhatsApp support before you buy'].map(t => (
                <span key={t}>{t}</span>
              ))}
            </div>

            {/* Tabs */}
            <div className={`border-t pt-6 ${darkMode ? 'border-[#3A3328]' : 'border-[#EDE4D6]'}`}>
              <div className="flex gap-6 mb-6 border-b overflow-x-auto pb-px" style={{ borderColor: darkMode ? '#3A3328' : '#EDE4D6' }}>
                {tabs.map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`text-xs tracking-[0.15em] uppercase font-medium pb-3 border-b-2 whitespace-nowrap transition-all ${
                      activeTab === tab
                        ? 'border-[#D3839E] text-[#D3839E]'
                        : `border-transparent ${darkMode ? 'text-[#FAF7F2]/40 hover:text-[#FAF7F2]/70' : 'text-[#4A4A4A]/50 hover:text-[#4A4A4A]'}`
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === 'Description' && (
                    <p className={`text-sm leading-relaxed ${darkMode ? 'text-[#FAF7F2]/70' : 'text-[#4A4A4A]'}`}>{product.description}</p>
                  )}
                  {activeTab === 'Ingredients' && (
                    <ul className="flex flex-col gap-2">
                      {product.ingredients.map((ing, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D3839E] flex-shrink-0" />
                          <span className={`text-sm ${darkMode ? 'text-[#FAF7F2]/70' : 'text-[#4A4A4A]'}`}>{ing}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {activeTab === 'Usage' && (
                    <p className={`text-sm leading-relaxed ${darkMode ? 'text-[#FAF7F2]/70' : 'text-[#4A4A4A]'}`}>{product.usage}</p>
                  )}
                  {activeTab === 'Reviews' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs ${darkMode ? 'text-[#FAF7F2]/50' : 'text-[#4A4A4A]/70'}`}>
                          {allReviews.length} {allReviews.length === 1 ? 'review' : 'reviews'}
                        </span>
                        <button
                          onClick={() => setShowReviewForm(s => !s)}
                          className="text-[#D3839E] text-xs tracking-widest uppercase font-medium hover:underline"
                        >
                          {showReviewForm ? 'Cancel' : 'Write a Review'}
                        </button>
                      </div>

                      <AnimatePresence>
                        {showReviewForm && (
                          <motion.form
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            onSubmit={handleReviewSubmit}
                            className={`overflow-hidden rounded-2xl border p-4 flex flex-col gap-3 ${darkMode ? 'border-[#3A3328] bg-[#252018]' : 'border-[#EDE4D6] bg-white'}`}
                          >
                            <div className="grid sm:grid-cols-2 gap-3">
                              <input
                                required
                                placeholder="Your name"
                                value={reviewForm.name}
                                onChange={e => setReviewForm(f => ({ ...f, name: e.target.value }))}
                                className={`bg-transparent border-b text-sm py-2 outline-none focus:border-[#D3839E] ${darkMode ? 'border-[#3A3328] text-[#FAF7F2] placeholder-[#FAF7F2]/30' : 'border-[#EDE4D6] text-[#2A2A2A] placeholder-[#4A4A4A]/40'}`}
                              />
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map(s => (
                                  <button
                                    key={s}
                                    type="button"
                                    onClick={() => setReviewForm(f => ({ ...f, rating: s }))}
                                    className={s <= reviewForm.rating ? 'star-filled text-lg' : 'star-empty text-lg'}
                                    aria-label={`Rate ${s} stars`}
                                  >
                                    ★
                                  </button>
                                ))}
                              </div>
                            </div>
                            <textarea
                              required
                              rows={3}
                              placeholder="Share your experience with this product…"
                              value={reviewForm.text}
                              onChange={e => setReviewForm(f => ({ ...f, text: e.target.value }))}
                              className={`bg-transparent border-b text-sm py-2 outline-none focus:border-[#D3839E] resize-none ${darkMode ? 'border-[#3A3328] text-[#FAF7F2] placeholder-[#FAF7F2]/30' : 'border-[#EDE4D6] text-[#2A2A2A] placeholder-[#4A4A4A]/40'}`}
                            />
                            <button
                              type="submit"
                              className="self-start bg-[#D3839E] hover:bg-[#B85E75] text-white text-xs tracking-[0.15em] uppercase font-semibold px-6 py-2.5 rounded-full transition-colors"
                            >
                              Submit Review
                            </button>
                          </motion.form>
                        )}
                      </AnimatePresence>

                      {allReviews.length === 0 ? (
                        <p className={`text-sm ${darkMode ? 'text-[#FAF7F2]/50' : 'text-[#4A4A4A]/60'}`}>
                          No reviews yet — be the first to share your experience.
                        </p>
                      ) : (
                        allReviews.map(r => (
                          <div key={r.id} className={`p-4 rounded-2xl border ${darkMode ? 'border-[#3A3328] bg-[#252018]' : 'border-[#EDE4D6] bg-white'}`}>
                            <div className="flex items-center justify-between mb-2">
                              <span className={`font-medium text-sm ${darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'}`}>{r.name}</span>
                              <span className={`text-xs ${darkMode ? 'text-[#FAF7F2]/30' : 'text-[#4A4A4A]/40'}`}>{r.date}</span>
                            </div>
                            <div className="flex gap-0.5 mb-2">
                              {[...Array(r.rating)].map((_, s) => <span key={s} className="text-[#D3839E] text-sm">★</span>)}
                            </div>
                            <p className={`text-sm ${darkMode ? 'text-[#FAF7F2]/60' : 'text-[#4A4A4A]'}`}>{r.text}</p>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-20">
            <h2 style={{ fontFamily: 'var(--font-display)' }} className={`text-3xl font-medium mb-8 ${darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'}`}>
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}

        {/* Recently viewed */}
        {recentProducts.length > 0 && (
          <div className="mt-20">
            <h2 style={{ fontFamily: 'var(--font-display)' }} className={`text-3xl font-medium mb-8 ${darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'}`}>
              Recently Viewed
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {recentProducts.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(false)}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-8"
          >
            <button
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              onClick={() => setLightbox(false)}
            >
              <FiX size={18} />
            </button>
            <img
              src={images[activeImg]}
              alt={product.name}
              className="max-w-full max-h-full object-contain rounded-2xl"
              onClick={e => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
