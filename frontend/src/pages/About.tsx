import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { IconType } from 'react-icons'
import { FiArrowRight, FiAward, FiFeather, FiTruck } from 'react-icons/fi'
import { LuRabbit } from 'react-icons/lu'
import { useApp, type Product } from '../contexts/AppContext'
import { products } from '../data/products'

// Four shelf favourites, looked up from the catalogue so the names and links
// stay correct if a product is renamed or removed.
const shelfIds = [1, 7, 10, 41]
const shelf = shelfIds.map(id => products.find(p => p.id === id)).filter(p => p !== undefined)

// What we stand for. Each value carries a line icon in the same weight as the
// rest of the shop — no emoji, which render differently on every device and
// cheapen an otherwise considered page.
const values: { Icon: IconType; title: string; text: string }[] = [
  {
    Icon: LuRabbit,
    title: 'Cruelty-Free',
    text: 'Never tested on animals — not by us, not by the brands we carry. Kindness is not a feature; it is the baseline.',
  },
  {
    Icon: FiAward,
    title: 'Chosen for Results',
    text: 'We stock what genuinely works. Every formula earns its place on real skin and in honest reviews, not in marketing claims.',
  },
  {
    Icon: FiFeather,
    title: 'Carefully Curated',
    text: 'From our own Rumi line to trusted Korean and global favourites, each product is hand-picked — so you never have to guess.',
  },
  {
    Icon: FiTruck,
    title: 'Nationwide Delivery',
    text: 'From our shelves to your door, anywhere in Ghana — tracked, dependable and covering all sixteen regions.',
  },
]

// Our own range, shown with the studio shots. The hero images are shipped with
// the shop, so these always load even before the catalogue does.
const signature = [
  {
    name: 'Glow Oil',
    image: '/hero/glow-oil.jpg',
    text: 'A lightweight brightening oil that leaves skin soft, even and lit from within.',
  },
  {
    name: 'Rumi Soap',
    image: '/hero/glow-soap.jpg',
    text: 'A deep-cleansing face and body soap, gentle enough to reach for every single day.',
  },
  {
    name: 'Body Scrub',
    image: '/hero/glow-scrub.jpg',
    text: 'A turmeric scrub that buffs away dullness for smooth, radiant skin head to toe.',
  },
]

/**
 * Real numbers only, read from the catalogue the shop actually loaded.
 *
 * Once there are approved reviews, the row leads with them — a true average,
 * the real count, and the genuine share rated four stars and up. Before any
 * reviews exist it shows honest facts about the range instead of inventing
 * praise, and switches over on its own the moment real reviews come in.
 */
function buildStats(catalogue: Product[]): { stat: string; label: string }[] {
  const allReviews = catalogue.flatMap(p => p.reviews ?? [])
  const count = allReviews.length

  if (count > 0) {
    const average = allReviews.reduce((sum, r) => sum + r.rating, 0) / count
    const happy = allReviews.filter(r => r.rating >= 4).length
    const recommend = Math.round((happy / count) * 100)
    return [
      { stat: average.toFixed(1), label: 'Average rating' },
      { stat: `${count}`, label: count === 1 ? 'Customer review' : 'Customer reviews' },
      { stat: `${recommend}%`, label: 'Rated 4★ & up' },
      { stat: '16', label: 'Regions covered' },
    ]
  }

  // No reviews yet — true facts about what we carry, nothing invented.
  const brands = new Set(catalogue.map(p => p.brand).filter(Boolean)).size
  return [
    { stat: `${catalogue.length}`, label: 'Products curated' },
    { stat: `${brands}`, label: 'Brands stocked' },
    { stat: '16', label: 'Regions covered' },
    { stat: '100%', label: 'Cruelty-free' },
  ]
}

