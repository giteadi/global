import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

const AdminRoute = ({ children }) => {
  const { user, token, isAdmin, loading, profileFetchAttempted } = useSelector(state => state.auth)
  const location = useLocation()

  // No token -> immediately redirect to login
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Token exists but profile is still loading / verifying
  if (loading || (!user && !profileFetchAttempted)) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a2830' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-bright mx-auto mb-4"></div>
          <p style={{ color: 'var(--text-bright)' }}>Verifying credentials...</p>
        </div>
      </div>
    )
  }

  // Strict admin authorization: Must have user object and role must strictly be 'admin'
  const isAuthorized = Boolean(token && user && (user.role === 'admin' || isAdmin))

  if (!isAuthorized) {
    return <Navigate to="/login" state={{ from: location, unauthorized: true }} replace />
  }

  return children
}

export default React.memo(AdminRoute)
