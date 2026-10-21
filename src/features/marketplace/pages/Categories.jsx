/**
 * Marketplace Categories Page
 *
 * Canonical route: /categories
 *
 * Enhanced layout with:
 * - Full-height left sidebar with category navigation
 * - Featured categories banner (2x grid size)
 * - Responsive category grid (1→2→4 columns)
 * - Product count badges
 * - Hover effects with zoom and shadow
 * - Subcategory links
 * - Aritii branding (#75d04b green, #131921 dark headers)
 */
import React, { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Loading from '@/components/common/Loading'
import EmptyState from '@/components/common/EmptyState'
import { useCatalogCategories } from '@/shared/hooks/useCatalogCategories'
import './Categories.css'

const CategoriesPage = () => {
  const { categories: rawCategories = [], loading, error } = useCatalogCategories({ type: 'product' })
  const [searchParams] = useSearchParams()
  const active = searchParams.get('category') || ''
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [expandedGroups, setExpandedGroups] = useState({})

  // Normalize categories into a consistent shape with subcategories
  const categories = useMemo(() => {
    return rawCategories.map((cat) => ({
      id: cat._id || cat.id || cat.title || cat.name || cat,
      title: cat.title || cat.name || cat,
      count: cat.productCount ?? cat.count ?? 0,
      icon: cat.icon,
      image: cat.image || `https://via.placeholder.com/400x300?text=${encodeURIComponent(cat.title || 'Category')}`,
      subcategories: cat.subcategories || [],
      isFeatured: cat.isFeatured || false,
      group: cat.group || 'All',
    }))
  }, [rawCategories])


  // Featured categories (first 3 marked as featured, or fallback to first 3)
  const featuredCategories = useMemo(() => {
    const featured = categories.filter(c => c.isFeatured)
    return featured.length > 0 ? featured.slice(0, 3) : categories.slice(0, 3)
  }, [categories])

  // Grouped categories for sidebar
  const groupedCategories = useMemo(() => {
    const groups = {}
    categories.forEach(cat => {
      if (!groups[cat.group]) {
        groups[cat.group] = []
      }
      groups[cat.group].push(cat)
    })
    return groups
  }, [categories])

  const toggleGroup = (group) => {
    setExpandedGroups(prev => ({
      ...prev,
      [group]: !prev[group],
    }))
  }

  const getCategoryImage = (category) => {
    return category.image || `https://via.placeholder.com/400x300?text=${encodeURIComponent(category.title)}`
  }

  return (
    <>
      <div className="categories-page-container">
        {/* Mobile menu trigger */}
        <div className="categories-mobile-trigger">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="categories-mobile-button"
            aria-haspopup="dialog"
            aria-expanded={sidebarOpen}
          >
            <span>☰ Categories</span>
            <span className="badge-small">{Object.keys(groupedCategories).length}</span>
          </button>
        </div>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="categories-mobile-overlay"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Mobile sidebar drawer */}
        {sidebarOpen && (
          <div className="categories-mobile-drawer">
            <div className="drawer-header">
              <h2>Categories</h2>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="drawer-close"
                aria-label="Close categories"
              >
                ✕
              </button>
            </div>
            
            <div className="drawer-content">
              {/* Categories section */}
              <div className="categories-section">
                <h3>Categories</h3>
                {Object.entries(groupedCategories).map(([group, cats]) => (
                  <div key={group} className="category-group">
                    <button
                      type="button"
                      onClick={() => toggleGroup(group)}
                      className="category-group-toggle"
                    >
                      <span>{group}</span>
                      <span className="group-count">{cats.length}</span>
                      <span className="toggle-icon">{expandedGroups[group] ? '▼' : '▶'}</span>
                    </button>
                    {expandedGroups[group] && (
                      <div className="category-group-items">
                        {cats.map(cat => (
                          <Link
                            key={cat.id}
                            to={`/products?category=${encodeURIComponent(cat.title)}`}
                            onClick={() => setSidebarOpen(false)}
                            className={`category-item ${active.toLowerCase() === cat.title.toLowerCase() ? 'active' : ''}`}
                          >
                            <span>{cat.title}</span>
                            <span className="item-count">{cat.count}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="drawer-footer">
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="drawer-done-btn"
              >
                Done
              </button>
            </div>
          </div>
        )}

        {/* Main content wrapper */}
        <div className="categories-content-wrapper">
          {/* Left sidebar — desktop only */}
          <aside className="categories-sidebar">
            {/* Categories section */}
            <div className="sidebar-section">
              <h3 className="sidebar-section-title">Categories</h3>
              {Object.entries(groupedCategories).map(([group, cats]) => (
                <div key={group} className="category-group">
                  <button
                    type="button"
                    onClick={() => toggleGroup(group)}
                    className="category-group-toggle"
                  >
                    <span>{group}</span>
                    <span className="group-count">{cats.length}</span>
                    <span className="toggle-icon">{expandedGroups[group] ? '▼' : '▶'}</span>
                  </button>
                  {expandedGroups[group] && (
                    <div className="category-group-items">
                      {cats.map(cat => (
                        <Link
                          key={cat.id}
                          to={`/products?category=${encodeURIComponent(cat.title)}`}
                          className={`category-item ${active.toLowerCase() === cat.title.toLowerCase() ? 'active' : ''}`}
                        >
                          <span>{cat.title}</span>
                          <span className="item-count">{cat.count}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </aside>

          {/* Main grid area */}
          <main className="categories-main">
            {/* Featured categories banner */}
            {featuredCategories.length > 0 && (
              <section className="featured-categories">
                <h2 className="featured-title">Featured Categories</h2>
                <div className="featured-grid">
                  {featuredCategories.map((cat, idx) => (
                    <Link
                      key={cat.id}
                      to={`/products?category=${encodeURIComponent(cat.title)}`}
                      className={`featured-card featured-card-${idx + 1}`}
                      style={{
                        backgroundImage: `url('${getCategoryImage(cat)}')`,
                      }}
                    >
                      <div className="featured-overlay">
                        <h3 className="featured-name">{cat.title}</h3>
                        <p className="featured-count">{cat.count} Products</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Category grid */}
            <section className="category-grid-section">
              <h2 className="grid-title">All Categories</h2>
              {categories.length > 0 ? (
                <div className="category-grid">
                  {categories.map((cat) => {
                    const isActive = active.toLowerCase() === String(cat.title).toLowerCase()
                    return (
                      <Link
                        key={cat.id}
                        to={`/products?category=${encodeURIComponent(cat.title)}`}
                        aria-current={isActive ? 'page' : undefined}
                        className={`category-card ${isActive ? 'active' : ''}`}
                      >
                        {/* Card image */}
                        <div
                          className="category-card-image"
                          style={{
                            backgroundImage: `url('${getCategoryImage(cat)}')`,
                          }}
                        >
                          {/* Product count badge */}
                          <div className="product-badge">
                            <span className="badge-count">{cat.count}</span>
                            <span className="badge-label">products</span>
                          </div>
                        </div>

                        {/* Card content */}
                        <div className="category-card-content">
                          <h3 className="category-title">{cat.title}</h3>

                          {/* Subcategories */}
                          {cat.subcategories && cat.subcategories.length > 0 && (
                            <div className="subcategories">
                              {cat.subcategories.slice(0, 3).map((sub, idx) => (
                                <Link
                                  key={idx}
                                  to={`/products?category=${encodeURIComponent(cat.title)}&subcategory=${encodeURIComponent(sub)}`}
                                  className="subcategory-link"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {sub}
                                </Link>
                              ))}
                              {cat.subcategories.length > 3 && (
                                <span className="subcategory-more">
                                  +{cat.subcategories.length - 3} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </Link>
                    )
                  })}
                </div>
              ) : null}
            </section>
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
