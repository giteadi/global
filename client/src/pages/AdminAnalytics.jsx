import React, { useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'
import { useDispatch, useSelector } from 'react-redux'
import { getDashboardStats, getSalesAnalytics } from '../store/slices/analyticsSlice'

const AdminAnalytics = () => {
  const dispatch = useDispatch()
  const { dashboardStats, loading, error } = useSelector(state => state.analytics)

  useEffect(() => {
    dispatch(getDashboardStats())
    dispatch(getSalesAnalytics())
  }, [dispatch])

  const stats = dashboardStats?.stats || {
    totalRevenue: '₹0',
    totalOrders: 0,
    totalCustomers: 0,
    avgOrderValue: '₹0',
    monthlyGrowth: '+0%',
    topCategories: [
      { name: 'Temple Heritage', revenue: '₹0', percentage: 0 },
      { name: 'Contemporary Ethnic', revenue: '₹0', percentage: 0 },
      { name: 'Handcrafted Decor', revenue: '₹0', percentage: 0 },
      { name: 'Export Grade', revenue: '₹0', percentage: 0 },
    ],
    recentActivity: [
      { action: 'New Order', details: 'ORD001 - ₹0', time: '2 hours ago' },
      { action: 'User Registration', details: 'Anjali Verma', time: '4 hours ago' },
      { action: 'Payment Completed', details: 'PAY003 - ₹0', time: '6 hours ago' },
      { action: 'Product Added', details: 'Brass Idol Set', time: '1 day ago' },
    ]
  }

  const topCategories = stats.topCategories
  const recentActivity = stats.recentActivity

  return (
    <AdminLayout>
      <div className="space-y-6 min-h-[calc(100vh-280px)] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-bright)' }}>Analytics Dashboard</h1>
            <p style={{ color: 'var(--text-soft)' }}>Business insights and performance metrics</p>
          </div>
          <button
            className="btn-primary"
          >
            Export Report
          </button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div style={{ background: 'var(--glass-card)', backdropFilter: 'blur(10px)', border: '1px solid var(--glass-border)' }} className="rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: 'var(--text-soft)' }}>Total Revenue</p>
                <p className="text-2xl font-bold" style={{ color: 'var(--text-bright)' }}>{analyticsData.totalRevenue}</p>
                <p className="text-xs" style={{ color: 'var(--green-400)' }}>{analyticsData.monthlyGrowth}</p>
              </div>
              <div className="text-3xl" style={{ color: 'var(--gold-bright)' }}>💰</div>
            </div>
          </div>
          <div style={{ background: 'var(--glass-card)', backdropFilter: 'blur(10px)', border: '1px solid var(--glass-border)' }} className="rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: 'var(--text-soft)' }}>Total Orders</p>
                <p className="text-2xl font-bold" style={{ color: 'var(--text-bright)' }}>{analyticsData.totalOrders}</p>
                <p className="text-xs" style={{ color: 'var(--green-400)' }}>+8.2%</p>
              </div>
              <div className="text-3xl" style={{ color: 'var(--teal-bright)' }}>📋</div>
            </div>
          </div>
          <div style={{ background: 'var(--glass-card)', backdropFilter: 'blur(10px)', border: '1px solid var(--glass-border)' }} className="rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: 'var(--text-soft)' }}>Total Customers</p>
                <p className="text-2xl font-bold" style={{ color: 'var(--text-bright)' }}>{analyticsData.totalCustomers}</p>
                <p className="text-xs" style={{ color: 'var(--green-400)' }}>+15.3%</p>
              </div>
              <div className="text-3xl" style={{ color: 'var(--maroon)' }}>👥</div>
            </div>
          </div>
          <div style={{ background: 'var(--glass-card)', backdropFilter: 'blur(10px)', border: '1px solid var(--glass-border)' }} className="rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: 'var(--text-soft)' }}>Avg Order Value</p>
                <p className="text-2xl font-bold" style={{ color: 'var(--text-bright)' }}>{analyticsData.avgOrderValue}</p>
                <p className="text-xs" style={{ color: 'var(--green-400)' }}>+5.7%</p>
              </div>
              <div className="text-3xl" style={{ color: 'var(--pink-soft)' }}>📊</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Categories */}
          <div style={{ background: 'var(--glass-card)', backdropFilter: 'blur(10px)', border: '1px solid var(--glass-border)' }} className="rounded-lg">
            <div className="p-6 border-b" style={{ borderColor: 'var(--glass-border)' }}>
              <h3 className="text-lg font-semibold" style={{ color: 'var(--text-bright)' }}>Top Categories</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {analyticsData.topCategories.map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium" style={{ color: 'var(--text-bright)' }}>{category.name}</span>
                        <span className="text-sm" style={{ color: 'var(--text-soft)' }}>{category.revenue}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="h-2 rounded-full"
                          style={{ width: `${category.percentage}%`, background: 'var(--teal)' }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div style={{ background: 'var(--glass-card)', backdropFilter: 'blur(10px)', border: '1px solid var(--glass-border)' }} className="rounded-lg">
            <div className="p-6 border-b" style={{ borderColor: 'var(--glass-border)' }}>
              <h3 className="text-lg font-semibold" style={{ color: 'var(--text-bright)' }}>Recent Activity</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {analyticsData.recentActivity.map((activity, index) => (
                  <div key={index} style={{ background: 'var(--glass-light)', border: '1px solid var(--glass-border)' }} className="flex items-center justify-between p-4 rounded-lg">
                    <div>
                      <p className="font-medium" style={{ color: 'var(--text-bright)' }}>{activity.action}</p>
                      <p className="text-sm" style={{ color: 'var(--text-soft)' }}>{activity.details}</p>
                    </div>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminAnalytics
