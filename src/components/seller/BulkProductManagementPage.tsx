import React, { useState, useEffect } from 'react';
import { Button, Modal, Select, Checkbox } from '@/components/common';
import { productService } from '@/services/product.service';
import { sellerService } from '@/services/seller.service';
import { useToast } from '@/hooks/useToast';

export const BulkProductManagementPage = () => {
  const [products, setProducts] = useState([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [action, setAction] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getShopProducts(''); // Current user's shop
      setProducts(data);
    } catch (err) {
      toast({ message: 'Failed to load products', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (productId: string) => {
    setSelectedIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const toggleSelectAll = () => {
    setSelectedIds(selectedIds.length === products.length ? [] : products.map((p) => p._id));
  };

  const handleBulkAction = async () => {
    if (selectedIds.length === 0) {
      toast({ message: 'Select products first', type: 'error' });
      return;
    }

    try {
      await sellerService.bulkProductUpdate(selectedIds, action);
      toast({ message: `${selectedIds.length} products ${action}ed successfully`, type: 'success' });
      setSelectedIds([]);
      setAction('');
      setShowModal(false);
      loadProducts();
    } catch (err) {
      toast({ message: 'Bulk action failed', type: 'error' });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Bulk Product Management</h1>
        <span className="text-sm text-gray-600">
          {selectedIds.length} of {products.length} selected
        </span>
      </div>

      <div className="bg-white rounded-lg shadow">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-3 text-left">
                <Checkbox
                  checked={selectedIds.length === products.length}
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="px-4 py-3 text-left">Product Name</th>
              <th className="px-4 py-3 text-left">Price</th>
              <th className="px-4 py-3 text-left">Stock</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">
                  <Checkbox
                    checked={selectedIds.includes(product._id)}
                    onChange={() => toggleSelect(product._id)}
                  />
                </td>
                <td className="px-4 py-3">{product.name}</td>
                <td className="px-4 py-3">${product.discountPrice}</td>
                <td className="px-4 py-3">{product.stock}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded text-sm ${
                      product.status === 'PUBLISHED'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {product.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedIds.length > 0 && (
        <div className="flex gap-2">
          <Select
            value={action}
            onChange={(e) => setAction(e.target.value)}
            options={[
              { label: 'Select action...', value: '' },
              { label: 'Publish', value: 'publish' },
              { label: 'Draft', value: 'draft' },
              { label: 'Archive', value: 'archive' },
              { label: 'Unarchive', value: 'unarchive' },
            ]}
          />
          <Button
            onClick={() => setShowModal(true)}
            disabled={!action}
            variant="primary"
          >
            Apply to {selectedIds.length} Products
          </Button>
        </div>
      )}

      {showModal && (
        <Modal
          title="Confirm Bulk Action"
          open={true}
          onClose={() => setShowModal(false)}
        >
          <div className="space-y-4">
            <p>
              You're about to {action} {selectedIds.length} product(s). This action cannot be undone
              immediately.
            </p>
            <div className="flex gap-2 pt-4">
              <Button onClick={handleBulkAction} variant="primary">
                Confirm
              </Button>
              <Button onClick={() => setShowModal(false)} variant="outline">
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
