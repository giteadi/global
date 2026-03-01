import React, { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'
import { useDispatch, useSelector } from 'react-redux'
import { getAdminOrders } from '../store/slices/adminOrdersSlice'

const AdminOrders = () => {
  const dispatch = useDispatch()
  const { orders, loading, error } = useSelector(state => state.adminOrders)
  const [statusFilter, setStatusFilter] = useState('All')

  useEffect(() => {
    const params = statusFilter !== 'All' ? { status: statusFilter } : {}
    dispatch(getAdminOrders(params))
  }, [dispatch, statusFilter])

  const filteredOrders = statusFilter === 'All' ? orders : orders.filter(order => order.orderStatus === statusFilter)
  const statuses = ['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled']

  return (
    <AdminLayout>
      <div className="space-y-6 min-h-[calc(100vh-280px)] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-bright)' }}>Order Management</h1>
            <p style={{ color: 'var(--text-soft)' }}>Manage customer orders and shipments</p>
          </div>
          <button
            className="btn-primary"
          >
            Export Orders
          </button>
        </div>

        {/* Filters */}
        <div style={{ background: 'var(--glass-card)', backdropFilter: 'blur(10px)', border: '1px solid var(--glass-border)' }} className="p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-bright)' }}>Status Filter</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                style={{
                  borderColor: 'var(--glass-border)',
                  background: 'var(--glass-light)',
                  color: 'var(--text-bright)',
                  '--tw-ring-color': 'var(--teal-bright)'
                }}
              >
                {statuses.map(status => (
                  <option key={status} value={status} style={{ background: 'var(--glass)', color: 'var(--text-bright)' }}>{status}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button className="px-4 py-2 rounded-lg transition-colors" style={{ background: 'var(--glass)', color: 'var(--text-soft)', border: '1px solid var(--glass-border)' }}>
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div style={{ background: 'var(--glass-card)', backdropFilter: 'blur(10px)', border: '1px solid var(--glass-border)' }} className="rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y" style={{ borderColor: 'var(--glass-border)' }}>
              <thead style={{ background: 'var(--glass)' }}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-soft)' }}>
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-soft)' }}>
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-soft)' }}>
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-soft)' }}>
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-soft)' }}>
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-soft)' }}>
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-soft)' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody style={{ background: 'var(--glass-light)', borderColor: 'var(--glass-border)' }} className="divide-y">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center" style={{ color: 'var(--text-soft)' }}>
                      <div className="text-6xl mb-4">⏳</div>
                      <div className="text-lg font-medium mb-2">Loading orders...</div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <div className="text-6xl mb-4">❌</div>
                      <div className="text-lg font-medium mb-2" style={{ color: 'var(--gold-bright)' }}>
                        Error loading orders
                      </div>
                      <div className="text-sm" style={{ color: 'var(--text-soft)' }}>
                        {error}
                      </div>
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12">
                      <div className="text-center">
                        <div className="text-6xl mb-4">📋</div>
                        <div className="text-lg font-medium mb-2" style={{ color: 'var(--text-bright)' }}>
                          No orders found
                        </div>
                        <div className="text-sm" style={{ color: 'var(--text-soft)' }}>
                          Try adjusting your status filter or check back later for new orders.
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order._id} className="hover:opacity-80">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium" style={{ color: 'var(--text-bright)' }}>
                          {order._id ? `ORD${order._id.slice(-6)}` : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium" style={{ color: 'var(--text-bright)' }}>
                          {order.user?.name || 'Guest User'}
                        </div>
                        <div className="text-sm" style={{ color: 'var(--text-soft)' }}>
                          {order.user?.email || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: 'var(--text-bright)' }}>
                        ₹{order.total || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: 'var(--text-bright)' }}>
                        {order.items?.length || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          order.orderStatus === 'Delivered' ? 'bg-green-900/20 text-green-300' :
                          order.orderStatus === 'Shipped' ? 'bg-blue-900/20 text-blue-300' :
                          order.orderStatus === 'Processing' ? 'bg-yellow-900/20 text-yellow-300' :
                          'bg-red-900/20 text-red-300'
                        }`}>
                          {order.orderStatus || 'Unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: 'var(--text-soft)' }}>
                        {new Date(order.created_at).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button style={{ color: 'var(--teal-bright)' }} className="mr-3 hover:opacity-80">
                          View
                        </button>
                        <button style={{ color: 'var(--gold-bright)' }} className="hover:opacity-80">
                          Update
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminOrders
