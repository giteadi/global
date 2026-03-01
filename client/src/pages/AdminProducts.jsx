import React, { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'
import { useDispatch, useSelector } from 'react-redux'
import { getProducts } from '../store/slices/productsSlice'
import toast from 'react-hot-toast'

const AdminProducts = () => {
  const dispatch = useDispatch()
  const { products, loading } = useSelector(state => state.products)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('All')
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    dispatch(getProducts())
  }, [dispatch])

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'All' || product.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const categories = ['All', 'Temple Heritage', 'Contemporary Ethnic', 'Handcrafted Decor', 'Export Grade']

  return (
    <AdminLayout>
      <div className="space-y-6 min-h-[calc(100vh-280px)] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-bright)' }}>Product Management</h1>
            <p style={{ color: 'var(--text-soft)' }}>Manage your product catalog</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary"
          >
            Add New Product
          </button>
        </div>

        {/* Filters */}
        <div style={{ background: 'var(--glass-card)', backdropFilter: 'blur(10px)', border: '1px solid var(--glass-border)' }} className="p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-bright)' }}>Search</label>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-bright)' }}>Category</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                style={{
                  borderColor: 'var(--glass-border)',
                  background: 'var(--glass-light)',
                  color: 'var(--text-bright)',
                  '--tw-ring-color': 'var(--teal-bright)'
                }}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat} style={{ background: 'var(--glass)', color: 'var(--text-bright)' }}>{cat}</option>
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

        {/* Products Table */}
        <div style={{ background: 'var(--glass-card)', backdropFilter: 'blur(10px)', border: '1px solid var(--glass-border)' }} className="rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y" style={{ borderColor: 'var(--glass-border)' }}>
              <thead style={{ background: 'var(--glass)' }}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-soft)' }}>
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-soft)' }}>
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-soft)' }}>
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-soft)' }}>
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-soft)' }}>
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-soft)' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody style={{ background: 'var(--glass-light)', borderColor: 'var(--glass-border)' }} className="divide-y">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center" style={{ color: 'var(--text-soft)' }}>
                      Loading products...
                    </td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12">
                      <div className="text-center">
                        <div className="text-6xl mb-4">📦</div>
                        <div className="text-lg font-medium mb-2" style={{ color: 'var(--text-bright)' }}>
                          No products found
                        </div>
                        <div className="text-sm" style={{ color: 'var(--text-soft)' }}>
                          Try adjusting your search or filters, or add a new product to get started.
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:opacity-80">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-2xl mr-3">{product.icon}</div>
                          <div>
                            <div className="text-sm font-medium" style={{ color: 'var(--text-bright)' }}>{product.name}</div>
                            <div className="text-sm" style={{ color: 'var(--text-soft)' }}>{product.material}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: 'var(--text-bright)' }}>
                        {product.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: 'var(--text-bright)' }}>
                        ₹{product.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: 'var(--text-bright)' }}>
                        {product.stock}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full" style={{
                          background: product.is_active ? 'rgba(37,204,200,0.2)' : 'rgba(92,26,40,0.2)',
                          color: product.is_active ? 'var(--teal-bright)' : 'var(--gold-bright)'
                        }}>
                          {product.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button style={{ color: 'var(--teal-bright)' }} className="mr-3 hover:opacity-80">
                          Edit
                        </button>
                        <button style={{ color: 'var(--gold-bright)' }} className="hover:opacity-80">
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

        {/* Add Product Modal */}
        {showAddModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'rgba(0,0,0,0.6)' }}>
            <div style={{ background: 'var(--glass)', backdropFilter: 'blur(20px)', border: '1px solid var(--glass-border)' }} className="rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold" style={{ color: 'var(--text-bright)' }}>Add New Product</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  style={{ color: 'var(--text-soft)' }}
                  className="hover:opacity-80"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-bright)' }}>Product Name</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                      style={{
                        borderColor: 'var(--glass-border)',
                        background: 'var(--glass-light)',
                        color: 'var(--text-bright)',
                        '--tw-ring-color': 'var(--teal-bright)'
                      }}
                      placeholder="Enter product name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-bright)' }}>Category</label>
                    <select className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2" style={{
                      borderColor: 'var(--glass-border)',
                      background: 'var(--glass-light)',
                      color: 'var(--text-bright)',
                      '--tw-ring-color': 'var(--teal-bright)'
                    }}>
                      {categories.filter(cat => cat !== 'All').map(cat => (
                        <option key={cat} value={cat} style={{ background: 'var(--glass)', color: 'var(--text-bright)' }}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-bright)' }}>Price</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                      style={{
                        borderColor: 'var(--glass-border)',
                        background: 'var(--glass-light)',
                        color: 'var(--text-bright)',
                        '--tw-ring-color': 'var(--teal-bright)'
                      }}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-bright)' }}>Stock</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                      style={{
                        borderColor: 'var(--glass-border)',
                        background: 'var(--glass-light)',
                        color: 'var(--text-bright)',
                        '--tw-ring-color': 'var(--teal-bright)'
                      }}
                      placeholder="0"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-bright)' }}>Description</label>
                  <textarea
                    rows="3"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                    style={{
                      borderColor: 'var(--glass-border)',
                      background: 'var(--glass-light)',
                      color: 'var(--text-bright)',
                      '--tw-ring-color': 'var(--teal-bright)'
                    }}
                    placeholder="Enter product description"
                  ></textarea>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-lg transition-colors"
                    style={{ background: 'var(--glass)', color: 'var(--text-soft)', border: '1px solid var(--glass-border)' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg transition-colors"
                    style={{ background: 'var(--teal)', color: 'var(--white)' }}
                  >
                    Add Product
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

export default AdminProducts
