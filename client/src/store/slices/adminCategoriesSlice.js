import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const initialState = {
  categories: [],
  loading: false,
  error: null
}

// Async thunks
export const getAdminCategories = createAsyncThunk(
  'adminCategories/getCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:4000/api/categories', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Failed to fetch categories')
      return data.data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const createCategory = createAsyncThunk(
  'adminCategories/createCategory',
  async (categoryData, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:4000/api/categories/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(categoryData)
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Failed to create category')
      return data.data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const updateCategory = createAsyncThunk(
  'adminCategories/updateCategory',
  async ({ id, categoryData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:4000/api/categories/admin/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(categoryData)
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Failed to update category')
      return data.data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const deleteCategory = createAsyncThunk(
  'adminCategories/deleteCategory',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:4000/api/categories/admin/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Failed to delete category')
      return id
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const adminCategoriesSlice = createSlice({
  name: 'adminCategories',
  initialState,
  reducers: {
    clearCategories: (state) => {
      state.categories = []
    }
  },
  extraReducers: (builder) => {
    builder
      // Get Categories
      .addCase(getAdminCategories.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getAdminCategories.fulfilled, (state, action) => {
        state.loading = false
        state.categories = action.payload.categories
      })
      .addCase(getAdminCategories.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Create Category
      .addCase(createCategory.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false
        state.categories.push(action.payload)
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Update Category
      .addCase(updateCategory.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false
        const index = state.categories.findIndex(cat => cat.id === action.payload.id || cat._id === action.payload._id)
        if (index !== -1) {
          state.categories[index] = action.payload
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Delete Category
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false
        state.categories = state.categories.filter(cat => cat.id !== action.payload && cat._id !== action.payload)
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearCategories } = adminCategoriesSlice.actions
export default adminCategoriesSlice.reducer
