import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { setSingleProduct } from '../store/slices/productsSlice'
import { addToCart } from '../store/slices/cartSlice'
import toast from 'react-hot-toast'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { singleProduct } = useSelector(state => state.products)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    // Mock product data - in real app, this would come from API
    const mockProduct = {
      id: parseInt(id),
      name: 'Temple Necklace Set',
      category: 'Temple Heritage',
      price: 299,
      icon: '🏛️',
      description: 'Traditional temple jewelry with intricate gold work',
      images: ['🏛️', '💎', '🦚', '🌸'],
      details: {
        material: 'Gold Plated Brass',
        craftsmanship: 'Handcrafted',
        origin: 'Rajasthan, India',
        weight: '250 grams',
        dimensions: 'Length: 18 inches, Width: 2 inches',
        care: 'Keep away from water and chemicals'
      },
      features: [
        'Traditional temple design',
        'Intricate gold work',
        'Adjustable chain',
        'Hypoallergenic',
        'Export quality packaging'
      ]
    }
    
    dispatch(setSingleProduct(mockProduct))
  }, [id, dispatch])

  const handleAddToCart = () => {
    if (singleProduct) {
      dispatch(addToCart({ ...singleProduct, quantity }))
      toast.success(`${singleProduct.name} added to cart!`)
    }
  }

  const handleBuyNow = () => {
    handleAddToCart()
    navigate('/cart')
  }

  if (!singleProduct) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-teal-950 to-teal-900 flex items-center justify-center">
        <div className="text-yellow-400 text-2xl animate-pulse">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-950 to-teal-900 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-yellow-400">
            <li><button onClick={() => navigate('/')} className="hover:text-yellow-300">Home</button></li>
            <li>/</li>
            <li><button onClick={() => navigate('/products')} className="hover:text-yellow-300">Products</button></li>
            <li>/</li>
            <li className="text-white">{singleProduct.name}</li>
          </ol>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <div className="bg-teal-800/30 border border-teal-600/30 rounded-lg p-8 mb-4">
              <div className="h-96 flex items-center justify-center">
                <span className="text-9xl">{singleProduct.images[selectedImage]}</span>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {singleProduct.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`bg-teal-800/30 border rounded-lg p-4 transition-all ${
                    selectedImage === index 
                      ? 'border-yellow-400' 
                      : 'border-teal-600/30 hover:border-yellow-400/50'
                  }`}
                >
                  <span className="text-3xl">{image}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-6">
              <span className="text-yellow-400 text-sm uppercase tracking-wider">{singleProduct.category}</span>
              <h1 className="text-4xl font-serif text-white mt-2 mb-4">{singleProduct.name}</h1>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl text-yellow-400 font-bold">${singleProduct.price}</span>
                <span className="text-teal-200 line-through">${Math.round(singleProduct.price * 1.5)}</span>
                <span className="bg-yellow-400 text-black px-2 py-1 rounded-full text-sm font-semibold">33% OFF</span>
              </div>
              <p className="text-teal-200 text-lg leading-relaxed">{singleProduct.description}</p>
            </div>

            {/* Quantity and Actions */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-6">
                <label className="text-white font-semibold">Quantity:</label>
                <div className="flex items-center border border-teal-600/30 rounded-lg">
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
                    className="w-16 text-center bg-transparent text-white border-x border-teal-600/30 py-2"
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
            <div className="bg-teal-800/30 border border-teal-600/30 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-serif text-white mb-4">Product Details</h3>
              <div className="space-y-3">
                {Object.entries(singleProduct.details).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-teal-200 capitalize">{key}:</span>
                    <span className="text-white">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="bg-teal-800/30 border border-teal-600/30 rounded-lg p-6">
              <h3 className="text-xl font-serif text-white mb-4">Key Features</h3>
              <ul className="space-y-2">
                {singleProduct.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-yellow-400 mt-1">◆</span>
                    <span className="text-teal-200">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