export default function About() {
  const { darkMode } = useApp()
  const stats = buildStats(products)

  return (
    <div className={darkMode ? 'bg-[#1C1916]' : 'bg-[#FAF7F2]'}>
      {/* Hero */}
      <section className="relative overflow-hidden pt-[244px] pb-24 px-6 lg:px-12">
        {!darkMode && (
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(160deg, #FBF8F4 0%, #F5EFE6 50%, #F0C4D3 100%)' }}
          />
        )}
        <div className="absolute top-24 right-[8%] w-64 h-64 rounded-full border border-[#D3839E]/20 pointer-events-none" />
        <div className="absolute bottom-10 left-[6%] w-40 h-40 rounded-full border border-dashed border-[#D3839E]/25 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative max-w-2xl mx-auto text-center"
        >
          <p className="text-[#D3839E] text-xs tracking-[0.35em] uppercase font-medium mb-5">Our Story</p>
          <h1
            style={{ fontFamily: 'var(--font-display)' }}
            className={`text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.1] mb-6 ${darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'}`}
          >
            Skincare That <span className="text-blush-gradient">Fits You</span>
          </h1>
          <p className={`text-base leading-relaxed ${darkMode ? 'text-[#FAF7F2]/70' : 'text-[#4A4A4A]'}`}>
            GLOWWITHRUMI was founded on a simple belief: finding skincare you can trust shouldn&apos;t be complicated. From our signature Rumi skincare products to carefully selected Korean and international beauty essentials, every item we carry is chosen with your skin — and your routine — in mind.
          </p>
        </motion.div>
      </section>

      {/* Story */}
      <section className="py-24 px-6 lg:px-12">
        <div className="max-w-[1200px] mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            {/* Four shelf favourites from our own catalogue, rather than a
                stock photo — each one links through to its product page. */}
            <div className="w-full aspect-square rounded-3xl shadow-xl bg-white p-4 grid grid-cols-2 gap-4">
              {shelf.map(item => (
                <Link
                  key={item.id}
                  to={`/products/${item.id}`}
                  aria-label={item.name}
                  className="group rounded-2xl bg-white overflow-hidden flex items-center justify-center"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                </Link>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-[#D3839E] text-xs tracking-[0.35em] uppercase font-medium mb-4">Our Journey</p>
            <h2
              style={{ fontFamily: 'var(--font-display)' }}
              className={`text-3xl md:text-4xl font-medium mb-6 ${darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'}`}
            >
              A skincare destination built on trust
            </h2>
            <div className={`flex flex-col gap-4 text-sm leading-relaxed ${darkMode ? 'text-[#FAF7F2]/70' : 'text-[#4A4A4A]'}`}>
              <p>
                GLOWWITHRUMI began with a simple question: how do we make it easier to find skincare and beauty products you can actually trust? We started with our own Rumi skincare line, then grew into a curated selection of Korean and international beauty essentials — so you can shop for everything you need in one place.
              </p>
              <p>
                Every product on our shelves is chosen for real results, not hype. From personalised recommendations to nationwide delivery across Ghana, we&apos;re here to support you from your first order to your last empty bottle.
              </p>
            </div>
            <Link to="/products">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="mt-8 bg-[#2A2A2A] text-white px-8 py-4 text-xs tracking-[0.2em] uppercase font-semibold rounded-full hover:bg-[#D3839E] transition-all duration-300 flex items-center gap-2"
              >
                Shop the Collection
                <FiArrowRight size={14} />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className={`py-24 px-6 lg:px-12 ${darkMode ? 'bg-[#252018]' : 'bg-white'}`}>
        <div className="max-w-[1200px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-[#D3839E] text-xs tracking-[0.35em] uppercase font-medium mb-4">What We Stand For</p>
            <h2
              style={{ fontFamily: 'var(--font-display)' }}
              className={`text-3xl md:text-4xl font-medium ${darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'}`}
            >
              Our Values
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`group p-8 rounded-[1.75rem] border text-center transition-all duration-300 hover:-translate-y-1 ${
                  darkMode
                    ? 'bg-[#1C1916] border-[#3A3328] hover:border-[#D3839E]/40'
                    : 'bg-[#FAF7F2] border-[#EFE6DA] hover:border-[#D3839E]/40 hover:shadow-[0_24px_60px_rgba(184,94,117,0.12)]'
                }`}
              >
                <span
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 transition-colors duration-300 ${
                    darkMode
                      ? 'bg-[#2A241C] text-[#E8A9BD] group-hover:bg-[#332a20]'
                      : 'bg-[#F6DFE6] text-[#B85E75] group-hover:bg-[#F1CDDC]'
                  }`}
                >
                  <v.Icon size={26} />
                </span>
                <h3
                  style={{ fontFamily: 'var(--font-display)' }}
                  className={`text-lg font-medium mb-2.5 ${darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'}`}
                >
                  {v.title}
                </h3>
                <p className={`text-[13px] leading-relaxed ${darkMode ? 'text-[#FAF7F2]/60' : 'text-[#5A5A5A]'}`}>{v.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Signature line — our own products, shown with their studio shots so
          the values above are anchored to something real on the shelf. */}
      <section className="py-24 px-6 lg:px-12">
        <div className="max-w-[1200px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-[#D3839E] text-xs tracking-[0.35em] uppercase font-medium mb-4">Made by us</p>
            <h2
              style={{ fontFamily: 'var(--font-display)' }}
              className={`text-3xl md:text-4xl font-medium ${darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'}`}
            >
              Meet the Rumi line
            </h2>
            <p className={`mt-4 text-sm leading-relaxed max-w-xl mx-auto ${darkMode ? 'text-[#FAF7F2]/60' : 'text-[#4A4A4A]'}`}>
              Our own face and body range — the heart of everything we do, made to deep-cleanse, brighten and smooth.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-6 lg:gap-8">
            {signature.map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link to="/products" className="group block h-full">
                  <div
                    className={`h-full flex flex-col rounded-[1.75rem] overflow-hidden border transition-all duration-300 group-hover:-translate-y-1.5 ${
                      darkMode
                        ? 'bg-[#1C1916] border-[#3A3328] group-hover:border-[#D3839E]/40'
                        : 'bg-white border-[#EFE6DA] group-hover:border-[#D3839E]/40'
                    }`}
                    style={{ boxShadow: '0 18px 50px rgba(42,42,42,0.08)' }}
                  >
                    <div className="aspect-square bg-white overflow-hidden">
                      <img
                        src={s.image}
                        alt={`GLOWWITHRUMI ${s.name}`}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-7 flex flex-col flex-1 text-center">
                      <h3
                        style={{ fontFamily: 'var(--font-display)' }}
                        className={`text-xl font-medium mb-2 ${darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'}`}
                      >
                        {s.name}
                      </h3>
                      <p className={`text-[13px] leading-relaxed flex-1 ${darkMode ? 'text-[#FAF7F2]/60' : 'text-[#5A5A5A]'}`}>
                        {s.text}
                      </p>
                      <span className="mt-5 inline-flex items-center justify-center gap-2 text-[11px] tracking-[0.2em] uppercase font-semibold text-[#B85E75] group-hover:gap-3 transition-all">
                        Shop now
                        <FiArrowRight size={13} />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-[1000px] mx-auto flex flex-wrap justify-center gap-10 lg:gap-16"
        >
          {stats.map(item => (
            <div key={item.label} className="text-center">
              <p style={{ fontFamily: 'var(--font-display)' }} className="text-4xl font-medium text-[#D3839E]">
                {item.stat}
              </p>
              <p className={`text-xs tracking-[0.12em] uppercase mt-1 ${darkMode ? 'text-[#FAF7F2]/50' : 'text-[#4A4A4A]'}`}>
                {item.label}
              </p>
            </div>
          ))}
        </motion.div>
      </section>
    </div>
  )
}
