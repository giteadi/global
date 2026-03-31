import React, { useState } from 'react'
import AdminLayout from '../components/AdminLayout'

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    siteTitle: 'Global Exim Traders',
    siteDescription: 'Where Heritage Meets Global Elegance',
    contactEmail: 'info@globalexim.com',
    contactPhone: '+91 98851 39882',
    currency: 'INR',
    taxRate: 18,
    shippingFee: 150,
    maintenanceMode: false,
    emailNotifications: true,
    smsNotifications: false,
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would typically save the settings
    alert('Settings saved successfully!')
  }

  return (
    <AdminLayout>
      <div className="space-y-6 min-h-[calc(100vh-280px)] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-bright)' }}>System Settings</h1>
            <p style={{ color: 'var(--text-soft)' }}>Configure system preferences and settings</p>
          </div>
        </div>

        {/* Settings Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General Settings */}
          <div style={{ background: 'var(--glass-card)', backdropFilter: 'blur(10px)', border: '1px solid var(--glass-border)' }} className="rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-bright)' }}>General Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-bright)' }}>Site Title</label>
                <input
                  type="text"
                  name="siteTitle"
                  value={settings.siteTitle}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{
                    borderColor: 'var(--glass-border)',
                    background: 'var(--glass-light)',
                    color: 'var(--text-bright)',
                    '--tw-ring-color': 'var(--teal-bright)'
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-bright)' }}>Currency</label>
                <select
                  name="currency"
                  value={settings.currency}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{
                    borderColor: 'var(--glass-border)',
                    background: 'var(--glass-light)',
                    color: 'var(--text-bright)',
                    '--tw-ring-color': 'var(--teal-bright)'
                  }}
                >
                  <option value="INR" style={{ background: 'var(--glass)', color: 'var(--text-bright)' }}>INR (₹)</option>
                  <option value="USD" style={{ background: 'var(--glass)', color: 'var(--text-bright)' }}>USD ($)</option>
                  <option value="EUR" style={{ background: 'var(--glass)', color: 'var(--text-bright)' }}>EUR (€)</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-bright)' }}>Site Description</label>
                <textarea
                  name="siteDescription"
                  value={settings.siteDescription}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{
                    borderColor: 'var(--glass-border)',
                    background: 'var(--glass-light)',
                    color: 'var(--text-bright)',
                    '--tw-ring-color': 'var(--teal-bright)'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div style={{ background: 'var(--glass-card)', backdropFilter: 'blur(10px)', border: '1px solid var(--glass-border)' }} className="rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-bright)' }}>Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-bright)' }}>Contact Email</label>
                <input
                  type="email"
                  name="contactEmail"
                  value={settings.contactEmail}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{
                    borderColor: 'var(--glass-border)',
                    background: 'var(--glass-light)',
                    color: 'var(--text-bright)',
                    '--tw-ring-color': 'var(--teal-bright)'
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-bright)' }}>Contact Phone</label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={settings.contactPhone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{
                    borderColor: 'var(--glass-border)',
                    background: 'var(--glass-light)',
                    color: 'var(--text-bright)',
                    '--tw-ring-color': 'var(--teal-bright)'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Business Settings */}
          <div style={{ background: 'var(--glass-card)', backdropFilter: 'blur(10px)', border: '1px solid var(--glass-border)' }} className="rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-bright)' }}>Business Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-bright)' }}>Tax Rate (%)</label>
                <input
                  type="number"
                  name="taxRate"
                  value={settings.taxRate}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  step="0.01"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{
                    borderColor: 'var(--glass-border)',
                    background: 'var(--glass-light)',
                    color: 'var(--text-bright)',
                    '--tw-ring-color': 'var(--teal-bright)'
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-bright)' }}>Shipping Fee (₹)</label>
                <input
                  type="number"
                  name="shippingFee"
                  value={settings.shippingFee}
                  onChange={handleChange}
                  min="0"
                  step="1"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{
                    borderColor: 'var(--glass-border)',
                    background: 'var(--glass-light)',
                    color: 'var(--text-bright)',
                    '--tw-ring-color': 'var(--teal-bright)'
                  }}
                />
              </div>
            </div>
          </div>

          {/* System Settings */}
          <div style={{ background: 'var(--glass-card)', backdropFilter: 'blur(10px)', border: '1px solid var(--glass-border)' }} className="rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-bright)' }}>System Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="maintenanceMode"
                  checked={settings.maintenanceMode}
                  onChange={handleChange}
                  className="mr-3"
                />
                <label className="text-sm font-medium" style={{ color: 'var(--text-bright)' }}>Maintenance Mode</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="emailNotifications"
                  checked={settings.emailNotifications}
                  onChange={handleChange}
                  className="mr-3"
                />
                <label className="text-sm font-medium" style={{ color: 'var(--text-bright)' }}>Email Notifications</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="smsNotifications"
                  checked={settings.smsNotifications}
                  onChange={handleChange}
                  className="mr-3"
                />
                <label className="text-sm font-medium" style={{ color: 'var(--text-bright)' }}>SMS Notifications</label>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="btn-primary"
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}

export default AdminSettings
