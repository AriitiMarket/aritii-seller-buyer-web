import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllProductsShop, deleteProduct, transitionProduct } from '@/store/slices/productThunks'
import { AiOutlineEye, AiOutlineDelete, AiOutlineEdit, AiOutlineSearch, AiOutlineCheckCircle, AiOutlineCloseCircle, AiOutlineUndo } from "react-icons/ai";
import { Link, useSearchParams } from 'react-router-dom';
import Loader from '@/components/common/Loading';
import { toast } from 'react-toastify';
import { useBusinessShops } from '@/business/hooks/useBusinessShops';
import { MdInventory2, MdOutlineAddBox, MdOutlineArchive } from 'react-icons/md';
import { FiPackage, FiDollarSign } from 'react-icons/fi';
import { StatusBadge } from '@/business/pages/Dashboard/components';


/** A Mongo ObjectId — the only shop-id shape the product endpoints accept. */
const isValidObjectId = (value) => /^[a-f0-9]{24}$/i.test(String(value || ''));

/**
 * Units a buyer can order right now (stock − units reserved by open orders).
 * Owners restock from this figure — raw `stock` overstates what is sellable.
 */
const availableUnits = (item) =>
  Math.max(0, Number(item?.stock ?? 0) - Number(item?.reserved ?? 0));

/**
 * Seller product tabs. Out-of-stock and unavailable listings never reach the
 * storefront (backend public gate), so they live here on the owner's surface:
 *   • live         — published, active, has available stock (buyer-visible)
 *   • out-of-stock — otherwise public, but available ≤ 0
 *   • unavailable  — draft / archived / deactivated
 */
const SELLER_TABS = [
  { key: 'all', label: 'All' },
  { key: 'live', label: 'Live' },
  { key: 'out-of-stock', label: 'Out of stock' },
  { key: 'unavailable', label: 'Unavailable' },
];

const matchesTabItem = (item, tab) => {
  const lifecycle = item.status || 'PUBLISHED';
  const deactivated = item.isActive === false;
  const unavailable = deactivated || lifecycle === 'DRAFT' || lifecycle === 'ARCHIVED';
  const outOfStock = !unavailable && availableUnits(item) < 1;
  switch (tab) {
    case 'live': return !unavailable && !outOfStock;
    case 'out-of-stock': return outOfStock;
    case 'unavailable': return unavailable;
    default: return true;
  }
};

