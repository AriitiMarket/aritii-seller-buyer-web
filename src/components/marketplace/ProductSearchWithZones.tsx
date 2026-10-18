import React, { useState, useEffect } from 'react';
import { Input, Select, Button, ProductCard } from '@/components/common';
import { buyerService } from '@/services/buyer.service';
import { useLocation } from '@/hooks/useLocation';
import { useToast } from '@/hooks/useToast';

export const ProductSearchWithZones = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedZone, setSelectedZone] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [zones, setZones] = useState([]);
  const [cities, setCities] = useState([]);
  const { zone, city } = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // Set default zone/city from user location
    if (zone) setSelectedZone(zone.id);
    if (city) setSelectedCity(city.id);

    // Load available zones/cities
    loadZonesAndCities();
  }, [zone, city]);

  const loadZonesAndCities = async () => {
    try {
      // This would fetch from your location service
      // For now using mocked data
      setZones([
        { id: 'zone-1', name: 'Zone 1' },
        { id: 'zone-2', name: 'Zone 2' },
      ]);
      setCities([
        { id: 'city-1', name: 'City 1' },
        { id: 'city-2', name: 'City 2' },
      ]);
    } catch (err) {
      toast({ message: 'Failed to load zones', type: 'error' });
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({ message: 'Enter search query', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      const result = await buyerService.searchProducts(searchQuery, selectedZone, selectedCity);
      setProducts(result.products || []);
      
      if (result.products.length === 0) {
        toast({ message: 'No products found for your zone', type: 'info' });
      }
    } catch (err) {
      toast({ message: 'Search failed', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Bar with Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Find Products</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />

          <Select
            label="Zone"
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
            options={zones.map((z) => ({ label: z.name, value: z.id }))}
          />

          <Select
            label="City"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            options={cities.map((c) => ({ label: c.name, value: c.id }))}
          />

          <div className="flex items-end">
            <Button onClick={handleSearch} disabled={loading} className="w-full">
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </div>

        {selectedZone && (
          <p className="text-sm text-gray-600 mt-2">
            Showing products available in your zone
          </p>
        )}
      </div>

      {/* Search Results */}
      {products.length > 0 && (
        <div>
          <p className="text-lg font-semibold mb-4">
            Found {products.length} product{products.length !== 1 ? 's' : ''}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      )}

      {!loading && products.length === 0 && searchQuery && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">
            No products found matching "{searchQuery}" in your area.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Try different search terms or change your delivery zone.
          </p>
        </div>
      )}
    </div>
  );
};
