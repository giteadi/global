import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { getProducts, getFeaturedProducts } from '../store/slices/productsSlice'

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
    if (!isAutoPlaying || allProducts.length <= 4) return

    const maxSlides = Math.ceil(allProducts.length / 4) - 1

    const interval = setInterval(() => {
      setCurrentSlide(prev =>
        prev >= maxSlides ? 0 : prev + 1
      )
    }, 4000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, allProducts])

  // Auto Slide for Featured Products
  useEffect(() => {
    if (!isAutoPlaying || featuredProducts.length <= 4) return

    const maxSlides = Math.ceil(featuredProducts.length / 4) - 1

    const interval = setInterval(() => {
      setCurrentFeaturedSlide(prev =>
        prev >= maxSlides ? 0 : prev + 1
      )
    }, 4000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, featuredProducts])

  const nextSlide = () => {
    if (allProducts.length <= 4) return
    const maxSlides = Math.ceil(allProducts.length / 4) - 1
    setCurrentSlide(prev =>
      prev >= maxSlides ? 0 : prev + 1
    )
  }

  const prevSlide = () => {
    if (allProducts.length <= 4) return
    const maxSlides = Math.ceil(allProducts.length / 4) - 1
    setCurrentSlide(prev =>
      prev === 0 ? maxSlides : prev - 1
    )
  }

  const nextFeaturedSlide = () => {
    if (featuredProducts.length <= 4) return
    const maxSlides = Math.ceil(featuredProducts.length / 4) - 1
    setCurrentFeaturedSlide(prev =>
      prev >= maxSlides ? 0 : prev + 1
    )
  }

  const prevFeaturedSlide = () => {
    if (featuredProducts.length <= 4) return
    const maxSlides = Math.ceil(featuredProducts.length / 4) - 1
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
          <h1 className="text-6xl font-serif mb-6 text-yellow-400">
            Global Exim Traders
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Where Heritage Meets Global Elegance
          </p>
          <div className="flex justify-center gap-4 mb-8">
            <Link to="/products" className="btn-primary">
              Explore Collections
            </Link>
            <Link to="/about" className="btn-secondary">
              Our Story
            </Link>
          </div>
          
          {/* Additional Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 text-center">
            <div className="p-6 rounded-lg bg-teal-900/30 border border-teal-700/50">
              <div className="text-4xl mb-3">🏛️</div>
              <h3 className="text-lg font-semibold text-yellow-400 mb-2">Traditional Heritage</h3>
              <p className="text-sm text-gray-300">Authentic Indian craftsmanship passed through generations</p>
            </div>
            <div className="p-6 rounded-lg bg-teal-900/30 border border-teal-700/50">
              <div className="text-4xl mb-3">🌍</div>
              <h3 className="text-lg font-semibold text-yellow-400 mb-2">Global Quality</h3>
              <p className="text-sm text-gray-300">Export-grade products meeting international standards</p>
            </div>
            <div className="p-6 rounded-lg bg-teal-900/30 border border-teal-700/50">
              <div className="text-4xl mb-3">✨</div>
              <h3 className="text-lg font-semibold text-yellow-400 mb-2">Premium Collection</h3>
              <p className="text-sm text-gray-300">Curated selection of finest jewelry and handicrafts</p>
            </div>
          </div>
        </div>
      </section>

      {/* ALL PRODUCTS CAROUSEL */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-serif text-yellow-400 mb-4">
            Top Products
          </h2>
          <p className="text-gray-400">
            Explore our complete collection from all categories
          </p>
        </div>

        {allProducts.length === 0 ? (
          <div className="text-center text-gray-400">
            No products available
          </div>
        ) : (
          <div className="relative max-w-7xl mx-auto px-4">
            <div className="overflow-hidden">
              <div
                className="flex gap-6 transition-transform duration-500 ease-in-out"
                style={{
                  transform: allProducts.length > 4 
                    ? `translateX(-${currentSlide * 25}%)` 
                    : 'none'
                }}
              >
                {allProducts.map(product => (
                  <div
                    key={product.id}
                    className="flex-shrink-0 w-64"
                  >
                    {renderProduct(product)}
                  </div>
                ))}
              </div>
            </div>

            {allProducts.length > 4 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-0 top-1/2 -translate-y-1/2 bg-teal-700/80 hover:bg-teal-600 p-3 rounded-full text-white text-2xl transition-colors z-10"
                  aria-label="Previous"
                >
                  ‹
                </button>

                <button
                  onClick={nextSlide}
                  className="absolute right-0 top-1/2 -translate-y-1/2 bg-teal-700/80 hover:bg-teal-600 p-3 rounded-full text-white text-2xl transition-colors z-10"
                  aria-label="Next"
                >
                  ›
                </button>

                <div className="flex justify-center mt-8 gap-2">
                  {Array.from({ length: Math.ceil(allProducts.length / 4) }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        currentSlide === index
                          ? 'bg-yellow-400'
                          : 'bg-gray-500 hover:bg-gray-400'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </section>

      {/* FEATURED SECTION */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-serif text-yellow-400 mb-4">
            Featured Collections
          </h2>
          <p className="text-gray-400">
            Discover our curated selection of premium jewelry & handicrafts
          </p>
        </div>

        {featuredProducts.length === 0 ? (
          <div className="text-center text-gray-400">
            No featured products available
          </div>
        ) : (
          <div className="relative max-w-7xl mx-auto px-4">
            <div className="overflow-hidden">
              <div
                className="flex gap-6 transition-transform duration-500 ease-in-out"
                style={{
                  transform: featuredProducts.length > 4 
                    ? `translateX(-${currentFeaturedSlide * 25}%)` 
                    : 'none'
                }}
              >
                {featuredProducts.map(product => (
                  <div
                    key={product.id}
                    className="flex-shrink-0 w-64"
                  >
                    {renderProduct(product)}
                  </div>
                ))}
              </div>
            </div>

            {featuredProducts.length > 4 && (
              <>
                <button
                  onClick={prevFeaturedSlide}
                  className="absolute left-0 top-1/2 -translate-y-1/2 bg-teal-700/80 hover:bg-teal-600 p-3 rounded-full text-white text-2xl transition-colors z-10"
                  aria-label="Previous"
                >
                  ‹
                </button>

                <button
                  onClick={nextFeaturedSlide}
                  className="absolute right-0 top-1/2 -translate-y-1/2 bg-teal-700/80 hover:bg-teal-600 p-3 rounded-full text-white text-2xl transition-colors z-10"
                  aria-label="Next"
                >
                  ›
                </button>

                <div className="flex justify-center mt-8 gap-2">
                  {Array.from({ length: Math.ceil(featuredProducts.length / 4) }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToFeaturedSlide(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        currentFeaturedSlide === index
                          ? 'bg-yellow-400'
                          : 'bg-gray-500 hover:bg-gray-400'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </section>
    </div>
  )
}

export default Home