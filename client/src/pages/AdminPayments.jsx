import React, { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'
import { useGetPaymentsQuery } from '../store/slices/adminApi'

const AdminPayments = () => {
  const [statusFilter, setStatusFilter] = useState('All')
  const [localStoragePayments, setLocalStoragePayments] = useState([])
  const { data: apiPayments, isLoading, error } = useGetPaymentsQuery(
    statusFilter !== 'All' ? { status: statusFilter } : {}
  )

  // Load payments from localStorage
  useEffect(() => {
    const storedPayments = JSON.parse(localStorage.getItem('payments') || '[]')
    setLocalStoragePayments(storedPayments)
  }, [])

  // Combine API and localStorage payments
  const allPayments = [
    ...(apiPayments || []),
    ...localStoragePayments.map(payment => ({
      ...payment,
      _id: payment.id,
      amount: payment.total,
      method: payment.paymentMethod,
      customer: payment.userInfo,
      created_at: payment.timestamp,
      status: payment.status || 'Completed'
    }))
  ]

  const filteredPayments = statusFilter === 'All' ? allPayments : allPayments.filter(payment => payment.status === statusFilter)
  const statuses = ['All', 'Completed', 'Pending', 'Failed', 'Refunded']

  return (
    <AdminLayout>
      <div className="space-y-6 min-h-[calc(100vh-280px)] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-bright)' }}>Payment Management</h1>
            <p style={{ color: 'var(--text-soft)' }}>Track and manage payment transactions</p>
          </div>
          <button
            className="btn-primary"
          >
            Process Refunds
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

        {/* Payments Table */}
        <div style={{ background: 'var(--glass-card)', backdropFilter: 'blur(10px)', border: '1px solid var(--glass-border)' }} className="rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y" style={{ borderColor: 'var(--glass-border)' }}>
              <thead style={{ background: 'var(--glass)' }}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-soft)' }}>
                    Payment ID
                  </th>
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
                    Method
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
                {isLoading ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center" style={{ color: 'var(--text-soft)' }}>
                      <div className="text-6xl mb-4">⏳</div>
                      <div className="text-lg font-medium mb-2">Loading payments...</div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center">
                      <div className="text-6xl mb-4">❌</div>
                      <div className="text-lg font-medium mb-2" style={{ color: 'var(--gold-bright)' }}>
                        Error loading payments
                      </div>
                      <div className="text-sm" style={{ color: 'var(--text-soft)' }}>
                        {error}
                      </div>
                    </td>
                  </tr>
                ) : filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-12">
                      <div className="text-center">
                        <div className="text-6xl mb-4">💳</div>
                        <div className="text-lg font-medium mb-2" style={{ color: 'var(--text-bright)' }}>
                          No payments found
                        </div>
                        <div className="text-sm" style={{ color: 'var(--text-soft)' }}>
                          Try adjusting your status filter or check back later for new payment transactions.
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((payment) => (
                    <tr key={payment._id || payment.id} className="hover:opacity-80">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium" style={{ color: 'var(--text-bright)' }}>
                          {payment._id ? `PAY${payment._id.slice(-6)}` : `PAY${payment.id?.toString().slice(-6)}`}
                          {payment.id && !payment._id && (
                            <span className="ml-2 text-xs bg-yellow-900/20 text-yellow-300 px-2 py-1 rounded">Local</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: 'var(--text-bright)' }}>
                        {payment.orderId ? `ORD${payment.orderId.slice(-6)}` : `ORD${payment.id?.toString().slice(-6)}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: 'var(--text-bright)' }}>
                        {payment.customer?.name || payment.userInfo?.name || 'Guest'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: 'var(--text-bright)' }}>
                        ₹{payment.amount || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: 'var(--text-bright)' }}>
                        <span className="capitalize">{payment.method || 'Unknown'}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          payment.status === 'Completed' ? 'bg-green-900/20 text-green-300' :
                          payment.status === 'Pending' ? 'bg-yellow-900/20 text-yellow-300' :
                          payment.status === 'Failed' ? 'bg-red-900/20 text-red-300' :
                          'bg-purple-900/20 text-purple-300'
                        }`}>
                          {payment.status || 'Unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: 'var(--text-soft)' }}>
                        {new Date(payment.created_at || payment.timestamp).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button style={{ color: 'var(--teal-bright)' }} className="mr-3 hover:opacity-80">
                          View
                        </button>
                        {payment.status === 'Completed' && (
                          <button style={{ color: 'var(--gold-bright)' }} className="hover:opacity-80">
                            Refund
                          </button>
                        )}
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

export default AdminPayments
