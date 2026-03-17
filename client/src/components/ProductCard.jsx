import React from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addToCart } from '../store/slices/cartSlice'
import toast from 'react-hot-toast'

const ProductCard = React.memo(({ product }) => {
  const dispatch = useDispatch()

  const handleAddToCart = (e) => {
    e.preventDefault()
    dispatch(addToCart(product))
    toast.success(`${product.name} added to cart!`)
  }

  return (
    <div className="bg-teal-800/30 backdrop-blur-sm border border-teal-600/30 rounded-lg overflow-hidden hover:border-yellow-400/50 transition-all transform hover:scale-105 group">
      {/* Product Image */}
      <div className="h-64 bg-gradient-to-br from-teal-700 to-teal-800 flex items-center justify-center relative overflow-hidden">
        <span className="text-6xl group-hover:scale-110 transition-transform duration-300">{product.icon}</span>
        {product.discount && (
          <span className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            -{product.discount}%
          </span>
        )}
      </div>

      {/* Product Info */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <span className="text-yellow-400 text-sm uppercase tracking-wider">{product.category}</span>
          <div className="text-right">
            <span className="text-2xl text-yellow-400 font-bold">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-teal-200 line-through text-sm block">₹{product.originalPrice}</span>
            )}
          </div>
        </div>

        <h3 className="text-xl font-serif text-white mb-3 group-hover:text-yellow-400 transition-colors">
          {product.name}
        </h3>

        <p className="text-teal-200 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-full text-sm font-semibold transition-all transform hover:scale-105"
          >
            Add to Cart
          </button>
          <Link
            to={`/product/${product.id}`}
            className="border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black px-4 py-2 rounded-full text-sm font-semibold transition-all"
          >
            View
          </Link>
        </div>

        {/* Features */}
        {product.features && (
          <div className="mt-4 pt-4 border-t border-teal-600/20">
            <div className="flex flex-wrap gap-2">
              {product.features.slice(0, 2).map((feature, index) => (
                <span key={index} className="text-xs text-teal-200">
                  • {feature}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
})

export default ProductCard
