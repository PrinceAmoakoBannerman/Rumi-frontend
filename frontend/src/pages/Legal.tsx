import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useApp } from '../contexts/AppContext'
import { store, whatsappLink } from '../data/store'

/**
 * Privacy and Terms, rendered from the same simple layout. The copy is a plain,
 * honest starting point for a Ghana skincare shop — the owner should read it
 * over and adjust anything that does not match how they actually operate.
 */
type Block = { heading: string; body: string[] }

const privacy: Block[] = [
  {
    heading: 'What we collect',
    body: [
      'When you place an order or get in touch, we collect what we need to serve you: your name, email, phone number, delivery address and the details of your order. If you join our list, we keep your email so we can tell you about new drops and offers.',
    ],
  },
  {
    heading: 'How we use it',
    body: [
      'To process and deliver your orders, answer your questions, and — only if you asked us to — send you updates. We do not sell your information to anyone.',
    ],
  },
  {
    heading: 'Payments',
    body: [
      'Payments are handled securely by Paystack. Your card or mobile-money details are entered on their secure checkout and are never stored on our servers.',
    ],
  },
  {
    heading: 'Who we share it with',
    body: [
      'Only the people needed to complete your order — our delivery partners and our payment processor — and only what they need. Nothing more.',
    ],
  },
  {
    heading: 'Your choices',
    body: [
      'You can unsubscribe from our emails at any time. To see, correct or delete the information we hold about you, just reach out and we will sort it.',
    ],
  },
]

const terms: Block[] = [
  {
    heading: 'Using our shop',
    body: [
      'By browsing GLOWWITHRUMI and placing an order, you agree to these terms. If anything here is unclear, message us before you order.',
    ],
  },
  {
    heading: 'Products & prices',
    body: [
      'Prices are in Ghana Cedis (GH₵) and may change. We work hard to describe every product accurately, but shades, packaging and formulations can vary slightly from the photos.',
    ],
  },
  {
    heading: 'Orders & payment',
    body: [
      'An order is confirmed once payment is received through Paystack (mobile money or card). We may decline or cancel an order — for example if an item is out of stock — and will refund you in full if we do.',
    ],
  },
  {
    heading: 'Delivery',
    body: [
      'We deliver nationwide across Ghana. Delivery times are estimates and can be affected by your location and the courier. We will keep you updated on your order.',
    ],
  },
  {
    heading: 'Returns',
    body: [
      'If something arrives damaged or incorrect, contact us within 48 hours of delivery and we will make it right. For hygiene reasons, opened skincare cannot be returned unless it is faulty.',
    ],
  },
  {
    heading: 'Using the products',
    body: [
      'Always follow the directions on the pack and patch-test a new product first. GLOWWITHRUMI is not responsible for reactions caused by misuse or by a known allergy.',
    ],
  },
]

const pages = {
  privacy: { eyebrow: 'Your privacy', title: 'Privacy Policy', blocks: privacy },
  terms: { eyebrow: 'The fine print', title: 'Terms & Conditions', blocks: terms },
}

export default function Legal({ kind }: { kind: 'privacy' | 'terms' }) {
  const { darkMode } = useApp()
  const page = pages[kind]

  return (
    <div className={`min-h-screen pt-[196px] pb-24 px-6 lg:px-12 ${darkMode ? 'bg-[#1C1916]' : 'bg-[#FAF7F2]'}`}>
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center">
          <p className="text-[#D3839E] text-xs tracking-[0.35em] uppercase font-medium mb-4">{page.eyebrow}</p>
          <h1
            style={{ fontFamily: 'var(--font-display)' }}
            className={`text-4xl md:text-5xl font-medium ${darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'}`}
          >
            {page.title}
          </h1>
        </motion.div>

        <div className="flex flex-col gap-9">
          {page.blocks.map(b => (
            <section key={b.heading}>
              <h2
                style={{ fontFamily: 'var(--font-display)' }}
                className={`text-lg font-medium mb-2.5 ${darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'}`}
              >
                {b.heading}
              </h2>
              {b.body.map((p, i) => (
                <p key={i} className={`text-sm leading-relaxed ${darkMode ? 'text-[#FAF7F2]/65' : 'text-[#4A4A4A]'}`}>
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>

        <div className={`mt-12 pt-8 border-t text-sm leading-relaxed ${darkMode ? 'border-[#3A3328] text-[#FAF7F2]/65' : 'border-[#EDE4D6] text-[#4A4A4A]'}`}>
          Questions? Email{' '}
          <a href={`mailto:${store.email}`} className="text-[#B85E75] hover:underline">{store.email}</a>, message us on{' '}
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="text-[#B85E75] hover:underline">WhatsApp</a>, or visit our{' '}
          <Link to="/contact" className="text-[#B85E75] hover:underline">contact page</Link>.
        </div>
      </div>
    </div>
  )
}
