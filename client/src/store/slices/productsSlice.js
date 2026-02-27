import { createSlice } from '@reduxjs/toolkit'

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
