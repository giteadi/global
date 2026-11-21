import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
  total: 0,
  isOpen: false,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const quantityToAdd = action.payload.quantity || 1
      const existingItem = state.items.find(item => item.id === action.payload.id)
      if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 0) + quantityToAdd
      } else {
        state.items.push({ ...action.payload, quantity: quantityToAdd })
      }
      state.total = state.items.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0)
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload)
      state.total = state.items.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0)
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload
      const item = state.items.find(item => item.id === id)
      if (item) {
        item.quantity = Math.max(1, Number(quantity) || 1)
        state.total = state.items.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0)
      }
    },
    clearCart: (state) => {
      state.items = []
      state.total = 0
    },
    toggleCart: (state) => {
      state.isOpen = !state.isOpen
    },
    closeCart: (state) => {
      state.isOpen = false
    },
  },
})

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleCart,
  closeCart,
} = cartSlice.actions

export default cartSlice.reducer
