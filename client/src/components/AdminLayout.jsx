import React, { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
  ChartBarIcon,
  ArchiveBoxIcon,
  ClipboardDocumentListIcon,
  UsersIcon,
  TagIcon,
  EnvelopeIcon,
  CreditCardIcon,
  ArrowTrendingUpIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'

const MENU_ITEMS = [
  {
    title: 'Dashboard',
    icon: '📊',
    iconComponent: ChartBarIcon,
    path: '/admin',
    description: 'Overview and statistics'
  },
  {
    title: 'Products',
    icon: '📦',
    iconComponent: ArchiveBoxIcon,
    path: '/admin/products',
    description: 'Manage product catalog'
  },
  {
    title: 'Orders',
    icon: '📋',
    iconComponent: ClipboardDocumentListIcon,
    path: '/admin/orders',
    description: 'View and process orders'
  },
  {
    title: 'Categories',
    icon: '🏷️',
    iconComponent: TagIcon,
    path: '/admin/categories',
    description: 'Product categories'
  },
  {
    title: 'Users',
    icon: '👥',
    iconComponent: UsersIcon,
    path: '/admin/users',
    description: 'Manage user accounts'
  },
  {
    title: 'Payments',
    icon: '💳',
    iconComponent: CreditCardIcon,
    path: '/admin/payments',
    description: 'Payment transactions'
  },
  {
    title: 'Contacts',
    icon: '📧',
    iconComponent: EnvelopeIcon,
    path: '/admin/contacts',
    description: 'Customer inquiries'
  },
  {
    title: 'Analytics',
    icon: '📈',
    iconComponent: ArrowTrendingUpIcon,
    path: '/admin/analytics',
    description: 'Sales reports and insights'
  }
]

const AdminLayout = React.memo(({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isAdmin, token } = useSelector(state => state.auth)

  const menuItems = MENU_ITEMS
  const isActive = useCallback((path) => location.pathname === path, [location.pathname])
  const currentItem = menuItems.find(item => item.path === location.pathname) || {
    title: 'Admin Dashboard',
    description: 'Manage your global store'
  }

  useEffect(() => {
    if (!token || (!isAdmin && user?.role !== 'admin')) {
      navigate('/login', { replace: true })
    }
  }, [token, isAdmin, user, navigate])

  if (!token || (!isAdmin && user?.role !== 'admin')) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row" style={{ background: 'transparent' }}>
      {/* Mobile Drawer Backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 md:hidden transition-opacity"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar (Desktop relative, Mobile slide-over drawer) */}
      <aside
        className={`${
          mobileSidebarOpen
            ? 'translate-x-0'
            : '-translate-x-full md:translate-x-0'
        } ${
          sidebarOpen ? 'w-64' : 'w-20 md:w-20'
        } fixed md:sticky top-0 inset-y-0 left-0 z-50 md:z-30 h-screen transition-all duration-300 ease-out flex flex-col`}
        style={{
          background: 'rgba(8, 30, 35, 0.94)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(37, 204, 200, 0.18)',
          boxShadow: '4px 0 24px rgba(0, 0, 0, 0.4)'
        }}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-teal-500/20 flex items-center justify-between">
          <div className="flex items-center space-x-2.5 min-w-0">
            <span className="text-2xl">🏛️</span>
            {sidebarOpen && (
              <div className="min-w-0">
                <h1
                  className="font-serif font-bold text-base truncate"
                  style={{ color: 'var(--gold-bright)' }}
                >
                  Admin Console
                </h1>
                <p className="text-[11px] text-[var(--teal-light)] truncate">Global Exim Traders</p>
              </div>
            )}
          </div>

          {/* Desktop Toggle or Mobile Close */}
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden md:flex p-2 rounded-xl text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 apple-press"
              aria-label="Toggle sidebar collapse"
            >
              <Bars3Icon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white bg-white/10 apple-press"
              aria-label="Close menu drawer"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* User Mini Profile */}
        {sidebarOpen && (
          <div className="px-4 py-3 border-b border-teal-500/15 bg-teal-950/30 flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-teal-800/80 border border-teal-400/30 flex items-center justify-center font-bold text-xs text-[var(--gold-bright)]">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-white truncate">{user?.name || 'Administrator'}</div>
              <div className="text-[10px] text-[var(--teal-pale)] uppercase tracking-wider">Super Admin</div>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="p-3 space-y-1.5 flex-1 overflow-y-auto">
          {menuItems.map((item) => {
            const active = isActive(item.path)
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileSidebarOpen(false)}
                className={`flex items-center min-h-[44px] p-2.5 rounded-xl transition-all duration-200 apple-press ${
                  active
                    ? 'text-[var(--gold-bright)] bg-teal-900/40 border border-teal-500/30 shadow-[0_0_15px_rgba(37,204,200,0.18)]'
                    : 'text-[var(--text-soft)] hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <span className="text-lg flex-shrink-0 w-7 text-center">{item.icon}</span>
                {sidebarOpen && (
                  <div className="ml-2.5 min-w-0 flex-1">
                    <div className="text-xs font-semibold tracking-wide truncate">{item.title}</div>
                    <div className="text-[10px] text-[var(--text-muted)] truncate">{item.description}</div>
                  </div>
                )}
                {active && sidebarOpen && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold-bright)] shadow-[0_0_8px_var(--gold-bright)] ml-auto"></span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Logout Bottom CTA */}
        <div className="p-3 border-t border-teal-500/20 pb-safe">
          <Link
            to="/"
            className="flex items-center min-h-[44px] p-2.5 rounded-xl text-xs font-semibold text-rose-300 bg-rose-950/30 border border-rose-500/25 hover:bg-rose-900/40 transition-all apple-press"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="ml-2.5">Back to Store</span>}
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Admin Header */}
        <header
          className="sticky top-16 z-20 transition-all"
          style={{
            background: 'rgba(8, 30, 35, 0.90)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(37, 204, 200, 0.16)'
          }}
        >
          {/* Top Title Bar */}
          <div className="px-4 md:px-6 py-3 flex items-center justify-between gap-3">
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              {/* Mobile Drawer Trigger Button (Touch Target 44x44) */}
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="md:hidden min-w-[40px] min-h-[40px] p-2 rounded-xl bg-teal-900/40 border border-teal-500/30 text-white flex items-center justify-center apple-press shadow-sm"
                aria-label="Open Admin Menu"
              >
                <Bars3Icon className="w-5 h-5" />
              </button>

              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-base sm:text-lg">{currentItem.icon}</span>
                  <h2
                    className="text-base sm:text-xl font-bold font-serif truncate"
                    style={{ color: 'var(--text-bright)' }}
                  >
                    {currentItem.title}
                  </h2>
                </div>
                <p className="text-[11px] text-[var(--text-soft)] hidden sm:block truncate">
                  {currentItem.description}
                </p>
              </div>
            </div>

            {/* Quick Admin Badge */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              <span className="hidden sm:inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-900/40 border border-teal-500/25 text-[var(--gold-bright)]">
                Admin Mode
              </span>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-teal-800 flex items-center justify-center text-white text-xs font-bold shadow-md">
                {user?.name?.charAt(0) || 'A'}
              </div>
            </div>
          </div>

          {/* ================= MOBILE ADMIN QUICK HORIZONTAL TABS ================= */}
          {/* Gives the admin instant 1-tap switching without opening menus */}
          <div className="md:hidden border-t border-teal-500/15 px-3 py-2 overflow-x-auto no-scrollbar flex items-center space-x-2">
            {menuItems.map((item) => {
              const active = isActive(item.path)
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all apple-press ${
                    active
                      ? 'text-[var(--gold-bright)] bg-teal-900/60 border border-teal-400/40 shadow-sm'
                      : 'text-[var(--text-soft)] bg-white/5 border border-white/5 hover:bg-white/10'
                  }`}
                >
                  <span className="text-sm">{item.icon}</span>
                  <span>{item.title}</span>
                </Link>
              )
            })}
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-3.5 sm:p-6 min-h-[calc(100vh-140px)] pb-24 md:pb-8">
          {children}
        </main>
      </div>
    </div>
  )
})

export default AdminLayout
