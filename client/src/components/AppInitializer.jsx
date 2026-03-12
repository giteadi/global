import React, { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getUserProfile } from '../store/slices/authSlice'

const AppInitializer = React.memo(({ children }) => {
  const dispatch = useDispatch()
  const { token, user, loading, error, profileFetchAttempted } = useSelector(state => state.auth)

  // Memoize the condition to prevent unnecessary re-renders
  const shouldFetchProfile = useMemo(() => {
    return token && !user && !loading && !error && !profileFetchAttempted
  }, [token, user, loading, error, profileFetchAttempted])

  useEffect(() => {
    if (shouldFetchProfile) {
      console.log('AppInitializer: Fetching user profile')
      dispatch(getUserProfile())
    } else if (error && profileFetchAttempted) {
      console.log('AppInitializer: Auth error detected, clearing token')
      dispatch({ type: 'auth/clearError' })
      localStorage.removeItem('token')
    }
  }, [shouldFetchProfile, error, profileFetchAttempted, dispatch])

  return children
})

export default AppInitializer
