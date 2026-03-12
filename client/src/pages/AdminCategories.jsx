import React, { useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import { useGetCategoriesQuery, useCreateCategoryMutation, useUpdateCategoryMutation, useDeleteCategoryMutation } from '../store/slices/adminApi'
import toast from 'react-hot-toast'

const AdminCategories = () => {
  const { data: categories, isLoading, error } = useGetCategoriesQuery()
  const [createCategory] = useCreateCategoryMutation()
  const [updateCategory] = useUpdateCategoryMutation()
  const [deleteCategory] = useDeleteCategoryMutation()
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '🏷️'
  })

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAddCategory = () => {
    setFormData({ name: '', description: '', icon: '🏷️' })
    setShowAddModal(true)
  }

  const handleEditCategory = (category) => {
    if (!category._id && !category.id) {
      toast.error('Invalid category ID')
      return
    }
    setEditingCategory(category)
    setFormData({
      name: category.name || '',
      description: category.description || '',
      icon: category.icon || '🏷️'
    })
    setShowEditModal(true)
  }

  const handleDeleteCategory = async (id, name) => {
    if (!id) {
      toast.error('Invalid category ID')
      return
    }
    if (window.confirm(`Are you sure you want to delete "${name}" category?`)) {
      try {
        await deleteCategory(id).unwrap()
        toast.success('Category deleted successfully')
        window.dispatchEvent(new Event('categories-updated'))
      } catch (error) {
        toast.error('Failed to delete category: ' + error)
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingCategory) {
        const categoryId = editingCategory._id || editingCategory.id
        if (!categoryId) {
          toast.error('Invalid category ID')
          return
        }
        await updateCategory({ id: categoryId, categoryData: formData }).unwrap()
        toast.success('Category updated successfully')
        window.dispatchEvent(new Event('categories-updated'))
        setShowEditModal(false)
      } else {
        await createCategory(formData).unwrap()
        toast.success('Category created successfully')
        window.dispatchEvent(new Event('categories-updated'))
        setShowAddModal(false)
      }
      setFormData({ name: '', description: '', icon: '🏷️' })
    } catch (error) {
      toast.error('Failed to save category: ' + error)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6 min-h-[calc(100vh-280px)] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-bright)' }}>Category Management</h1>
            <p style={{ color: 'var(--text-soft)' }}>Manage product categories and organization</p>
          </div>
          <button
            onClick={handleAddCategory}
            className="btn-primary"
          >
            Add New Category
          </button>
        </div>

        {/* Categories Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="text-6xl mb-4">⏳</div>
              <div className="text-lg font-semibold mb-2" style={{ color: 'var(--text-bright)' }}>Loading categories...</div>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="text-6xl mb-4">❌</div>
              <div className="text-xl font-semibold mb-2" style={{ color: 'var(--gold-bright)' }}>Error loading categories</div>
              <p style={{ color: 'var(--text-soft)' }}>{error}</p>
            </div>
          </div>
        ) : categories && categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div key={category._id || category.id || category.name} style={{ background: 'var(--glass-card)', backdropFilter: 'blur(10px)', border: '1px solid var(--glass-border)' }} className="rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold" style={{ color: 'var(--text-bright)' }}>{category.name}</h3>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-soft)' }}>{category.description}</p>
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    category.status === 'Active' ? 'bg-green-900/20 text-green-300' : 'bg-red-900/20 text-red-300'
                  }`}>
                    {category.status || 'Active'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm" style={{ color: 'var(--text-soft)' }}>
                    {category.productCount || 0} products
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleEditCategory(category)}
                      style={{ color: 'var(--teal-bright)' }} 
                      className="text-sm hover:opacity-80"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteCategory(category._id || category.id, category.name)}
                      style={{ color: 'var(--gold-bright)' }} 
                      className="text-sm hover:opacity-80"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="text-6xl mb-4">📂</div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-bright)' }}>No Categories Found</h3>
              <p style={{ color: 'var(--text-soft)' }}>Start by adding your first product category.</p>
            </div>
          </div>
        )}

        {/* Add/Edit Category Modal */}
        {(showAddModal || showEditModal) && (
          <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'rgba(0,0,0,0.6)' }}>
            <div style={{ background: 'var(--glass)', backdropFilter: 'blur(20px)', border: '1px solid var(--glass-border)' }} className="rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold" style={{ color: 'var(--text-bright)' }}>
                  {editingCategory ? 'Edit Category' : 'Add New Category'}
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

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-bright)' }}>Category Name *</label>
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
                    placeholder="Enter category name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-bright)' }}>Description</label>
                  <textarea
                    rows="3"
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                    style={{
                      borderColor: 'var(--glass-border)',
                      background: 'var(--glass-light)',
                      color: 'var(--text-bright)',
                      '--tw-ring-color': 'var(--teal-bright)'
                    }}
                    placeholder="Enter category description"
                  ></textarea>
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
                    placeholder="🏷️"
                  />
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
                    {editingCategory ? 'Update Category' : 'Add Category'}
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

export default AdminCategories
