import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { setProducts, setLoading } from '../store/slices/productsSlice'
import { addToCart } from '../store/slices/cartSlice'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

const Products = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { products, loading } = useSelector(state => state.products)
  const { user } = useSelector(state => state.auth)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [categories, setCategories] = useState([])

  // Read category from URL on mount
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category')
    if (categoryFromUrl && categoryFromUrl !== 'All') {
      setSelectedCategory(decodeURIComponent(categoryFromUrl))
    }
  }, [searchParams])

  const fetchProducts = async () => {
    try {
      dispatch(setLoading(true))
      const response = await fetch('http://localhost:4000/api/products')
      const data = await response.json()
      if (data.success) {
        dispatch(setProducts(data.data.products))
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Failed to fetch products')
    } finally {
      dispatch(setLoading(false))
    }
  }

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/categories')
      const data = await response.json()
      if (data.success) {
        setCategories(Array.isArray(data.data) ? data.data : [])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      toast.error('Failed to fetch categories')
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

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

        {/* Filters */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('All')}
                className="px-4 py-2 rounded-full font-semibold transition-all"
                style={selectedCategory === 'All' ? { background: 'var(--gold)', color: 'var(--text-bright)' } : { background: 'rgba(200,162,110,0.2)', border: '1px solid var(--gold)', color: 'var(--gold-bright)' }}
              >
                All Products
              </button>
              {Array.isArray(categories) && categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.name)}
                  className="px-4 py-2 rounded-full font-semibold transition-all"
                  style={selectedCategory === category.name ? { background: 'var(--gold)', color: 'var(--text-bright)' } : { background: 'rgba(200,162,110,0.2)', border: '1px solid var(--gold)', color: 'var(--gold-bright)' }}
                >
                  {category.name}
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
                className="px-4 py-2 pr-10 rounded-full focus:outline-none transition-all backdrop-blur-sm"
                style={{ background: 'rgba(27,158,155,0.5)', border: '1px solid rgba(37,204,200,0.12)', color: 'var(--text-bright)' }}
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
            {filteredProducts.map((product, index) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="rounded-lg overflow-hidden transition-all" 
                style={{ background: 'rgba(27,158,155,0.5)', border: '1px solid rgba(37,204,200,0.12)' }}
              >
                <div className="h-64 overflow-hidden">
                  {(() => {
                    let images = product.images
                    
                    if (typeof images === "string") {
                      try {
                        images = JSON.parse(images)
                      } catch {
                        images = []
                      }
                    }
                    
                    return images && images.length > 0 ? (
                      <img
                        src={images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div
                        className="h-full flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, #0D6E6C, #1B9E9B)' }}
                      >
                        <span className="text-6xl">{product.icon}</span>
                      </div>
                    )
                  })()}
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-sm" style={{ color: 'var(--gold-bright)' }}>{product.category_name || product.category}</span>
                    <span className="text-2xl font-bold" style={{ color: 'var(--gold-bright)' }}>₹{product.price}</span>
                  </div>
                  <h3 className="text-xl font-serif mb-3" style={{ color: 'var(--text-bright)' }}>{product.name}</h3>
                  <p className="text-sm mb-4 line-clamp-2" style={{ color: 'var(--text-soft)' }}>{product.description}</p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        if (!user) {
                          toast.error('Please login to add items to cart')
                          navigate('/login')
                          return
                        }
                        dispatch(addToCart({ ...product, quantity: 1 }))
                        toast.success(`${product.name} added to cart!`)
                      }}
                      className="flex-1 btn-primary text-sm"
                    >
                      Add to Cart
                    </button>
                    <Link to={`/product/${product.id}`} className="btn-secondary text-sm">
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
}

export default Products
