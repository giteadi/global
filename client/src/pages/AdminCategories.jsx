import React, { useState, useCallback } from 'react'
import AdminLayout from '../components/AdminLayout'
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation
} from '../store/slices/adminApi'
import toast from 'react-hot-toast'
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
  TagIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

const AdminCategories = React.memo(() => {
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

  const handleFormChange = useCallback((e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }, [])

  const handleAddCategory = useCallback(() => {
    setFormData({ name: '', description: '', icon: '🏷️' })
    setShowAddModal(true)
  }, [])

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
        toast.success('Category deleted successfully', {
          style: {
            background: '#0d323a',
            color: '#fff',
            border: '1px solid rgba(37, 204, 200, 0.3)',
            borderRadius: '12px'
          }
        })
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
        toast.success('Category updated successfully', {
          style: {
            background: '#0d323a',
            color: '#fff',
            border: '1px solid rgba(37, 204, 200, 0.3)',
            borderRadius: '12px'
          }
        })
        window.dispatchEvent(new Event('categories-updated'))
        setShowEditModal(false)
      } else {
        await createCategory(formData).unwrap()
        toast.success('Category created successfully', {
          style: {
            background: '#0d323a',
            color: '#fff',
            border: '1px solid rgba(37, 204, 200, 0.3)',
            borderRadius: '12px'
          }
        })
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
      <div className="space-y-5 flex flex-col">
        {/* Header & Mobile Action Button */}
        <div className="flex flex-col sm:flex-row gap-3.5 sm:gap-4 justify-between items-stretch sm:items-center">
          <div>
            <h1
              className="text-xl sm:text-2xl font-bold font-serif"
              style={{ color: 'var(--text-bright)' }}
            >
              Category Management
            </h1>
            <p className="text-xs sm:text-sm mt-0.5" style={{ color: 'var(--text-soft)' }}>
              Organize product categories, collections and badges
            </p>
          </div>

          {/* Primary Mobile Action Button */}
          <button
            onClick={handleAddCategory}
            className="min-h-[44px] px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 apple-press shadow-lg self-stretch sm:self-auto"
            style={{
              background: 'linear-gradient(135deg, var(--gold-bright) 0%, var(--gold) 100%)',
              color: '#071e24'
            }}
          >
            <PlusIcon className="w-4 h-4 stroke-[2.5]" />
            <span>Add New Category</span>
          </button>
        </div>

        {/* Categories Grid (Mobile-First Responsive Layout) */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="flex gap-2 mb-3 justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-[var(--teal-bright)] animate-bounce"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-[var(--teal-bright)] animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-[var(--teal-bright)] animate-bounce [animation-delay:0.4s]"></div>
              </div>
              <p className="text-xs" style={{ color: 'var(--text-soft)' }}>Loading categories...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-16 apple-glass-card p-6 text-center">
            <div>
              <div className="text-4xl mb-3">❌</div>
              <div className="text-base font-semibold mb-1" style={{ color: 'var(--gold-bright)' }}>
                Error loading categories
              </div>
              <p className="text-xs" style={{ color: 'var(--text-soft)' }}>{String(error)}</p>
            </div>
          </div>
        ) : categories && categories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {categories.map((category) => (
              <div
                key={category._id || category.id || category.name}
                className="apple-glass-card p-4 sm:p-5 rounded-2xl flex flex-col justify-between group transition-all duration-300 hover:shadow-xl"
              >
                <div>
                  {/* Category Card Header */}
                  <div className="flex justify-between items-start gap-3 mb-3">
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-teal-900/50 border border-teal-500/25 flex items-center justify-center text-2xl flex-shrink-0 shadow-inner">
                        {category.icon || '🏷️'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3
                          className="text-base font-bold font-serif truncate group-hover:text-[var(--gold-bright)] transition-colors"
                          style={{ color: 'var(--text-bright)' }}
                          title={category.name}
                        >
                          {category.name}
                        </h3>
                        <div className="flex items-center space-x-2 mt-0.5">
                          <span className="text-[11px] text-[var(--teal-light)] font-medium">
                            {category.productCount || 0} products
                          </span>
                        </div>
                      </div>
                    </div>

                    <span
                      className={`inline-flex px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${
                        category.status === 'Inactive'
                          ? 'bg-rose-950/40 text-rose-300 border-rose-500/30'
                          : 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30'
                      }`}
                    >
                      {category.status || 'Active'}
                    </span>
                  </div>

                  {/* Description */}
                  <p
                    className="text-xs line-clamp-2 leading-relaxed mb-4"
                    style={{ color: 'var(--text-soft)' }}
                  >
                    {category.description || 'No description provided for this category.'}
                  </p>
                </div>

                {/* Mobile Action Buttons (Thumb Friendly) */}
                <div className="flex items-center gap-2 pt-3 border-t border-teal-500/15">
                  <button
                    onClick={() => handleEditCategory(category)}
                    className="flex-1 min-h-[40px] px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all apple-press bg-teal-950/60 border border-teal-500/30 text-[var(--teal-bright)] hover:bg-teal-900/50 shadow-sm"
                    aria-label={`Edit ${category.name}`}
                  >
                    <PencilSquareIcon className="w-4 h-4" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => handleDeleteCategory(category._id || category.id, category.name)}
                    className="min-h-[40px] px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all apple-press bg-rose-950/40 border border-rose-500/30 text-rose-300 hover:bg-rose-900/50 shadow-sm"
                    aria-label={`Delete ${category.name}`}
                  >
                    <TrashIcon className="w-4 h-4" />
                    <span className="hidden xs:inline">Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-16 apple-glass-card rounded-2xl p-6 text-center">
            <div>
              <div className="text-5xl mb-3">📂</div>
              <h3 className="text-base font-bold font-serif mb-1" style={{ color: 'var(--text-bright)' }}>
                No Categories Found
              </h3>
              <p className="text-xs max-w-sm mb-4" style={{ color: 'var(--text-soft)' }}>
                Start by creating your first product category for temple jewellery or handicrafts.
              </p>
              <button
                onClick={handleAddCategory}
                className="px-4 py-2 rounded-xl text-xs font-semibold apple-press"
                style={{
                  background: 'linear-gradient(135deg, var(--gold-bright) 0%, var(--gold) 100%)',
                  color: '#071e24'
                }}
              >
                + Add Category
              </button>
            </div>
          </div>
        )}

        {/* Add/Edit Category Modal (Mobile Bottom Sheet on small screens, Centered on desktop) */}
        {(showAddModal || showEditModal) && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm transition-opacity">
            <div
              className="apple-glass-card w-full max-w-lg rounded-t-3xl sm:rounded-2xl p-5 sm:p-6 max-h-[90vh] overflow-y-auto pb-safe shadow-2xl transition-transform duration-300"
              style={{
                background: 'linear-gradient(180deg, #0d323a 0%, #081e23 100%)',
                borderTop: '1px solid rgba(37, 204, 200, 0.3)'
              }}
            >
              {/* Mobile Drag Handle */}
              <div className="sm:hidden w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-4"></div>

              {/* Modal Header */}
              <div className="flex justify-between items-center pb-3 border-b border-teal-500/20 mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">🏷️</span>
                  <h2
                    className="text-base sm:text-lg font-bold font-serif"
                    style={{ color: 'var(--text-bright)' }}
                  >
                    {editingCategory ? 'Edit Category' : 'Add New Category'}
                  </h2>
                </div>
                <button
                  onClick={() => {
                    setShowAddModal(false)
                    setShowEditModal(false)
                  }}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-slate-300 hover:text-white apple-press"
                  aria-label="Close modal"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-bright)' }}>
                    Category Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                    className="w-full h-11 px-3.5 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all"
                    style={{
                      borderColor: 'rgba(37, 204, 200, 0.25)',
                      borderWidth: '1px',
                      background: 'rgba(8, 30, 35, 0.85)',
                      color: 'var(--text-bright)',
                      '--tw-ring-color': 'var(--teal-bright)'
                    }}
                    placeholder="e.g. Temple Heritage Jewellery"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-bright)' }}>
                    Description
                  </label>
                  <textarea
                    rows="3"
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    className="w-full p-3.5 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all"
                    style={{
                      borderColor: 'rgba(37, 204, 200, 0.25)',
                      borderWidth: '1px',
                      background: 'rgba(8, 30, 35, 0.85)',
                      color: 'var(--text-bright)',
                      '--tw-ring-color': 'var(--teal-bright)'
                    }}
                    placeholder="Brief description of products in this category"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-bright)' }}>
                    Category Icon (Emoji)
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      name="icon"
                      value={formData.icon}
                      onChange={handleFormChange}
                      className="w-20 h-11 text-center text-lg rounded-xl focus:outline-none focus:ring-2"
                      style={{
                        borderColor: 'rgba(37, 204, 200, 0.25)',
                        borderWidth: '1px',
                        background: 'rgba(8, 30, 35, 0.85)',
                        color: 'var(--text-bright)',
                        '--tw-ring-color': 'var(--teal-bright)'
                      }}
                      placeholder="🏷️"
                    />
                    <div className="flex flex-wrap gap-1.5">
                      {['🏷️', '🏛️', '💎', '🏺', '👑', '✨'].map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, icon: emoji }))}
                          className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 hover:border-teal-400/40 flex items-center justify-center text-base apple-press"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Mobile-Friendly Action Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-teal-500/20">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false)
                      setShowEditModal(false)
                    }}
                    className="min-h-[46px] rounded-xl text-xs sm:text-sm font-semibold border border-white/10 bg-white/5 text-[var(--text-soft)] hover:text-white transition-all apple-press flex items-center justify-center"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="min-h-[46px] rounded-xl text-xs sm:text-sm font-semibold transition-all apple-press shadow-lg flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, var(--gold-bright) 0%, var(--gold) 100%)',
                      color: '#071e24'
                    }}
                  >
                    {editingCategory ? 'Update' : 'Create Category'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
})

export default AdminCategories
