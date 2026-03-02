import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getUserProfile } from '../store/slices/authSlice'

const AppInitializer = ({ children }) => {
  const dispatch = useDispatch()
  const { token, user, loading, error } = useSelector(state => state.auth)

  useEffect(() => {
    // If we have a token but no user data, fetch the profile
    // Only fetch if not currently loading and no previous error
    if (token && !user && !loading && !error) {
      console.log('AppInitializer: Fetching user profile')
      dispatch(getUserProfile())
    } else if (error) {
      console.log('AppInitializer: Auth error detected, clearing token')
      // Clear invalid token
      dispatch({ type: 'auth/clearError' })
      localStorage.removeItem('token')
    }
  }, [token, user, loading, error, dispatch])

  return children
}

export default AppInitializer
