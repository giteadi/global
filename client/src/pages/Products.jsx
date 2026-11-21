import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { addToCart } from '../store/slices/cartSlice'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { useGetProductsQuery, useGetCategoriesQuery } from '../store/slices/adminApi'

const Products = React.memo(() => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user } = useSelector(state => state.auth)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  
  // Use RTK Query for optimized data fetching
  const { data: productsData = [], isLoading: productsLoading } = useGetProductsQuery()
  
  // Ensure products is always an array
  const products = useMemo(() => {
    if (!productsData) return []
    if (Array.isArray(productsData)) return productsData
    // Handle paginated response format { data: { products: [...] } }
    if (productsData.data?.products && Array.isArray(productsData.data.products)) return productsData.data.products
    if (productsData.products && Array.isArray(productsData.products)) return productsData.products
    if (productsData.data && Array.isArray(productsData.data)) return productsData.data
    return []
  }, [productsData])
  const { data: categoriesData = [] } = useGetCategoriesQuery()
  
  // Memoize categories to prevent re-renders
  const categories = useMemo(() => {
    if (!categoriesData) return []
    if (Array.isArray(categoriesData)) return categoriesData
    if (categoriesData.data && Array.isArray(categoriesData.data)) return categoriesData.data
    if (categoriesData.data?.categories && Array.isArray(categoriesData.data.categories)) return categoriesData.data.categories
    return []
  }, [categoriesData])

  const handleSelectCategory = useCallback((cat) => {
    setSelectedCategory(cat)
  }, [])

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value)
  }, [])

  // Read category from URL on mount
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category')
    if (categoryFromUrl && categoryFromUrl !== 'All') {
      setSelectedCategory(decodeURIComponent(categoryFromUrl))
    }
  }, [searchParams])

  // Memoize filtered products to prevent re-calculations
  const filteredProducts = useMemo(() => {
    return products
      .filter(product => {
        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             product.description.toLowerCase().includes(searchTerm.toLowerCase())
        return matchesCategory && matchesSearch
      })
      .map(product => {
        let images = product.images
        if (typeof images === 'string') {
          try { images = JSON.parse(images) } catch { images = [] }
        }
        return { ...product, images: Array.isArray(images) ? images : [] }
      })
  }, [products, selectedCategory, searchTerm])

  return (
    <div className="min-h-screen py-20 px-4 bg-black/60">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-sm uppercase tracking-wider" style={{ color: 'var(--gold-bright)' }}>Our Collections</span>
          <h1 className="text-4xl md:text-5xl font-serif mt-2 mb-4 text-with-shadow" style={{ color: 'var(--text-bright)' }}>
            Premium Indian Jewelry & Handicrafts
          </h1>
          <div className="w-24 h-1 mx-auto mb-6" style={{ background: 'var(--gold)' }}></div>
          <p className="max-w-2xl mx-auto text-with-shadow" style={{ color: 'var(--text-soft)' }}>
            Explore our exquisite collection of handcrafted jewelry and decorative items
          </p>
        </motion.div>

        {/* Filters & Search - Apple-Style Mobile-First */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            {/* Category Filter Pills (Horizontal swipe on mobile) */}
            <div className="flex overflow-x-auto no-scrollbar pb-2 md:pb-0 gap-2 items-center -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap">
              <button
                onClick={() => setSelectedCategory('All')}
                className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all apple-press ${
                  selectedCategory === 'All'
                    ? 'shadow-lg'
                    : 'hover:bg-white/10'
                }`}
                style={
                  selectedCategory === 'All'
                    ? { background: 'linear-gradient(135deg, var(--gold-bright) 0%, var(--gold) 100%)', color: '#071e24' }
                    : { background: 'rgba(27,158,155,0.2)', border: '1px solid rgba(37,204,200,0.25)', color: 'var(--text-bright)' }
                }
              >
                All Products
              </button>
              {Array.isArray(categories) && categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all apple-press ${
                    selectedCategory === category.name
                      ? 'shadow-lg'
                      : 'hover:bg-white/10'
                  }`}
                  style={
                    selectedCategory === category.name
                      ? { background: 'linear-gradient(135deg, var(--gold-bright) 0%, var(--gold) 100%)', color: '#071e24' }
                      : { background: 'rgba(27,158,155,0.2)', border: '1px solid rgba(37,204,200,0.25)', color: 'var(--text-bright)' }
                  }
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[240px]">
              <input
                type="text"
                placeholder="Search collections..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2.5 pr-10 rounded-full focus:outline-none transition-all backdrop-blur-md text-xs placeholder:text-slate-400 focus:border-[var(--gold-bright)]"
                style={{
                  background: 'rgba(8, 30, 35, 0.85)',
                  border: '1px solid rgba(37,204,200,0.25)',
                  color: 'var(--text-bright)'
                }}
              />
              <span className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-sm opacity-70">
                🔍
              </span>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {productsLoading ? (
          <div className="text-center py-20">
            <div className="text-2xl animate-pulse font-serif" style={{ color: 'var(--gold-bright)' }}>Loading Collections...</div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 apple-glass-card max-w-md mx-auto p-8">
            <div className="text-4xl mb-3">🏛️</div>
            <div className="text-lg font-serif mb-2" style={{ color: 'var(--gold-bright)' }}>No products found</div>
            <p className="text-xs text-[var(--text-muted)]">Try selecting another category or refining your search keywords.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.3) }}
                className="apple-glass-card rounded-2xl overflow-hidden flex flex-col justify-between group transition-all duration-300 hover:shadow-2xl hover:shadow-teal-400/20"
              >
                <div>
                  <Link to={`/product/${product.id}`} className="block relative h-60 overflow-hidden bg-gradient-to-br from-teal-950/80 to-teal-900/60">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        style={{ filter: 'brightness(0.96) contrast(1.05)' }}
                      />
                    ) : (
                      <div
                        className="h-full flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, #0D6E6C, #1B9E9B)' }}
                      >
                        <span className="text-6xl group-hover:scale-110 transition-transform duration-300">{product.icon || '🏛️'}</span>
                      </div>
                    )}
                    {/* Category Floating Pill */}
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase backdrop-blur-md bg-black/45 border border-teal-500/20 text-[var(--gold-bright)] shadow-md">
                      {product.category_name || product.category}
                    </span>
                  </Link>

                  <div className="p-5">
                    <div className="flex justify-between items-baseline mb-2">
                      <span className="text-xl font-bold font-serif" style={{ color: 'var(--gold-bright)' }}>
                        ₹{product.price}
                      </span>
                    </div>
                    <Link to={`/product/${product.id}`}>
                      <h3 className="text-base font-serif font-semibold mb-2 group-hover:text-[var(--gold-bright)] transition-colors line-clamp-1" style={{ color: 'var(--text-bright)' }}>
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-xs line-clamp-2 leading-relaxed mb-4" style={{ color: 'var(--text-soft)' }}>
                      {product.description}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-0">
                  <div className="flex gap-2 pt-3 border-t border-teal-500/15">
                    <button 
                      onClick={() => {
                        dispatch(addToCart({ ...product, quantity: 1 }))
                        toast.success(`${product.name} added to cart!`, {
                          style: {
                            background: '#0d323a',
                            color: '#fff',
                            border: '1px solid rgba(37, 204, 200, 0.3)',
                            borderRadius: '12px'
                          }
                        })
                      }}
                      className="flex-1 py-2.5 px-3 rounded-xl font-semibold text-xs transition-all apple-press shadow-md"
                      style={{
                        background: 'linear-gradient(135deg, var(--gold-bright) 0%, var(--gold) 100%)',
                        color: '#071e24'
                      }}
                    >
                      Add to Bag
                    </button>
                    <Link
                      to={`/product/${product.id}`}
                      className="px-3.5 py-2.5 rounded-xl border border-teal-500/25 bg-white/5 text-[var(--text-soft)] hover:text-white hover:border-teal-400/40 text-xs font-semibold transition-all apple-press flex items-center justify-center"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
})

export default Products
