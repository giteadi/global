import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const initialState = {
  payments: [],
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
export const getAdminPayments = createAsyncThunk(
  'adminPayments/getPayments',
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryString = new URLSearchParams(params).toString()
      const response = await fetch(`http://localhost:4000/api/admin/payments?${queryString}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Failed to fetch payments')
      return data.data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const processRefund = createAsyncThunk(
  'adminPayments/processRefund',
  async ({ id, amount, reason }, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:4000/api/admin/payments/${id}/refund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ amount, reason })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Failed to process refund')
      return data.data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const adminPaymentsSlice = createSlice({
  name: 'adminPayments',
  initialState,
  reducers: {
    clearPayments: (state) => {
      state.payments = []
      state.pagination = { page: 1, limit: 10, total: 0, pages: 0 }
    },
    setPaymentFilter: (state, action) => {
      state.filter = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      // Get Payments
      .addCase(getAdminPayments.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getAdminPayments.fulfilled, (state, action) => {
        state.loading = false
        state.payments = action.payload.payments
        state.pagination = action.payload.pagination
      })
      .addCase(getAdminPayments.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Process Refund
      .addCase(processRefund.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(processRefund.fulfilled, (state, action) => {
        state.loading = false
        const index = state.payments.findIndex(payment => payment._id === action.payload._id)
        if (index !== -1) {
          state.payments[index] = action.payload
        }
      })
      .addCase(processRefund.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearPayments, setPaymentFilter } = adminPaymentsSlice.actions
export default adminPaymentsSlice.reducer
