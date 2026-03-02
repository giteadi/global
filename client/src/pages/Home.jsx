import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { getProducts, getFeaturedProducts } from '../store/slices/productsSlice'
import { motion } from 'framer-motion'

const Home = () => {
  const dispatch = useDispatch()
  const featuredProducts = useSelector(
    state => state.products.featuredProducts || []
  )
  const allProducts = useSelector(
    state => state.products.products || []
  )

  const [currentSlide, setCurrentSlide] = useState(0)
  const [currentFeaturedSlide, setCurrentFeaturedSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Fetch all products and featured products
  useEffect(() => {
    dispatch(getProducts())
    dispatch(getFeaturedProducts())
  }, [dispatch])

  // Auto Slide for All Products
  useEffect(() => {
    if (!isAutoPlaying || allProducts.length <= 1) return

    const maxSlides = allProducts.length - 1

    const interval = setInterval(() => {
      setCurrentSlide(prev =>
        prev >= maxSlides ? 0 : prev + 1
      )
    }, 4000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, allProducts])

  // Auto Slide for Featured Products
  useEffect(() => {
    if (!isAutoPlaying || featuredProducts.length <= 1) return

    const maxSlides = featuredProducts.length - 1

    const interval = setInterval(() => {
      setCurrentFeaturedSlide(prev =>
        prev >= maxSlides ? 0 : prev + 1
      )
    }, 4000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, featuredProducts])

  const nextSlide = () => {
    if (allProducts.length <= 1) return
    const maxSlides = allProducts.length - 1
    setCurrentSlide(prev =>
      prev >= maxSlides ? 0 : prev + 1
    )
  }

  const prevSlide = () => {
    if (allProducts.length <= 1) return
    const maxSlides = allProducts.length - 1
    setCurrentSlide(prev =>
      prev === 0 ? maxSlides : prev - 1
    )
  }

  const nextFeaturedSlide = () => {
    if (featuredProducts.length <= 1) return
    const maxSlides = featuredProducts.length - 1
    setCurrentFeaturedSlide(prev =>
      prev >= maxSlides ? 0 : prev + 1
    )
  }

  const prevFeaturedSlide = () => {
    if (featuredProducts.length <= 1) return
    const maxSlides = featuredProducts.length - 1
    setCurrentFeaturedSlide(prev =>
      prev === 0 ? maxSlides : prev - 1
    )
  }

  const goToSlide = index => {
    setCurrentSlide(index)
  }

  const goToFeaturedSlide = index => {
    setCurrentFeaturedSlide(index)
  }

  const renderProduct = (product) => {
    let images = product.images

    if (typeof images === 'string') {
      try {
        images = JSON.parse(images)
      } catch {
        images = []
      }
    }

    const imageUrl = images && images.length > 0 ? images[0] : null

    return (
      <Link
        to={`/product/${product.id}`}
        className="block bg-teal-900/40 rounded-lg overflow-hidden border border-teal-700 hover:border-yellow-400 transition-all hover:shadow-lg hover:shadow-yellow-400/20"
      >
        <div className="h-48 overflow-hidden bg-teal-800">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              <span className="text-5xl">
                {product.icon || '📦'}
              </span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg text-yellow-400 font-serif mb-2 truncate">
            {product.name}
          </h3>
          <span className="text-xl text-yellow-400 font-bold">
            ₹{product.price}
          </span>
        </div>
      </Link>
    )
  }

  return (
    <div className="min-h-screen py-20 px-4">
      
      {/* HERO */}
      <section className="relative py-16 flex items-center justify-center">
        <div className="text-center max-w-4xl">
          <motion.h1 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl font-serif mb-6 text-yellow-400"
          >
            Global Exim Traders
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-300 mb-8"
          >
            Where Heritage Meets Global Elegance
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex justify-center gap-4 mb-8"
          >
            <Link to="/products" className="btn-primary">
              Explore Collections
            </Link>
            <Link to="/about" className="btn-secondary">
              Our Story
            </Link>
          </motion.div>
          
          {/* Additional Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="p-6 rounded-lg bg-teal-900/30 border border-teal-700/50"
            >
              <div className="text-4xl mb-3">🏛️</div>
              <h3 className="text-lg font-semibold text-yellow-400 mb-2">Traditional Heritage</h3>
              <p className="text-sm text-gray-300">Authentic Indian craftsmanship passed through generations</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="p-6 rounded-lg bg-teal-900/30 border border-teal-700/50"
            >
              <div className="text-4xl mb-3">🌍</div>
              <h3 className="text-lg font-semibold text-yellow-400 mb-2">Global Quality</h3>
              <p className="text-sm text-gray-300">Export-grade products meeting international standards</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="p-6 rounded-lg bg-teal-900/30 border border-teal-700/50"
            >
              <div className="text-4xl mb-3">✨</div>
              <h3 className="text-lg font-semibold text-yellow-400 mb-2">Premium Collection</h3>
              <p className="text-sm text-gray-300">Curated selection of finest jewelry and handicrafts</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ALL PRODUCTS CAROUSEL */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-20"
      >
        <div className="max-w-7xl mx-auto text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-serif text-yellow-400 mb-4"
          >
            Top Products
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-400"
          >
            Explore our complete collection from all categories
          </motion.p>
        </div>

        {allProducts.length === 0 ? (
          <div className="text-center text-gray-400">
            No products available
          </div>
        ) : (
          <div className="relative max-w-7xl mx-auto px-16">
            {/* Left Arrow */}
            {allProducts.length > 1 && (
              <button
                onClick={prevSlide}
                className="absolute left-2 md:left-0 top-1/2 -translate-y-1/2 bg-yellow-400 hover:bg-yellow-500 p-2 md:p-3 rounded-full text-black text-xl md:text-2xl font-bold transition-all shadow-lg hover:shadow-xl z-20 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center"
                aria-label="Previous"
              >
                ←
              </button>
            )}

            {/* Right Arrow */}
            {allProducts.length > 1 && (
              <button
                onClick={nextSlide}
                className="absolute right-2 md:right-0 top-1/2 -translate-y-1/2 bg-yellow-400 hover:bg-yellow-500 p-2 md:p-3 rounded-full text-black text-xl md:text-2xl font-bold transition-all shadow-lg hover:shadow-xl z-20 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center"
                aria-label="Next"
              >
                →
              </button>
            )}

            <div className="overflow-hidden">
              <div
                className="flex gap-4 md:gap-6 transition-transform duration-500 ease-in-out"
                style={{
                  transform: allProducts.length > 1 
                    ? `translateX(-${currentSlide * 100}%)` 
                    : 'none'
                }}
              >
                {allProducts.map(product => (
                  <div
                    key={product.id}
                    className="flex-shrink-0 w-full md:w-64"
                  >
                    {renderProduct(product)}
                  </div>
                ))}
              </div>
            </div>

            {allProducts.length > 1 && (
              <div className="flex justify-center mt-8 gap-2">
                {allProducts.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-colors ${
                      currentSlide === index
                        ? 'bg-yellow-400'
                        : 'bg-gray-500 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </motion.section>

      {/* FEATURED SECTION */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-20"
      >
        <div className="max-w-7xl mx-auto text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-serif text-yellow-400 mb-4"
          >
            Featured Collections
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-400"
          >
            Discover our curated selection of premium jewelry & handicrafts
          </motion.p>
        </div>

        {featuredProducts.length === 0 ? (
          <div className="text-center text-gray-400">
            No featured products available
          </div>
        ) : (
          <div className="relative max-w-7xl mx-auto px-16">
            {/* Left Arrow */}
            {featuredProducts.length > 1 && (
              <button
                onClick={prevFeaturedSlide}
                className="absolute left-2 md:left-0 top-1/2 -translate-y-1/2 bg-yellow-400 hover:bg-yellow-500 p-2 md:p-3 rounded-full text-black text-xl md:text-2xl font-bold transition-all shadow-lg hover:shadow-xl z-20 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center"
                aria-label="Previous"
              >
                ←
              </button>
            )}

            {/* Right Arrow */}
            {featuredProducts.length > 1 && (
              <button
                onClick={nextFeaturedSlide}
                className="absolute right-2 md:right-0 top-1/2 -translate-y-1/2 bg-yellow-400 hover:bg-yellow-500 p-2 md:p-3 rounded-full text-black text-xl md:text-2xl font-bold transition-all shadow-lg hover:shadow-xl z-20 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center"
                aria-label="Next"
              >
                →
              </button>
            )}

            <div className="overflow-hidden">
              <div
                className="flex gap-4 md:gap-6 transition-transform duration-500 ease-in-out"
                style={{
                  transform: featuredProducts.length > 1 
                    ? `translateX(-${currentFeaturedSlide * 100}%)` 
                    : 'none'
                }}
              >
                {featuredProducts.map(product => (
                  <div
                    key={product.id}
                    className="flex-shrink-0 w-full md:w-64"
                  >
                    {renderProduct(product)}
                  </div>
                ))}
              </div>
            </div>

            {featuredProducts.length > 1 && (
              <div className="flex justify-center mt-8 gap-2">
                {featuredProducts.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToFeaturedSlide(index)}
                    className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-colors ${
                      currentFeaturedSlide === index
                        ? 'bg-yellow-400'
                        : 'bg-gray-500 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </motion.section>
    </div>
  )
}

export default Home