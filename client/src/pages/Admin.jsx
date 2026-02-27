import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { addProduct, updateProduct, deleteProduct, setProducts } from '../store/slices/productsSlice'
import toast from 'react-hot-toast'

const Admin = () => {
  const dispatch = useDispatch()
  const { products } = useSelector(state => state.products)
  const [activeTab, setActiveTab] = useState('products')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    category: 'Temple Heritage',
    price: '',
    description: '',
    icon: '🏛️',
    material: '',
    craftsmanship: '',
    origin: '',
    weight: '',
    dimensions: '',
    care: ''
  })

  useEffect(() => {
    // Mock data for admin - in real app, this would come from API
    const mockProducts = [
      { id: 1, name: 'Temple Necklace Set', category: 'Temple Heritage', price: 299, icon: '🏛️', description: 'Traditional temple jewelry with intricate gold work' },
      { id: 2, name: 'Ethnic Earrings', category: 'Contemporary Ethnic', price: 149, icon: '💎', description: 'Modern ethnic design with traditional motifs' },
      { id: 3, name: 'Handcrafted Decor Vase', category: 'Handcrafted Decor', price: 199, icon: '🏺', description: 'Artisan vase with traditional Indian patterns' },
      { id: 4, name: 'Export Bracelet Set', category: 'Export Grade', price: 249, icon: '📦', description: 'Premium quality bracelet set for global markets' },
    ]
    dispatch(setProducts(mockProducts))
  }, [dispatch])

  const categories = ['Temple Heritage', 'Contemporary Ethnic', 'Handcrafted Decor', 'Export Grade']
  const icons = ['🏛️', '💎', '🏺', '📦', '🦚', '🌸', '✨', '💫']

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (editingProduct) {
      dispatch(updateProduct({ ...formData, id: editingProduct.id, price: parseFloat(formData.price) }))
      toast.success('Product updated successfully!')
    } else {
      dispatch(addProduct({ ...formData, id: Date.now(), price: parseFloat(formData.price) }))
      toast.success('Product added successfully!')
    }
    
    resetForm()
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      description: product.description,
      icon: product.icon,
      material: product.material || '',
      craftsmanship: product.craftsmanship || '',
      origin: product.origin || '',
      weight: product.weight || '',
      dimensions: product.dimensions || '',
      care: product.care || ''
    })
    setShowAddForm(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch(deleteProduct(id))
      toast.success('Product deleted successfully!')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'Temple Heritage',
      price: '',
      description: '',
      icon: '🏛️',
      material: '',
      craftsmanship: '',
      origin: '',
      weight: '',
      dimensions: '',
      care: ''
    })
    setEditingProduct(null)
    setShowAddForm(false)
  }

  const stats = {
    totalProducts: products.length,
    totalValue: products.reduce((sum, p) => sum + p.price, 0),
    categories: categories.length,
    avgPrice: products.length > 0 ? (products.reduce((sum, p) => sum + p.price, 0) / products.length).toFixed(2) : 0
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-950 to-teal-900 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif text-white mb-4">Admin Panel</h1>
          <p className="text-teal-200">Manage your products and store settings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-teal-800/30 border border-teal-600/30 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-teal-200 text-sm">Total Products</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.totalProducts}</p>
              </div>
              <span className="text-3xl">📦</span>
            </div>
          </div>
          <div className="bg-teal-800/30 border border-teal-600/30 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-teal-200 text-sm">Total Value</p>
                <p className="text-2xl font-bold text-yellow-400">₹{stats.totalValue}</p>
              </div>
              <span className="text-3xl">💰</span>
            </div>
          </div>
          <div className="bg-teal-800/30 border border-teal-600/30 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-teal-200 text-sm">Categories</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.categories}</p>
              </div>
              <span className="text-3xl">🏷️</span>
            </div>
          </div>
          <div className="bg-teal-800/30 border border-teal-600/30 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-teal-200 text-sm">Avg Price</p>
                <p className="text-2xl font-bold text-yellow-400">₹{stats.avgPrice}</p>
              </div>
              <span className="text-3xl">📊</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-teal-800/20 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex-1 px-4 py-2 rounded-md font-semibold transition-all ${
              activeTab === 'products'
                ? 'bg-yellow-400 text-black'
                : 'text-yellow-400 hover:bg-teal-800/50'
            }`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 px-4 py-2 rounded-md font-semibold transition-all ${
              activeTab === 'orders'
                ? 'bg-yellow-400 text-black'
                : 'text-yellow-400 hover:bg-teal-800/50'
            }`}
          >
            Orders
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 px-4 py-2 rounded-md font-semibold transition-all ${
              activeTab === 'settings'
                ? 'bg-yellow-400 text-black'
                : 'text-yellow-400 hover:bg-teal-800/50'
            }`}
          >
            Settings
          </button>
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-serif text-white">Product Management</h2>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-2 rounded-full font-semibold transition-all"
              >
                Add New Product
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-teal-800/30 border border-teal-600/30 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-teal-900/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-yellow-400">Product</th>
                      <th className="px-6 py-3 text-left text-yellow-400">Category</th>
                      <th className="px-6 py-3 text-left text-yellow-400">Price</th>
                      <th className="px-6 py-3 text-left text-yellow-400">Status</th>
                      <th className="px-6 py-3 text-left text-yellow-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-t border-teal-600/20">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{product.icon}</span>
                            <div>
                              <p className="text-white font-semibold">{product.name}</p>
                              <p className="text-teal-200 text-sm">{product.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-teal-200">{product.category}</td>
                        <td className="px-6 py-4 text-yellow-400 font-semibold">₹{product.price}</td>
                        <td className="px-6 py-4">
                          <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-sm">
                            Active
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(product)}
                              className="text-yellow-400 hover:text-yellow-300 transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="text-red-400 hover:text-red-300 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <h2 className="text-2xl font-serif text-white mb-6">Payment Management</h2>
            
            <div className="bg-teal-800/30 border border-teal-600/30 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-teal-900/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-yellow-400">Order ID</th>
                      <th className="px-6 py-3 text-left text-yellow-400">Customer</th>
                      <th className="px-6 py-3 text-left text-yellow-400">Amount</th>
                      <th className="px-6 py-3 text-left text-yellow-400">Status</th>
                      <th className="px-6 py-3 text-left text-yellow-400">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Sample payments - in real app, this would come from API */}
                    <tr className="border-t border-teal-600/20">
                      <td className="px-6 py-4 text-white">#ORD001</td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-white font-semibold">John Doe</p>
                          <p className="text-teal-200 text-sm">john@example.com</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-yellow-400 font-semibold">₹299.00</td>
                      <td className="px-6 py-4">
                        <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-sm">
                          Paid
                        </span>
                      </td>
                      <td className="px-6 py-4 text-teal-200">2024-01-15</td>
                    </tr>
                    <tr className="border-t border-teal-600/20">
                      <td className="px-6 py-4 text-white">#ORD002</td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-white font-semibold">Jane Smith</p>
                          <p className="text-teal-200 text-sm">jane@example.com</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-yellow-400 font-semibold">₹149.00</td>
                      <td className="px-6 py-4">
                        <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-sm">
                          Paid
                        </span>
                      </td>
                      <td className="px-6 py-4 text-teal-200">2024-01-14</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="bg-teal-800/30 border border-teal-600/30 rounded-lg p-8">
            <h2 className="text-2xl font-serif text-white mb-6">Store Settings</h2>
            <p className="text-teal-200 text-center py-12">Settings panel coming soon...</p>
          </div>
        )}

        {/* Add/Edit Product Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-teal-900 border border-teal-600/30 rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-serif text-white mb-6">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-yellow-400 text-sm mb-2">Product Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-teal-800/50 border border-teal-600/30 text-white placeholder-teal-300 px-4 py-2 rounded-lg focus:outline-none focus:border-yellow-400"
                      placeholder="Product Name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-yellow-400 text-sm mb-2">Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full bg-teal-800/50 border border-teal-600/30 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-yellow-400"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-yellow-400 text-sm mb-2">Price *</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      step="0.01"
                      className="w-full bg-teal-800/50 border border-teal-600/30 text-white placeholder-teal-300 px-4 py-2 rounded-lg focus:outline-none focus:border-yellow-400"
                      placeholder="299.99"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-yellow-400 text-sm mb-2">Icon</label>
                    <select
                      name="icon"
                      value={formData.icon}
                      onChange={handleInputChange}
                      className="w-full bg-teal-800/50 border border-teal-600/30 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-yellow-400"
                    >
                      {icons.map(icon => (
                        <option key={icon} value={icon}>{icon}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-yellow-400 text-sm mb-2">Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows="3"
                    className="w-full bg-teal-800/50 border border-teal-600/30 text-white placeholder-teal-300 px-4 py-2 rounded-lg focus:outline-none focus:border-yellow-400 resize-none"
                    placeholder="Product description..."
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-yellow-400 text-sm mb-2">Material</label>
                    <input
                      type="text"
                      name="material"
                      value={formData.material}
                      onChange={handleInputChange}
                      className="w-full bg-teal-800/50 border border-teal-600/30 text-white placeholder-teal-300 px-4 py-2 rounded-lg focus:outline-none focus:border-yellow-400"
                      placeholder="Gold Plated Brass"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-yellow-400 text-sm mb-2">Craftsmanship</label>
                    <input
                      type="text"
                      name="craftsmanship"
                      value={formData.craftsmanship}
                      onChange={handleInputChange}
                      className="w-full bg-teal-800/50 border border-teal-600/30 text-white placeholder-teal-300 px-4 py-2 rounded-lg focus:outline-none focus:border-yellow-400"
                      placeholder="Handcrafted"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-2 border border-teal-600/30 text-teal-200 hover:bg-teal-800/50 rounded-lg transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-yellow-500 hover:bg-yellow-400 text-black rounded-lg font-semibold transition-all"
                  >
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Admin
