import React from 'react'
import AdminLayout from '../components/AdminLayout'
import { useGetDashboardStatsQuery } from '../store/slices/adminApi'

const AdminDashboard = () => {
  const { data: stats, isLoading, error } = useGetDashboardStatsQuery()

  const dashboardData = stats?.data || {
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: [],
    topProducts: []
  }

  const statsCards = [
    { title: 'Total Products', value: dashboardData.totalProducts, icon: '📦', loading: isLoading },
    { title: 'Total Orders', value: dashboardData.totalOrders, icon: '📋', loading: isLoading },
    { title: 'Total Users', value: dashboardData.totalUsers, icon: '👥', loading: isLoading },
    { title: 'Revenue', value: `₹${dashboardData.totalRevenue?.toLocaleString() || '0'}`, icon: '�', loading: isLoading }
  ]

  return (
    <AdminLayout>
      <div className="space-y-6 min-h-[calc(100vh-280px)] flex flex-col">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat, index) => (
            <div key={index} style={{ background: 'var(--glass-card)', backdropFilter: 'blur(10px)', border: '1px solid var(--glass-border)' }} className="rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm" style={{ color: 'var(--text-soft)' }}>{stat.title}</p>
                  <p className="text-2xl font-bold" style={{ color: 'var(--text-bright)' }}>
                    {stat.loading ? '...' : stat.value}
                  </p>
                </div>
                <div className="text-3xl">{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div style={{ background: 'var(--glass-card)', backdropFilter: 'blur(10px)', border: '1px solid var(--glass-border)' }} className="rounded-lg">
            <div className="p-6 border-b" style={{ borderColor: 'var(--glass-border)' }}>
              <h3 className="text-lg font-semibold" style={{ color: 'var(--text-bright)' }}>Recent Orders</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {isLoading ? (
                  <div className="text-center py-4" style={{ color: 'var(--text-soft)' }}>Loading...</div>
                ) : dashboardData.recentOrders?.length > 0 ? (
                  dashboardData.recentOrders.slice(0, 4).map((order) => (
                    <div key={order.id} style={{ background: 'var(--glass-light)', border: '1px solid var(--glass-border)' }} className="flex items-center justify-between p-4 rounded-lg">
                      <div>
                        <p className="font-medium" style={{ color: 'var(--text-bright)' }}>#{order.id}</p>
                        <p className="text-sm" style={{ color: 'var(--text-soft)' }}>{order.customer_name}</p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium" style={{ color: 'var(--text-bright)' }}>₹{order.total_amount}</p>
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                          order.status === 'Delivered' ? 'bg-green-900/20 text-green-300' :
                          order.status === 'Shipped' ? 'bg-blue-900/20 text-blue-300' :
                          'bg-yellow-900/20 text-yellow-300'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4" style={{ color: 'var(--text-soft)' }}>No recent orders</div>
                )}
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div style={{ background: 'var(--glass-card)', backdropFilter: 'blur(10px)', border: '1px solid var(--glass-border)' }} className="rounded-lg">
            <div className="p-6 border-b" style={{ borderColor: 'var(--glass-border)' }}>
              <h3 className="text-lg font-semibold" style={{ color: 'var(--text-bright)' }}>Top Products</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {isLoading ? (
                  <div className="text-center py-4" style={{ color: 'var(--text-soft)' }}>Loading...</div>
                ) : dashboardData.topProducts?.length > 0 ? (
                  dashboardData.topProducts.slice(0, 4).map((product, index) => (
                    <div key={index} style={{ background: 'var(--glass-light)', border: '1px solid var(--glass-border)' }} className="flex items-center justify-between p-4 rounded-lg">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{product.icon || '📦'}</span>
                        <div>
                          <p className="font-medium" style={{ color: 'var(--text-bright)' }}>{product.name}</p>
                          <p className="text-sm" style={{ color: 'var(--text-soft)' }}>{product.sales_count || 0} sold</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium" style={{ color: 'var(--text-bright)' }}>₹{product.price}</p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Revenue</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4" style={{ color: 'var(--text-soft)' }}>No top products</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ background: 'var(--glass-card)', backdropFilter: 'blur(10px)', border: '1px solid var(--glass-border)' }} className="rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-bright)' }}>Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 rounded-lg transition-colors" style={{ background: 'rgba(27,158,155,0.1)', color: 'var(--teal-bright)', border: '1px solid rgba(37,204,200,0.2)' }}>
              <div className="text-2xl mb-2">➕</div>
              <div className="text-sm font-medium">Add Product</div>
            </button>
            <button className="p-4 rounded-lg transition-colors" style={{ background: 'rgba(37,204,200,0.1)', color: 'var(--teal-bright)', border: '1px solid rgba(37,204,200,0.2)' }}>
              <div className="text-2xl mb-2">📊</div>
              <div className="text-sm font-medium">View Reports</div>
            </button>
            <button className="p-4 rounded-lg transition-colors" style={{ background: 'rgba(200,160,94,0.1)', color: 'var(--gold-bright)', border: '1px solid rgba(200,160,94,0.2)' }}>
              <div className="text-2xl mb-2">👥</div>
              <div className="text-sm font-medium">Manage Users</div>
            </button>
            <button className="p-4 rounded-lg transition-colors" style={{ background: 'rgba(146,26,40,0.1)', color: 'var(--maroon)', border: '1px solid rgba(146,26,40,0.2)' }}>
              <div className="text-2xl mb-2">⚙️</div>
              <div className="text-sm font-medium">Settings</div>
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard
