import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const location = useLocation()
  const { user } = useSelector(state => state.auth)

  const menuItems = [
    {
      title: 'Dashboard',
      icon: '📊',
      path: '/admin',
      description: 'Overview and statistics'
    },
    {
      title: 'Products',
      icon: '📦',
      path: '/admin/products',
      description: 'Manage product catalog'
    },
    {
      title: 'Orders',
      icon: '📋',
      path: '/admin/orders',
      description: 'View and process orders'
    },
    {
      title: 'Users',
      icon: '👥',
      path: '/admin/users',
      description: 'Manage user accounts'
    },
    {
      title: 'Categories',
      icon: '🏷️',
      path: '/admin/categories',
      description: 'Product categories'
    },
    {
      title: 'Payments',
      icon: '💳',
      path: '/admin/payments',
      description: 'Payment transactions'
    },
    {
      title: 'Analytics',
      icon: '📈',
      path: '/admin/analytics',
      description: 'Sales reports and insights'
    },
    {
      title: 'Settings',
      icon: '⚙️',
      path: '/admin/settings',
      description: 'System configuration'
    }
  ]

  const isActive = (path) => location.pathname === path

  return (
    <div className="h-screen flex" style={{ background: 'transparent' }}>
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 ease-in-out`} style={{ background: 'var(--glass)', backdropFilter: 'blur(20px)', border: '1px solid var(--glass-border)' }}>
        <div className="p-4 border-b" style={{ borderColor: 'var(--glass-border)' }}>
          <div className="flex items-center justify-between">
            <h1 className={`font-bold text-xl ${!sidebarOpen && 'hidden'}`} style={{ color: 'var(--text-bright)' }}>
              Admin Panel
            </h1>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg transition-colors"
              style={{ background: 'rgba(27,158,155,0.1)', color: 'var(--text-bright)' }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          {sidebarOpen && (
            <div className="mt-2 text-sm" style={{ color: 'var(--text-soft)' }}>
              Welcome, {user?.name || 'Admin'}
            </div>
          )}
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
                    isActive(item.path)
                      ? 'border-l-4'
                      : 'hover:opacity-80'
                  }`}
                  style={{
                    color: isActive(item.path) ? 'var(--teal-bright)' : 'var(--text-soft)',
                    borderColor: isActive(item.path) ? 'var(--teal-bright)' : 'transparent',
                    background: isActive(item.path) ? 'rgba(27,158,155,0.1)' : 'transparent'
                  }}
                >
                  <span className="text-xl">{item.icon}</span>
                  {sidebarOpen && (
                    <div className="ml-3">
                      <div className="font-medium" style={{ color: 'var(--text-bright)' }}>{item.title}</div>
                      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.description}</div>
                    </div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t" style={{ borderColor: 'var(--glass-border)' }}>
          <Link
            to="/"
            className="flex items-center p-3 rounded-lg transition-all duration-200"
            style={{ color: 'var(--gold-bright)', background: 'rgba(92,26,40,0.1)' }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {sidebarOpen && <span className="ml-3 font-medium">Logout</span>}
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header style={{ background: 'var(--glass)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--glass-border)' }}>
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold" style={{ color: 'var(--text-bright)' }}>
                {menuItems.find(item => item.path === location.pathname)?.title || 'Admin Dashboard'}
              </h2>
              <p className="text-sm" style={{ color: 'var(--text-soft)' }}>
                {menuItems.find(item => item.path === location.pathname)?.description || 'Manage your business'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm font-medium" style={{ color: 'var(--text-bright)' }}>{user?.name || 'Admin'}</div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Administrator</div>
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold" style={{ background: 'var(--teal)' }}>
                {user?.name?.charAt(0) || 'A'}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 min-h-[calc(100vh-200px)]" style={{ background: 'transparent' }}>
          {children}
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
