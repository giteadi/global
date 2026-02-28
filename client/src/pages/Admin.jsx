import React from 'react'

const Admin = () => {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-yellow-400 text-sm uppercase tracking-wider">Admin Panel</span>
          <h1 className="text-4xl md:text-5xl font-serif text-white mt-2 mb-4">
            Dashboard
          </h1>
          <div className="w-24 h-1 bg-yellow-400 mx-auto mb-6"></div>
          <p className="text-teal-200 max-w-2xl mx-auto">
            Manage your store's products, orders, and users from this central dashboard.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-teal-800/30 backdrop-blur-sm border border-teal-600/30 rounded-lg p-8 hover:border-yellow-400/50 transition-all">
            <div className="text-yellow-400 text-4xl mb-4">📦</div>
            <h2 className="text-2xl font-serif text-white mb-4">Manage Products</h2>
            <p className="text-teal-200 mb-4">Add, edit, or remove products from your catalog</p>
            <button className="w-full bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105">
              Go to Products
            </button>
          </div>

          <div className="bg-teal-800/30 backdrop-blur-sm border border-teal-600/30 rounded-lg p-8 hover:border-yellow-400/50 transition-all">
            <div className="text-yellow-400 text-4xl mb-4">📋</div>
            <h2 className="text-2xl font-serif text-white mb-4">Manage Orders</h2>
            <p className="text-teal-200 mb-4">View and process customer orders</p>
            <button className="w-full bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105">
              Go to Orders
            </button>
          </div>

          <div className="bg-teal-800/30 backdrop-blur-sm border border-teal-600/30 rounded-lg p-8 hover:border-yellow-400/50 transition-all">
            <div className="text-yellow-400 text-4xl mb-4">👥</div>
            <h2 className="text-2xl font-serif text-white mb-4">Manage Users</h2>
            <p className="text-teal-200 mb-4">View and manage user accounts</p>
            <button className="w-full bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105">
              Go to Users
            </button>
          </div>

          <div className="bg-teal-800/30 backdrop-blur-sm border border-teal-600/30 rounded-lg p-8 hover:border-yellow-400/50 transition-all">
            <div className="text-yellow-400 text-4xl mb-4">📊</div>
            <h2 className="text-2xl font-serif text-white mb-4">Analytics</h2>
            <p className="text-teal-200 mb-4">View sales reports and statistics</p>
            <button className="w-full bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105">
              View Analytics
            </button>
          </div>

          <div className="bg-teal-800/30 backdrop-blur-sm border border-teal-600/30 rounded-lg p-8 hover:border-yellow-400/50 transition-all">
            <div className="text-yellow-400 text-4xl mb-4">⚙️</div>
            <h2 className="text-2xl font-serif text-white mb-4">Settings</h2>
            <p className="text-teal-200 mb-4">Configure store settings and preferences</p>
            <button className="w-full bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105">
              Go to Settings
            </button>
          </div>

          <div className="bg-teal-800/30 backdrop-blur-sm border border-teal-600/30 rounded-lg p-8 hover:border-yellow-400/50 transition-all">
            <div className="text-yellow-400 text-4xl mb-4">📤</div>
            <h2 className="text-2xl font-serif text-white mb-4">Export Data</h2>
            <p className="text-teal-200 mb-4">Export product and order data</p>
            <button className="w-full bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105">
              Export Data
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Admin
