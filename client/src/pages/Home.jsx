import React, { useEffect, useState, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useGetProductsQuery, useGetFeaturedProductsQuery } from '../store/slices/adminApi'
import { motion } from 'framer-motion'
import audioFile from '../assets/Celion_Dion_-_My_Heart_Will_Go_On_OST_Titanic_(mp3.pm).mp3'

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

// Image optimization function - moved before ProductImage
const getOptimizedUrl = (url, size = 'medium') => {
  if (!url) return null
  
  // Skip optimization for base64 or blob URLs
  if (url.startsWith('data:') || url.startsWith('blob:')) {
    return url
  }
  
  // Image size optimization for different screen sizes
  const sizes = {
    small: 'w_200,h_200,c_fill,q_auto,f_auto',  // Auto format + quality
    medium: 'w_400,h_400,c_fill,q_auto,f_auto', 
    large: 'w_600,h_600,c_fill,q_auto,f_auto'
  }
  
  // If it's a Cloudinary URL, add optimization
  if (url.includes('cloudinary.com')) {
    const optimization = sizes[size]
    return url.replace('/upload/', `/upload/${optimization}/`)
  }
  
  // For other URLs, add basic quality hint
  if (url.includes('?')) {
    return `${url}&quality=80&format=webp`
  } else {
    return `${url}?quality=80&format=webp`
  }
}

const ProductImage = React.memo(({ src, alt, className, style, onLoad, onError, sizes }) => {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  const [shouldLoad, setShouldLoad] = useState(false)
  const containerRef = React.useRef()

  // Intersection Observer - attached to container div (always rendered)
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShouldLoad(true)
          observer.disconnect()
        }
      },
      { threshold: 0.05, rootMargin: '100px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  if (!src || error) {
    return (
      <div ref={containerRef} className="h-full flex items-center justify-center">
        <span className="text-6xl opacity-60">📦</span>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="h-full w-full relative">
      {/* Spinner while not loaded */}
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-teal-800/50 to-teal-900/50">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-400"></div>
        </div>
      )}
      {/* Render img only when in viewport - browser handles actual loading */}
      {shouldLoad && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className={className}
          style={{
            ...style,
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.4s ease'
          }}
          sizes={sizes}
          onLoad={() => { setLoaded(true); onLoad?.() }}
          onError={() => { setError(true); onError?.() }}
        />
      )}
    </div>
  )
})

const ProductCard = React.memo(({ product, isMobile, imageLoaded, imageError, onImageLoad, onImageError }) => {
    if (!product || !product.id) return null

    let images = product.images

    if (typeof images === 'string') {
      try {
        images = JSON.parse(images)
      } catch {
        images = []
      }
    }

    const imageUrl = images && images.length > 0 ? getOptimizedUrl(images[0], isMobile ? 'small' : 'medium') : null

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
            <ProductImage
              src={imageUrl}
              alt={product.name || 'Product'}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              style={{
                filter: 'brightness(0.95) contrast(1.05) saturate(1.1)',
              }}
              onLoad={onImageLoad}
              onError={onImageError}
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 256px"
            />
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
  })

