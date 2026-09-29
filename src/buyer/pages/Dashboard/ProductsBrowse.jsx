import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import ProductCard from '@/shared/components/ProductCard';
import productService from '@/services/product.service';
import { MdOutlineStorefront, MdSearch, MdClose } from 'react-icons/md';

const SORT_OPTIONS = [
  { value: 'recommended', label: 'Sort: Recommended' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest' },
  { value: 'rating', label: 'Top Rated' },
]

const BuyerProductsBrowse = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const shopParam = searchParams.get("shop");
  const searchQuery = searchParams.get("search") || "";

  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('recommended');
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || '');
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const products = await productService.getAllFresh();
        if (!cancelled) setAllProducts(products || []);
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Could not load products");
          setAllProducts([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    setSelectedCategory(categoryParam || '');
    setLocalSearch(searchQuery);
  }, [categoryParam, searchQuery]);

  const filteredProducts = useMemo(() => {
    let filtered = [...allProducts];

    const q = (searchQuery || localSearch || '').toLowerCase().trim();
    if (q) {
      filtered = filtered.filter((p) => {
        const name = (p.name || "").toLowerCase();
        const category = (typeof p.category === 'string' ? p.category : p.category?.name || p.category?.title || "").toLowerCase();
                const shopName = (p?.shop?.name || "").toLowerCase();
        const description = (p.description || "").toLowerCase();
        return name.includes(q) || category.includes(q) || shopName.includes(q) || description.includes(q);
      });
    }

    if (selectedCategory) {
      filtered = filtered.filter(
        (p) => (typeof p.category === 'string' ? p.category : p.category?.name || p.category?.title || "").toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (shopParam) {
      filtered = filtered.filter((p) => {
                const shopName = p?.shop?.name || '';
        return shopName.toLowerCase() === shopParam.toLowerCase();
      });
    }

    switch (sortBy) {
      case 'price_low':
        filtered.sort((a, b) => (a.discountPrice || 0) - (b.discountPrice || 0));
        break;
      case 'price_high':
        filtered.sort((a, b) => (b.discountPrice || 0) - (a.discountPrice || 0));
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      case 'rating':
        filtered.sort((a, b) => (b.ratings || b.rating || 0) - (a.ratings || a.rating || 0));
        break;
      default:
        filtered.sort((a, b) => {
          const aSold = a.sold_out ?? a.total_sell ?? 0;
          const bSold = b.sold_out ?? b.total_sell ?? 0;
          return bSold - aSold;
        });
    }

    return filtered;
  }, [allProducts, searchQuery, localSearch, selectedCategory, shopParam, sortBy]);

  const handleRefresh = async () => {
    try {
      setLoading(true);
      setError(null);
      const products = await productService.getAllFresh();
      setAllProducts(products || []);
    } catch (err) {
      setError(err.message || "Could not load products");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (localSearch.trim()) {
      setSearchParams({ search: localSearch.trim() });
    } else {
      setSearchParams({});
    }
  };

  const pageTitle = searchQuery
    ? `Search: "${searchQuery}"`
    : selectedCategory || categoryParam
      ? selectedCategory || categoryParam
      : shopParam
        ? shopParam
        : "All Products";

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-[#171A21]">{pageTitle}</h1>
        {!loading && (
          <p className="text-sm text-[#667085] mt-1">{filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} from trusted Ethiopian shops</p>
        )}
      </div>

      {/* Search + Sort Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <form onSubmit={handleSearchSubmit} className="flex-1 w-full sm:max-w-md relative">
          <div className="flex items-center bg-white rounded-xl border border-[#E5E7EB] focus-within:ring-2 focus-within:ring-[#20305C] focus-within:border-transparent overflow-hidden">
            <MdSearch size={18} className="text-gray-400 ml-3" />
            <input
              type="text"
              placeholder="Search products..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="flex-1 px-3 py-2.5 text-sm bg-transparent focus:outline-none"
            />
            {localSearch && (
              <button type="button" onClick={() => { setLocalSearch(''); setSearchParams({}); }} className="px-2 text-gray-400 hover:text-[#667085]">
                <MdClose size={16} />
              </button>
            )}
          </div>
        </form>

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
              <button onClick={() => setSelectedCategory('')} className="hover:text-[#2C3F6E]">
                <MdClose size={14} />
              </button>
            </span>
          )}
          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#E9ECF5] text-[#2C3F6E] text-xs font-semibold rounded-full border border-[#20305C]/20">
              "{searchQuery}"
              <button onClick={() => { setLocalSearch(''); setSearchParams({}); }} className="hover:text-[#182647]">
                <MdClose size={14} />
              </button>
            </span>
          )}
          <button
            onClick={() => { setSelectedCategory(''); setLocalSearch(''); setSearchParams({}); }}
            className="text-xs text-[#667085] hover:text-[#171A21] font-semibold"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#20305C] mx-auto mb-4"></div>
          <p className="text-[#667085] text-sm">Loading products...</p>
        </div>
      ) : error ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-[#E5E7EB]">
          <p className="text-red-600 text-sm mb-4">{error}</p>
          <button onClick={handleRefresh} className="px-5 py-2.5 bg-[#20305C] text-white rounded-xl text-sm font-semibold hover:bg-[#2C3F6E] transition">
            Try Again
          </button>
        </div>
      ) : filteredProducts.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard data={product} key={product._id} basePath="/my-dashboard/marketplace" />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-[#E5E7EB]">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MdOutlineStorefront className="text-3xl text-gray-300" />
          </div>
          <p className="text-[#667085] font-medium mb-1">
            {searchQuery || selectedCategory ? "No products match your filters" : "No products found"}
          </p>
          <p className="text-[#667085] text-sm mb-5">
            {searchQuery || selectedCategory ? "Try adjusting your search or filters" : "Check back later for new products"}
          </p>
          {(searchQuery || selectedCategory) && (
            <button
              onClick={() => { setSelectedCategory(''); setLocalSearch(''); setSearchParams({}); }}
              className="px-5 py-2.5 bg-[#20305C] text-white rounded-xl text-sm font-semibold hover:bg-[#2C3F6E] transition"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default BuyerProductsBrowse;
