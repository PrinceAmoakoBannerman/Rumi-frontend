import { useNavigate } from 'react-router-dom'
import { FiSearch } from 'react-icons/fi'
import { useApp } from '../contexts/AppContext'

/** Always-visible search row, sitting directly under the navbar. */
export default function SearchBar() {
  const { searchQuery, setSearchQuery } = useApp()
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const q = searchQuery.trim()
    navigate(q ? `/products?q=${encodeURIComponent(q)}` : '/products')
  }

  return (
    <div className="fixed top-[116px] left-0 right-0 z-40 h-12 bg-white border-b border-[#EDE4D6]">
      <form
        onSubmit={handleSubmit}
        className="max-w-[1400px] mx-auto h-full pl-4 sm:pl-6 lg:pl-12 flex items-stretch"
      >
        <input
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search for products"
          aria-label="Search for products"
          className="flex-1 min-w-0 bg-transparent text-[#2A2A2A] placeholder-[#4A4A4A]/45 outline-none"
        />
        <button
          type="submit"
          aria-label="Search"
          className="w-14 shrink-0 flex items-center justify-center bg-[#2A2A2A] text-white hover:bg-[#B85E75] transition-colors"
        >
          <FiSearch size={19} />
        </button>
      </form>
    </div>
  )
}
