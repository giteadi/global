import React, { useEffect, useState, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { getProducts, getFeaturedProducts } from '../store/slices/productsSlice'
import { motion } from 'framer-motion'

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Homepage Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a2830' }}>
          <div className="text-center">
            <h1 style={{ color: 'var(--text-bright)', marginBottom: '1rem' }}>Something went wrong</h1>
            <button 
              onClick={() => window.location.reload()} 
              style={{ 
                background: 'var(--teal-bright)', 
                color: '#071e24', 
                padding: '0.5rem 1rem', 
                border: 'none', 
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Reload Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

const ProductImage = ({ src, alt, className, style, onLoad, onError, sizes }) => {
  const [imageSrc, setImageSrc] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!src) return

    const img = new Image()
    img.onload = () => {
      setImageSrc(src)
      setLoading(false)
      onLoad?.()
    }
    img.onerror = () => {
      setError(true)
      setLoading(false)
      onError?.()
    }
    img.src = src
  }, [src, onLoad, onError])

  if (error || !src) {
    return null
  }

  if (loading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-bright"></div>
      </div>
    )
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      loading="lazy"
      className={className}
      style={style}
      sizes={sizes}
    />
  )
}

const Home = () => {
  const dispatch = useDispatch()
  const featuredProducts = useSelector(
    state => state.products.featuredProducts || []
  )
  const allProducts = useSelector(
    state => state.products.products || []
  )
  const productsLoading = useSelector(
    state => state.products.loadingProducts || state.products.loadingFeatured
  )
  const productsError = useSelector(
    state => state.products.error
  )

  const [currentSlide, setCurrentSlide] = useState(0)
  const [currentFeaturedSlide, setCurrentFeaturedSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [loadedImages, setLoadedImages] = useState({})
  const [imageErrors, setImageErrors] = useState({})
  const [componentMounted, setComponentMounted] = useState(false)

  // Fetch all products and featured products
  useEffect(() => {
    setComponentMounted(true)
    try {
      dispatch(getProducts())
      dispatch(getFeaturedProducts())
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }, [dispatch])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setComponentMounted(false)
    }
  }, [])

  // Auto Slide for All Products
  useEffect(() => {
    if (!componentMounted || !isAutoPlaying || allProducts.length <= 1) return

    const maxSlides = allProducts.length - 1

    const interval = setInterval(() => {
      setCurrentSlide(prev =>
        prev >= maxSlides ? 0 : prev + 1
      )
    }, 4000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, allProducts, componentMounted])

  // Auto Slide for Featured Products
  useEffect(() => {
    if (!componentMounted || !isAutoPlaying || featuredProducts.length <= 1) return

    const maxSlides = featuredProducts.length - 1

    const interval = setInterval(() => {
      setCurrentFeaturedSlide(prev =>
        prev >= maxSlides ? 0 : prev + 1
      )
    }, 4000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, featuredProducts, componentMounted])

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
    if (!product || !product.id) return null

    let images = product.images

    if (typeof images === 'string') {
      try {
        images = JSON.parse(images)
      } catch {
        images = []
      }
    }

    const imageUrl = images && images.length > 0 ? images[0] : null
    const imageLoaded = loadedImages[product.id]
    const imageError = imageErrors[product.id]

    const handleImageLoad = () => {
      if (componentMounted) {
        setLoadedImages(prev => ({ ...prev, [product.id]: true }))
      }
    }

    const handleImageError = () => {
      if (componentMounted) {
        setImageErrors(prev => ({ ...prev, [product.id]: true }))
      }
    }

    return (
      <Link
        to={`/product/${product.id}`}
        className="block overflow-hidden transition-all hover:shadow-xl hover:shadow-teal-400/20"
        style={{
          background: 'var(--glass-card)',
          border: '1px solid var(--glass-border)',
          borderRadius: '12px',
          backdropFilter: 'blur(8px)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div className="h-56 overflow-hidden relative" style={{
          background: 'linear-gradient(135deg, rgba(10,40,45,0.8), rgba(10,50,55,0.6))'
        }}>
          {imageUrl && !imageError ? (
            <>
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-bright"></div>
                </div>
              )}
              <img
                src={imageUrl}
                alt={product.name || 'Product'}
                loading="lazy"
                className={`w-full h-full object-contain md:object-cover hover:scale-105 transition-transform duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                style={{
                  filter: 'brightness(0.9) contrast(1.1)',
                  transition: 'opacity 0.3s ease'
                }}
                onLoad={handleImageLoad}
                onError={handleImageError}
                sizes="(max-width: 768px) 100vw, 256px"
              />
            </>
          ) : (
            <div className="h-full flex items-center justify-center">
              <span className="text-6xl opacity-60">
                {product.icon || '📦'}
              </span>
            </div>
          )}
        </div>
        <div className="p-6" style={{
          background: 'linear-gradient(to bottom, rgba(10,40,45,0.9), rgba(8,30,35,0.95))'
        }}>
          <h3 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '1.25rem',
            fontWeight: '600',
            color: 'var(--gold-bright)',
            marginBottom: '0.75rem',
            lineHeight: '1.3'
          }}>
            {product.name}
          </h3>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '1rem'
          }}>
            <span style={{
              fontFamily: 'Raleway, sans-serif',
              fontSize: '1.5rem',
              fontWeight: '700',
              color: 'var(--teal-bright)',
              letterSpacing: '0.02em'
            }}>
              ₹{product.price}
            </span>
            <div style={{
              width: '8px',
              height: '8px',
              background: 'var(--gold-bright)',
              borderRadius: '50%',
              boxShadow: '0 0 12px rgba(224,194,128,0.6)'
            }}></div>
          </div>
        </div>
      </Link>
    )
  }

  // Loading state
  if (productsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, rgba(10,40,45,0.3), rgba(20,60,65,0.2), rgba(15,50,55,0.25))',
        backdropFilter: 'blur(2px)'
      }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-bright mx-auto mb-4"></div>
          <p style={{ color: 'var(--text-bright)' }}>Loading...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (productsError) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, rgba(10,40,45,0.3), rgba(20,60,65,0.2), rgba(15,50,55,0.25))',
        backdropFilter: 'blur(2px)'
      }}>
        <div className="text-center">
          <h1 style={{ color: 'var(--text-bright)', marginBottom: '1rem' }}>Unable to load products</h1>
          <button 
            onClick={() => {
              dispatch(getProducts())
              dispatch(getFeaturedProducts())
            }} 
            style={{ 
              background: 'var(--teal-bright)', 
              color: '#071e24', 
              padding: '0.5rem 1rem', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '0.5rem'
            }}
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, rgba(10,40,45,0.3), rgba(20,60,65,0.2), rgba(15,50,55,0.25))',
      backdropFilter: 'blur(2px)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'radial-gradient(ellipse at center, rgba(37,204,200,0.1) 0%, transparent 70%)',
        animation: 'waterWave 8s ease-in-out infinite',
        pointerEvents: 'none'
      }}></div>
      
      {/* Bubbles Animation */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none'
      }}>
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              bottom: '-20px',
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 20 + 5}px`,
              height: `${Math.random() * 20 + 5}px`,
              background: `rgba(${Math.random() * 50 + 200}, ${Math.random() * 50 + 50}, ${Math.random() * 50 + 150}, ${Math.random() * 0.3 + 0.2})`,
              borderRadius: '50%',
              animation: `bubbleRise ${Math.random() * 8 + 6}s linear infinite`,
              animationDelay: `${Math.random() * 10}s`,
              filter: 'blur(1px)'
            }}
          />
        ))}
      </div>
      
      {/* HERO */}
      <section className="relative py-24 flex items-center justify-center" style={{
        backgroundImage: 'linear-gradient(to bottom, rgba(8,25,30,0.65) 0%, rgba(8,25,30,0.3) 35%, rgba(8,25,30,0.7) 100%)',
        backgroundAttachment: 'fixed'
      }}>
        <div className="text-center max-w-6xl px-6">
          <div className="hero-eyebrow" style={{
            fontFamily: 'Raleway, sans-serif',
            fontSize: '0.65rem',
            fontWeight: '700',
            letterSpacing: '0.65em',
            color: 'var(--teal-bright)',
            textTransform: 'uppercase',
            marginBottom: '2rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <span style={{
              display: 'inline-block',
              width: '35px',
              height: '1px',
              background: 'var(--teal)'
            }}></span>
            WELCOME TO
            <span style={{
              display: 'inline-block',
              width: '35px',
              height: '1px',
              background: 'var(--teal)'
            }}></span>
          </div>
          <motion.h1 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-title"
            style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(3.5rem,8vw,7.5rem)',
              fontWeight: '900',
              lineHeight: '0.93',
              letterSpacing: '-0.02em',
              color: '#FFFFFF',
              textShadow: '4px 4px 12px rgba(0,0,0,0.8)',
              marginBottom: '0.5rem'
            }}
          >
            Global Exim Traders
            <span className="brand-exim" style={{
              display: 'block',
              fontStyle: 'italic',
              color: 'var(--gold-bright)',
              fontFamily: 'Lora, serif',
              fontSize: 'clamp(1.1rem,2vw,1.6rem)'
            }}>
              Where Heritage Meets Global Elegance
            </span>
          </motion.h1>
          
          <div className="lotus-divider" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            margin: '2rem 0'
          }}>
            <div className="lotus-line" style={{
              flex: '1',
              maxWidth: '100px',
              height: '1px',
              background: 'linear-gradient(90deg, transparent, var(--teal), transparent)'
            }}></div>
            <div className="lotus-gem" style={{
              width: '9px',
              height: '9px',
              background: 'var(--teal-bright)',
              transform: 'rotate(45deg)',
              animation: 'floatLotus 4s ease-in-out infinite'
            }}></div>
            <div className="lotus-line" style={{
              flex: '1',
              maxWidth: '100px',
              height: '1px',
              background: 'linear-gradient(90deg, transparent, var(--teal), transparent)'
            }}></div>
          </div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hero-tagline"
            style={{
              fontFamily: 'Lora, serif',
              fontStyle: 'italic',
              fontSize: 'clamp(1.1rem,2vw,1.6rem)',
              color: 'var(--text-soft)',
              marginBottom: '1rem'
            }}
          >
            Discover authentic Indian craftsmanship & premium export-quality collections
          </motion.p>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hero-subtitle"
            style={{
              fontFamily: 'Raleway, sans-serif',
              fontSize: '0.88rem',
              fontWeight: '300',
              letterSpacing: '0.06em',
              color: 'var(--text-muted)',
              lineHeight: '1.9',
              marginBottom: '3rem'
            }}
          >
            Curated selection of finest jewelry and handicrafts from traditional artisans
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex justify-center gap-6 mb-12"
          >
            <Link to="/products" className="btn-primary" style={{
              fontFamily: 'Raleway, sans-serif',
              fontSize: '0.7rem',
              fontWeight: '700',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: '#071e24',
              background: 'var(--teal-bright)',
              padding: '1rem 2.4rem',
              textDecoration: 'none',
              display: 'inline-block',
              clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s'
            }}>
              Explore Collections
            </Link>
            <Link to="/about" className="btn-secondary" style={{
              fontFamily: 'Raleway, sans-serif',
              fontSize: '0.7rem',
              fontWeight: '600',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--gold-bright)',
              background: 'rgba(10,40,45,0.5)',
              padding: '1rem 2.4rem',
              border: '1px solid rgba(200,162,110,0.45)',
              textDecoration: 'none',
              display: 'inline-block',
              clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.35s'
            }}>
              Our Story
            </Link>
          </motion.div>
          
          {/* Trust Badges */}
          <div className="trust-row" style={{
            position: 'relative',
            zIndex: '10',
            width: '100%',
            background: 'rgba(8,30,35,0.82)',
            backdropFilter: 'blur(16px)',
            borderTop: '1px solid var(--glass-border)',
            padding: '1.3rem 4%',
            marginTop: '4rem',
            borderRadius: '8px'
          }}>
            <div className="trust-label-v" style={{
              fontFamily: 'Raleway, sans-serif',
              fontSize: '0.58rem',
              fontWeight: '700',
              letterSpacing: '0.4em',
              color: 'var(--teal)',
              textTransform: 'uppercase',
              textAlign: 'center',
              marginBottom: '1rem'
            }}>
              TRUSTED BY GLOBAL CLIENTS
            </div>
            <div className="trust-badges-v" style={{
              display: 'flex',
              gap: '1.8rem',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
              <div className="badge-text" style={{
                fontFamily: 'Raleway, sans-serif',
                fontSize: '0.58rem',
                fontWeight: '600',
                letterSpacing: '0.12em',
                color: 'var(--text-soft)',
                textTransform: 'uppercase'
              }}>
                ✓ EXPORT QUALITY
              </div>
              <div className="badge-text" style={{
                fontFamily: 'Raleway, sans-serif',
                fontSize: '0.58rem',
                fontWeight: '600',
                letterSpacing: '0.12em',
                color: 'var(--text-soft)',
                textTransform: 'uppercase'
              }}>
                ✓ AUTHENTIC HANDICRAFTS
              </div>
              <div className="badge-text" style={{
                fontFamily: 'Raleway, sans-serif',
                fontSize: '0.58rem',
                fontWeight: '600',
                letterSpacing: '0.12em',
                color: 'var(--text-soft)',
                textTransform: 'uppercase'
              }}>
                ✓ PREMIUM JEWELRY
              </div>
              <div className="badge-text" style={{
                fontFamily: 'Raleway, sans-serif',
                fontSize: '0.58rem',
                fontWeight: '600',
                letterSpacing: '0.12em',
                color: 'var(--text-soft)',
                textTransform: 'uppercase'
              }}>
                ✓ GLOBAL SHIPPING
              </div>
            </div>
          </div>
          
          {/* Additional Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="p-8 rounded-lg"
              style={{
                background: 'var(--glass-card)',
                border: '1px solid var(--glass-border)',
                backdropFilter: 'blur(8px)'
              }}
            >
              <div className="text-5xl mb-4">🏛️</div>
              <h3 style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: '1.25rem',
                fontWeight: '600',
                color: 'var(--gold-bright)',
                marginBottom: '1rem'
              }}>Traditional Heritage</h3>
              <p style={{
                fontFamily: 'Lora, serif',
                fontSize: '0.95rem',
                color: 'var(--text-soft)',
                lineHeight: '1.6'
              }}>Authentic Indian craftsmanship passed through generations</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="p-8 rounded-lg"
              style={{
                background: 'var(--glass-card)',
                border: '1px solid var(--glass-border)',
                backdropFilter: 'blur(8px)'
              }}
            >
              <div className="text-5xl mb-4">🌍</div>
              <h3 style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: '1.25rem',
                fontWeight: '600',
                color: 'var(--gold-bright)',
                marginBottom: '1rem'
              }}>Global Quality</h3>
              <p style={{
                fontFamily: 'Lora, serif',
                fontSize: '0.95rem',
                color: 'var(--text-soft)',
                lineHeight: '1.6'
              }}>Export-grade products meeting international standards</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="p-8 rounded-lg"
              style={{
                background: 'var(--glass-card)',
                border: '1px solid var(--glass-border)',
                backdropFilter: 'blur(8px)'
              }}
            >
              <div className="text-5xl mb-4">✨</div>
              <h3 style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: '1.25rem',
                fontWeight: '600',
                color: 'var(--gold-bright)',
                marginBottom: '1rem'
              }}>Premium Collection</h3>
              <p style={{
                fontFamily: 'Lora, serif',
                fontSize: '0.95rem',
                color: 'var(--text-soft)',
                lineHeight: '1.6'
              }}>Curated selection of finest jewelry and handicrafts</p>
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
        className="py-24"
        style={{
          background: 'linear-gradient(to bottom, transparent, rgba(8,30,35,0.4))'
        }}
      >
        <div className="max-w-7xl mx-auto text-center mb-16 px-6">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(2.5rem,5vw,4rem)',
              fontWeight: '700',
              color: 'var(--text-bright)',
              marginBottom: '1rem',
              letterSpacing: '-0.01em'
            }}
          >
            Top Products
          </motion.h2>
          <div className="lotus-divider" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            margin: '1.5rem auto'
          }}>
            <div className="lotus-line" style={{
              flex: '1',
              maxWidth: '80px',
              height: '1px',
              background: 'linear-gradient(90deg, transparent, var(--teal), transparent)'
            }}></div>
            <div className="lotus-gem" style={{
              width: '9px',
              height: '9px',
              background: 'var(--teal-bright)',
              transform: 'rotate(45deg)',
              animation: 'floatLotus 4s ease-in-out infinite'
            }}></div>
            <div className="lotus-line" style={{
              flex: '1',
              maxWidth: '80px',
              height: '1px',
              background: 'linear-gradient(90deg, transparent, var(--teal), transparent)'
            }}></div>
          </div>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              fontFamily: 'Lora, serif',
              fontSize: '1.1rem',
              color: 'var(--text-soft)',
              lineHeight: '1.6',
              maxWidth: '600px',
              margin: '0 auto'
            }}
          >
            Explore our complete collection from all categories
          </motion.p>
        </div>

        {allProducts.length === 0 ? (
          <div className="text-center py-16" style={{
            color: 'var(--text-muted)',
            fontFamily: 'Lora, serif',
            fontSize: '1.1rem'
          }}>
            No products available
          </div>
        ) : (
          <div className="relative max-w-7xl mx-auto px-8">
            {/* Left Arrow */}
            {allProducts.length > 1 && (
              <button
                onClick={prevSlide}
                style={{
                  position: 'absolute',
                  left: '0',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'var(--teal-bright)',
                  color: '#071e24',
                  border: 'none',
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  zIndex: '20',
                  boxShadow: '0 8px 32px rgba(37,204,200,0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'var(--teal-light)'
                  e.target.style.transform = 'translateY(-50%) scale(1.1)'
                  e.target.style.boxShadow = '0 12px 40px rgba(37,204,200,0.5)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'var(--teal-bright)'
                  e.target.style.transform = 'translateY(-50%) scale(1)'
                  e.target.style.boxShadow = '0 8px 32px rgba(37,204,200,0.3)'
                }}
                aria-label="Previous"
              >
                ←
              </button>
            )}

            {/* Right Arrow */}
            {allProducts.length > 1 && (
              <button
                onClick={nextSlide}
                style={{
                  position: 'absolute',
                  right: '0',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'var(--teal-bright)',
                  color: '#071e24',
                  border: 'none',
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  zIndex: '20',
                  boxShadow: '0 8px 32px rgba(37,204,200,0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'var(--teal-light)'
                  e.target.style.transform = 'translateY(-50%) scale(1.1)'
                  e.target.style.boxShadow = '0 12px 40px rgba(37,204,200,0.5)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'var(--teal-bright)'
                  e.target.style.transform = 'translateY(-50%) scale(1)'
                  e.target.style.boxShadow = '0 8px 32px rgba(37,204,200,0.3)'
                }}
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
              <div className="flex justify-center mt-12 gap-3">
                {allProducts.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    style={{
                      width: currentSlide === index ? '12px' : '8px',
                      height: currentSlide === index ? '12px' : '8px',
                      borderRadius: '50%',
                      border: 'none',
                      background: currentSlide === index ? 'var(--teal-bright)' : 'var(--text-muted)',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      boxShadow: currentSlide === index ? '0 0 16px rgba(37,204,200,0.6)' : 'none'
                    }}
                    onMouseEnter={(e) => {
                      if (currentSlide !== index) {
                        e.target.style.background = 'var(--text-soft)'
                        e.target.style.transform = 'scale(1.2)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (currentSlide !== index) {
                        e.target.style.background = 'var(--text-muted)'
                        e.target.style.transform = 'scale(1)'
                      }
                    }}
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
        className="py-24"
        style={{
          background: 'linear-gradient(to bottom, rgba(8,30,35,0.4), rgba(8,30,35,0.6))'
        }}
      >
        <div className="max-w-7xl mx-auto text-center mb-16 px-6">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(2.5rem,5vw,4rem)',
              fontWeight: '700',
              color: 'var(--text-bright)',
              marginBottom: '1rem',
              letterSpacing: '-0.01em'
            }}
          >
            Featured Collections
          </motion.h2>
          <div className="lotus-divider" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            margin: '1.5rem auto'
          }}>
            <div className="lotus-line" style={{
              flex: '1',
              maxWidth: '80px',
              height: '1px',
              background: 'linear-gradient(90deg, transparent, var(--teal), transparent)'
            }}></div>
            <div className="lotus-gem" style={{
              width: '9px',
              height: '9px',
              background: 'var(--teal-bright)',
              transform: 'rotate(45deg)',
              animation: 'floatLotus 4s ease-in-out infinite'
            }}></div>
            <div className="lotus-line" style={{
              flex: '1',
              maxWidth: '80px',
              height: '1px',
              background: 'linear-gradient(90deg, transparent, var(--teal), transparent)'
            }}></div>
          </div>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              fontFamily: 'Lora, serif',
              fontSize: '1.1rem',
              color: 'var(--text-soft)',
              lineHeight: '1.6',
              maxWidth: '600px',
              margin: '0 auto'
            }}
          >
            Discover our curated selection of premium jewelry & handicrafts
          </motion.p>
        </div>

        {featuredProducts.length === 0 ? (
          <div className="text-center py-16" style={{
            color: 'var(--text-muted)',
            fontFamily: 'Lora, serif',
            fontSize: '1.1rem'
          }}>
            No featured products available
          </div>
        ) : (
          <div className="relative max-w-7xl mx-auto px-8">
            {/* Left Arrow */}
            {featuredProducts.length > 1 && (
              <button
                onClick={prevFeaturedSlide}
                style={{
                  position: 'absolute',
                  left: '0',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'var(--teal-bright)',
                  color: '#071e24',
                  border: 'none',
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  zIndex: '20',
                  boxShadow: '0 8px 32px rgba(37,204,200,0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'var(--teal-light)'
                  e.target.style.transform = 'translateY(-50%) scale(1.1)'
                  e.target.style.boxShadow = '0 12px 40px rgba(37,204,200,0.5)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'var(--teal-bright)'
                  e.target.style.transform = 'translateY(-50%) scale(1)'
                  e.target.style.boxShadow = '0 8px 32px rgba(37,204,200,0.3)'
                }}
                aria-label="Previous"
              >
                ←
              </button>
            )}

            {/* Right Arrow */}
            {featuredProducts.length > 1 && (
              <button
                onClick={nextFeaturedSlide}
                style={{
                  position: 'absolute',
                  right: '0',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'var(--teal-bright)',
                  color: '#071e24',
                  border: 'none',
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  zIndex: '20',
                  boxShadow: '0 8px 32px rgba(37,204,200,0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'var(--teal-light)'
                  e.target.style.transform = 'translateY(-50%) scale(1.1)'
                  e.target.style.boxShadow = '0 12px 40px rgba(37,204,200,0.5)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'var(--teal-bright)'
                  e.target.style.transform = 'translateY(-50%) scale(1)'
                  e.target.style.boxShadow = '0 8px 32px rgba(37,204,200,0.3)'
                }}
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
              <div className="flex justify-center mt-12 gap-3">
                {featuredProducts.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToFeaturedSlide(index)}
                    style={{
                      width: currentFeaturedSlide === index ? '12px' : '8px',
                      height: currentFeaturedSlide === index ? '12px' : '8px',
                      borderRadius: '50%',
                      border: 'none',
                      background: currentFeaturedSlide === index ? 'var(--teal-bright)' : 'var(--text-muted)',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      boxShadow: currentFeaturedSlide === index ? '0 0 16px rgba(37,204,200,0.6)' : 'none'
                    }}
                    onMouseEnter={(e) => {
                      if (currentFeaturedSlide !== index) {
                        e.target.style.background = 'var(--text-soft)'
                        e.target.style.transform = 'scale(1.2)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (currentFeaturedSlide !== index) {
                        e.target.style.background = 'var(--text-muted)'
                        e.target.style.transform = 'scale(1)'
                      }
                    }}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </motion.section>
    </div>
    </ErrorBoundary>
  )
}

export default Home