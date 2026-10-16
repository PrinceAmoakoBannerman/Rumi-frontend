import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiSearch, FiX } from 'react-icons/fi'
import { useApp } from '../contexts/AppContext'
import { searchProducts } from '../lib/search'
import { formatProductPrice, PLACEHOLDER_IMAGE } from '../lib/currency'

/** Always-visible search row, sitting directly under the navbar. */
export default function SearchBar() {
  const { searchQuery, setSearchQuery } = useApp()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const rowRef = useRef<HTMLDivElement>(null)

  const query = searchQuery.trim().toLowerCase()

  const suggestions = useMemo(() => searchProducts(query), [query])

  // Reset the highlight whenever the list itself changes.
  useEffect(() => { setActive(-1) }, [query])

  // Close when the click lands outside the row.
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (rowRef.current && !rowRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  const goToResults = () => {
    const q = searchQuery.trim()
    setOpen(false)
    navigate(q ? `/products?q=${encodeURIComponent(q)}` : '/products')
  }

  const goToProduct = (id: number) => {
    setOpen(false)
    navigate(`/products/${id}`)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (active >= 0 && suggestions[active]) goToProduct(suggestions[active].id)
    else goToResults()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { setOpen(false); return }
    if (!suggestions.length) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setOpen(true)
      setActive(i => (i + 1) % suggestions.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setOpen(true)
      setActive(i => (i <= 0 ? suggestions.length - 1 : i - 1))
    }
  }

  const showPanel = open && query.length >= 2

  return (
    <div ref={rowRef} className="fixed top-[116px] left-0 right-0 z-40 bg-white border-b border-[#EDE4D6]">
      <form
        onSubmit={handleSubmit}
        className="max-w-[1400px] mx-auto h-12 pl-4 sm:pl-6 lg:pl-12 flex items-stretch"
        role="search"
      >
        <input
          value={searchQuery}
          onChange={e => { setSearchQuery(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search for products"
          aria-label="Search for products"
          aria-expanded={showPanel}
          aria-autocomplete="list"
          role="combobox"
          aria-controls="search-suggestions"
          className="flex-1 min-w-0 bg-transparent text-[#2A2A2A] placeholder-[#4A4A4A]/45 outline-none"
        />
        {searchQuery && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => { setSearchQuery(''); setOpen(false) }}
            className="px-3 shrink-0 text-[#4A4A4A]/50 hover:text-[#2A2A2A] transition-colors"
          >
            <FiX size={17} />
          </button>
        )}
        <button
          type="submit"
          aria-label="Search"
          className="w-14 shrink-0 flex items-center justify-center bg-[#2A2A2A] text-white hover:bg-[#B85E75] transition-colors"
        >
          <FiSearch size={19} />
        </button>
      </form>

      {showPanel && (
        <div
          id="search-suggestions"
          role="listbox"
          className="absolute left-0 right-0 top-12 bg-white border-b border-[#EDE4D6] shadow-lg max-h-[70vh] overflow-y-auto"
        >
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-2">
            {suggestions.length === 0 ? (
              <p className="py-4 text-sm text-[#4A4A4A]/70">
                Nothing matches &ldquo;{searchQuery.trim()}&rdquo;.
              </p>
            ) : (
              <>
                {suggestions.map((p, i) => (
                  <button
                    key={p.id}
                    type="button"
                    role="option"
                    aria-selected={i === active}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => goToProduct(p.id)}
                    className={`w-full flex items-center gap-3 py-2.5 text-left rounded-xl px-2 transition-colors ${
                      i === active ? 'bg-[#FDF6F8]' : ''
                    }`}
                  >
                    <img
                      src={p.image}
                      alt=""
                      loading="lazy"
                      onError={e => { (e.currentTarget as HTMLImageElement).src = PLACEHOLDER_IMAGE }}
                      className="w-11 h-11 shrink-0 rounded-lg bg-white object-contain"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm text-[#2A2A2A] truncate">{p.name}</span>
                      <span className="block text-xs text-[#4A4A4A]/60">
                        {p.category} · {formatProductPrice(p.price)}
                      </span>
                    </span>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={goToResults}
                  className="w-full text-left px-2 py-3 text-xs tracking-[0.15em] uppercase font-medium text-[#D3839E] hover:underline"
                >
                  See all results
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
