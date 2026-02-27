import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Home = () => {
  const { featuredProducts } = useSelector(state => state.products)

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-950 to-teal-900">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-serif text-yellow-400 mb-6 animate-pulse">
            Global Exim Traders
          </h1>
          <p className="text-xl md:text-2xl text-teal-200 mb-8 font-light">
            Where Heritage Meets Global Elegance
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/products" 
              className="bg-yellow-500 hover:bg-yellow-400 text-black px-8 py-3 rounded-full font-semibold transition-all transform hover:scale-105"
            >
              Explore Collections
            </Link>
            <Link 
              to="/about" 
              className="border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black px-8 py-3 rounded-full font-semibold transition-all"
            >
              Our Story
            </Link>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="text-yellow-400 text-3xl">↓</div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-yellow-400 text-sm uppercase tracking-wider">Featured Collections</span>
            <h2 className="text-4xl md:text-5xl font-serif text-white mt-2 mb-4">
              Exquisite Indian Heritage
            </h2>
            <div className="w-24 h-1 bg-yellow-400 mx-auto mb-6"></div>
            <p className="text-teal-200 max-w-2xl mx-auto">
              Discover our curated selection of premium jewelry and handicrafts that showcase India's rich artistic heritage
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <div key={product.id} className="bg-teal-800/30 backdrop-blur-sm border border-teal-600/30 rounded-lg overflow-hidden hover:border-yellow-400/50 transition-all">
                <div className="h-64 bg-gradient-to-br from-teal-700 to-teal-800 flex items-center justify-center">
                  <span className="text-6xl">{product.icon}</span>
                </div>
                <div className="p-6">
                  <span className="text-yellow-400 text-sm">{product.category}</span>
                  <h3 className="text-xl font-serif text-white mt-2 mb-3">{product.name}</h3>
                  <p className="text-teal-200 text-sm mb-4">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl text-yellow-400 font-bold">${product.price}</span>
                    <Link 
                      to={`/product/${product.id}`}
                      className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-full text-sm font-semibold transition-all"
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
      <section className="py-20 px-4 bg-black/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-yellow-400 text-sm uppercase tracking-wider">Our Excellence</span>
              <h2 className="text-4xl font-serif text-white mt-2 mb-6">
                Certified & Trusted Exporter
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <span className="text-yellow-400 text-xl">◆</span>
                  <div>
                    <h4 className="text-white font-semibold">GSTIN Registered</h4>
                    <p className="text-teal-200 text-sm">Fully compliant with all tax regulations</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-yellow-400 text-xl">◆</span>
                  <div>
                    <h4 className="text-white font-semibold">IEC Code Holder</h4>
                    <p className="text-teal-200 text-sm">Authorized for international trade</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-yellow-400 text-xl">◆</span>
                  <div>
                    <h4 className="text-white font-semibold">Premium Quality</h4>
                    <p className="text-teal-200 text-sm">Export-grade craftsmanship guaranteed</p>
                  </div>
                </div>
              </div>
              <Link 
                to="/about" 
                className="inline-block mt-8 border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black px-6 py-3 rounded-full font-semibold transition-all"
              >
                Learn More About Us
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-teal-800/30 p-6 rounded-lg border border-teal-600/30">
                <span className="text-3xl">🏛️</span>
                <h4 className="text-white font-semibold mt-2">Temple Jewelry</h4>
                <p className="text-teal-200 text-sm mt-1">Traditional designs</p>
              </div>
              <div className="bg-teal-800/30 p-6 rounded-lg border border-teal-600/30">
                <span className="text-3xl">💎</span>
                <h4 className="text-white font-semibold mt-2">Ethnic Fashion</h4>
                <p className="text-teal-200 text-sm mt-1">Modern elegance</p>
              </div>
              <div className="bg-teal-800/30 p-6 rounded-lg border border-teal-600/30">
                <span className="text-3xl">🏺</span>
                <h4 className="text-white font-semibold mt-2">Artisan Décor</h4>
                <p className="text-teal-200 text-sm mt-1">Handcrafted pieces</p>
              </div>
              <div className="bg-teal-800/30 p-6 rounded-lg border border-teal-600/30">
                <span className="text-3xl">📦</span>
                <h4 className="text-white font-semibold mt-2">Export Grade</h4>
                <p className="text-teal-200 text-sm mt-1">Global standards</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
