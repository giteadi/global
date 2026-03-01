import React, { useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import { useGetOrdersQuery, useUpdateOrderMutation } from '../store/slices/adminApi'
import toast from 'react-hot-toast'

const AdminOrders = () => {
  const [statusFilter, setStatusFilter] = useState('All')
  const params = statusFilter !== 'All' ? { status: statusFilter } : {}
  const { data: ordersData, isLoading, error, refetch } = useGetOrdersQuery(params)
  const [updateOrder] = useUpdateOrderMutation()

  const orders = ordersData?.data?.orders || []
  const filteredOrders = statusFilter === 'All' ? orders : orders.filter(order => order.status === statusFilter)
  const statuses = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrder({ id: orderId, status: newStatus }).unwrap()
      toast.success('Order status updated successfully')
      refetch()
    } catch (err) {
      toast.error('Failed to update order status')
    }
  }

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
                    <tr key={order.id} className="hover:opacity-80">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium" style={{ color: 'var(--text-bright)' }}>
                          #{order.id}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium" style={{ color: 'var(--text-bright)' }}>
                          {order.customer_name || 'N/A'}
                        </div>
                        <div className="text-sm" style={{ color: 'var(--text-soft)' }}>
                          {order.customer_email || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: 'var(--text-bright)' }}>
                        ₹{order.total_amount || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: 'var(--text-bright)' }}>
                        {order.items_count || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={order.status || 'Pending'}
                          onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                          className="px-2 py-1 text-xs rounded-full border focus:outline-none focus:ring-1"
                          style={{
                            borderColor: 'var(--glass-border)',
                            background: 'var(--glass-light)',
                            color: 'var(--text-bright)',
                            '--tw-ring-color': 'var(--teal-bright)'
                          }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: 'var(--text-soft)' }}>
                        {order.created_at ? new Date(order.created_at).toLocaleDateString('en-IN') : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button style={{ color: 'var(--teal-bright)' }} className="mr-3 hover:opacity-80">
                          View Details
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
