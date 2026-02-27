import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Home = () => {
  const { featuredProducts } = useSelector(state => state.products)

  return (
    <div className="min-h-screen" style={{ background: '#0a2830' }}>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-serif mb-6 animate-pulse" style={{ color: 'var(--gold-bright)' }}>
            Global Exim Traders
          </h1>
          <p className="text-xl md:text-2xl mb-8 font-light" style={{ color: 'var(--text-soft)' }}>
            Where Heritage Meets Global Elegance
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/products" 
              className="btn-primary"
            >
              Explore Collections
            </Link>
            <Link 
              to="/about" 
              className="btn-secondary"
            >
              Our Story
            </Link>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="text-3xl" style={{ color: 'var(--gold-bright)' }}>↓</div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm uppercase tracking-wider" style={{ color: 'var(--gold-bright)' }}>Featured Collections</span>
            <h2 className="text-4xl md:text-5xl font-serif mt-2 mb-4" style={{ color: 'var(--text-bright)' }}>
              Exquisite Indian Heritage
            </h2>
            <div className="w-24 h-1 mx-auto mb-6" style={{ background: 'var(--gold)' }}></div>
            <p className="max-w-2xl mx-auto" style={{ color: 'var(--text-soft)' }}>
              Discover our curated selection of premium jewelry and handicrafts that showcase India's rich artistic heritage
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <div key={product.id} className="rounded-lg overflow-hidden transition-all" style={{ background: 'rgba(27,158,155,0.1)', border: '1px solid rgba(37,204,200,0.12)' }}>
                <div className="h-64 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0D6E6C, #1B9E9B)' }}>
                  <span className="text-6xl">{product.icon}</span>
                </div>
                <div className="p-6">
                  <span className="text-sm" style={{ color: 'var(--gold-bright)' }}>{product.category}</span>
                  <h3 className="text-xl font-serif mt-2 mb-3" style={{ color: 'var(--text-bright)' }}>{product.name}</h3>
                  <p className="text-sm mb-4" style={{ color: 'var(--text-soft)' }}>{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold" style={{ color: 'var(--gold-bright)' }}>${product.price}</span>
                    <Link 
                      to={`/product/${product.id}`}
                      className="btn-primary text-sm"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-20 px-4" style={{ background: 'rgba(0,0,0,0.2)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-sm uppercase tracking-wider" style={{ color: 'var(--gold-bright)' }}>Our Excellence</span>
              <h2 className="text-4xl font-serif mt-2 mb-6" style={{ color: 'var(--text-bright)' }}>
                Certified & Trusted Exporter
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <span className="text-xl" style={{ color: 'var(--gold-bright)' }}>◆</span>
                  <div>
                    <h4 className="font-semibold" style={{ color: 'var(--text-bright)' }}>GSTIN Registered</h4>
                    <p className="text-sm" style={{ color: 'var(--text-soft)' }}>Fully compliant with all tax regulations</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-xl" style={{ color: 'var(--gold-bright)' }}>◆</span>
                  <div>
                    <h4 className="font-semibold" style={{ color: 'var(--text-bright)' }}>IEC Code Holder</h4>
                    <p className="text-sm" style={{ color: 'var(--text-soft)' }}>Authorized for international trade</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-xl" style={{ color: 'var(--gold-bright)' }}>◆</span>
                  <div>
                    <h4 className="font-semibold" style={{ color: 'var(--text-bright)' }}>Premium Quality</h4>
                    <p className="text-sm" style={{ color: 'var(--text-soft)' }}>Export-grade craftsmanship guaranteed</p>
                  </div>
                </div>
              </div>
              <Link 
                to="/about" 
                className="btn-secondary mt-8"
              >
                Learn More About Us
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 rounded-lg" style={{ background: 'rgba(27,158,155,0.1)', border: '1px solid rgba(37,204,200,0.12)' }}>
                <span className="text-3xl">🏛️</span>
                <h4 className="font-semibold mt-2" style={{ color: 'var(--text-bright)' }}>Temple Jewelry</h4>
                <p className="text-sm mt-1" style={{ color: 'var(--text-soft)' }}>Traditional designs</p>
              </div>
              <div className="p-6 rounded-lg" style={{ background: 'rgba(27,158,155,0.1)', border: '1px solid rgba(37,204,200,0.12)' }}>
                <span className="text-3xl">💎</span>
                <h4 className="font-semibold mt-2" style={{ color: 'var(--text-bright)' }}>Ethnic Fashion</h4>
                <p className="text-sm mt-1" style={{ color: 'var(--text-soft)' }}>Modern elegance</p>
              </div>
              <div className="p-6 rounded-lg" style={{ background: 'rgba(27,158,155,0.1)', border: '1px solid rgba(37,204,200,0.12)' }}>
                <span className="text-3xl">🏺</span>
                <h4 className="font-semibold mt-2" style={{ color: 'var(--text-bright)' }}>Artisan Décor</h4>
                <p className="text-sm mt-1" style={{ color: 'var(--text-soft)' }}>Handcrafted pieces</p>
              </div>
              <div className="p-6 rounded-lg" style={{ background: 'rgba(27,158,155,0.1)', border: '1px solid rgba(37,204,200,0.12)' }}>
                <span className="text-3xl">📦</span>
                <h4 className="font-semibold mt-2" style={{ color: 'var(--text-bright)' }}>Export Grade</h4>
                <p className="text-sm mt-1" style={{ color: 'var(--text-soft)' }}>Global standards</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
