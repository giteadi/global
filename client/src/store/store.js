import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import productsSlice from './slices/productsSlice'
import cartSlice from './slices/cartSlice'
import authSlice from './slices/authSlice'
import { adminApi } from './slices/adminApi'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'] // Only persist auth state
}

const persistedAuthReducer = persistReducer(persistConfig, authSlice)

export const store = configureStore({
  reducer: {
    products: productsSlice,
    cart: cartSlice,
    auth: persistedAuthReducer,
    [adminApi.reducerPath]: adminApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(adminApi.middleware),
})

export const persistor = persistStore(store)
