import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import API_BASE from '../../api/config'

const initialState = {
  dashboardStats: null,
  salesAnalytics: [],
  productAnalytics: null,
  customerAnalytics: null,
  loading: false,
  error: null
}

// Async thunks
export const getDashboardStats = createAsyncThunk(
  'analytics/getDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/api/analytics/dashboard`)
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Failed to fetch dashboard stats')
      return data.data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const getSalesAnalytics = createAsyncThunk(
  'analytics/getSalesAnalytics',
  async (period = 'month', { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/api/analytics/sales?period=${period}`)
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Failed to fetch sales analytics')
      return data.data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const getProductAnalytics = createAsyncThunk(
  'analytics/getProductAnalytics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/api/analytics/products`)
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Failed to fetch product analytics')
      return data.data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const getCustomerAnalytics = createAsyncThunk(
  'analytics/getCustomerAnalytics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/api/analytics/customers`)
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Failed to fetch customer analytics')
      return data.data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    clearAnalytics: (state) => {
      state.dashboardStats = null
      state.salesAnalytics = []
      state.productAnalytics = null
      state.customerAnalytics = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Dashboard Stats
      .addCase(getDashboardStats.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getDashboardStats.fulfilled, (state, action) => {
        state.loading = false
        state.dashboardStats = action.payload
      })
      .addCase(getDashboardStats.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Sales Analytics
      .addCase(getSalesAnalytics.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getSalesAnalytics.fulfilled, (state, action) => {
        state.loading = false
        state.salesAnalytics = action.payload
      })
      .addCase(getSalesAnalytics.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Product Analytics
      .addCase(getProductAnalytics.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getProductAnalytics.fulfilled, (state, action) => {
        state.loading = false
        state.productAnalytics = action.payload
      })
      .addCase(getProductAnalytics.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Customer Analytics
      .addCase(getCustomerAnalytics.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getCustomerAnalytics.fulfilled, (state, action) => {
        state.loading = false
        state.customerAnalytics = action.payload
      })
      .addCase(getCustomerAnalytics.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearAnalytics } = analyticsSlice.actions
export default analyticsSlice.reducer
