/**
 * Gap 8: Redux Reducer Factory
 * Generate Redux slices and thunks from configuration
 * Eliminates duplicate reducer logic across domains
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/client';

/**
 * Factory function to create Redux slice with standard patterns
 */
export function createDomainSlice(config) {
  const {
    name,           // e.g., 'products'
    endpoint,       // e.g., '/api/products'
    initialState = {}
  } = config;

  // Create async thunks
  const fetchAll = createAsyncThunk(
    `${name}/fetchAll`,
    async (params, { rejectWithValue }) => {
      try {
        const response = await api.get(endpoint, { params });
        return response.data.data;
      } catch (error) {
        return rejectWithValue(error.response?.data?.message);
      }
    }
  );

  const fetchById = createAsyncThunk(
    `${name}/fetchById`,
    async (id, { rejectWithValue }) => {
      try {
        const response = await api.get(`${endpoint}/${id}`);
        return response.data.data;
      } catch (error) {
        return rejectWithValue(error.response?.data?.message);
      }
    }
  );

  const create = createAsyncThunk(
    `${name}/create`,
    async (data, { rejectWithValue }) => {
      try {
        const response = await api.post(endpoint, data);
        return response.data.data;
      } catch (error) {
        return rejectWithValue(error.response?.data?.message);
      }
    }
  );

  const update = createAsyncThunk(
    `${name}/update`,
    async ({ id, data }, { rejectWithValue }) => {
      try {
        const response = await api.put(`${endpoint}/${id}`, data);
        return response.data.data;
      } catch (error) {
        return rejectWithValue(error.response?.data?.message);
      }
    }
  );

  const delete_ = createAsyncThunk(
    `${name}/delete`,
    async (id, { rejectWithValue }) => {
      try {
        await api.delete(`${endpoint}/${id}`);
        return id;
      } catch (error) {
        return rejectWithValue(error.response?.data?.message);
      }
    }
  );

  // Create slice
  const slice = createSlice({
    name,
    initialState: {
      items: [],
      selectedItem: null,
      loading: false,
      error: null,
      ...initialState
    },
    reducers: {
      clearError: (state) => {
        state.error = null;
      },
      setSelectedItem: (state, action) => {
        state.selectedItem = action.payload;
      },
      clearSelectedItem: (state) => {
        state.selectedItem = null;
      }
    },
    extraReducers: (builder) => {
      // Fetch All
      builder
        .addCase(fetchAll.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchAll.fulfilled, (state, action) => {
          state.loading = false;
          state.items = action.payload;
        })
        .addCase(fetchAll.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });

      // Fetch by ID
      builder
        .addCase(fetchById.pending, (state) => {
          state.loading = true;
        })
        .addCase(fetchById.fulfilled, (state, action) => {
          state.loading = false;
          state.selectedItem = action.payload;
        })
        .addCase(fetchById.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });

      // Create
      builder
        .addCase(create.pending, (state) => {
          state.loading = true;
        })
        .addCase(create.fulfilled, (state, action) => {
          state.loading = false;
          state.items.push(action.payload);
        })
        .addCase(create.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });

      // Update
      builder
        .addCase(update.pending, (state) => {
          state.loading = true;
        })
        .addCase(update.fulfilled, (state, action) => {
          state.loading = false;
          const index = state.items.findIndex(i => i._id === action.payload._id);
          if (index !== -1) {
            state.items[index] = action.payload;
          }
          state.selectedItem = action.payload;
        })
        .addCase(update.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });

      // Delete
      builder
        .addCase(delete_.pending, (state) => {
          state.loading = true;
        })
        .addCase(delete_.fulfilled, (state, action) => {
          state.loading = false;
          state.items = state.items.filter(i => i._id !== action.payload);
        })
        .addCase(delete_.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    }
  });

  return {
    reducer: slice.reducer,
    actions: {
      ...slice.actions,
      fetchAll,
      fetchById,
      create,
      update,
      delete: delete_
    }
  };
}

export default createDomainSlice;
