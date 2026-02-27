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
    <div className="min-h-screen bg-gradient-to-b from-teal-950 to-teal-900 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-yellow-400 text-sm uppercase tracking-wider">Our Collections</span>
          <h1 className="text-4xl md:text-5xl font-serif text-white mt-2 mb-4">
            Premium Indian Jewelry & Handicrafts
          </h1>
          <div className="w-24 h-1 bg-yellow-400 mx-auto mb-6"></div>
          <p className="text-teal-200 max-w-2xl mx-auto">
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
                className={`px-4 py-2 rounded-full font-semibold transition-all ${
                  selectedCategory === 'All'
                    ? 'bg-yellow-400 text-black'
                    : 'border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black'
                }`}
              >
                All Products
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full font-semibold transition-all ${
                    selectedCategory === category
                      ? 'bg-yellow-400 text-black'
                      : 'border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black'
                  }`}
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
                className="bg-teal-800/50 border border-teal-600/30 text-white placeholder-teal-300 px-4 py-2 pr-10 rounded-full focus:outline-none focus:border-yellow-400 transition-all"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-yellow-400">🔍</span>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="text-yellow-400 text-2xl animate-pulse">Loading...</div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-teal-200 text-xl">No products found matching your criteria</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-teal-800/30 backdrop-blur-sm border border-teal-600/30 rounded-lg overflow-hidden hover:border-yellow-400/50 transition-all transform hover:scale-105">
                <div className="h-64 bg-gradient-to-br from-teal-700 to-teal-800 flex items-center justify-center">
                  <span className="text-6xl">{product.icon}</span>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-yellow-400 text-sm">{product.category}</span>
                    <span className="text-2xl text-yellow-400 font-bold">${product.price}</span>
                  </div>
                  <h3 className="text-xl font-serif text-white mb-3">{product.name}</h3>
                  <p className="text-teal-200 text-sm mb-4 line-clamp-2">{product.description}</p>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-full text-sm font-semibold transition-all">
                      Add to Cart
                    </button>
                    <button className="border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black px-4 py-2 rounded-full text-sm font-semibold transition-all">
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
