import React, { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'
import { useGetUsersQuery, useCreateUserMutation, useUpdateUserMutation, useDeleteUserMutation } from '../store/slices/adminApi'

const AdminUsers = () => {
  const [roleFilter, setRoleFilter] = useState('All')
  const params = roleFilter !== 'All' ? { role: roleFilter } : {}
  const { data: usersData, isLoading: loading, error, refetch } = useGetUsersQuery(params)
  const [createUser] = useCreateUserMutation()
  const [updateUser] = useUpdateUserMutation()
  const [deleteUser] = useDeleteUserMutation()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'customer',
    status: 'Active'
  })

  const users = usersData?.data?.users || []
  const filteredUsers = roleFilter === 'All' ? users : users.filter(user => user.role === roleFilter)
  const roles = ['All', 'customer', 'admin']

  const handleAddUser = () => {
    setEditingUser(null)
    setFormData({ name: '', email: '', role: 'customer', status: 'Active' })
    setIsModalOpen(true)
  }

  const handleEditUser = (user) => {
    setEditingUser(user)
    setFormData({
      name: user.name || '',
      email: user.email || '',
      role: user.role || 'customer',
      status: user.status || 'Active'
    })
    setIsModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingUser) {
        await updateUser({ id: editingUser._id, ...formData }).unwrap()
      } else {
        await createUser(formData).unwrap()
      }
      setIsModalOpen(false)
      refetch()
    } catch (err) {
      console.error('Error saving user:', err)
    }
  }

  const handleToggleStatus = async (user) => {
    try {
      const newStatus = user.status === 'Active' ? 'Inactive' : 'Active'
      await updateUser({ id: user._id, status: newStatus }).unwrap()
      refetch()
    } catch (err) {
      console.error('Error updating status:', err)
    }
  }

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId).unwrap()
        refetch()
      } catch (err) {
        console.error('Error deleting user:', err)
      }
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6 min-h-[calc(100vh-280px)] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-bright)' }}>User Management</h1>
            <p style={{ color: 'var(--text-soft)' }}>Manage user accounts and permissions</p>
          </div>
          <button
            className="btn-primary"
            onClick={handleAddUser}
          >
            Add New User
          </button>
        </div>

        {/* Filters */}
        <div style={{ background: 'var(--glass-card)', backdropFilter: 'blur(10px)', border: '1px solid var(--glass-border)' }} className="p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-bright)' }}>Role Filter</label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                style={{
                  borderColor: 'var(--glass-border)',
                  background: 'var(--glass-light)',
                  color: 'var(--text-bright)',
                  '--tw-ring-color': 'var(--teal-bright)'
                }}
              >
                {roles.map(role => (
                  <option key={role} value={role} style={{ background: 'var(--glass)', color: 'var(--text-bright)' }}>{role}</option>
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

        {/* Users Table */}
        <div style={{ background: 'var(--glass-card)', backdropFilter: 'blur(10px)', border: '1px solid var(--glass-border)' }} className="rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y" style={{ borderColor: 'var(--glass-border)' }}>
              <thead style={{ background: 'var(--glass)' }}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-soft)' }}>
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-soft)' }}>
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-soft)' }}>
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-soft)' }}>
                    Join Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-soft)' }}>
                    Orders
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-soft)' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody style={{ background: 'var(--glass-light)', borderColor: 'var(--glass-border)' }} className="divide-y">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center" style={{ color: 'var(--text-soft)' }}>
                      <div className="text-6xl mb-4">⏳</div>
                      <div className="text-lg font-medium mb-2">Loading users...</div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="text-6xl mb-4">❌</div>
                      <div className="text-lg font-medium mb-2" style={{ color: 'var(--gold-bright)' }}>
                        Error loading users
                      </div>
                      <div className="text-sm" style={{ color: 'var(--text-soft)' }}>
                        {error}
                      </div>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12">
                      <div className="text-center">
                        <div className="text-6xl mb-4">👥</div>
                        <div className="text-lg font-medium mb-2" style={{ color: 'var(--text-bright)' }}>
                          No users found
                        </div>
                        <div className="text-sm" style={{ color: 'var(--text-soft)' }}>
                          Try adjusting your role filter or add a new user to get started.
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:opacity-80">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold" style={{ background: 'var(--teal)' }}>
                            {user.name?.charAt(0) || 'U'}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium" style={{ color: 'var(--text-bright)' }}>{user.name || 'Unknown'}</div>
                            <div className="text-sm" style={{ color: 'var(--text-soft)' }}>{user.email || 'N/A'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.role === 'admin' ? 'bg-purple-900/20 text-purple-300' : 'bg-blue-900/20 text-blue-300'
                        }`}>
                          {user.role || 'customer'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.status === 'Active' ? 'bg-green-900/20 text-green-300' : 'bg-red-900/20 text-red-300'
                        }`}>
                          {user.status || 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: 'var(--text-soft)' }}>
                        {new Date(user.created_at).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: 'var(--text-bright)' }}>
                        {user.orderCount || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button style={{ color: 'var(--teal-bright)' }} className="mr-3 hover:opacity-80" onClick={() => handleEditUser(user)}>
                          Edit
                        </button>
                        <button style={{ color: 'var(--gold-bright)' }} className="mr-3 hover:opacity-80" onClick={() => handleToggleStatus(user)}>
                          {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                        </button>
                        <button style={{ color: 'var(--red)' }} className="hover:opacity-80" onClick={() => handleDeleteUser(user._id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal for Add/Edit User */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div style={{ background: 'var(--glass-card)', backdropFilter: 'blur(10px)', border: '1px solid var(--glass-border)' }} className="p-6 rounded-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-bright)' }}>
                {editingUser ? 'Edit User' : 'Add New User'}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-bright)' }}>Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                    style={{
                      borderColor: 'var(--glass-border)',
                      background: 'var(--glass-light)',
                      color: 'var(--text-bright)',
                      '--tw-ring-color': 'var(--teal-bright)'
                    }}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-bright)' }}>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                    style={{
                      borderColor: 'var(--glass-border)',
                      background: 'var(--glass-light)',
                      color: 'var(--text-bright)',
                      '--tw-ring-color': 'var(--teal-bright)'
                    }}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-bright)' }}>Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                    style={{
                      borderColor: 'var(--glass-border)',
                      background: 'var(--glass-light)',
                      color: 'var(--text-bright)',
                      '--tw-ring-color': 'var(--teal-bright)'
                    }}
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-bright)' }}>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                    style={{
                      borderColor: 'var(--glass-border)',
                      background: 'var(--glass-light)',
                      color: 'var(--text-bright)',
                      '--tw-ring-color': 'var(--teal-bright)'
                    }}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-lg"
                    style={{ background: 'var(--glass)', color: 'var(--text-soft)', border: '1px solid var(--glass-border)' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg"
                    style={{ background: 'var(--teal)', color: 'white' }}
                  >
                    {editingUser ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default AdminUsers
