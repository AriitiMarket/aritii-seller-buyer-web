import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getAllProductsShop } from '@/store/slices/productThunks';
import productService from '@/services/product.service';
import { toast } from 'react-toastify';
import { ProductImage } from '@/components/common/ImageWithFallback';
import Loader from '@/components/common/Loading';
import { useBusinessShops } from '@/business/hooks/useBusinessShops';
import { SellerSearchAndFilters, SellerEmptyState } from '@/business/components';

const BusinessInventoryPage = () => {
  const dispatch = useDispatch();
  const { shopProducts = [], isLoading } = useSelector((state) => state.products);
  const { seller } = useSelector((state) => state.seller);
  const { activeShopId } = useBusinessShops();
  const [filter, setFilter] = useState('ALL');

  const [stockFor, setStockFor] = useState(null);
  const [stockQty, setStockQty] = useState('');
  const [stockNote, setStockNote] = useState('');
  const [, setMovements] = useState(null);
  const [busy, setBusy] = useState(false);

  const shopId = activeShopId || seller?._id;

  useEffect(() => {
    if (shopId) {
      dispatch(getAllProductsShop(shopId, { includeInactive: true }));
    }
  }, [dispatch, shopId]);

  if (isLoading || !seller) return <Loader />;

  const availableUnits = (p) => Math.max(0, Number(p.stock ?? 0) - Number(p.reserved ?? 0));
  const lowStock = shopProducts.filter((p) => { const a = availableUnits(p); return a <= 5 && a > 0 });
  const outOfStock = shopProducts.filter((p) => availableUnits(p) < 1);
  const inStock = shopProducts.filter((p) => availableUnits(p) > 5);
  const unlisted = shopProducts.filter((p) => p.isActive === false || p.status === 'DRAFT' || p.status === 'ARCHIVED');

  const reloadList = () => {
    if (shopId) dispatch(getAllProductsShop(shopId, { includeInactive: true }));
  };

  const openStockPanel = async (p) => {
    if (stockFor && stockFor._id === p._id) {
      setStockFor(null); setMovements(null); return;
    }
    setStockFor(p); setStockQty(''); setStockNote(''); setMovements(null);
  };


  const applyStock = async (mode) => {
    if (!stockFor) return;
    const qty = Number(stockQty);
    if (!Number.isFinite(qty) || qty < 0 || (mode === 'restock' && qty <= 0)) {
      toast.error('Enter a valid quantity');
      return;
    }
    setBusy(true);
    try {
      if (mode === 'restock') {
        // add qty units to current stock (writes a StockMovement ledger entry)
        await productService.restock(stockFor._id, qty, stockNote);
      } else {
        // set total stock to qty (backend computes delta, guards reserved units)
        await productService.adjustStock(stockFor._id, qty, stockNote);
      }
      toast.success('Stock updated');
      setStockFor(null);
      reloadList();
    } catch (e) {
      toast.error(e?.response?.data?.message || e?.message || 'Failed to update stock');
    } finally {
      setBusy(false);
    }
  };

  const FILTERS = [
    { key: 'ALL', label: 'All Products', count: shopProducts.length },
    { key: 'IN_STOCK', label: 'In Stock', count: inStock.length },
    { key: 'LOW_STOCK', label: 'Low Stock', count: lowStock.length },
    { key: 'OUT_OF_STOCK', label: 'Out of Stock', count: outOfStock.length },
    { key: 'UNLISTED', label: 'Unlisted', count: unlisted.length },
  ];

  const view = shopProducts.filter((p) => {
    if (filter === 'IN_STOCK') return availableUnits(p) > 5;
    if (filter === 'LOW_STOCK') { const a = availableUnits(p); return a <= 5 && a > 0; }
    if (filter === 'OUT_OF_STOCK') return availableUnits(p) < 1;
    if (filter === 'UNLISTED') return p.isActive === false || p.status === 'DRAFT' || p.status === 'ARCHIVED';
    return true;
  });

  return (
    <>
      <div className="space-y-6">
        <SellerSearchAndFilters
          searchValue=""
          onSearchChange={() => {}}
          filters={FILTERS}
          onFilterChange={setFilter}
          activeFilter={filter}
          placeholder="Search inventory…"
        />

        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-market-on-surface">Inventory</h2>
            <p className="text-sm text-market-on-surface-variant">Track and manage your stock levels</p>
          </div>
          <Link
            to="/business/products/create"
            className="seller-btn-primary"
          >
            <span className="text-sm font-medium">Add Product</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="seller-stat-card border-green-50">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2.5 rounded-lg bg-green-100 text-green-600">
                <span className="text-xl">📦</span>
              </div>
            </div>
            <p className="seller-stat-card-value text-green-700 font-bold">{inStock.length}</p>
            <p className="seller-stat-card-label">In stock</p>
          </div>
          <div className="seller-stat-card border-amber-50">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2.5 rounded-lg bg-amber-100 text-amber-600">
                <span className="text-xl">⚠️</span>
              </div>
            </div>
            <p className="seller-stat-card-value text-amber-700 font-bold">{lowStock.length}</p>
            <p className="seller-stat-card-label">Low stock</p>
          </div>
          <div className="seller-stat-card border-red-50">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2.5 rounded-lg bg-red-100 text-red-600">
                <span className="text-xl">🚫</span>
              </div>
            </div>
            <p className="seller-stat-card-value text-red-700 font-bold">{outOfStock.length}</p>
            <p className="seller-stat-card-label">Out of stock</p>
          </div>
          <div className="seller-stat-card border-gray-50">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2.5 rounded-lg bg-gray-100 text-gray-600">
                <span className="text-xl">🔕</span>
              </div>
            </div>
            <p className="seller-stat-card-value text-gray-700 font-bold">{unlisted.length}</p>
            <p className="seller-stat-card-label">Unlisted</p>
          </div>
        </div>

        {view.length === 0 ? (
          <SellerEmptyState
            title="No products in this view"
            description="Try adjusting your filter or add a new product."
            action={{ to: '/business/products/create', label: 'Add Product' }}
            icon="📦"
          />
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a222d] shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f0f2f2] dark:bg-[#131921] border-b border-gray-200 dark:border-gray-800">
                  <th scope="col" className="px-4 py-2.5 text-[11px] font-bold text-[#0f1111] dark:text-gray-300 uppercase tracking-wider">Product</th>
                  <th scope="col" className="px-4 py-2.5 text-[11px] font-bold text-[#0f1111] dark:text-gray-300 uppercase tracking-wider">Available</th>
                  <th scope="col" className="px-4 py-2.5 text-[11px] font-bold text-[#0f1111] dark:text-gray-300 uppercase tracking-wider">Reserved</th>
                  <th scope="col" className="px-4 py-2.5 text-[11px] font-bold text-[#0f1111] dark:text-gray-300 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-4 py-2.5 text-[11px] font-bold text-[#0f1111] dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-xs text-gray-800 dark:text-gray-200">
                {view.map((p) => {
                  const st = availableUnits(p);
                  const status = st < 1 ? 'OUT' : st <= 5 ? 'LOW' : 'IN';
                  return (
                    <tr key={p._id} className="hover:bg-gray-50 dark:hover:bg-[#232f3e]/40 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded border border-gray-200 dark:border-gray-700 overflow-hidden bg-gray-50 dark:bg-gray-800 shrink-0">
                            <ProductImage data={p} className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900 dark:text-white truncate">{p.name}</p>
                            {(p.isActive === false || p.status === 'DRAFT' || p.status === 'ARCHIVED') && (
                              <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                                {p.isActive === false ? 'Unlisted' : p.status === 'ARCHIVED' ? 'Archived' : 'Draft'}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">{st}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{p.reserved || 0}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${status === 'IN' ? 'bg-green-100 text-green-700' : status === 'LOW' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                          {status === 'IN' ? 'In stock' : status === 'LOW' ? 'Low stock' : 'Out'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openStockPanel(p)}
                            className="text-xs font-semibold text-[#007185] dark:text-[#42a2b3] hover:text-[#c7511f] hover:underline"
                          >
                            Manage stock
                          </button>
                          <span className="text-gray-300 dark:text-gray-600">|</span>
                          <Link to={`/business/products/${p._id}/edit`} className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                            Edit
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-market-on-surface-variant">
          <p>Showing {view.length} of {shopProducts.length} products</p>
        </div>
      </div>

      {stockFor && (
        <div className="seller-form-section">
          <h2 className="seller-form-section-title">Manage Stock: {stockFor.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="seller-form-group">
              <label className="seller-form-label">Current stock</label>
              <p className="text-market-on-surface">{stockFor.stock}</p>
              <p className="text-xs text-market-on-surface-variant">Reserved: {stockFor.reserved || 0}</p>
            </div>
            <div className="seller-form-group">
              <label className="seller-form-label">New quantity</label>
              <input
                type="number"
                min="0"
                value={stockQty}
                onChange={(e) => setStockQty(e.target.value)}
                className="seller-form-input"
                placeholder="Enter quantity"
              />
            </div>
            <div className="seller-form-group">
              <label className="seller-form-label">Note</label>
              <input
                type="text"
                value={stockNote}
                onChange={(e) => setStockNote(e.target.value)}
                className="seller-form-input"
                placeholder="Reason for adjustment"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => applyStock('restock')}
              disabled={busy}
              className="seller-btn-primary"
            >
              {busy ? 'Updating…' : 'Restock'}
            </button>
            <button
              type="button"
              onClick={() => applyStock('set')}
              disabled={busy}
              className="seller-btn-secondary"
            >
              Set total
            </button>
            <button
              type="button"
              onClick={() => setStockFor(null)}
              className="seller-btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default BusinessInventoryPage;
