import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import API_BASE from '../../api/config'

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: `${API_BASE}/api`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  endpoints: (builder) => ({
    // Users CRUD
    getUsers: builder.query({
      query: (params = {}) => {
        const { page = 1, limit = 10, role } = params
        const queryString = new URLSearchParams({ page: page.toString(), limit: limit.toString() })
        if (role) queryString.append('role', role)
        return `auth/admin/users?${queryString}`
      },
      providesTags: ['Users']
    }),
    createUser: builder.mutation({
      query: (userData) => ({
        url: 'auth/admin/users',
        method: 'POST',
        body: userData
      }),
      invalidatesTags: ['Users']
    }),
    updateUser: builder.mutation({
      query: ({ id, ...userData }) => ({
        url: `auth/admin/users/${id}`,
        method: 'PUT',
        body: userData
      }),
      invalidatesTags: ['Users']
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `auth/admin/users/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Users']
    }),

    // Products CRUD
    getProducts: builder.query({
      query: (params = {}) => {
        const { page = 1, limit = 10, category, search } = params
        const queryString = new URLSearchParams({ page: page.toString(), limit: limit.toString() })
        if (category) queryString.append('category', category)
        if (search) queryString.append('search', search)
        return `products?${queryString}`
      },
      providesTags: ['Products']
    }),
    createProduct: builder.mutation({
      query: (productData) => ({
        url: 'products',
        method: 'POST',
        body: productData
      }),
      invalidatesTags: ['Products']
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...productData }) => ({
        url: `products/${id}`,
        method: 'PUT',
        body: productData
      }),
      invalidatesTags: ['Products']
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `products/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Products']
    }),

    // Get Single Product
    getProduct: builder.query({
      query: (id) => `products/${id}`,
      providesTags: ['Products']
    }),

    // Get Featured Products
    getFeaturedProducts: builder.query({
      query: () => 'products/featured',
      providesTags: ['Products']
    }),

    // Orders CRUD
    getOrders: builder.query({
      query: (params = {}) => {
        const { page = 1, limit = 10, status } = params
        const queryString = new URLSearchParams({ page: page.toString(), limit: limit.toString() })
        if (status) queryString.append('status', status)
        return `orders/admin/all?${queryString}`
      },
      providesTags: ['Orders']
    }),
    updateOrder: builder.mutation({
      query: ({ id, ...orderData }) => ({
        url: `orders/admin/${id}`,
        method: 'PUT',
        body: orderData
      }),
      invalidatesTags: ['Orders']
    }),

    // Categories CRUD
    getCategories: builder.query({
      query: () => 'categories',
      providesTags: ['Categories']
    }),
    createCategory: builder.mutation({
      query: (categoryData) => ({
        url: 'categories/admin',
        method: 'POST',
        body: categoryData
      }),
      invalidatesTags: ['Categories']
    }),
    updateCategory: builder.mutation({
      query: ({ id, ...categoryData }) => ({
        url: `categories/admin/${id}`,
        method: 'PUT',
        body: categoryData
      }),
      invalidatesTags: ['Categories']
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `categories/admin/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Categories']
    }),

    // Payments
    getPayments: builder.query({
      query: (params = {}) => {
        const { page = 1, limit = 10, status } = params
        const queryString = new URLSearchParams({ page: page.toString(), limit: limit.toString() })
        if (status) queryString.append('status', status)
        return `payments/admin?${queryString}`
      },
      providesTags: ['Payments']
    }),

    // Analytics
    getAnalytics: builder.query({
      query: (params = {}) => {
        const { period = 'month', type = 'overview' } = params
        return `analytics?period=${period}&type=${type}`
      },
      providesTags: ['Analytics']
    }),

    // Dashboard Stats
    getDashboardStats: builder.query({
      query: () => 'analytics/dashboard',
      providesTags: ['Dashboard']
    }),

    // Contacts
    getContacts: builder.query({
      query: () => 'contacts/admin',
      providesTags: ['Contacts']
    }),
    updateContactStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `contacts/admin/${id}/status`,
        method: 'PUT',
        body: { status }
      }),
      invalidatesTags: ['Contacts']
    }),
    deleteContact: builder.mutation({
      query: (id) => ({
        url: `contacts/admin/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Contacts']
    })
  })
})

export const {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductQuery,
  useGetFeaturedProductsQuery,
  useGetOrdersQuery,
  useUpdateOrderMutation,
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetPaymentsQuery,
  useGetAnalyticsQuery,
  useGetDashboardStatsQuery,
  useGetContactsQuery,
  useUpdateContactStatusMutation,
  useDeleteContactMutation
} = adminApi
