import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import API_BASE from '../../api/config'

const initialState = {
  products: [],
  featuredProducts: [],
  categories: ['Temple Heritage', 'Contemporary Ethnic', 'Handcrafted Decor', 'Export Grade'],
  loadingProducts: false,
  loadingFeatured: false,
  error: null,
  singleProduct: null,
}

// Async thunks
export const getProducts = createAsyncThunk(
  'products/getProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/api/products`)
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Failed to fetch products')
      return data.data.products
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const getFeaturedProducts = createAsyncThunk(
  'products/getFeaturedProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/api/products/featured`)
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Failed to fetch featured products')
      return data.data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Failed to create product')
      return data.data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Failed to update product')
      return data.data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/api/products/${id}`, {
        method: 'DELETE'
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Failed to delete product')
      return id
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload
    },
    setFeaturedProducts: (state, action) => {
      state.featuredProducts = action.payload
    },
    setSingleProduct: (state, action) => {
      state.singleProduct = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    addProduct: (state, action) => {
      state.products.push(action.payload)
    },
    updateProductLocal: (state, action) => {
      const index = state.products.findIndex(p => p.id === action.payload.id)
      if (index !== -1) {
        state.products[index] = action.payload
      }
    },
    deleteProductLocal: (state, action) => {
      state.products = state.products.filter(p => p.id !== action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => {
        state.loadingProducts = true
        state.error = null
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.loadingProducts = false
        state.products = action.payload
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loadingProducts = false
        state.error = action.payload
      })
      .addCase(getFeaturedProducts.pending, (state) => {
        state.loadingFeatured = true
        state.error = null
      })
      .addCase(getFeaturedProducts.fulfilled, (state, action) => {
        state.loadingFeatured = false
        state.featuredProducts = action.payload
      })
      .addCase(getFeaturedProducts.rejected, (state, action) => {
        state.loadingFeatured = false
        state.error = action.payload
      })
      .addCase(createProduct.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false
        state.products.push(action.payload)
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(updateProduct.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false
        const index = state.products.findIndex(p => p.id === action.payload.id)
        if (index !== -1) {
          state.products[index] = action.payload
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false
        state.products = state.products.filter(p => p.id !== action.payload)
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const {
  setProducts,
  setFeaturedProducts,
  setSingleProduct,
  setLoading,
  setError,
  addProduct,
  updateProductLocal,
  deleteProductLocal,
} = productsSlice.actions

export default productsSlice.reducer
