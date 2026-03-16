import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { setSingleProduct } from '../store/slices/productsSlice'
import { addToCart } from '../store/slices/cartSlice'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import API_BASE from '../api/config'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { singleProduct } = useSelector(state => state.products)
  const { user } = useSelector(state => state.auth)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      try {
        const response = await fetch(`${API_BASE}/api/products/${id}`)
        const data = await response.json()
        
        if (data.success && data.data) {
          dispatch(setSingleProduct(data.data))
        } else {
          toast.error('Product not found')
          navigate('/products')
          return
        }
      } catch (error) {
        console.error('Error fetching product:', error)
        toast.error('Failed to load product details')
        navigate('/products')
        return
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProduct()
    }
  }, [id, dispatch, navigate])

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Please login to add items to cart')
      navigate('/login')
      return
    }
    if (singleProduct) {
      dispatch(addToCart({ ...singleProduct, quantity }))
      toast.success(`${singleProduct.name} added to cart!`)
    }
  }

  const handleBuyNow = () => {
    if (!singleProduct) return

    // Check if user is logged in
    if (!user) {
      toast.error('Please login to make a purchase')
      navigate('/login')
      return
    }

    // Add item to cart and redirect to checkout
    dispatch(addToCart({ ...singleProduct, quantity }))
    toast.success('Redirecting to checkout...')
    navigate('/checkout')
  }

  if (loading || !singleProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl animate-pulse text-with-shadow">Loading...</div>
      </div>
    )
  }

  const productDetails = {
    material: singleProduct.material || 'N/A',
    craftsmanship: singleProduct.craftsmanship || 'N/A',
    origin: singleProduct.origin || 'N/A',
    weight: singleProduct.weight || 'N/A',
    dimensions: singleProduct.dimensions || 'N/A',
    care: singleProduct.care || 'N/A'
  }

  let parsedImages = singleProduct.images
  if (typeof parsedImages === 'string') {
    try { parsedImages = JSON.parse(parsedImages) } catch { parsedImages = [] }
  }
  if (!Array.isArray(parsedImages)) parsedImages = []

  return (
    <div className="min-h-screen py-20 px-4 bg-black/60">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb removed as requested */}

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-teal-800/50 backdrop-blur-sm border border-teal-600/30 rounded-lg p-8 mb-4">
              <div className="h-96 flex items-center justify-center">
                <img 
                  src={parsedImages[selectedImage] || '/placeholder.jpg'} 
                  alt={singleProduct.name} 
                  loading="lazy"
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
              </div>
            </div>
            {parsedImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {parsedImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`border rounded-lg p-2 transition-all ${
                      selectedImage === index 
                        ? 'border-yellow-400' 
                        : 'border-teal-600/30 hover:border-yellow-400/50'
                    }`}
                  >
                    <img 
                      src={image} 
                      alt={`${singleProduct.name} ${index + 1}`} 
                      loading="lazy"
                      className="w-full h-16 object-cover rounded"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-6">
              <span className="text-yellow-400 text-sm uppercase tracking-wider">{singleProduct.category}</span>
              <h1 className="text-4xl font-serif text-white mt-2 mb-4 text-with-shadow">{singleProduct.name}</h1>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl text-yellow-400 font-bold">₹{singleProduct.price}</span>
                <span className="text-teal-200 line-through">₹{Math.round(singleProduct.price * 1.5)}</span>
                <span className="bg-yellow-400 text-black px-2 py-1 rounded-full text-sm font-semibold">33% OFF</span>
              </div>
              <p className="text-teal-200 text-lg leading-relaxed text-with-shadow">{singleProduct.description}</p>
            </div>

            {/* Quantity and Actions */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-6">
                <label className="text-white font-semibold">Quantity:</label>
                <div className="flex items-center bg-teal-800/50 backdrop-blur-sm border border-teal-600/30 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-yellow-400 hover:bg-teal-800/50 transition-all"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 text-center bg-teal-800/30 text-white border-x border-teal-600/30 py-2"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-yellow-400 hover:bg-teal-800/50 transition-all"
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105"
                >
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black px-6 py-3 rounded-full font-semibold transition-all"
                >
                  Buy Now
                </button>
              </div>
            </div>

            {/* Product Details */}
            <div className="bg-teal-800/30 border border-teal-600/30 rounded-lg p-6">
              <h3 className="text-xl font-serif text-white mb-4 text-with-shadow">Product Details</h3>
              <div className="space-y-3">
                {Object.entries(productDetails).map(([key, value]) => (
                  value && (
                    <div key={key} className="flex justify-between">
                      <span className="text-teal-200 capitalize">{key.replace('_', ' ')}:</span>
                      <span className="text-white">{value}</span>
                    </div>
                  )
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
