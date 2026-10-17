/**
 * Marketplace Categories Page
 *
 * Canonical route: /categories
 *
 * Shopping department layout inspired by catalog browsing:
 * a left department rail (desktop) plus a main grid of department tiles.
 * Each tile links into /products?category=…
 */
import React, { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Breadcrumbs from '@/shared/components/Breadcrumbs'
import Loading from '@/components/common/Loading'
import EmptyState from '@/components/common/EmptyState'
import CategoryIcon from '@/features/marketplace/components/CategoryIcon'
import { useCatalogCategories } from '@/shared/hooks/useCatalogCategories'

const CategoriesPage = () => {
  const { categories: rawCategories = [], loading, error } = useCatalogCategories({ type: 'product' })
  const [searchParams] = useSearchParams()
  const active = searchParams.get('category') || ''
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Normalize categories into a consistent shape.
  const categories = useMemo(() => {
    return rawCategories.map((cat) => ({
      id: cat._id || cat.id || cat.title || cat.name || cat,
      title: cat.title || cat.name || cat,
      count: cat.productCount ?? cat.count ?? 0,
    }))
  }, [rawCategories])

  const totalCount = useMemo(() => categories.reduce((sum, c) => sum + c.count, 0), [categories])

  return (
    <>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Categories' }]} />

      {/* Hero header */}
      <header className="market-category-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="market-category-hero-title">Shop by Category</div>
          <p className="market-category-hero-desc">
            Browse all departments and find what you need across the marketplace.
          </p>
          <div className="market-category-hero-meta">
            {categories.length} category{categories.length !== 1 ? 's' : ''} &bull; {totalCount} product{totalCount !== 1 ? 's' : ''} available
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile department drawer trigger */}
        <div className="lg:hidden mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-market-border bg-market-surface text-market-on-surface text-sm font-medium hover:bg-market-surface-container-high transition-colors"
            aria-haspopup="dialog"
            aria-expanded={sidebarOpen}
          >
            <span>Departments</span>
            <span className="text-market-on-surface-variant">{categories.length}</span>
          </button>
        </div>

        {/* Mobile drawer overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-[60] bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}
        {/* Mobile drawer panel */}
        {sidebarOpen && (
          <div className="fixed inset-y-0 left-0 z-[70] w-80 max-w-[85vw] flex flex-col bg-market-surface border-r border-market-border lg:hidden shadow-level-3">
            <div className="flex items-center justify-between border-b border-market-border px-4 py-3">
              <h2 className="font-bold text-market-on-surface text-base">Departments</h2>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 text-market-on-surface-variant hover:text-market-primary transition-colors"
                aria-label="Close departments"
              >
                ✕
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-3 space-y-0.5" aria-label="Departments">
              {categories.map((cat) => {
                const isActive = active.toLowerCase() === String(cat.title).toLowerCase()
                return (
                  <Link
                    key={cat.id}
                    to={`/products?category=${encodeURIComponent(cat.title)}`}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${isActive ? 'bg-market-primary text-market-on-primary font-semibold' : 'text-market-on-surface-variant hover:bg-market-surface-container-high hover:text-market-primary'}`}
                  >
                    <CategoryIcon title={cat.title} size={16} />
                    <span className="flex-1">{cat.title}</span>
                    <span className="market-category-sidebar-count">{cat.count}</span>
                  </Link>
                )
              })}
            </nav>
            <div className="border-t border-market-border p-3">
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="w-full rounded-lg bg-market-primary px-4 py-2.5 text-sm font-semibold text-market-on-primary transition-colors hover:bg-market-primary-hover"
              >
                Done
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left department rail — desktop only */}
          <aside className="market-category-sidebar flex-shrink-0" aria-label="Departments">
            <div className="px-2 mb-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-market-on-surface-variant mb-2">Shop by department</h2>
            </div>
            <nav className="space-y-0.5" aria-label="Departments">
              {categories.map((cat) => {
                const isActive = active.toLowerCase() === String(cat.title).toLowerCase()
                return (
                  <Link
                    key={cat.id}
                    to={`/products?category=${encodeURIComponent(cat.title)}`}
                    className={`market-category-sidebar-item ${isActive ? 'active' : ''}`}
                  >
                    <CategoryIcon title={cat.title} size={16} />
                    <span className="flex-1">{cat.title}</span>
                    <span className="market-category-sidebar-count">{cat.count}</span>
                  </Link>
                )
              })}
            </nav>
          </aside>

          {/* Main category grid */}
          <main className="flex-1 min-w-0">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {categories.length > 0 ? (
                categories.map((cat) => {
                  const isActive = active.toLowerCase() === String(cat.title).toLowerCase()
                  return (
                    <Link
                      key={cat.id}
                      to={`/products?category=${encodeURIComponent(cat.title)}`}
                      aria-current={isActive ? 'page' : undefined}
                      className="market-category-card group"
                    >
                      <div className="market-category-card-icon">
                        <CategoryIcon title={cat.title} size={28} />
                      </div>
                      <h3 className="market-category-card-name">{cat.title}</h3>
                      {cat.count > 0 && (
                        <p className="market-category-card-count">
                          {cat.count} product{cat.count !== 1 ? 's' : ''}
                        </p>
                      )}
                    </Link>
                  )
                })
              ) : null}
            </div>
          </main>
        </div>
      </div>

      {loading ? (
        <Loading variant="inline" label="Loading categories…" />
      ) : error ? (
        <EmptyState title="Could not load categories" description={error} />
      ) : categories.length === 0 ? (
        <EmptyState title="No categories yet" description="Categories appear here once the catalog is populated." />
      ) : null}
    </>
  )
}

export default CategoriesPage
