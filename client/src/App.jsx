import { useState } from 'react'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-red-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">TetHealthGift</h1>
          <p className="text-red-100 mt-1">Premium Health Gift Baskets for Tet Holiday</p>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-50 to-yellow-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome the Lunar New Year with Health & Wellness
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Curated gift baskets filled with nutritious and delicious treats
          </p>
          <button className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition">
            Shop Now
          </button>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Featured Categories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Organic Fruits</h3>
            <p className="text-gray-600">Fresh, organic fruits perfect for gifting</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Nuts & Seeds</h3>
            <p className="text-gray-600">Premium quality nuts and healthy seeds</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Wellness Baskets</h3>
            <p className="text-gray-600">Complete wellness gift sets</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-12">
        <div className="container mx-auto px-4 py-6 text-center">
          <p>&copy; 2026 TetHealthGift. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
