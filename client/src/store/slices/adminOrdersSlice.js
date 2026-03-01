import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const initialState = {
  orders: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  }
}

// Async thunks
export const getAdminOrders = createAsyncThunk(
  'adminOrders/getOrders',
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryString = new URLSearchParams(params).toString()
      const response = await fetch(`http://localhost:4000/api/admin/orders?${queryString}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Failed to fetch orders')
      return data.data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const updateOrderStatus = createAsyncThunk(
  'adminOrders/updateStatus',
  async ({ id, status, trackingNumber }, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:4000/api/admin/orders/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ orderStatus: status, trackingNumber })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Failed to update order')
      return data.data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const adminOrdersSlice = createSlice({
  name: 'adminOrders',
  initialState,
  reducers: {
    clearOrders: (state) => {
      state.orders = []
      state.pagination = { page: 1, limit: 10, total: 0, pages: 0 }
    },
    setOrderFilter: (state, action) => {
      state.filter = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      // Get Orders
      .addCase(getAdminOrders.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getAdminOrders.fulfilled, (state, action) => {
        state.loading = false
        state.orders = action.payload.orders
        state.pagination = action.payload.pagination
      })
      .addCase(getAdminOrders.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Update Order Status
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false
        const index = state.orders.findIndex(order => order._id === action.payload._id)
        if (index !== -1) {
          state.orders[index] = action.payload
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearOrders, setOrderFilter } = adminOrdersSlice.actions
export default adminOrdersSlice.reducer
