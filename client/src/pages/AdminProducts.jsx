import React, { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'
import { useGetProductsQuery, useCreateProductMutation, useUpdateProductMutation, useDeleteProductMutation } from '../store/slices/adminApi'
import { useGetCategoriesQuery, useCreateCategoryMutation } from '../store/slices/adminApi'
import toast from 'react-hot-toast'

const AdminProducts = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('All')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    description: '',
    icon: '🏷️'
  })
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Temple Heritage',
    price: '',
    stock: '',
    material: '',
    craftsmanship: '',
    origin: 'Rajasthan, India',
    weight: '',
    dimensions: '',
    care: '',
    icon: '🏛️',
    is_featured: false,
    is_active: true,
    images: []
  })

  const params = {
    page: 1,
    limit: 15, // 15 products per page
    ...(filterCategory !== 'All' && { category: filterCategory }),
    ...(searchTerm && { search: searchTerm })
  }
  const { data: productsData, isLoading: loading, refetch } = useGetProductsQuery(params)
  const [createProduct] = useCreateProductMutation()
  const [updateProduct] = useUpdateProductMutation()
  const [deleteProduct] = useDeleteProductMutation()

  // Category hooks
  const { data: categoriesData, refetch: refetchCategories } = useGetCategoriesQuery()
  const [createCategory] = useCreateCategoryMutation()

  const products = productsData?.data?.products || []
  const categories = categoriesData?.data?.categories || []

  const handleCategoryFormChange = (e) => {
    const { name, value } = e.target
    setCategoryFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    const promises = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.readAsDataURL(file)
      })
    })
    Promise.all(promises).then(base64Images => {
      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), ...base64Images]
      }))
    })
  }

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== index)
    }))
  }

  const handleMoveImage = (index, direction) => {
    const newImages = [...formData.images]
    const newIndex = direction === 'left' ? index - 1 : index + 1
    
    if (newIndex < 0 || newIndex >= newImages.length) return
    
    [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]]
    
    setFormData(prev => ({
      ...prev,
      images: newImages
    }))
  }

  const handleCreateCategory = async (e) => {
    e.preventDefault()
    try {
      await createCategory(categoryFormData).unwrap()
      toast.success('Category created successfully')
      setShowCategoryModal(false)
      setCategoryFormData({ name: '', description: '', icon: '🏷️' })
      refetchCategories()
    } catch (error) {
      toast.error('Failed to create category')
    }
  }

  const handleAddProduct = () => {
    setEditingProduct(null)
    setFormData({
      name: '',
      description: '',
      category: categories.length > 0 ? categories[0].name : 'Temple Heritage',
      price: '',
      stock: '',
      material: '',
      craftsmanship: '',
      origin: 'Rajasthan, India',
      weight: '',
      dimensions: '',
      care: '',
      icon: '🏛️',
      is_featured: false,
      is_active: true,
      images: []
    })
    setShowAddModal(true)
  }

  const handleEditProduct = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name || '',
      description: product.description || '',
      category: product.category || 'Temple Heritage',
      price: product.price || '',
      stock: product.stock || '',
      material: product.material || '',
      craftsmanship: product.craftsmanship || '',
      origin: product.origin || 'Rajasthan, India',
      weight: product.weight || '',
      dimensions: product.dimensions || '',
      care: product.care || '',
      icon: product.icon || '🏛️',
      is_featured: product.is_featured || false,
      is_active: product.is_active !== false,
      images: product.images || []
    })
    setShowEditModal(true)
  }

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id).unwrap()
        toast.success('Product deleted successfully')
      } catch (error) {
        const errorMessage = error?.data?.message || error?.message || 'Unknown error occurred'
        toast.error('Failed to delete product: ' + errorMessage)
      }
    }
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock)
      }

      if (editingProduct) {
        await updateProduct({ id: editingProduct.id, ...productData }).unwrap()
        toast.success('Product updated successfully')
        setShowEditModal(false)
      } else {
        await createProduct(productData).unwrap()
        toast.success('Product created successfully')
        setShowAddModal(false)
      }
      refetch()
    } catch (error) {
      toast.error('Failed to save product: ' + error)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6 flex flex-col h-full">
        {/* Header */}
        <div className="flex justify-between items-center flex-shrink-0">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-bright)' }}>Product Management</h1>
            <p style={{ color: 'var(--text-soft)' }}>Manage your product catalog</p>
          </div>
          <button
            onClick={handleAddProduct}
            className="btn-primary"
          >
            Add New Product
          </button>
        </div>

        {/* Filters */}
        <div style={{ background: 'var(--glass-card)', backdropFilter: 'blur(10px)', border: '1px solid var(--glass-border)' }} className="p-4 rounded-lg flex-shrink-0">
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
                  <option key={cat.id} value={cat.name} style={{ background: 'var(--glass)', color: 'var(--text-bright)' }}>{cat.name}</option>
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
        <div style={{ background: 'var(--glass-card)', backdropFilter: 'blur(10px)', border: '1px solid var(--glass-border)' }} className="rounded-lg overflow-hidden flex-1 flex flex-col min-h-0">
          <div className="overflow-x-auto overflow-y-auto flex-1">
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
                ) : products.length === 0 ? (
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
                  products.map((product) => (
                    <tr key={product.id} className="hover:opacity-80">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {product.images && product.images.length > 0 ? (
                        <img src={product.images[0]} alt="" loading="lazy" className="w-10 h-10 object-cover mr-3 rounded" />
                          ) : (
                            <div className="text-2xl mr-3">{product.icon}</div>
                          )}
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
                        <button 
                          onClick={() => handleEditProduct(product)}
                          style={{ color: 'var(--teal-bright)' }} 
                          className="mr-3 hover:opacity-80"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(product.id)}
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

        {/* Add/Edit Product Modal */}
        {(showAddModal || showEditModal) && (
          <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'rgba(0,0,0,0.6)' }}>
            <div style={{ background: 'var(--glass)', backdropFilter: 'blur(20px)', border: '1px solid var(--glass-border)' }} className="rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold" style={{ color: 'var(--text-bright)' }}>
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false)
                    setShowEditModal(false)
                  }}
                  style={{ color: 'var(--text-soft)' }}
                  className="hover:opacity-80"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-bright)' }}>Product Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      required
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
                    <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-bright)' }}>Category *</label>
                    <div className="flex gap-2">
                      <select 
                        name="category"
                        value={formData.category}
                        onChange={handleFormChange}
                        required
                        className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2" 
                        style={{
                          borderColor: 'var(--glass-border)',
                          background: 'var(--glass-light)',
                          color: 'var(--text-bright)',
                          '--tw-ring-color': 'var(--teal-bright)'
                        }}
                      >
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.name} style={{ background: 'var(--glass)', color: 'var(--text-bright)' }}>{cat.name}</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => setShowCategoryModal(true)}
                        className="px-3 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg transition-colors flex items-center justify-center"
                        title="Create new category"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-bright)' }}>Price *</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleFormChange}
                      required
                      step="0.01"
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
                    <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-bright)' }}>Stock *</label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleFormChange}
                      required
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
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-bright)' }}>Material</label>
                    <input
                      type="text"
                      name="material"
                      value={formData.material}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                      style={{
                        borderColor: 'var(--glass-border)',
                        background: 'var(--glass-light)',
                        color: 'var(--text-bright)',
                        '--tw-ring-color': 'var(--teal-bright)'
                      }}
                      placeholder="e.g., Gold Plated Brass"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-bright)' }}>Craftsmanship</label>
                    <input
                      type="text"
                      name="craftsmanship"
                      value={formData.craftsmanship}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                      style={{
                        borderColor: 'var(--glass-border)',
                        background: 'var(--glass-light)',
                        color: 'var(--text-bright)',
                        '--tw-ring-color': 'var(--teal-bright)'
                      }}
                      placeholder="e.g., Handcrafted"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-bright)' }}>Origin</label>
                    <input
                      type="text"
                      name="origin"
                      value={formData.origin}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                      style={{
                        borderColor: 'var(--glass-border)',
                        background: 'var(--glass-light)',
                        color: 'var(--text-bright)',
                        '--tw-ring-color': 'var(--teal-bright)'
                      }}
                      placeholder="e.g., Rajasthan, India"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-bright)' }}>Weight</label>
                    <input
                      type="text"
                      name="weight"
                      value={formData.weight}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                      style={{
                        borderColor: 'var(--glass-border)',
                        background: 'var(--glass-light)',
                        color: 'var(--text-bright)',
                        '--tw-ring-color': 'var(--teal-bright)'
                      }}
                      placeholder="e.g., 50g"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-bright)' }}>Dimensions</label>
                    <input
                      type="text"
                      name="dimensions"
                      value={formData.dimensions}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                      style={{
                        borderColor: 'var(--glass-border)',
                        background: 'var(--glass-light)',
                        color: 'var(--text-bright)',
                        '--tw-ring-color': 'var(--teal-bright)'
                      }}
                      placeholder="e.g., 10cm x 5cm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-bright)' }}>Icon</label>
                    <input
                      type="text"
                      name="icon"
                      value={formData.icon}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                      style={{
                        borderColor: 'var(--glass-border)',
                        background: 'var(--glass-light)',
                        color: 'var(--text-bright)',
                        '--tw-ring-color': 'var(--teal-bright)'
                      }}
                      placeholder="🏛️"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-bright)' }}>Description *</label>
                  <textarea
                    rows="3"
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    required
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
                
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-bright)' }}>Care Instructions</label>
                  <textarea
                    rows="2"
                    name="care"
                    value={formData.care}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                    style={{
                      borderColor: 'var(--glass-border)',
                      background: 'var(--glass-light)',
                      color: 'var(--text-bright)',
                      '--tw-ring-color': 'var(--teal-bright)'
                    }}
                    placeholder="e.g., Keep away from water and perfume"
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="is_featured"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                      className="w-4 h-4 rounded focus:ring-2"
                      style={{
                        borderColor: 'var(--glass-border)',
                        background: 'var(--glass-light)',
                        '--tw-ring-color': 'var(--teal-bright)'
                      }}
                    />
                    <label className="ml-2 text-sm" style={{ color: 'var(--text-bright)' }}>Featured Product</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={formData.is_active}
                      onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                      className="w-4 h-4 rounded focus:ring-2"
                      style={{
                        borderColor: 'var(--glass-border)',
                        background: 'var(--glass-light)',
                        '--tw-ring-color': 'var(--teal-bright)'
                      }}
                    />
                    <label className="ml-2 text-sm" style={{ color: 'var(--text-bright)' }}>Active Product</label>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-bright)' }}>Images</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                    style={{
                      borderColor: 'var(--glass-border)',
                      background: 'var(--glass-light)',
                      color: 'var(--text-bright)',
                      '--tw-ring-color': 'var(--teal-bright)'
                    }}
                  />
                  {formData.images && formData.images.length > 0 && (
                    <div className="mt-3 grid grid-cols-4 gap-3">
                      {formData.images.map((img, idx) => (
                        <div key={idx} className="relative group">
                          <img 
                            src={img} 
                            alt={`Product ${idx + 1}`} 
                            loading="lazy"
                            className="w-full h-24 object-cover rounded border"
                            style={{ borderColor: 'var(--glass-border)' }}
                          />
                          {/* Image Controls Overlay */}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center gap-1">
                            {/* Move Left */}
                            {idx > 0 && (
                              <button
                                type="button"
                                onClick={() => handleMoveImage(idx, 'left')}
                                className="p-1.5 bg-teal-600 hover:bg-teal-500 rounded text-white transition-colors"
                                title="Move left"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                              </button>
                            )}
                            {/* Remove */}
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              className="p-1.5 bg-red-600 hover:bg-red-500 rounded text-white transition-colors"
                              title="Remove image"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                            {/* Move Right */}
                            {idx < formData.images.length - 1 && (
                              <button
                                type="button"
                                onClick={() => handleMoveImage(idx, 'right')}
                                className="p-1.5 bg-teal-600 hover:bg-teal-500 rounded text-white transition-colors"
                                title="Move right"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </button>
                            )}
                          </div>
                          {/* Image Number Badge */}
                          <div className="absolute top-1 left-1 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
                            {idx + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="mt-1 text-xs" style={{ color: 'var(--text-soft)' }}>
                    Hover over images to reorder or remove. First image will be the main product image.
                  </p>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false)
                      setShowEditModal(false)
                    }}
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
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div>
          {showCategoryModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'rgba(0,0,0,0.6)' }}>
            <div style={{ background: 'var(--glass)', backdropFilter: 'blur(20px)', border: '1px solid var(--glass-border)' }} className="rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold" style={{ color: 'var(--text-bright)' }}>
                  Create New Category
                </h2>
                <button
                  onClick={() => setShowCategoryModal(false)}
                  style={{ color: 'var(--text-soft)' }}
                  className="hover:opacity-80"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleCreateCategory} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-bright)' }}>Category Name</label>
                  <input
                    type="text"
                    name="name"
                    value={categoryFormData.name}
                    onChange={handleCategoryFormChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                    style={{
                      borderColor: 'var(--glass-border)',
                      background: 'var(--glass-light)',
                      color: 'var(--text-bright)',
                      '--tw-ring-color': 'var(--teal-bright)'
                    }}
                    placeholder="Enter category name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-bright)' }}>Description</label>
                  <textarea
                    rows="3"
                    name="description"
                    value={categoryFormData.description}
                    onChange={handleCategoryFormChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                    style={{
                      borderColor: 'var(--glass-border)',
                      background: 'var(--glass-light)',
                      color: 'var(--text-bright)',
                      '--tw-ring-color': 'var(--teal-bright)'
                    }}
                    placeholder="Enter category description"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-bright)' }}>Icon</label>
                  <input
                    type="text"
                    name="icon"
                    value={categoryFormData.icon}
                    onChange={handleCategoryFormChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                    style={{
                      borderColor: 'var(--glass-border)',
                      background: 'var(--glass-light)',
                      color: 'var(--text-bright)',
                      '--tw-ring-color': 'var(--teal-bright)'
                    }}
                    placeholder="🏷️"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowCategoryModal(false)}
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
                    Create Category
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminProducts
