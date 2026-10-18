import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProductsShop, deleteProduct, transitionProduct } from '@/store/slices/productThunks';
import { AiOutlineEye, AiOutlineDelete, AiOutlineEdit, AiOutlineSearch, AiOutlineCheckCircle, AiOutlineCloseCircle, AiOutlineUndo } from 'react-icons/ai';
import { Link, useSearchParams } from 'react-router-dom';
import Loader from '@/components/common/Loading';
import { toast } from 'react-toastify';
import { useBusinessShops } from '@/business/hooks/useBusinessShops';
import { MdInventory2, MdOutlineArchive } from 'react-icons/md';
import { FiPackage, FiDollarSign } from 'react-icons/fi';
import { SellerStatusBadge, SellerSearchAndFilters, SellerEmptyState, SellerConfirmationDialog } from '@/business/components';
import { SellerDataTable } from '@/business/components';

const isValidObjectId = (value) => /^[a-f0-9]{24}$/i.test(String(value || ''));

const availableUnits = (item) =>
  Math.max(0, Number(item?.stock ?? 0) - Number(item?.reserved ?? 0));

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
  const { shops, activeShop, activeShopId, selectedShopId, hasMultipleShops, selectShop, loading: shopsLoading } = useBusinessShops();

  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const searchQ = searchParams.get('search') || '';
  const [searchTerm, setSearchTerm] = useState(searchQ);
  const [tab, setTab] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [pendingDelete, setPendingDelete] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogProduct, setDialogProduct] = useState(null);

  // Prefer the active shop resolved from the shops list, but fall back to the
  // persisted selected shop id (available synchronously from localStorage) so
  // the products fetch can start in parallel with the shops fetch instead of
  // waiting for the full user → seller → shops → products waterfall.
  const shopId = isValidObjectId(activeShopId)
    ? activeShopId
    : isValidObjectId(selectedShopId)
      ? selectedShopId
      : (isValidObjectId(seller?._id) ? seller._id : '');
  const noShop = !shopsLoading && !shopId;

  useEffect(() => {
    if (shopId) {
      dispatch(getAllProductsShop(shopId));
    }
  }, [dispatch, shopId]);

  const filteredProducts = products.filter((p) => {
    const matchesTab = matchesTabItem(p, tab);
    const matchesSearch = !searchTerm || p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStock = stockFilter === 'all' || (stockFilter === 'low' && availableUnits(p) <= 5 && availableUnits(p) > 0) || (stockFilter === 'out' && availableUnits(p) < 1);
    return matchesTab && matchesSearch && matchesStock;
  });

  const handleLifecycle = async (id, action) => {
    try {
      await dispatch(transitionProduct(id, action));
      toast.success(action === 'publish' ? 'Product published' : action === 'archive' ? 'Product archived' : 'Product updated');
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || 'Action failed');
    }
  };

  const handleDelete = async () => {
    if (!dialogProduct) return;
    try {
      await dispatch(deleteProduct(dialogProduct._id));
      toast.success('Product deleted');
      setDialogOpen(false);
      setDialogProduct(null);
      if (shopId) dispatch(getAllProductsShop(shopId));
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete product');
    }
  };

  // Show a loader while either the shops list or the products are being fetched.
  // Previously products only started loading after shops resolved, which caused
  // a noticeable delay on first load; now they load in parallel.
  if ((isLoading || shopsLoading) && !noShop) return <Loader />;
  if (noShop) {
    return (
      <SellerEmptyState
        title="No shop to manage"
        description="This account does not own a shop yet. Complete seller onboarding to get started."
        action={{ to: '/seller-registration', label: 'Open a store' }}
        icon="🏪"
      />
    );
  }
  if (error) {
    return (
      <SellerEmptyState
        title="Could not load products"
        description={error}
        action={{ to: '/business/products', label: 'Try again' }}
        icon="⚠️"
      />
    );
  }
  if (filteredProducts.length === 0) {
    return (
      <SellerEmptyState
        title="No products found"
        description={searchTerm || tab !== 'all' ? 'Try adjusting your search or filter.' : 'Your shop has no products yet.'}
        action={{ to: '/business/products/create', label: 'Add Product' }}
        icon="📦"
      />
    );
  }

  const columns = [
    { key: 'image', label: 'Image', render: (p) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded overflow-hidden bg-market-surface-container-low shrink-0">
          <img src={Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : '/assets/images/placeholders/product-placeholder.svg'} alt={p.name} className="w-full h-full object-cover" />
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-market-on-surface truncate">{p.name}</p>
          <p className="text-xs text-market-on-surface-variant">{p.sku || '—'}</p>
        </div>
      </div>
    )},
    { key: 'price', label: 'Price', render: (p) => (
      <div className="flex flex-col">
        <p className="font-semibold text-market-on-surface">{Number(p.discountPrice || 0).toLocaleString()} ETB</p>
        {p.originalPrice && p.originalPrice > p.discountPrice && (
          <p className="text-xs text-market-on-surface-variant line-through">{Number(p.originalPrice).toLocaleString()} ETB</p>
        )}
      </div>
    )},
    { key: 'stock', label: 'Stock', render: (p) => {
      const avail = availableUnits(p);
      const status = avail < 1 ? 'OUT' : avail <= 5 ? 'LOW' : 'IN';
      return (
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${status === 'IN' ? 'bg-green-100 text-green-700' : status === 'LOW' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
            {status === 'IN' ? 'In stock' : status === 'LOW' ? 'Low stock' : 'Out'}
          </span>
          <p className="text-xs text-market-on-surface-variant ml-1">{avail} available</p>
        </div>
      );
    }},
    { key: 'status', label: 'Status', render: (p) => <SellerStatusBadge status={p.status} />},
    { key: 'sold', label: 'Sold', render: (p) => <p className="text-market-on-surface">{p.sold_out || 0}</p>},
    { key: 'actions', label: 'Actions', render: (p) => (
      <div className="flex items-center gap-2">
        <Link to={`/business/products/${p._id}`} className="p-2 text-market-on-surface-variant hover:text-market-primary hover:bg-market-surface-container-high rounded-lg transition" title="View">
          <AiOutlineEye size={16} />
        </Link>
        <Link to={`/business/products/${p._id}/edit`} className="p-2 text-market-on-surface-variant hover:text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit">
          <AiOutlineEdit size={16} />
        </Link>
        {p.isActive !== false && p.status !== 'ARCHIVED' ? (
          <button
            onClick={() => handleLifecycle(p._id, 'archive')}
            className="p-2 text-market-on-surface-variant hover:text-red-600 hover:bg-red-50 rounded-lg transition"
            title="Archive"
          >
            <MdOutlineArchive size={18} />
          </button>
        ) : (
          <button
            onClick={() => handleLifecycle(p._id, 'unarchive')}
            className="p-2 text-market-on-surface-variant hover:text-green-600 hover:bg-green-50 rounded-lg transition" title="Restore"
          >
            <AiOutlineUndo size={18} />
          </button>
        )}
        <button
          onClick={() => { setDialogProduct(p); setDialogOpen(true); }}
          className="p-2 text-market-on-surface-variant hover:text-red-600 hover:bg-red-50 rounded-lg transition" title="Delete"
        >
          <AiOutlineDelete size={18} />
        </button>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <SellerSearchAndFilters
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        filters={SELLER_TABS}
        onFilterChange={setTab}
        activeFilter={tab}
        placeholder="Search products…"
      />

      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-market-on-surface">Products</h2>
          <p className="text-sm text-market-on-surface-variant">Manage your shop's catalog</p>
        </div>
        <Link
          to="/business/products/create"
          className="seller-btn-primary"
        >
          <MdInventory2 size={18} className="mr-2" />
          Add Product
        </Link>
      </div>

      <SellerDataTable
        columns={columns}
        rows={filteredProducts}
        emptyMessage="No products found"
        emptyAction={{ to: '/business/products/create', label: 'Add Product' }}
      />

      <div className="flex items-center justify-between text-sm text-market-on-surface-variant">
        <p>Showing {filteredProducts.length} of {products.length} products</p>
      </div>

      <SellerConfirmationDialog
        isOpen={dialogOpen}
        onClose={() => { setDialogOpen(false); setDialogProduct(null); }}
        title="Delete product?"
        description={
          <>
            {dialogProduct?.name} will be permanently removed. Products that appear in orders cannot be deleted — archive them instead.
          </>
        }
        onConfirm={handleDelete}
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />
    </div>
  );
};

export default AllProductsOfASingleShop;