const AllProductsOfASingleShop = () => {

 const { shopProducts: products = [], isLoading, error } = useSelector((state) => state.products);
  const { seller } = useSelector((state) => state.seller);
  const { shops, activeShop, activeShopId, hasMultipleShops, selectShop, loading: shopsLoading } = useBusinessShops();

  const dispatch = useDispatch();

  const [searchParams] = useSearchParams();
  const searchQ = searchParams.get('search') || '';
  const [searchTerm, setSearchTerm] = useState(searchQ);
  const [tab, setTab] = useState('all');
  // Narrow within a tab: available stock levels (not raw stock).
  const [stockFilter, setStockFilter] = useState('all');
  // Delete used to fire on a single click — one mis-click destroyed a listing.
  const [pendingDelete, setPendingDelete] = useState(null);

  // `seller._id` is the IDENTITY user id (a UUID), not a shop id — sending it to
  // /product/get-all-products-shop is now a clean 400 instead of an empty list,
  // so only ever dispatch for a real ObjectId.
  const shopId = isValidObjectId(activeShopId)
    ? activeShopId
    : (isValidObjectId(seller?._id) ? seller._id : '');
  const noShop = !shopsLoading && !shopId;

  useEffect(() => {
  // Wait for the shop lookup to settle before concluding there is no shop.
  if (shopsLoading || !shopId) return;
    // Seller inventory must see unlisted products too, or they could never
    // be re-activated. The backend only honours includeInactive for the owner.
    dispatch(getAllProductsShop(shopId, { includeInactive: true }));
}, [dispatch, shopId, shopsLoading]);











const handleDeleteProduct = async (id) => {
  setPendingDelete(null);
  try {
    await dispatch(deleteProduct(id));
   
    if (shopId) {
      dispatch(getAllProductsShop(shopId, { includeInactive: true }));
    }

    toast.success("Product deleted successfully");  

  } catch (error) {
    // A product with order history cannot be hard-deleted (409) — the backend
    // explains why and points at archiving, so surface that reason instead of a
    // generic failure.
    console.error("Failed to delete product:", error);
    toast.error(error?.response?.data?.message || "Failed to delete product");
  }
}

  const filteredProducts = products?.filter((item) => {
    const matchesSearch = !searchTerm || item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const inTab = matchesTabItem(item, tab);
    const available = availableUnits(item);
    const matchesStock = stockFilter === 'all' ||
      (stockFilter === 'in-stock' && available > 5) ||
      (stockFilter === 'low-stock' && available > 0 && available <= 5) ||
      (stockFilter === 'out-of-stock' && available < 1);
    return matchesSearch && inTab && matchesStock;
  }) || [];

  // Publish / Draft — the APPROVED seller controls their own lifecycle; there is
  // no admin approval step (admin's only controls are activate/deactivate).
  const handleLifecycle = async (id, action) => {
    // publish/draft are the seller's visibility switches; archive retires a
    // listing for good (reversible) without losing its stock ledger or reviews.
    const labels = {
      publish: 'Product published',
      draft: 'Product moved to draft',
      archive: 'Product archived — it is no longer in the marketplace',
      unarchive: 'Product restored as a draft',
    };
    try {
      await dispatch(transitionProduct(id, action));
      toast.success(labels[action] || 'Product updated');
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || 'Action failed');
    }
  }

    
  return (
    <>
      {noShop ? (
        <div className="bg-white rounded-xl p-10 text-center shadow-sm border border-gray-100">
          <MdInventory2 className="text-5xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-lg mb-2">No shop yet</p>
          <p className="text-gray-500 text-sm">Your products belong to a shop — contact support if your shop is missing.</p>
        </div>
      ) : isLoading ? (
        <Loader />
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-primary-dark mb-1">
                  {activeShop?.name || 'Your store'}
                </p>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Products</h1>
                <p className="text-sm text-gray-600">
                  Manage your product catalog{hasMultipleShops ? ` · ${products.length} in this shop` : ''}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {hasMultipleShops && (
                  <label className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="font-medium">Shop:</span>
                    <select
                      value={activeShopId || ''}
                      onChange={(e) => selectShop(e.target.value)}
                      className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 focus:border-brand-primary focus:outline-none"
                      aria-label="Select active shop"
                    >
                      {shops.map((s) => (
                        <option key={s._id} value={s._id}>{s.name || 'Unnamed shop'}</option>
                      ))}
                    </select>
                  </label>
                )}
                <Link
                  to="/business/products/create"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-semibold hover:bg-brand-primary-dark transition"
                >
                  <MdOutlineAddBox size={18} />
                  Add Product
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            {/* Owner tabs — out-of-stock / unavailable only surface here. */}
            <div className="flex flex-wrap gap-1 mb-4 border-b border-gray-100 pb-3">
              {SELLER_TABS.map((t) => {
                const count = products?.filter((p) => matchesTabItem(p, t.key)).length || 0;
                return (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => setTab(t.key)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition ${
                      tab === t.key
                        ? 'bg-brand-primary text-white'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {t.label}
                    <span className={`ml-1.5 text-xs ${tab === t.key ? 'text-white/80' : 'text-gray-400'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <AiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white"
                >
                  <option value="all">All Stock</option>
                  <option value="in-stock">In Stock</option>
                  <option value="low-stock">Low Stock</option>
                  <option value="out-of-stock">Out of Stock</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {error ? (
              <div className="text-center py-16 px-6">
                <p className="text-red-600 font-semibold mb-2">Could not load products</p>
                <p className="text-gray-500 text-sm">{error}</p>
                {shopId && (
                  <button
                    onClick={() => dispatch(getAllProductsShop(shopId, { includeInactive: true }))}
                    className="mt-4 px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Retry
                  </button>
                )}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <MdInventory2 className="text-5xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg mb-2">No products found</p>
                <p className="text-gray-500 text-sm">Add your first product to get started</p>
              </div>
            ) : (
              <>
                {/* Desktop: table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        <th className="px-6 py-4">Product</th>
                        <th className="px-6 py-4">Price</th>
                        <th className="px-6 py-4">Stock</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Sold</th>
                        <th className="px-6 py-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredProducts.map((product) => (
                        <tr key={product._id} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                <FiPackage className="text-gray-400" size={20} />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{product.name}</p>
                                <p className="text-xs text-gray-500">{product.category || 'No category'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1">
                              <FiDollarSign className="text-gray-400" size={16} />
                              <span className="font-semibold text-gray-900">
                                {Number(product.discountPrice || 0).toLocaleString()}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {(() => {
                              const available = availableUnits(product);
                              return (
                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                  available < 1
                                    ? 'bg-red-100 text-red-700'
                                    : available <= 5
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-green-100 text-green-700'
                                }`}>
                                  {available} of {product.stock ?? 0} available
                                  {product.reserved ? ` (${product.reserved} reserved)` : ''}
                                </span>
                              );
                            })()}
                          </td>
                          <td className="px-6 py-4">
                            {(() => {
                              const lifecycle = product.status || 'PUBLISHED';
                              if (product.isActive === false) return <StatusBadge status="inactive" />;
                              return <StatusBadge status={lifecycle} />;
                            })()}
                          </td>
                          <td className="px-6 py-4 text-gray-700">
                            {product.sold_out || 0}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {(product.status || 'PUBLISHED') !== 'ARCHIVED' && (
                                (product.status || 'PUBLISHED') === 'DRAFT' ? (
                                  <button
                                    onClick={() => handleLifecycle(product._id, 'publish')}
                                    className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition"
                                    title="Publish"
                                  >
                                    <AiOutlineCheckCircle size={18} />
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleLifecycle(product._id, 'draft')}
                                    className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                                    title="Move to draft (unpublish)"
                                  >
                                    <AiOutlineCloseCircle size={18} />
                                  </button>
                                )
                              )}
                              {(product.status || 'PUBLISHED') === 'ARCHIVED' ? (
                                <button
                                  onClick={() => handleLifecycle(product._id, 'unarchive')}
                                  className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition"
                                  title="Restore as a draft"
                                >
                                  <AiOutlineUndo size={18} />
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleLifecycle(product._id, 'archive')}
                                  className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition"
                                  title="Archive (hide from the storefront, keep the record)"
                                >
                                  <MdOutlineArchive size={18} />
                                </button>
                              )}
                              <Link
                                to={`/business/products/${product._id}`}
                                className="p-2 text-gray-500 hover:text-brand-primary-dark hover:bg-brand-primary-light rounded-lg transition"
                                title="View"
                              >
                                <AiOutlineEye size={18} />
                              </Link>
                              <Link
                                to={`/business/products/${product._id}/edit`}
                                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                title="Edit"
                              >
                                <AiOutlineEdit size={18} />
                              </Link>
                              <button
                                onClick={() => setPendingDelete(product)}
                                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                title="Delete"
                              >
                                <AiOutlineDelete size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile: stacked section cards — no horizontal scroll */}
                <div className="md:hidden divide-y divide-gray-100">
                  {filteredProducts.map((product) => {
                    const available = availableUnits(product);
                    const lifecycle = product.status || 'PUBLISHED';
                    return (
                      <div key={product._id} className="p-4 space-y-3">
                        {/* Section: identity */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-11 h-11 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                              <FiPackage className="text-gray-400" size={18} />
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-gray-900 truncate">{product.name}</p>
                              <p className="text-xs text-gray-500 truncate">{product.category || 'No category'}</p>
                            </div>
                          </div>
                          {product.isActive === false
                            ? <StatusBadge status="inactive" />
                            : <StatusBadge status={lifecycle} />}
                        </div>

                        {/* Section: details grid */}
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                          <div>
                            <p className="text-xs text-gray-400">Price</p>
                            <p className="font-semibold text-gray-900">
                              {Number(product.discountPrice || 0).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Sold</p>
                            <p className="font-semibold text-gray-900">{product.sold_out || 0}</p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-xs text-gray-400">Stock</p>
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              available < 1
                                ? 'bg-red-100 text-red-700'
                                : available <= 5
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-green-100 text-green-700'
                            }`}>
                              {available} of {product.stock ?? 0} available
                              {product.reserved ? ` (${product.reserved} reserved)` : ''}
                            </span>
                          </div>
                        </div>

                        {/* Section: actions */}
                        <div className="flex items-center gap-1 pt-1 border-t border-gray-50">
                          {(product.status || 'PUBLISHED') !== 'ARCHIVED' && (
                            (product.status || 'PUBLISHED') === 'DRAFT' ? (
                              <button
                                onClick={() => handleLifecycle(product._id, 'publish')}
                                className="p-2.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition"
                                title="Publish"
                              >
                                <AiOutlineCheckCircle size={18} />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleLifecycle(product._id, 'draft')}
                                className="p-2.5 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                                title="Move to draft"
                              >
                                <AiOutlineCloseCircle size={18} />
                              </button>
                            )
                          )}
                          {(product.status || 'PUBLISHED') === 'ARCHIVED' ? (
                            <button
                              onClick={() => handleLifecycle(product._id, 'unarchive')}
                              className="p-2.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition"
                              title="Restore"
                            >
                              <AiOutlineUndo size={18} />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleLifecycle(product._id, 'archive')}
                              className="p-2.5 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition"
                              title="Archive"
                            >
                              <MdOutlineArchive size={18} />
                            </button>
                          )}
                          <Link
                            to={`/business/products/${product._id}`}
                            className="p-2.5 text-gray-500 hover:text-brand-primary-dark hover:bg-brand-primary-light rounded-lg transition"
                            title="View"
                          >
                            <AiOutlineEye size={18} />
                          </Link>
                          <Link
                            to={`/business/products/${product._id}/edit`}
                            className="p-2.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Edit"
                          >
                            <AiOutlineEdit size={18} />
                          </Link>
                          <button
                            onClick={() => setPendingDelete(product)}
                            className="p-2.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Delete"
                          >
                            <AiOutlineDelete size={18} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <p>Showing {filteredProducts.length} of {products?.length || 0} products</p>
          </div>

          {pendingDelete && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
              <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete product?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  <span className="font-medium">{pendingDelete.name}</span> will be permanently removed.
                  Products that appear in orders cannot be deleted — archive them instead.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setPendingDelete(null)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(pendingDelete._id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default AllProductsOfASingleShop