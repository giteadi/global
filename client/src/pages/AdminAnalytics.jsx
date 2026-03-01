import React, { useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import { useGetAnalyticsQuery } from '../store/slices/adminApi'

const AdminAnalytics = () => {
  const [period, setPeriod] = useState('month')
  const [type, setType] = useState('overview')
  const { data: analyticsData, isLoading, error } = useGetAnalyticsQuery({ period, type })

  const analytics = analyticsData?.data || {
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    avgOrderValue: 0,
    monthlyGrowth: '0%',
    topCategories: [],
    recentActivity: []
  }

  const periods = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' }
  ]

  const types = [
    { value: 'overview', label: 'Overview' },
    { value: 'sales', label: 'Sales' },
    { value: 'products', label: 'Products' },
    { value: 'customers', label: 'Customers' }
  ]

  return (
    <AdminLayout>
      <div className="space-y-6 min-h-[calc(100vh-280px)] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-bright)' }}>Analytics Dashboard</h1>
            <p style={{ color: 'var(--text-soft)' }}>Business insights and performance metrics</p>
          </div>
          <div className="flex space-x-4">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
              style={{
                borderColor: 'var(--glass-border)',
                background: 'var(--glass-light)',
                color: 'var(--text-bright)',
                '--tw-ring-color': 'var(--teal-bright)'
              }}
            >
              {periods.map(p => (
                <option key={p.value} value={p.value} style={{ background: 'var(--glass)', color: 'var(--text-bright)' }}>{p.label}</option>
              ))}
            </select>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
              style={{
                borderColor: 'var(--glass-border)',
                background: 'var(--glass-light)',
                color: 'var(--text-bright)',
                '--tw-ring-color': 'var(--teal-bright)'
              }}
            >
              {types.map(t => (
                <option key={t.value} value={t.value} style={{ background: 'var(--glass)', color: 'var(--text-bright)' }}>{t.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div style={{ background: 'var(--glass-card)', backdropFilter: 'blur(10px)', border: '1px solid var(--glass-border)' }} className="rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: 'var(--text-soft)' }}>Total Revenue</p>
                <p className="text-2xl font-bold" style={{ color: 'var(--text-bright)' }}>₹{isLoading ? '...' : analytics.totalRevenue?.toLocaleString() || '0'}</p>
                <p className="text-xs" style={{ color: 'var(--green-400)' }}>{analytics.monthlyGrowth || '0%'}</p>
              </div>
              <div className="text-3xl" style={{ color: 'var(--gold-bright)' }}>💰</div>
            </div>
          </div>
          <div style={{ background: 'var(--glass-card)', backdropFilter: 'blur(10px)', border: '1px solid var(--glass-border)' }} className="rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: 'var(--text-soft)' }}>Total Orders</p>
                <p className="text-2xl font-bold" style={{ color: 'var(--text-bright)' }}>{isLoading ? '...' : analytics.totalOrders || 0}</p>
                <p className="text-xs" style={{ color: 'var(--green-400)' }}>+8.2%</p>
              </div>
              <div className="text-3xl" style={{ color: 'var(--teal-bright)' }}>📋</div>
            </div>
          </div>
          <div style={{ background: 'var(--glass-card)', backdropFilter: 'blur(10px)', border: '1px solid var(--glass-border)' }} className="rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: 'var(--text-soft)' }}>Total Customers</p>
                <p className="text-2xl font-bold" style={{ color: 'var(--text-bright)' }}>{isLoading ? '...' : analytics.totalCustomers || 0}</p>
                <p className="text-xs" style={{ color: 'var(--green-400)' }}>+15.3%</p>
              </div>
              <div className="text-3xl" style={{ color: 'var(--maroon)' }}>👥</div>
            </div>
          </div>
          <div style={{ background: 'var(--glass-card)', backdropFilter: 'blur(10px)', border: '1px solid var(--glass-border)' }} className="rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: 'var(--text-soft)' }}>Avg Order Value</p>
                <p className="text-2xl font-bold" style={{ color: 'var(--text-bright)' }}>₹{isLoading ? '...' : analytics.avgOrderValue || '0'}</p>
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
                {isLoading ? (
                  <div className="text-center py-4" style={{ color: 'var(--text-soft)' }}>Loading...</div>
                ) : analytics.topCategories?.length > 0 ? (
                  analytics.topCategories.map((category, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium" style={{ color: 'var(--text-bright)' }}>{category.name}</span>
                          <span className="text-sm" style={{ color: 'var(--text-soft)' }}>₹{category.revenue?.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className="h-2 rounded-full"
                            style={{ width: `${category.percentage}%`, background: 'var(--teal)' }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4" style={{ color: 'var(--text-soft)' }}>No category data available</div>
                )}
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
                {isLoading ? (
                  <div className="text-center py-4" style={{ color: 'var(--text-soft)' }}>Loading...</div>
                ) : analytics.recentActivity?.length > 0 ? (
                  analytics.recentActivity.map((activity, index) => (
                    <div key={index} style={{ background: 'var(--glass-light)', border: '1px solid var(--glass-border)' }} className="flex items-center justify-between p-4 rounded-lg">
                      <div>
                        <p className="font-medium" style={{ color: 'var(--text-bright)' }}>{activity.action}</p>
                        <p className="text-sm" style={{ color: 'var(--text-soft)' }}>{activity.details}</p>
                      </div>
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{activity.time}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4" style={{ color: 'var(--text-soft)' }}>No recent activity</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminAnalytics
