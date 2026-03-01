import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const initialState = {
  products: [],
  featuredProducts: [
    { id: 1, name: 'Temple Necklace Set', category: 'Temple Heritage', price: 299, icon: '🏛️', description: 'Traditional temple jewelry with intricate gold work' },
    { id: 2, name: 'Ethnic Earrings', category: 'Contemporary Ethnic', price: 149, icon: '💎', description: 'Modern ethnic design with traditional motifs' },
    { id: 3, name: 'Handcrafted Decor Vase', category: 'Handcrafted Decor', price: 199, icon: '🏺', description: 'Artisan vase with traditional Indian patterns' },
    { id: 4, name: 'Export Bracelet Set', category: 'Export Grade', price: 249, icon: '📦', description: 'Premium quality bracelet set for global markets' },
  ],
  categories: ['Temple Heritage', 'Contemporary Ethnic', 'Handcrafted Decor', 'Export Grade'],
  loading: false,
  error: null,
  singleProduct: null,
}

// Async thunks
export const getProducts = createAsyncThunk(
  'products/getProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:4000/api/products')
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Failed to fetch products')
      return data.data.products
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
    updateProduct: (state, action) => {
      const index = state.products.findIndex(p => p.id === action.payload.id)
      if (index !== -1) {
        state.products[index] = action.payload
      }
    },
    deleteProduct: (state, action) => {
      state.products = state.products.filter(p => p.id !== action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading = false
        state.products = action.payload
      })
      .addCase(getProducts.rejected, (state, action) => {
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
  updateProduct,
  deleteProduct,
} = productsSlice.actions

export default productsSlice.reducer
