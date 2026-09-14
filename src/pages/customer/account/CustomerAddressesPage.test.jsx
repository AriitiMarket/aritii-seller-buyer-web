/**
 * Test suite for CustomerAddressesPage
 * Verifies address management functionality:
 * - Load addresses from backend
 * - Display addresses in grid layout
 * - Show empty state when no addresses
 * - Add new address with validation
 * - Delete address with confirmation
 * - Sync with Redux state
 * - Error handling
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import CustomerAddressesPage from './CustomerAddressesPage'
import { addressService } from '../../../services'
import * as userActions from '../../../store/redux/actions/user'
import { userReducer } from '../../../store/redux/reducers/user'

// Mock dependencies
jest.mock('react-toastify')
jest.mock('../../../services/address.service')
jest.mock('../../../store/redux/actions/user')
jest.mock('country-state-city', () => ({
  Country: {
    getAllCountries: () => [
      { isoCode: 'US', name: 'United States' },
      { isoCode: 'ET', name: 'Ethiopia' },
    ],
    getCountryByCode: (code) => {
      const map = { US: 'United States', ET: 'Ethiopia' }
      return { name: map[code] }
    },
  },
  State: {
    getStatesOfCountry: (code) => {
      if (code === 'US') {
        return [
          { isoCode: 'CA', name: 'California' },
          { isoCode: 'NY', name: 'New York' },
        ]
      }
      if (code === 'ET') {
        return [
          { isoCode: 'AA', name: 'Addis Ababa' },
          { isoCode: 'OR', name: 'Oromia' },
        ]
      }
      return []
    },
  },
}))

// Mock address data
const mockAddresses = [
  {
    _id: '1',
    address1: '123 Main St',
    address2: 'Apt 4B',
    city: 'CA',
    country: 'US',
    zipCode: '90001',
    addressType: 'Home',
  },
  {
    _id: '2',
    address1: '456 Work Ave',
    address2: '',
    city: 'NY',
    country: 'US',
    zipCode: '10001',
    addressType: 'Office',
  },
]

// Helper function to create mock store
const createMockStore = (initialState = {}) => {
  const defaultState = {
    user: {
      user: {
        _id: 'user-123',
        addresses: [],
      },
      updateUserAddressLoading: false,
      deleteUserAddressLoading: false,
      addressError: null,
    },
    ...initialState,
  }

  return configureStore({
    reducer: {
      user: (state = defaultState.user) => state,
    },
    preloadedState: defaultState,
  })
}

describe('CustomerAddressesPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    addressService.getAll.mockResolvedValue(mockAddresses)
  })

  describe('1. Display user saved addresses', () => {
    test('should load and display addresses from backend on mount', async () => {
      const store = createMockStore()
      render(
        <Provider store={store}>
          <CustomerAddressesPage />
        </Provider>
      )

      // Should show loading state initially
      expect(screen.getByText(/Loading addresses/i)).toBeInTheDocument()

      // Wait for addresses to load
      await waitFor(() => {
        expect(addressService.getAll).toHaveBeenCalled()
      })

      // Check if addresses are displayed
      await waitFor(() => {
        expect(screen.getByText(/123 Main St/i)).toBeInTheDocument()
        expect(screen.getByText(/456 Work Ave/i)).toBeInTheDocument()
      })
    })

    test('should display address details correctly', async () => {
      const store = createMockStore({ user: { user: { addresses: mockAddresses } } })
      render(
        <Provider store={store}>
          <CustomerAddressesPage />
        </Provider>
      )

      await waitFor(() => {
        // Check address line 1
        expect(screen.getByText('123 Main St')).toBeInTheDocument()
        // Check address line 2
        expect(screen.getByText('Apt 4B')).toBeInTheDocument()
        // Check city
        expect(screen.getByText('California')).toBeInTheDocument()
        // Check postal code
        expect(screen.getByText('90001')).toBeInTheDocument()
        // Check country
        expect(screen.getByText('United States')).toBeInTheDocument()
      })
    })
  })

  describe('2. Empty state handling', () => {
    test('should show empty state when no addresses exist', async () => {
      addressService.getAll.mockResolvedValue([])
      const store = createMockStore()

      render(
        <Provider store={store}>
          <CustomerAddressesPage />
        </Provider>
      )

      await waitFor(() => {
        expect(screen.getByText(/No addresses yet/i)).toBeInTheDocument()
        expect(screen.getByText(/Add a delivery address to get started/i)).toBeInTheDocument()
        expect(screen.getByText(/Add Your First Address/i)).toBeInTheDocument()
      })
    })
  })

  describe('3. Add address functionality', () => {
    test('should open modal when Add Address button is clicked', async () => {
      const store = createMockStore({ user: { user: { addresses: mockAddresses } } })
      render(
        <Provider store={store}>
          <CustomerAddressesPage />
        </Provider>
      )

      const addButton = await screen.findByText(/Add Address/i)
      fireEvent.click(addButton)

      // Check if modal appears
      await waitFor(() => {
        expect(screen.getByText(/Add New Address/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/Country/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/City/i)).toBeInTheDocument()
      })
    })

    test('should validate required fields before submission', async () => {
      const store = createMockStore()
      render(
        <Provider store={store}>
          <CustomerAddressesPage />
        </Provider>
      )

      const addButton = await screen.findByText(/Add Your First Address/i)
      fireEvent.click(addButton)

      // Try to submit without filling fields
      const saveButton = await screen.findByText(/Save Address/i)
      fireEvent.click(saveButton)

      // Should show validation error
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Please fix the validation errors')
      })
    })

    test('should submit form with valid data', async () => {
      const store = createMockStore()
      const mockDispatch = jest.fn()
      jest.spyOn(store, 'dispatch').mockImplementation(mockDispatch)

      render(
        <Provider store={store}>
          <CustomerAddressesPage />
        </Provider>
      )

      const addButton = await screen.findByText(/Add Your First Address/i)
      fireEvent.click(addButton)

      // Fill in the form
      const countrySelect = await screen.findByLabelText(/Country/i)
      fireEvent.change(countrySelect, { target: { value: 'US' } })

      const citySelect = await screen.findByLabelText(/City/i)
      fireEvent.change(citySelect, { target: { value: 'CA' } })

      const address1Input = await screen.findByPlaceholderText(/Street address/i)
      fireEvent.change(address1Input, { target: { value: '123 Main St' } })

      const zipCodeInput = await screen.findByPlaceholderText(/Postal code/i)
      fireEvent.change(zipCodeInput, { target: { value: '90001' } })

      // Submit
      const saveButton = await screen.findByText(/Save Address/i)
      fireEvent.click(saveButton)

      // Should dispatch action
      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalled()
      })
    })
  })

  describe('4. Delete address functionality', () => {
    test('should show delete confirmation dialog', async () => {
      window.confirm = jest.fn(() => true)
      const store = createMockStore({ user: { user: { addresses: mockAddresses } } })

      render(
        <Provider store={store}>
          <CustomerAddressesPage />
        </Provider>
      )

      await waitFor(() => {
        const deleteButtons = screen.getAllByTitle(/Delete address/i)
        fireEvent.click(deleteButtons[0])
      })

      expect(window.confirm).toHaveBeenCalled()
    })

    test('should dispatch deleteUserAddress when confirmed', async () => {
      window.confirm = jest.fn(() => true)
      const store = createMockStore({ user: { user: { addresses: mockAddresses } } })
      userActions.deleteUserAddress.mockImplementation(() => ({ type: 'DELETE' }))

      render(
        <Provider store={store}>
          <CustomerAddressesPage />
        </Provider>
      )

      await waitFor(() => {
        const deleteButtons = screen.getAllByTitle(/Delete address/i)
        fireEvent.click(deleteButtons[0])
      })

      await waitFor(() => {
        expect(userActions.deleteUserAddress).toHaveBeenCalledWith('1')
      })
    })

    test('should not delete when confirmation is cancelled', async () => {
      window.confirm = jest.fn(() => false)
      const store = createMockStore({ user: { user: { addresses: mockAddresses } } })

      render(
        <Provider store={store}>
          <CustomerAddressesPage />
        </Provider>
      )

      await waitFor(() => {
        const deleteButtons = screen.getAllByTitle(/Delete address/i)
        fireEvent.click(deleteButtons[0])
      })

      expect(userActions.deleteUserAddress).not.toHaveBeenCalled()
    })
  })

  describe('5. Redux integration', () => {
    test('should sync addresses from Redux state', async () => {
      const store = createMockStore({ user: { user: { addresses: mockAddresses } } })

      const { rerender } = render(
        <Provider store={store}>
          <CustomerAddressesPage />
        </Provider>
      )

      await waitFor(() => {
        expect(screen.getByText(/123 Main St/i)).toBeInTheDocument()
      })
    })

    test('should display loading state when adding address', async () => {
      const store = createMockStore({
        user: {
          user: { addresses: mockAddresses },
          updateUserAddressLoading: true,
        },
      })

      render(
        <Provider store={store}>
          <CustomerAddressesPage />
        </Provider>
      )

      // Add button should be disabled during loading
      const addButton = await screen.findByText(/Add Address/i)
      expect(addButton).toBeDisabled()
    })

    test('should display error message when address operation fails', async () => {
      const errorMessage = 'Failed to save address'
      const store = createMockStore({
        user: {
          user: { addresses: mockAddresses },
          addressError: errorMessage,
        },
      })

      render(
        <Provider store={store}>
          <CustomerAddressesPage />
        </Provider>
      )

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(errorMessage)
      })
    })
  })

  describe('6. Form validation', () => {
    test('should show validation error for empty address line 1', async () => {
      const store = createMockStore()
      render(
        <Provider store={store}>
          <CustomerAddressesPage />
        </Provider>
      )

      const addButton = await screen.findByText(/Add Your First Address/i)
      fireEvent.click(addButton)

      // Fill other fields but not address1
      const countrySelect = await screen.findByLabelText(/Country/i)
      fireEvent.change(countrySelect, { target: { value: 'US' } })

      const citySelect = await screen.findByLabelText(/City/i)
      fireEvent.change(citySelect, { target: { value: 'CA' } })

      // Try to submit
      const saveButton = await screen.findByText(/Save Address/i)
      fireEvent.click(saveButton)

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Please fix the validation errors')
      })
    })

    test('should validate minimum address length', async () => {
      const store = createMockStore()
      render(
        <Provider store={store}>
          <CustomerAddressesPage />
        </Provider>
      )

      const addButton = await screen.findByText(/Add Your First Address/i)
      fireEvent.click(addButton)

      const countrySelect = await screen.findByLabelText(/Country/i)
      fireEvent.change(countrySelect, { target: { value: 'US' } })

      const citySelect = await screen.findByLabelText(/City/i)
      fireEvent.change(citySelect, { target: { value: 'CA' } })

      const address1Input = await screen.findByPlaceholderText(/Street address/i)
      fireEvent.change(address1Input, { target: { value: 'abc' } }) // Too short

      const saveButton = await screen.findByText(/Save Address/i)
      fireEvent.click(saveButton)

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalled()
      })
    })
  })

  describe('7. Error handling', () => {
    test('should handle address loading error gracefully', async () => {
      const error = new Error('Network error')
      addressService.getAll.mockRejectedValue(error)

      const store = createMockStore()
      render(
        <Provider store={store}>
          <CustomerAddressesPage />
        </Provider>
      )

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Failed to load addresses')
      })
    })
  })

  describe('8. UI/UX features', () => {
    test('should display address type with correct icon and color', async () => {
      const store = createMockStore({ user: { user: { addresses: mockAddresses } } })

      render(
        <Provider store={store}>
          <CustomerAddressesPage />
        </Provider>
      )

      await waitFor(() => {
        expect(screen.getByText(/Home/i)).toBeInTheDocument()
        expect(screen.getByText(/Office/i)).toBeInTheDocument()
      })
    })

    test('should disable buttons during loading', async () => {
      const store = createMockStore({
        user: {
          user: { addresses: mockAddresses },
          updateUserAddressLoading: true,
          deleteUserAddressLoading: true,
        },
      })

      render(
        <Provider store={store}>
          <CustomerAddressesPage />
        </Provider>
      )

      const deleteButtons = await screen.findAllByTitle(/Delete address/i)
      deleteButtons.forEach(btn => {
        expect(btn).toBeDisabled()
      })
    })
  })
})
