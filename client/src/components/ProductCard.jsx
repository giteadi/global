import React, { useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addToCart } from '../store/slices/cartSlice'
import toast from 'react-hot-toast'
import { ShoppingBagIcon, EyeIcon } from '@heroicons/react/24/outline'

const ProductCard = React.memo(({ product }) => {
  const dispatch = useDispatch()

  const handleAddToCart = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    dispatch(addToCart({ ...product, quantity: 1 }))
    toast.success(`${product.name} added to bag!`, {
      style: {
        background: '#0d323a',
        color: '#fff',
        border: '1px solid rgba(37, 204, 200, 0.3)',
        borderRadius: '12px'
      },
      iconTheme: {
        primary: 'var(--gold-bright)',
        secondary: '#071e24'
      }
    })
  }, [dispatch, product])

  // Handle images array or json string with useMemo
  const imageUrl = useMemo(() => {
    let images = product.images
    if (typeof images === 'string') {
      try {
        images = JSON.parse(images)
      } catch {
        images = []
      }
    }
    return images && images.length > 0 ? images[0] : null
  }, [product.images])

  return (
    <div className="apple-glass-card overflow-hidden group flex flex-col h-full transition-all duration-300 hover:shadow-[0_16px_36px_rgba(0,0,0,0.45)]">
      {/* Product Image Area */}
      <Link
        to={`/product/${product.id}`}
        className="block relative h-60 sm:h-64 overflow-hidden bg-gradient-to-br from-teal-950/80 to-teal-900/60"
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            style={{ filter: 'brightness(0.96) contrast(1.05)' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
              {product.icon || '🏛️'}
            </span>
          </div>
        )}

        {/* Floating Category Tag */}
        {product.category && (
          <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase backdrop-blur-md bg-black/40 border border-teal-500/25 text-[var(--gold-bright)] shadow-md">
            {product.category}
          </span>
        )}

        {/* Discount Badge */}
        {product.discount && (
          <span
            className="absolute top-3 right-3 text-white px-2.5 py-0.5 rounded-full text-xs font-bold shadow-lg"
            style={{ background: 'var(--maroon)', border: '1px solid rgba(255,255,255,0.15)' }}
          >
            -{product.discount}%
          </span>
        )}
      </Link>

      {/* Product Information */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex justify-between items-baseline mb-2">
            <span
              className="text-xl font-bold font-serif"
              style={{ color: 'var(--gold-bright)' }}
            >
              ₹{product.price}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-slate-400 line-through">
                ₹{product.originalPrice}
              </span>
            )}
          </div>

          <Link to={`/product/${product.id}`}>
            <h3
              className="font-serif font-semibold text-base text-white group-hover:text-[var(--gold-bright)] transition-colors line-clamp-1 mb-2"
              title={product.name}
            >
              {product.name}
            </h3>
          </Link>

          <p className="text-xs text-[var(--text-soft)] line-clamp-2 leading-relaxed mb-4">
            {product.description}
          </p>
        </div>

        {/* Apple Tactile Action Buttons */}
        <div className="flex items-center gap-2 pt-3 border-t border-teal-500/15">
          <button
            onClick={handleAddToCart}
            className="flex-1 flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl font-semibold text-xs transition-all apple-press shadow-md"
            style={{
              background: 'linear-gradient(135deg, var(--gold-bright) 0%, var(--gold) 100%)',
              color: '#071e24'
            }}
          >
            <ShoppingBagIcon className="w-4 h-4" />
            <span>Add to Bag</span>
          </button>

          <Link
            to={`/product/${product.id}`}
            className="flex items-center justify-center p-2.5 rounded-xl border border-teal-500/25 bg-white/5 text-[var(--text-soft)] hover:text-white hover:border-teal-400/40 transition-all apple-press"
            aria-label="View product details"
          >
            <EyeIcon className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
})

export default ProductCard
