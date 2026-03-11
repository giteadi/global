import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import API_BASE from '../../api/config'

const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  isAdmin: false,
  loading: false,
  error: null,
  profileFetchAttempted: false,
}

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Login failed')
      return data.data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const signupUser = createAsyncThunk(
  'auth/signupUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Signup failed')
      return data.data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const forgetPassword = createAsyncThunk(
  'auth/forgetPassword',
  async (emailData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/api/auth/forget-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailData)
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Failed to send reset email')
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const getUserProfile = createAsyncThunk(
  'auth/getUserProfile',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth
      const response = await fetch(`${API_BASE}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Failed to fetch profile')
      return data.data.user
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async (profileData, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth
      const response = await fetch(`${API_BASE}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Failed to update profile')
      return data.data.user
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAdmin = false
      state.profileFetchAttempted = false
      localStorage.removeItem('token')
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAdmin = action.payload.user.role === 'admin'
        state.profileFetchAttempted = false
        localStorage.setItem('token', action.payload.token)
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(signupUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAdmin = action.payload.user.role === 'admin'
        localStorage.setItem('token', action.payload.token)
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(forgetPassword.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(forgetPassword.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(forgetPassword.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.isAdmin = action.payload.role === 'admin'
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.profileFetchAttempted = true
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.isAdmin = action.payload.role === 'admin'
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const {
  logout,
  setLoading,
  setError,
  clearError,
} = authSlice.actions

export default authSlice.reducer
