import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setProducts, setLoading } from '../store/slices/productsSlice'

const Products = () => {
  const dispatch = useDispatch()
  const { products, loading, categories } = useSelector(state => state.products)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    // Mock data - in real app, this would come from API
    const mockProducts = [
      { id: 1, name: 'Temple Necklace Set', category: 'Temple Heritage', price: 299, icon: '🏛️', description: 'Traditional temple jewelry with intricate gold work' },
      { id: 2, name: 'Ethnic Earrings', category: 'Contemporary Ethnic', price: 149, icon: '💎', description: 'Modern ethnic design with traditional motifs' },
      { id: 3, name: 'Handcrafted Decor Vase', category: 'Handcrafted Decor', price: 199, icon: '🏺', description: 'Artisan vase with traditional Indian patterns' },
      { id: 4, name: 'Export Bracelet Set', category: 'Export Grade', price: 249, icon: '📦', description: 'Premium quality bracelet set for global markets' },
      { id: 5, name: 'Peacock Motif Necklace', category: 'Temple Heritage', price: 399, icon: '🦚', description: 'Regal peacock design inspired by Indian royalty' },
      { id: 6, name: 'Kundan Pendant Set', category: 'Contemporary Ethnic', price: 349, icon: '🌸', description: 'Elegant kundan work with modern styling' },
      { id: 7, name: 'Brass Decor Set', category: 'Handcrafted Decor', price: 179, icon: '🏛️', description: 'Traditional brass decorative items' },
      { id: 8, name: 'Global Collection Set', category: 'Export Grade', price: 449, icon: '📦', description: 'Complete export-ready jewelry collection' },
    ]
    
    dispatch(setProducts(mockProducts))
    dispatch(setLoading(false))
  }, [dispatch])

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-sm uppercase tracking-wider" style={{ color: 'var(--gold-bright)' }}>Our Collections</span>
          <h1 className="text-4xl md:text-5xl font-serif mt-2 mb-4" style={{ color: 'var(--text-bright)', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
            Premium Indian Jewelry & Handicrafts
          </h1>
          <div className="w-24 h-1 mx-auto mb-6" style={{ background: 'var(--gold)' }}></div>
          <p className="max-w-2xl mx-auto" style={{ color: 'var(--text-soft)', textShadow: '1px 1px 2px rgba(0,0,0,0.6)' }}>
            Explore our exquisite collection of handcrafted jewelry and decorative items
          </p>
        </div>

        {/* Filters */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('All')}
                className="px-4 py-2 rounded-full font-semibold transition-all"
                style={selectedCategory === 'All' ? { background: 'var(--gold)', color: 'var(--text-bright)' } : { border: '1px solid var(--gold)', color: 'var(--gold-bright)' }}
              >
                All Products
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className="px-4 py-2 rounded-full font-semibold transition-all"
                  style={selectedCategory === category ? { background: 'var(--gold)', color: 'var(--text-bright)' } : { border: '1px solid var(--gold)', color: 'var(--gold-bright)' }}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 pr-10 rounded-full focus:outline-none transition-all"
                style={{ background: 'rgba(27,158,155,0.1)', border: '1px solid rgba(37,204,200,0.12)', color: 'var(--text-bright)' }}
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2" style={{ color: 'var(--gold-bright)' }}>🔍</span>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="text-2xl animate-pulse" style={{ color: 'var(--gold-bright)' }}>Loading...</div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-xl" style={{ color: 'var(--text-soft)' }}>No products found matching your criteria</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <div key={product.id} className="rounded-lg overflow-hidden transition-all transform hover:scale-105" style={{ background: 'rgba(27,158,155,0.1)', border: '1px solid rgba(37,204,200,0.12)' }}>
                <div className="h-64 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0D6E6C, #1B9E9B)' }}>
                  <span className="text-6xl">{product.icon}</span>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-sm" style={{ color: 'var(--gold-bright)' }}>{product.category}</span>
                    <span className="text-2xl font-bold" style={{ color: 'var(--gold-bright)' }}>${product.price}</span>
                  </div>
                  <h3 className="text-xl font-serif mb-3" style={{ color: 'var(--text-bright)' }}>{product.name}</h3>
                  <p className="text-sm mb-4 line-clamp-2" style={{ color: 'var(--text-soft)' }}>{product.description}</p>
                  <div className="flex gap-2">
                    <button className="flex-1 btn-primary text-sm">
                      Add to Cart
                    </button>
                    <button className="btn-secondary text-sm">
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Products