const Home = () => {
  const dispatch = useDispatch()
  
  // Use RTK Query for optimized data fetching with pagination
  const { data: productsData, isLoading: productsLoading, error: productsError, refetch: refetchProducts } = useGetProductsQuery({ 
    limit: 8, // Sirf 8 products load karna hai initially
    page: 1 
  })
  const { data: featuredData, isLoading: featuredLoading, error: featuredError, refetch: refetchFeatured } = useGetFeaturedProductsQuery()

  // Extract arrays from the response data
  const allProducts = Array.isArray(productsData) ? productsData : (productsData?.data?.products || [])
  const featuredProducts = Array.isArray(featuredData) ? featuredData : (featuredData?.data || [])

  const [currentSlide, setCurrentSlide] = useState(0)
  const [currentFeaturedSlide, setCurrentFeaturedSlide] = useState(0)
  const [loadedImages, setLoadedImages] = useState({})
  const [imageErrors, setImageErrors] = useState({})
  const [componentMounted, setComponentMounted] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = React.useRef(null)
  const [isMobile, setIsMobile] = useState(false)

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Audio setup - NO AUTOPLAY
  useEffect(() => {
    if (isMobile) return  // mobile pe audio hide karo
    
    const audio = audioRef.current
    if (!audio) return
    
    // Audio setup for manual play only
    audio.volume = 0.4
    audio.preload = 'none' // Network bandwidth save karo
    
    // Cleanup
    return () => {
      if (audio) {
        audio.pause()
        audio.currentTime = 0
      }
    }
  }, [isMobile])

  const toggleAudio = async () => {
    if (!audioRef.current) return
    
    if (isPlaying) {
      audioRef.current.pause()
      // setIsPlaying handled by onPause event on the <audio> element
    } else {
      try {
        await audioRef.current.play()
        // setIsPlaying handled by onPlay event on the <audio> element
      } catch (error) {
        console.log('Audio play failed:', error.message)
        setIsPlaying(false)
      }
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    setComponentMounted(true)
    return () => {
      setComponentMounted(false)
    }
  }, [])

  // Auto Slide for All Products - DISABLED for performance
  useEffect(() => {
    // Disabled to prevent CPU spikes
    return () => {}
  }, [])

  // Auto Slide for Featured Products - DISABLED for performance  
  useEffect(() => {
    // Disabled to prevent CPU spikes
    return () => {}
  }, [])

  const nextSlide = () => {
    if (!Array.isArray(allProducts) || allProducts.length <= 1) return
    const maxSlides = allProducts.length - 1
    setCurrentSlide(prev =>
      prev >= maxSlides ? 0 : prev + 1
    )
  }

  const prevSlide = () => {
    if (!Array.isArray(allProducts) || allProducts.length <= 1) return
    const maxSlides = allProducts.length - 1
    setCurrentSlide(prev =>
      prev === 0 ? maxSlides : prev - 1
    )
  }

  const nextFeaturedSlide = () => {
    if (!Array.isArray(featuredProducts) || featuredProducts.length <= 1) return
    const maxSlides = featuredProducts.length - 1
    setCurrentFeaturedSlide(prev =>
      prev >= maxSlides ? 0 : prev + 1
    )
  }

  const prevFeaturedSlide = () => {
    if (!Array.isArray(featuredProducts) || featuredProducts.length <= 1) return
    const maxSlides = featuredProducts.length - 1
    setCurrentFeaturedSlide(prev =>
      prev === 0 ? maxSlides : prev - 1
    )
  }

  const goToSlide = React.useCallback(index => {
    setCurrentSlide(index)
  }, [])

  const goToFeaturedSlide = React.useCallback(index => {
    setCurrentFeaturedSlide(index)
  }, [])

  const modelImages = [
    'https://res.cloudinary.com/bazeercloud/image/upload/v1773206791/img2_wb4n3k.jpg',
    'https://res.cloudinary.com/bazeercloud/image/upload/v1773206792/img3_xffkyd.jpg',
    'https://res.cloudinary.com/bazeercloud/image/upload/v1773206792/img5_nv7b5y.jpg',
    'https://res.cloudinary.com/bazeercloud/image/upload/v1773206792/img4_gynggu.jpg',
    'https://res.cloudinary.com/bazeercloud/image/upload/v1773206792/img1_tvaz89.jpg',
    'https://res.cloudinary.com/bazeercloud/image/upload/v1773206792/img6_bbu1ew.jpg',
    'https://res.cloudinary.com/bazeercloud/image/upload/v1773206792/img7_bgaydp.jpg',
    'https://res.cloudinary.com/bazeercloud/image/upload/v1773206793/img9_pku7et.jpg',
    'https://res.cloudinary.com/bazeercloud/image/upload/v1773895324/WhatsApp_Image_2026-03-11_at_14.10.08_mmaxot.jpg',
    'https://res.cloudinary.com/bazeercloud/image/upload/v1773895324/WhatsApp_Image_2026-03-09_at_16.54.26_aryjws.jpg',
    'https://res.cloudinary.com/bazeercloud/image/upload/v1773895324/WhatsApp_Image_2026-03-09_at_13.56.30_rjhdna.jpg',
    'https://res.cloudinary.com/bazeercloud/image/upload/v1774364834/WhatsApp_Image_2026-03-24_at_19.43.15_muommg.jpg',
    'https://res.cloudinary.com/bazeercloud/image/upload/v1774364834/WhatsApp_Image_2026-03-24_at_19.41.45_vpwusr.jpg',
    'https://res.cloudinary.com/bazeercloud/image/upload/v1774364834/WhatsApp_Image_2026-03-24_at_19.40.11_glhjz4.jpg',
    'https://res.cloudinary.com/bazeercloud/image/upload/v1774364833/WhatsApp_Image_2026-03-24_at_19.30.06_kexn9a.jpg',
    'https://res.cloudinary.com/bazeercloud/image/upload/v1774364833/WhatsApp_Image_2026-03-24_at_19.33.30_tzea17.jpg'
  ]

  const visibleImages = isMobile ? modelImages.slice(0, 8) : modelImages

  // ProductCard is now defined outside Home to prevent recreation on every render
  const handleImageLoad = React.useCallback((productId) => {
    if (componentMounted) {
      setLoadedImages(prev => ({ ...prev, [productId]: true }))
    }
  }, [componentMounted])

  const handleImageError = React.useCallback((productId) => {
    if (componentMounted) {
      setImageErrors(prev => ({ ...prev, [productId]: true }))
    }
  }, [componentMounted])

  // Skeleton card component
  const SkeletonCard = () => (
    <div style={{
      background: 'var(--glass-card)',
      border: '1px solid var(--glass-border)',
      borderRadius: '12px',
      overflow: 'hidden'
    }}>
      <div style={{ height: '224px', background: 'rgba(37,204,200,0.08)' }} />
      <div style={{ padding: '1.5rem' }}>
        <div style={{ height: '20px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', marginBottom: '12px', width: '70%' }} />
        <div style={{ height: '24px', background: 'rgba(37,204,200,0.12)', borderRadius: '4px', width: '40%' }} />
      </div>
    </div>
  )

  return (
    <ErrorBoundary>
      <div className="min-h-screen" style={{
      background: 'transparent',
      position: 'relative',
      overflow: 'visible'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'radial-gradient(ellipse at center, rgba(37,204,200,0.1) 0%, transparent 70%)',
        pointerEvents: 'none',
        animation: 'none'
      }}></div>
      
      {/* Audio Element - Using Imported File */}
      <audio
        ref={audioRef}
        src={audioFile}
        loop
        preload="none"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => {
          if (audioRef.current) {
            audioRef.current.currentTime = 0
            audioRef.current.play().catch(() => {})
          }
        }}
        onError={(e) => {
          console.error('Audio error:', e.target.error?.message || 'File not found')
          setIsPlaying(false)
        }}
        style={{ display: 'none' }}
      />
      
      {/* Audio Controls */}
      <button
          onClick={toggleAudio}
          style={{
            position: 'fixed',
            top: isMobile ? '70px' : '80px',
            right: isMobile ? '15px' : '20px',
            zIndex: '1000',
            background: isPlaying ? 'rgba(37,204,200,0.95)' : 'rgba(37,204,200,0.7)',
            color: '#071e24',
            border: 'none',
            borderRadius: '50%',
            width: isMobile ? '44px' : '52px',
            height: isMobile ? '44px' : '52px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: isMobile ? '1.1rem' : '1.3rem',
            cursor: 'pointer',
            boxShadow: isPlaying ? '0 0 20px rgba(37,204,200,0.6)' : '0 4px 16px rgba(37,204,200,0.3)',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(37,204,200,1)'
            e.currentTarget.style.transform = 'scale(1.1)'
            e.currentTarget.style.boxShadow = '0 6px 30px rgba(37,204,200,0.6)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = isPlaying ? 'rgba(37,204,200,0.95)' : 'rgba(37,204,200,0.7)'
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.boxShadow = isPlaying ? '0 0 20px rgba(37,204,200,0.6)' : '0 4px 16px rgba(37,204,200,0.3)'
          }}
          title={isPlaying ? 'Pause Music' : 'Play Music'}
          aria-label={isPlaying ? 'Pause Music' : 'Play Music'}
        >
          {isPlaying ? '⏸️' : '▶️'}
        </button>
      
      {/* Bubbles Animation - DISABLED for performance */}
      
      {/* HERO */}
      <section className="relative py-24 flex items-center justify-center" style={{
        backgroundImage: 'linear-gradient(to bottom, rgba(8,25,30,0.4) 0%, rgba(8,35,40,0.3) 35%, rgba(8,30,35,0.5) 100%)',
        backgroundAttachment: 'scroll'
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
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="hero-title"
            style={{
              lineHeight: '1.1',
              letterSpacing: '0',
              marginBottom: '0.5rem',
              background: 'rgba(8,30,35,0.95)',
              padding: '2rem',
              borderRadius: '12px',
              border: '1px solid rgba(37,204,200,0.3)'
            }}
          >
            {/* "Get AshokaaZ" — single line with same font */}
            <span style={{
              display: 'block',
              fontFamily: '"Great Vibes", "Dancing Script", cursive',
              fontSize: 'clamp(3rem, 6vw, 5rem)',
              fontWeight: '400',
              color: 'var(--gold-bright)',
              letterSpacing: '0.05em',
              marginBottom: '0.1rem',
              textShadow: '2px 2px 8px rgba(0,0,0,0.8), 0 0 16px rgba(224,194,128,0.4)'
            }}>
              Get AshokaaZ
            </span>

            {/* Tagline italic */}
            <span className="brand-exim" style={{
              display: 'block',
              fontStyle: 'italic',
              color: 'rgba(255,255,255,0.85)',
              fontFamily: 'Lora, Georgia, serif',
              fontSize: 'clamp(0.85rem, 1.6vw, 1.1rem)',
              letterSpacing: '0.05em',
              fontWeight: '400',
              marginBottom: '1.2rem'
            }}>
              "Where elegance meets global luxury."
            </span>

            {/* "Global Exim Traders" */}
            <span style={{
              display: 'block',
              marginBottom: '0.5rem',
              padding: '0.3rem 0',
              fontSize: 'clamp(1.1rem, 3vw, 1.8rem)',
              fontFamily: 'Cinzel, "Playfair Display", serif',
              fontWeight: '600',
              letterSpacing: '0.18em',
              color: '#FFFFFF',
              textTransform: 'uppercase',
              textShadow: '2px 2px 6px rgba(0,0,0,0.8), 0 0 10px rgba(255,255,255,0.1)'
            }}>
              Global Exim Traders
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
              transform: 'rotate(45deg)'
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
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hero-tagline"
            style={{
              fontFamily: 'Lora, serif',
              fontStyle: 'italic',
              fontSize: 'clamp(1.1rem,2vw,1.6rem)',
              color: '#FFFFFF',
              marginBottom: '1rem'
            }}
          >
            Discover authentic Indian craftsmanship & premium export-quality collections
          </motion.p>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hero-subtitle"
            style={{
              fontFamily: 'Raleway, sans-serif',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              letterSpacing: '0.06em',
              color: '#FFFFFF',
              lineHeight: '1.9',
              marginBottom: '3rem'
            }}
          >
            Curated selection of finest jewellery and handicrafts from traditional artisans
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
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
            background: 'rgba(8,30,35,0.92)',
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
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="p-8 rounded-lg"
              style={{
                background: 'rgba(8,30,35,0.95)',
                border: '1px solid var(--glass-border)'
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
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="p-8 rounded-lg"
              style={{
                background: 'rgba(8,30,35,0.95)',
                border: '1px solid var(--glass-border)'
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
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="p-8 rounded-lg"
              style={{
                background: 'rgba(8,30,35,0.95)',
                border: '1px solid var(--glass-border)'
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

      {/* MODEL IMAGES GRID */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-16"
        style={{
          background: 'linear-gradient(to bottom, rgb(8,30,35), rgb(8,35,40))',
          overflow: 'visible',
          paddingBottom: '4rem'
        }}
      >
        <div className="max-w-7xl mx-auto px-6" style={{ overflow: 'visible' }}>
          <div className="model-grid-container">
            {visibleImages.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="model-grid-item"
                style={{
                  background: 'var(--glass-card)',
                  border: '1px solid var(--glass-border)',
                  backdropFilter: 'blur(8px)',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  borderRadius: '12px'
                }}
              >
                <ProductImage
                  src={getOptimizedUrl(image)}
                  alt={`Model ${index + 1}`}
                  className="model-grid-image"
                  style={{
                    filter: 'brightness(0.9) contrast(1.1)',
                    display: 'block',
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'top center'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.75), transparent)',
                  padding: '1rem',
                  color: '#FFFFFF'
                }}>
                  <p style={{
                    fontFamily: 'Lora, serif',
                    fontSize: '0.85rem',
                    opacity: '0.9',
                    letterSpacing: '0.05em'
                  }}>
                    Elegance Personified
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-24"
        style={{
          background: 'linear-gradient(to bottom, rgb(8,30,35), rgb(8,35,40))'
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
              color: '#FFFFFF',
              lineHeight: '1.6',
              maxWidth: '800px',
              margin: '0 auto'
            }}
          >
            <strong style={{ color: 'var(--gold-bright)' }}>All Categories of Fashion Jewelleries:</strong><br/>
            Afghani Jewellery, Oxidised, German Silver, Double Tone, Black Metal, Gold Plated, CZ Jewellery, and more...
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{
              marginTop: '2rem',
              maxWidth: '900px',
              margin: '2rem auto 0'
            }}
          >
            <h4 style={{
              fontFamily: 'Raleway, sans-serif',
              fontSize: '1.2rem',
              fontWeight: '600',
              color: 'var(--gold-bright)',
              marginBottom: '1rem',
              textAlign: 'center'
            }}>
              All Categories:
            </h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              textAlign: 'center',
              marginBottom: '2rem'
            }}>
              {[
                'Afghani Jewellery',
                'Oxidised',
                'German Silver',
                'Double Tone',
                'Black Metal',
                'Gold Plated',
                'CZ Jewellery',
                'Traditional'
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.05 }}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: '0 8px 32px rgba(224,194,128,0.3)'
                  }}
                  style={{
                    padding: '1rem',
                    background: 'linear-gradient(135deg, rgba(224,194,128,0.1), rgba(224,194,128,0.05))',
                    border: '1px solid rgba(224,194,128,0.3)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(12px)',
                    color: '#FFFFFF',
                    fontFamily: 'Lora, serif',
                    fontSize: '0.95rem',
                    fontWeight: '500',
                    position: 'relative',
                    overflow: 'hidden',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    right: '0',
                    height: '2px',
                    background: 'linear-gradient(90deg, transparent, var(--gold-bright), transparent)'
                  }}></div>
                  {item}
                </motion.div>
              ))}
            </div>
            
            <h4 style={{
              fontFamily: 'Raleway, sans-serif',
              fontSize: '1.2rem',
              fontWeight: '600',
              color: 'var(--gold-bright)',
              marginBottom: '1rem',
              textAlign: 'center'
            }}>
              Sub Categories:
            </h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              textAlign: 'center'
            }}>
              {[
                'Necklace (Kundan)',
                'Necklace with Ear Tops',
                'Only Ear Tops',
                'Bangles',
                'Rings',
                'Bracelets',
                'Anklets',
                'Maang Tikka'
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.05 }}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: '0 8px 32px rgba(224,194,128,0.3)'
                  }}
                  style={{
                    padding: '1rem',
                    background: 'linear-gradient(135deg, rgba(224,194,128,0.1), rgba(224,194,128,0.05))',
                    border: '1px solid rgba(224,194,128,0.3)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(12px)',
                    color: '#FFFFFF',
                    fontFamily: 'Lora, serif',
                    fontSize: '0.95rem',
                    fontWeight: '500',
                    position: 'relative',
                    overflow: 'hidden',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    right: '0',
                    height: '2px',
                    background: 'linear-gradient(90deg, transparent, var(--gold-bright), transparent)'
                  }}></div>
                  {item}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {productsLoading || featuredLoading ? (
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : productsError ? (
          <div className="text-center py-16">
            <p style={{ color: 'var(--text-muted)', fontFamily: 'Lora, serif', marginBottom: '1rem' }}>Unable to load products</p>
            <button onClick={() => refetchProducts()} style={{ background: 'var(--teal-bright)', color: '#071e24', padding: '0.5rem 1.5rem', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Retry</button>
          </div>
        ) : !Array.isArray(allProducts) || allProducts.length === 0 ? (
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
            {Array.isArray(allProducts) && allProducts.length > 1 && (
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
            {Array.isArray(allProducts) && allProducts.length > 1 && (
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
                  transform: Array.isArray(allProducts) && allProducts.length > 1 
                    ? `translateX(-${currentSlide * 100}%)` 
                    : 'none',
                  willChange: 'transform',
                  backfaceVisibility: 'hidden',
                  perspective: 1000
                }}
              >
                {Array.isArray(allProducts) && allProducts.map(product => (
                  <div
                    key={product.id}
                    className="flex-shrink-0 w-full md:w-64"
                  >
                    <ProductCard
                      product={product}
                      isMobile={isMobile}
                      imageLoaded={loadedImages[product.id]}
                      imageError={imageErrors[product.id]}
                      onImageLoad={() => handleImageLoad(product.id)}
                      onImageError={() => handleImageError(product.id)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {Array.isArray(allProducts) && allProducts.length > 1 && (
              <div className="flex justify-center mt-12 gap-3">
                {Array.isArray(allProducts) && allProducts.map((_, index) => (
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
          background: 'linear-gradient(to bottom, rgb(8,30,35), rgb(8,35,40))'
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
              transform: 'rotate(45deg)'
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

        {productsLoading || featuredLoading ? (
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : featuredError ? (
          <div className="text-center py-16">
            <p style={{ color: 'var(--text-muted)', fontFamily: 'Lora, serif', marginBottom: '1rem' }}>Unable to load featured products</p>
            <button onClick={() => refetchFeatured()} style={{ background: 'var(--teal-bright)', color: '#071e24', padding: '0.5rem 1.5rem', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Retry</button>
          </div>
        ) : !Array.isArray(featuredProducts) || featuredProducts.length === 0 ? (
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
            {Array.isArray(featuredProducts) && featuredProducts.length > 1 && (
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
            {Array.isArray(featuredProducts) && featuredProducts.length > 1 && (
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
                  transform: Array.isArray(featuredProducts) && featuredProducts.length > 1 
                    ? `translateX(-${currentFeaturedSlide * 100}%)` 
                    : 'none',
                  willChange: 'transform',
                  backfaceVisibility: 'hidden',
                  perspective: 1000
                }}
              >
                {Array.isArray(featuredProducts) && featuredProducts.map(product => (
                  <div
                    key={product.id}
                    className="flex-shrink-0 w-full md:w-64"
                  >
                    <ProductCard
                      product={product}
                      isMobile={isMobile}
                      imageLoaded={loadedImages[product.id]}
                      imageError={imageErrors[product.id]}
                      onImageLoad={() => handleImageLoad(product.id)}
                      onImageError={() => handleImageError(product.id)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {Array.isArray(featuredProducts) && featuredProducts.length > 1 && (
              <div className="flex justify-center mt-12 gap-3">
                {Array.isArray(featuredProducts) && featuredProducts.map((_, index) => (
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