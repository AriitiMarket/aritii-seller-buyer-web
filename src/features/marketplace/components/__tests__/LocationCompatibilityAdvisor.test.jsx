import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import LocationCompatibilityAdvisor from '../LocationCompatibilityAdvisor';
import { cartReducer } from '@/store/slices/cartSlice';
import { wishlistReducer } from '@/store/slices/wishlistSlice';

vi.mock('@/components/common/ImageWithFallback', () => ({
  ProductImage: () => <div data-testid="product-image" />,
}));

vi.mock('@/features/marketplace/components/DeliveryZoneSelector', () => ({
  default: ({ onSelect }) => (
    <div data-testid="delivery-zone-selector">
      <button
        type="button"
        onClick={() => onSelect({ zoneId: 'zone-new', zoneName: 'Arada' })}
      >
        Select Arada
      </button>
    </div>
  ),
}));

vi.mock('@/services', () => ({
  shopService: {
    getPublicById: vi.fn().mockResolvedValue({
      name: 'Fresh Fruits Harar',
      delivery: {
        zoneNames: [{ id: 'zone-h1', name: 'Harar City Zone' }],
        cityName: 'Harar',
      },
    }),
    getPublicAll: vi.fn().mockResolvedValue([
      {
        _id: 'shop-alt-1',
        name: 'Addis Superstore',
        delivery: { servesSelectedZone: true },
      },
    ]),
  },
  productService: {
    getPublicPage: vi.fn().mockResolvedValue({
      products: [
        {
          _id: 'prod-alt-1',
          name: 'Alternative Addis Honey 500g',
          price: 350,
          shop: { name: 'Addis Superstore' },
        },
      ],
      total: 1,
    }),
  },
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('LocationCompatibilityAdvisor component', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        cart: cartReducer,
        wishlist: wishlistReducer,
        user: () => ({ isAuthenticated: true }),
      },
    });
  });

  const sampleValidation = {
    valid: false,
    zone: { id: 'zone-bole', name: 'Bole Zone' },
    items: [
      {
        productId: 'prod-123',
        _id: 'prod-123',
        name: 'Harar Coffee Beans 1kg',
        shopId: 'shop-harar',
        shopName: 'Fresh Fruits Harar',
        price: 450,
        eligible: false,
        message: 'Fresh Fruits Harar does not deliver to Bole Zone (it serves: Harar City Zone)',
      },
    ],
  };

  it('renders nothing when validation is null or valid', () => {
    const { container } = render(
      <ReduxProvider store={store}>
        <MemoryRouter>
          <LocationCompatibilityAdvisor validation={{ valid: true }} />
        </MemoryRouter>
      </ReduxProvider>
    );
    expect(container.firstChild).toBeNull();
  });

  it('displays the incompatible items and explains the location issue', async () => {
    render(
      <ReduxProvider store={store}>
        <MemoryRouter>
          <LocationCompatibilityAdvisor
            validation={sampleValidation}
            currentZoneId="zone-bole"
            currentZoneName="Bole Zone"
          />
        </MemoryRouter>
      </ReduxProvider>
    );

    expect(screen.getByText(/Delivery Area Notice for Your Order/i)).toBeInTheDocument();
    expect(screen.getByText(/Harar Coffee Beans 1kg/i)).toBeInTheDocument();
    expect(screen.getByText(/Locations to use for this item:/i)).toBeInTheDocument();
    expect(screen.getByText(/📍 Harar City Zone/i)).toBeInTheDocument();
  });

  it('renders matching saved address and lets user switch to it', () => {
    const onSelectAddressMock = vi.fn();
    const savedAddresses = [
      {
        _id: 'addr-harar',
        address1: 'Kebele 02 House 10',
        deliveryZoneName: 'Harar City Zone',
      },
    ];

    render(
      <ReduxProvider store={store}>
        <MemoryRouter>
          <LocationCompatibilityAdvisor
            validation={sampleValidation}
            currentZoneId="zone-bole"
            currentZoneName="Bole Zone"
            savedAddresses={savedAddresses}
            onSelectAddress={onSelectAddressMock}
          />
        </MemoryRouter>
      </ReduxProvider>
    );

    const switchBtn = screen.getByRole('button', { name: /switch to this address/i });
    expect(switchBtn).toBeInTheDocument();
    fireEvent.click(switchBtn);
    expect(onSelectAddressMock).toHaveBeenCalledWith('addr-harar');
  });

  it('displays alternative products delivering to current zone and allows swapping', async () => {
    render(
      <ReduxProvider store={store}>
        <MemoryRouter>
          <LocationCompatibilityAdvisor
            validation={sampleValidation}
            currentZoneId="zone-bole"
            currentZoneName="Bole Zone"
          />
        </MemoryRouter>
      </ReduxProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Alternative Addis Honey 500g/i)).toBeInTheDocument();
    });

    const swapBtn = screen.getByRole('button', { name: /swap with this/i });
    expect(swapBtn).toBeInTheDocument();
  });

  it('allows removing the incompatible item', () => {
    const onRemoveItemMock = vi.fn();

    render(
      <ReduxProvider store={store}>
        <MemoryRouter>
          <LocationCompatibilityAdvisor
            validation={sampleValidation}
            currentZoneId="zone-bole"
            currentZoneName="Bole Zone"
            onRemoveItem={onRemoveItemMock}
          />
        </MemoryRouter>
      </ReduxProvider>
    );

    const removeBtn = screen.getByRole('button', { name: /^remove$/i });
    fireEvent.click(removeBtn);
    expect(onRemoveItemMock).toHaveBeenCalledWith('prod-123');
  });

  it('toggles location picker to select a new delivery area', () => {
    const onZoneSelectMock = vi.fn();

    render(
      <ReduxProvider store={store}>
        <MemoryRouter>
          <LocationCompatibilityAdvisor
            validation={sampleValidation}
            currentZoneId="zone-bole"
            currentZoneName="Bole Zone"
            onZoneSelect={onZoneSelectMock}
          />
        </MemoryRouter>
      </ReduxProvider>
    );

    const changeAreaBtn = screen.getByRole('button', { name: /change delivery area/i });
    fireEvent.click(changeAreaBtn);

    expect(screen.getByTestId('delivery-zone-selector')).toBeInTheDocument();
    const selectZoneBtn = screen.getByRole('button', { name: /select arada/i });
    fireEvent.click(selectZoneBtn);

    expect(onZoneSelectMock).toHaveBeenCalledWith({ zoneId: 'zone-new', zoneName: 'Arada' });
  });

  it('allows 1-click removing all incompatible items via quick resolution bar', () => {
    const onRemoveItemMock = vi.fn();

    render(
      <ReduxProvider store={store}>
        <MemoryRouter>
          <LocationCompatibilityAdvisor
            validation={sampleValidation}
            currentZoneId="zone-bole"
            currentZoneName="Bole Zone"
            onRemoveItem={onRemoveItemMock}
          />
        </MemoryRouter>
      </ReduxProvider>
    );

    const clearAllBtn = screen.getByRole('button', { name: /remove all incompatible/i });
    expect(clearAllBtn).toBeInTheDocument();
    fireEvent.click(clearAllBtn);
    expect(onRemoveItemMock).toHaveBeenCalledWith('prod-123');
  });
});
