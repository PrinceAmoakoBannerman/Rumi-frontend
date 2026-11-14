import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiSearch, FiX, FiArrowRight } from 'react-icons/fi'
import { useApp } from '../contexts/AppContext'
import { searchProducts } from '../lib/search'
import { formatProductPrice, PLACEHOLDER_IMAGE } from '../lib/currency'

/** Always-visible search row, sitting directly under the navbar. */
export default function SearchBar() {
  const { searchQuery, setSearchQuery, darkMode } = useApp()
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
    <div
      ref={rowRef}
      className={`fixed top-[116px] left-0 right-0 z-40 border-b ${
        darkMode ? 'bg-[#1C1916] border-[#2E2820]' : 'bg-white border-[#EDE4D6]'
      }`}
    >
      <form
        onSubmit={handleSubmit}
        className="max-w-[1400px] mx-auto h-14 px-4 sm:px-6 lg:px-12 flex items-center gap-2.5"
        role="search"
      >
        {/* The field itself — a rounded pill with the search icon tucked in,
            so it reads as a search box rather than a bare line. */}
        <div
          className={`flex-1 min-w-0 flex items-center gap-2.5 h-11 rounded-full border px-4 transition-colors ${
            darkMode
              ? 'bg-[#252018] border-[#3A3328] focus-within:border-[#D3839E]'
              : 'bg-[#F7F1E8] border-[#EADFCF] focus-within:border-[#D3839E] focus-within:bg-white'
          }`}
        >
          <FiSearch size={17} className={`shrink-0 ${darkMode ? 'text-[#FAF7F2]/40' : 'text-[#4A4A4A]/45'}`} />
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
            className={`flex-1 min-w-0 bg-transparent text-sm outline-none ${
              darkMode ? 'text-[#FAF7F2] placeholder-[#FAF7F2]/35' : 'text-[#2A2A2A] placeholder-[#4A4A4A]/45'
            }`}
          />
          {searchQuery && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => { setSearchQuery(''); setOpen(false) }}
              className={`shrink-0 transition-colors ${
                darkMode ? 'text-[#FAF7F2]/40 hover:text-[#FAF7F2]' : 'text-[#4A4A4A]/45 hover:text-[#2A2A2A]'
              }`}
            >
              <FiX size={16} />
            </button>
          )}
        </div>

        <button
          type="submit"
          aria-label="Search"
          className="shrink-0 h-11 px-5 sm:px-6 rounded-full bg-[#2A2A2A] text-white hover:bg-[#B85E75] transition-colors flex items-center gap-2 text-xs tracking-[0.18em] uppercase font-semibold"
        >
          <FiSearch size={16} />
          <span className="hidden sm:inline">Search</span>
        </button>
      </form>

      {showPanel && (
        <div id="search-suggestions" role="listbox" className="absolute left-0 right-0 top-full">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 pb-3">
            <div
              className={`rounded-2xl border shadow-xl overflow-hidden max-h-[70vh] overflow-y-auto ${
                darkMode ? 'bg-[#1C1916] border-[#3A3328]' : 'bg-white border-[#EDE4D6]'
              }`}
            >
              <div className="p-2">
                {suggestions.length === 0 ? (
                  <p className={`py-4 px-2 text-sm ${darkMode ? 'text-[#FAF7F2]/60' : 'text-[#4A4A4A]/70'}`}>
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
                          i === active ? (darkMode ? 'bg-[#252018]' : 'bg-[#FDF6F8]') : ''
                        }`}
                      >
                        <img
                          src={p.image}
                          alt=""
                          loading="lazy"
                          onError={e => { (e.currentTarget as HTMLImageElement).src = PLACEHOLDER_IMAGE }}
                          className="w-11 h-11 shrink-0 rounded-lg bg-white object-contain border border-[#EDE4D6]"
                        />
                        <span className="min-w-0 flex-1">
                          <span className={`block text-sm truncate ${darkMode ? 'text-[#FAF7F2]' : 'text-[#2A2A2A]'}`}>{p.name}</span>
                          <span className={`block text-xs ${darkMode ? 'text-[#FAF7F2]/45' : 'text-[#4A4A4A]/60'}`}>
                            {p.category} · {formatProductPrice(p.price)}
                          </span>
                        </span>
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={goToResults}
                      className="w-full flex items-center gap-1.5 px-2 py-3 text-xs tracking-[0.15em] uppercase font-semibold text-[#D3839E] hover:text-[#B85E75] transition-colors"
                    >
                      See all results
                      <FiArrowRight size={13} />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
