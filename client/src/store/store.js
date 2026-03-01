import { configureStore } from '@reduxjs/toolkit'
import productsSlice from './slices/productsSlice'
import cartSlice from './slices/cartSlice'
import authSlice from './slices/authSlice'
import adminOrdersSlice from './slices/adminOrdersSlice'
import adminUsersSlice from './slices/adminUsersSlice'
import adminPaymentsSlice from './slices/adminPaymentsSlice'
import adminCategoriesSlice from './slices/adminCategoriesSlice'
import analyticsSlice from './slices/analyticsSlice'
import { adminApi } from './slices/adminApi'

export const store = configureStore({
  reducer: {
    products: productsSlice,
    cart: cartSlice,
    auth: authSlice,
    adminOrders: adminOrdersSlice,
    adminUsers: adminUsersSlice,
    adminPayments: adminPaymentsSlice,
    adminCategories: adminCategoriesSlice,
    analytics: analyticsSlice,
    [adminApi.reducerPath]: adminApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(adminApi.middleware),
})
