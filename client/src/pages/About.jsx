import React from 'react'

const About = () => {
  return (
    <div className="min-h-screen py-20 px-4 bg-black/60">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-yellow-400 text-sm uppercase tracking-wider">Our Story</span>
          <h1 className="text-4xl md:text-5xl font-serif text-white mt-2 mb-4">
            India's Heritage, <span className="italic">Delivered Globally</span>
          </h1>
          <div className="w-24 h-1 bg-yellow-400 mx-auto mb-6"></div>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <p className="text-teal-200 text-lg leading-relaxed mb-6">
              GLOBAL EXIM TRADERS is a registered export-import enterprise committed to delivering premium Indian handicrafts and fashion jewellery across global marketplaces.
            </p>
            <p className="text-teal-200 text-lg leading-relaxed mb-6">
              Available on Amazon, Flipkart, Meesho, and Etsy, we operate with complete transparency, legal compliance, and international trade standards.
            </p>
            <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-6 mb-6">
              <p className="text-yellow-400 text-xl font-serif italic text-center">
                "We don't just sell products —<br/>We export heritage."
              </p>
            </div>
            <p className="text-teal-200 text-lg leading-relaxed">
              With full statutory certifications and a commitment to quality, every transaction reflects our dedication to excellence and trust.
            </p>
          </div>
          <div className="bg-teal-800/30 backdrop-blur-sm border border-teal-600/30 rounded-lg p-8">
            <h3 className="text-2xl font-serif text-yellow-400 mb-6 text-center">
              Certified | Compliant | Committed
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start space-x-2">
                <span className="text-yellow-400 mt-1">◆</span>
                <span className="text-teal-200 text-sm">GSTIN Registered</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-yellow-400 mt-1">◆</span>
                <span className="text-teal-200 text-sm">IEC Code Holder</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-yellow-400 mt-1">◆</span>
                <span className="text-teal-200 text-sm">EPCH Associated</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-yellow-400 mt-1">◆</span>
                <span className="text-teal-200 text-sm">IIFJAS & IHGF</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-yellow-400 mt-1">◆</span>
                <span className="text-teal-200 text-sm">Proprietorship Firm</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-yellow-400 mt-1">◆</span>
                <span className="text-teal-200 text-sm">Port & Shipment</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-yellow-400 mt-1">◆</span>
                <span className="text-teal-200 text-sm">GST Compliant Billing</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-yellow-400 mt-1">◆</span>
                <span className="text-teal-200 text-sm">Export Documentation</span>
              </div>
            </div>
            <p className="text-yellow-400 text-center mt-6 text-sm">
              ◆ Your trust is our capital. ◆
            </p>
          </div>
        </div>

        {/* Collections Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <span className="text-yellow-400 text-sm uppercase tracking-wider">What We Offer</span>
            <h2 className="text-4xl font-serif text-white mt-2 mb-4">Our Collections</h2>
            <div className="w-24 h-1 bg-yellow-400 mx-auto mb-6"></div>
            <p className="text-teal-200 max-w-2xl mx-auto">
              Premium Luxury Quality · Detailed Craftsmanship · Elegant Finish · Global Aesthetic
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-teal-800/30 border border-teal-600/30 rounded-lg p-6 text-center hover:border-yellow-400/50 transition-all">
              <span className="text-4xl mb-4 block">✨</span>
              <h3 className="text-xl font-serif text-white mb-3">Temple Heritage Jewellery</h3>
              <p className="text-teal-200 text-sm">Temple-inspired pieces rooted in centuries of artisan tradition</p>
            </div>
            <div className="bg-teal-800/30 border border-teal-600/30 rounded-lg p-6 text-center hover:border-yellow-400/50 transition-all">
              <span className="text-4xl mb-4 block">💫</span>
              <h3 className="text-xl font-serif text-white mb-3">Contemporary Ethnic Fashion</h3>
              <p className="text-teal-200 text-sm">Modern silhouettes carrying the soul of traditional craft</p>
            </div>
            <div className="bg-teal-800/30 border border-teal-600/30 rounded-lg p-6 text-center hover:border-yellow-400/50 transition-all">
              <span className="text-4xl mb-4 block">🏺</span>
              <h3 className="text-xl font-serif text-white mb-3">Handcrafted Artisan Décor</h3>
              <p className="text-teal-200 text-sm">Exclusive home décor embodying India's artistic heritage</p>
            </div>
            <div className="bg-teal-800/30 border border-teal-600/30 rounded-lg p-6 text-center hover:border-yellow-400/50 transition-all">
              <span className="text-4xl mb-4 block">📦</span>
              <h3 className="text-xl font-serif text-white mb-3">Export-Grade Handicrafts</h3>
              <p className="text-teal-200 text-sm">Certified collections ready for global retail and wholesale</p>
            </div>
          </div>
        </section>

        {/* Quality Commitment */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <span className="text-yellow-400 text-sm uppercase tracking-wider">Our Commitment</span>
            <h2 className="text-4xl font-serif text-white mt-2 mb-4">Certified & Fully Compliant</h2>
            <div className="w-24 h-1 bg-yellow-400 mx-auto mb-6"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-yellow-400/20 border-2 border-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🏆</span>
              </div>
              <h3 className="text-xl font-serif text-white mb-3">Premium Quality</h3>
              <p className="text-teal-200 text-sm">Every piece meets international quality standards and export requirements</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-yellow-400/20 border-2 border-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📋</span>
              </div>
              <h3 className="text-xl font-serif text-white mb-3">Legal Compliance</h3>
              <p className="text-teal-200 text-sm">Fully registered and compliant with all export-import regulations</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-yellow-400/20 border-2 border-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🌍</span>
              </div>
              <h3 className="text-xl font-serif text-white mb-3">Global Reach</h3>
              <p className="text-teal-200 text-sm">Serving customers worldwide through trusted marketplaces</p>
            </div>
          </div>
        </section>

        {/* Marketplaces */}
        <section className="text-center">
          <span className="text-yellow-400 text-sm uppercase tracking-wider">Available On</span>
          <h2 className="text-3xl font-serif text-white mt-2 mb-8">Trusted Marketplaces</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="bg-teal-800/30 border border-teal-600/30 rounded-lg px-6 py-3 hover:border-yellow-400/50 transition-all">
              <span className="text-yellow-400 font-semibold">Amazon</span>
            </div>
            <div className="bg-teal-800/30 border border-teal-600/30 rounded-lg px-6 py-3 hover:border-yellow-400/50 transition-all">
              <span className="text-yellow-400 font-semibold">Flipkart</span>
            </div>
            <div className="bg-teal-800/30 border border-teal-600/30 rounded-lg px-6 py-3 hover:border-yellow-400/50 transition-all">
              <span className="text-yellow-400 font-semibold">Meesho</span>
            </div>
            <div className="bg-teal-800/30 border border-teal-600/30 rounded-lg px-6 py-3 hover:border-yellow-400/50 transition-all">
              <span className="text-yellow-400 font-semibold">Etsy</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default About
