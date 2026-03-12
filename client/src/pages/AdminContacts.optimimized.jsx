import React, { useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import { useGetContactsQuery } from '../store/slices/adminApi'

const AdminContacts = () => {
  const [selectedContact, setSelectedContact] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  
  // Using RTK Query for contacts (assuming it exists in adminApi)
  const { data: contacts = [], isLoading, error } = useGetContactsQuery()

  const handleStatusChange = async (id, newStatus) => {
    // This would need to be implemented in adminApi
    console.log('Status change:', id, newStatus)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      // This would need to be implemented in adminApi
      console.log('Delete contact:', id)
    }
  }

  const handleViewDetails = (contact) => {
    setSelectedContact(contact)
    setShowDetailModal(true)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'New':
        return 'bg-blue-900/20 text-blue-300'
      case 'In Progress':
        return 'bg-yellow-900/20 text-yellow-300'
      case 'Resolved':
        return 'bg-green-900/20 text-green-300'
      default:
        return 'bg-gray-900/20 text-gray-300'
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-bright)' }}>Contact Submissions</h1>
          <p style={{ color: 'var(--text-soft)' }}>Manage customer inquiries and messages</p>
        </div>

        {/* Contacts Table */}
        <div style={{ background: 'var(--glass-card)', backdropFilter: 'blur(10px)', border: '1px solid var(--glass-border)' }} className="rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y" style={{ borderColor: 'var(--glass-border)' }}>
              <thead style={{ background: 'var(--glass)' }}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-soft)' }}>
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-soft)' }}>
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-soft)' }}>
                    Subject
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
                    <td colSpan="6" className="px-6 py-4 text-center" style={{ color: 'var(--text-soft)' }}>
                      Loading contacts...
                    </td>
                  </tr>
                ) : contacts.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12">
                      <div className="text-center">
                        <div className="text-6xl mb-4">📧</div>
                        <div className="text-lg font-medium mb-2" style={{ color: 'var(--text-bright)' }}>
                          No contact submissions yet
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  contacts.map((contact) => (
                    <tr key={contact.id} className="hover:opacity-80">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium" style={{ color: 'var(--text-bright)' }}>{contact.name}</div>
                        {contact.phone && <div className="text-sm" style={{ color: 'var(--text-soft)' }}>{contact.phone}</div>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: 'var(--text-bright)' }}>
                        {contact.email}
                      </td>
                      <td className="px-6 py-4 text-sm" style={{ color: 'var(--text-bright)' }}>
                        {contact.subject}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(contact.status)}`}>
                          {contact.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: 'var(--text-bright)' }}>
                        {new Date(contact.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          onClick={() => handleViewDetails(contact)}
                          style={{ color: 'var(--teal-bright)' }} 
                          className="mr-3 hover:opacity-80"
                        >
                          View
                        </button>
                        <button 
                          onClick={() => handleDelete(contact.id)}
                          style={{ color: 'var(--gold-bright)' }} 
                          className="hover:opacity-80"
                        >
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

        {/* Detail Modal */}
        {showDetailModal && selectedContact && (
          <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'rgba(0,0,0,0.6)' }}>
            <div style={{ background: 'var(--glass)', backdropFilter: 'blur(20px)', border: '1px solid var(--glass-border)' }} className="rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold" style={{ color: 'var(--text-bright)' }}>Contact Details</h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  style={{ color: 'var(--text-soft)' }}
                  className="hover:opacity-80"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-soft)' }}>Name</label>
                  <p style={{ color: 'var(--text-bright)' }}>{selectedContact.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-soft)' }}>Email</label>
                  <p style={{ color: 'var(--text-bright)' }}>{selectedContact.email}</p>
                </div>
                {selectedContact.phone && (
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-soft)' }}>Phone</label>
                    <p style={{ color: 'var(--text-bright)' }}>{selectedContact.phone}</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-soft)' }}>Subject</label>
                  <p style={{ color: 'var(--text-bright)' }}>{selectedContact.subject}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-soft)' }}>Message</label>
                  <p style={{ color: 'var(--text-bright)' }} className="whitespace-pre-wrap">{selectedContact.message}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-soft)' }}>Status</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedContact.status)}`}>
                    {selectedContact.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-soft)' }}>Submitted On</label>
                  <p style={{ color: 'var(--text-bright)' }}>{new Date(selectedContact.created_at).toLocaleString()}</p>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 rounded-lg transition-colors"
                  style={{ background: 'var(--teal)', color: 'var(--white)' }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default AdminContacts
