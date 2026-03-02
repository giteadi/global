import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const initialState = {
  users: [],
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
export const fetchUsers = createAsyncThunk(
  'adminUsers/fetchUsers',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { page = 1, limit = 10, role } = params
      const queryString = new URLSearchParams({ page: page.toString(), limit: limit.toString() })
      if (role) queryString.append('role', role)
      
      const response = await fetch(`http://localhost:4000/api/auth/admin/users?${queryString}`)
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Failed to fetch users')
      return data.data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const createUser = createAsyncThunk(
  'adminUsers/createUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:4000/api/auth/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Failed to create user')
      return data.data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const updateUser = createAsyncThunk(
  'adminUsers/updateUser',
  async ({ id, userData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:4000/api/auth/admin/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Failed to update user')
      return data.data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const deleteUser = createAsyncThunk(
  'adminUsers/deleteUser',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:4000/api/auth/admin/users/${id}`, {
        method: 'DELETE'
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Failed to delete user')
      return id
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const adminUsersSlice = createSlice({
  name: 'adminUsers',
  initialState,
  reducers: {
    clearUsers: (state) => {
      state.users = []
      state.pagination = { page: 1, limit: 10, total: 0, pages: 0 }
    },
    setUserFilter: (state, action) => {
      state.filter = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false
        state.users = action.payload.users
        state.pagination = action.payload.pagination
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Update User
      .addCase(updateUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false
        const index = state.users.findIndex(user => user._id === action.payload._id)
        if (index !== -1) {
          state.users[index] = action.payload
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Create User
      .addCase(createUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false
        state.users.unshift(action.payload)
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearUsers, setUserFilter } = adminUsersSlice.actions
export const getAdminUsers = (params) => async (dispatch) => {
  await dispatch(fetchUsers(params))
}
export default adminUsersSlice.reducer
