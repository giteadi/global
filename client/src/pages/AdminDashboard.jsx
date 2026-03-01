import React from 'react'
import AdminLayout from '../components/AdminLayout'

const AdminDashboard = () => {
  const stats = [
    { title: 'Total Products', value: '8', icon: '📦', change: '+2', changeType: 'positive' },
    { title: 'Total Orders', value: '24', icon: '📋', change: '+12%', changeType: 'positive' },
    { title: 'Total Users', value: '156', icon: '👥', change: '+8%', changeType: 'positive' },
    { title: 'Revenue', value: '₹45,678', icon: '💰', change: '+18%', changeType: 'positive' }
  ]

  const recentOrders = [
    { id: 'ORD001', customer: 'Rahul Sharma', amount: '₹2,499', status: 'Processing', date: '2024-02-27' },
    { id: 'ORD002', customer: 'Priya Patel', amount: '₹1,899', status: 'Shipped', date: '2024-02-27' },
    { id: 'ORD003', customer: 'Amit Singh', amount: '₹3,299', status: 'Delivered', date: '2024-02-26' },
    { id: 'ORD004', customer: 'Neha Gupta', amount: '₹999', status: 'Processing', date: '2024-02-26' }
  ]

  const topProducts = [
    { name: 'Temple Necklace Set', sales: 45, revenue: '₹13,455', icon: '🏛️' },
    { name: 'Ethnic Earrings', sales: 38, revenue: '₹5,662', icon: '💎' },
    { name: 'Handcrafted Decor Vase', sales: 22, revenue: '₹4,378', icon: '🏺' },
    { name: 'Export Bracelet Set', sales: 18, revenue: '₹4,482', icon: '📦' }
  ]

  return (
    <AdminLayout>
      <div className="space-y-6 min-h-[calc(100vh-280px)] flex flex-col">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} style={{ background: 'var(--glass-card)', backdropFilter: 'blur(10px)', border: '1px solid var(--glass-border)' }} className="rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm" style={{ color: 'var(--text-soft)' }}>{stat.title}</p>
                  <p className="text-2xl font-bold" style={{ color: 'var(--text-bright)' }}>{stat.value}</p>
                  <div className={`flex items-center text-sm mt-1 ${
                    stat.changeType === 'positive' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    <span>{stat.change}</span>
                    <span className="ml-1">from last month</span>
                  </div>
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
                {recentOrders.map((order) => (
                  <div key={order.id} style={{ background: 'var(--glass-light)', border: '1px solid var(--glass-border)' }} className="flex items-center justify-between p-4 rounded-lg">
                    <div>
                      <p className="font-medium" style={{ color: 'var(--text-bright)' }}>{order.id}</p>
                      <p className="text-sm" style={{ color: 'var(--text-soft)' }}>{order.customer}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{order.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium" style={{ color: 'var(--text-bright)' }}>{order.amount}</p>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        order.status === 'Delivered' ? 'bg-green-900/20 text-green-300' :
                        order.status === 'Shipped' ? 'bg-blue-900/20 text-blue-300' :
                        'bg-yellow-900/20 text-yellow-300'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
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
                {topProducts.map((product, index) => (
                  <div key={index} style={{ background: 'var(--glass-light)', border: '1px solid var(--glass-border)' }} className="flex items-center justify-between p-4 rounded-lg">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{product.icon}</span>
                      <div>
                        <p className="font-medium" style={{ color: 'var(--text-bright)' }}>{product.name}</p>
                        <p className="text-sm" style={{ color: 'var(--text-soft)' }}>{product.sales} sold</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium" style={{ color: 'var(--text-bright)' }}>{product.revenue}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Revenue</p>
                    </div>
                  </div>
                ))}
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
