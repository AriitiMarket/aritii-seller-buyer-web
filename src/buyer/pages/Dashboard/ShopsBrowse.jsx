import React, { useState, useMemo, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import ShopCard from '@/shared/components/ShopCard'
import { useShops } from '@/shared/hooks/useShops'
import { MdSearch, MdClose, MdStorefront } from 'react-icons/md'

const SORT_OPTIONS = [
  { value: 'recommended', label: 'Sort: Recommended' },
  { value: 'rating', label: 'Rating (Highest)' },
  { value: 'newest', label: 'Newest' },
  { value: 'products', label: 'Most Products' },
]

const BuyerShopsBrowse = () => {
  const { shops = [], loading: isLoading, error } = useShops()
  const [sortBy, setSortBy] = useState('recommended')
  const [searchQuery, setSearchQuery] = useState('')

  // The category rail lives in BuyerLayout and writes `?category=` — read it
  // from the URL (NOT local state) or selecting a chip changes the URL while
  // the results silently stay unfiltered.
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedCategory = searchParams.get('category') || ''

  const clearCategory = useCallback(() => {
    const params = new URLSearchParams(searchParams)
    params.delete('category')
    setSearchParams(params, { replace: true })
  }, [searchParams, setSearchParams])

  const clearAll = useCallback(() => {
    setSearchParams({})
    setSearchQuery('')
  }, [setSearchParams])

  const filteredShops = useMemo(() => {
    let result = [...(shops || [])]

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(s => {
                const name = (s.name || '').toLowerCase()
        const desc = (s.description || '').toLowerCase()
        const type = (s.category || '').toLowerCase()
        return name.includes(q) || desc.includes(q) || type.includes(q)
      })
    }

    if (selectedCategory) {
      result = result.filter(s =>
        String(s.category || '').trim().toLowerCase() === selectedCategory.trim().toLowerCase()
      )
    }

    switch (sortBy) {
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        break
      case 'products':
        result.sort((a, b) => (b.productCount || b.products?.length || 0) - (a.productCount || a.products?.length || 0))
        break
      default:
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    }

    return result
  }, [shops, sortBy, searchQuery, selectedCategory])

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-[#171A21]">
          {selectedCategory || 'Discover shops'}
        </h1>
        <p className="text-sm text-[#667085] mt-1">Meet trusted sellers and artisans from across Ethiopia</p>
      </div>

      {/* Search + Sort */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative flex-1 w-full sm:max-w-md">
          <MdSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search shops"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#20305C] focus:border-transparent"
          />
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-sm font-semibold text-[#171A21] focus:outline-none focus:ring-2 focus:ring-[#20305C]"
        >
          {SORT_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Active filters */}
      {(selectedCategory || searchQuery) && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-[#667085] font-medium">Active filters:</span>
          {selectedCategory && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#E9ECF5] text-[#20305C] text-xs font-semibold rounded-full border border-[#20305C]/20">
              {selectedCategory}
              <button onClick={clearCategory} aria-label="Remove category filter" className="hover:text-[#2C3F6E]">
                <MdClose size={14} />
              </button>
            </span>
          )}
          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#E9ECF5] text-[#2C3F6E] text-xs font-semibold rounded-full border border-[#20305C]/20">
              "{searchQuery}"
              <button onClick={() => setSearchQuery('')} aria-label="Clear search" className="hover:text-[#182647]">
                <MdClose size={14} />
              </button>
            </span>
          )}
          <button onClick={clearAll} className="text-xs text-[#667085] hover:text-[#171A21] font-semibold">
            Clear all
          </button>
        </div>
      )}

      {/* Results count */}
      {!isLoading && (
        <p className="text-sm text-[#667085]">{filteredShops.length} shop{filteredShops.length !== 1 ? 's' : ''} found</p>
      )}

      {/* Shops Grid */}
      {isLoading ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#20305C] mx-auto mb-4"></div>
          <p className="text-[#667085] text-sm">Loading shops...</p>
        </div>
      ) : error ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-[#E5E7EB]">
          <p className="text-red-600 text-sm mb-4">{error}</p>
        </div>
      ) : filteredShops.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredShops.map((shop) => (
            <ShopCard key={shop._id || shop.id} data={shop} basePath="/my-dashboard" />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-[#E5E7EB]">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MdStorefront className="text-3xl text-gray-300" />
          </div>
          <p className="text-[#667085] font-medium mb-1">
            {selectedCategory ? `No shops in ${selectedCategory} yet` : searchQuery ? 'No shops match your search' : 'No shops found'}
          </p>
          <p className="text-[#667085] text-sm mb-5">
            {selectedCategory || searchQuery ? 'Try another category or clear your filters' : 'Check back later for new sellers'}
          </p>
          {(searchQuery || selectedCategory) && (
            <button
              onClick={clearAll}
              className="px-5 py-2.5 bg-[#20305C] text-white rounded-xl text-sm font-semibold hover:bg-[#2C3F6E] transition"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default BuyerShopsBrowse
