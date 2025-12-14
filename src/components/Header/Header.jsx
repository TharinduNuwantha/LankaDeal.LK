// myapp\src\components\Header\Header.jsx
import '../../styles/tailwind.css'
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PhoneIcon from '@mui/icons-material/Phone';
import LanguageIcon from '@mui/icons-material/Language';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import CategoryIcon from '@mui/icons-material/Category';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import StoreIcon from '@mui/icons-material/Store';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Badge from '@mui/material/Badge';
import { useState } from 'react';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="w-full bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white">
        <div className="container mx-auto px-4 py-2">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm space-y-1 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-red-800 px-3 py-1 rounded-full">
                <LocalShippingIcon sx={{ fontSize: 14 }} />
                <span className="font-medium">🚚 Free Shipping on Orders Over $50</span>
              </div>
              <div className="hidden lg:flex items-center space-x-2">
                <PhoneIcon sx={{ fontSize: 14 }} />
                <span>📞 Hotline: +94 77 123 4567</span>
              </div>
            </div>
            <div className="flex items-center space-x-4 md:space-x-6">
              <button className="flex items-center space-x-1 hover:text-yellow-200 transition">
                <LocationOnIcon sx={{ fontSize: 14 }} />
                <span>Track Order</span>
              </button>
              <span className="hidden md:inline text-gray-300">|</span>
              <button className="hidden md:inline hover:text-yellow-200 transition">Help Center</button>
              <span className="hidden lg:inline text-gray-300">|</span>
              <div className="flex items-center space-x-1">
                <LanguageIcon sx={{ fontSize: 14 }} />
                <select className="bg-transparent outline-none cursor-pointer">
                  <option>🇱🇰 English</option>
                  <option>🇱🇰 Sinhala</option>
                  <option>🇱🇰 Tamil</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header with Gradient Background */}
      <header className='w-full bg-gradient-to-r from-white via-red-50 to-white border-b shadow-lg fixed top-0 left-0 right-0 z-50'>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            {/* Left Section: Logo & Menu */}
            <div className="flex items-center space-x-4">
              {/* Mobile Menu Button */}
              <button className="lg:hidden text-gray-700 hover:text-red-600 transition">
                <MenuIcon sx={{ fontSize: 28 }} />
              </button>

              {/* Logo with Background */}
              <div className="flex items-center cursor-pointer">
                <div className="relative bg-gradient-to-r from-red-600 to-red-800 rounded-xl px-4 py-2 shadow-lg">
                  <h1 className="text-2xl font-bold tracking-tight">
                    <span className="text-white">Lanka</span>
                    <span className="text-yellow-300">Deal</span>
                    <span className="text-white text-3xl ml-1">.</span>
                    <span className="text-yellow-300 font-extrabold">LK</span>
                  </h1>
                </div>
              </div>

              {/* Desktop Categories Dropdown */}
              <div className="hidden lg:flex items-center ml-6">
                <button className="flex items-center space-x-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-5 py-3 rounded-xl hover:from-red-700 hover:to-red-800 transition-all shadow-md hover:shadow-lg group">
                  <CategoryIcon sx={{ fontSize: 20 }} />
                  <span className="font-bold">Browse Categories</span>
                  <ExpandMoreIcon sx={{ fontSize: 20 }} />
                  
                  {/* Mega Menu */}
                  <div className="absolute top-full left-0 mt-2 w-full bg-white shadow-2xl rounded-xl p-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 border">
                    <div className="grid grid-cols-4 gap-6">
                      <div>
                        <div className="font-bold text-gray-800 mb-4 flex items-center">
                          <div className="w-3 h-8 bg-red-600 rounded-full mr-3"></div>
                          Electronics
                        </div>
                        <div className="space-y-3 text-sm">
                          <a href="#" className="block text-gray-600 hover:text-red-600 hover:font-medium">📱 Smartphones</a>
                          <a href="#" className="block text-gray-600 hover:text-red-600 hover:font-medium">💻 Laptops</a>
                          <a href="#" className="block text-gray-600 hover:text-red-600 hover:font-medium">📺 Televisions</a>
                          <a href="#" className="block text-gray-600 hover:text-red-600 hover:font-medium">🎧 Audio Devices</a>
                        </div>
                      </div>
                      <div>
                        <div className="font-bold text-gray-800 mb-4 flex items-center">
                          <div className="w-3 h-8 bg-blue-600 rounded-full mr-3"></div>
                          Fashion
                        </div>
                        <div className="space-y-3 text-sm">
                          <a href="#" className="block text-gray-600 hover:text-red-600 hover:font-medium">👕 Men's Clothing</a>
                          <a href="#" className="block text-gray-600 hover:text-red-600 hover:font-medium">👗 Women's Fashion</a>
                          <a href="#" className="block text-gray-600 hover:text-red-600 hover:font-medium">👟 Shoes & Footwear</a>
                          <a href="#" className="block text-gray-600 hover:text-red-600 hover:font-medium">💍 Jewelry & Watches</a>
                        </div>
                      </div>
                      <div>
                        <div className="font-bold text-gray-800 mb-4 flex items-center">
                          <div className="w-3 h-8 bg-green-600 rounded-full mr-3"></div>
                          Home & Garden
                        </div>
                        <div className="space-y-3 text-sm">
                          <a href="#" className="block text-gray-600 hover:text-red-600 hover:font-medium">🛋️ Furniture</a>
                          <a href="#" className="block text-gray-600 hover:text-red-600 hover:font-medium">🍳 Kitchenware</a>
                          <a href="#" className="block text-gray-600 hover:text-red-600 hover:font-medium">🌿 Home Decor</a>
                          <a href="#" className="block text-gray-600 hover:text-red-600 hover:font-medium">🛏️ Bedding</a>
                        </div>
                      </div>
                      <div>
                        <div className="font-bold text-gray-800 mb-4 flex items-center">
                          <div className="w-3 h-8 bg-purple-600 rounded-full mr-3"></div>
                          Special Offers
                        </div>
                        <div className="space-y-3 text-sm">
                          <a href="#" className="block text-red-600 font-bold hover:text-red-700">🔥 Flash Sales</a>
                          <a href="#" className="block text-gray-600 hover:text-red-600 hover:font-medium">🎯 Today's Deals</a>
                          <a href="#" className="block text-gray-600 hover:text-red-600 hover:font-medium">⭐ Top Rated</a>
                          <a href="#" className="block text-gray-600 hover:text-red-600 hover:font-medium">🆕 New Arrivals</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Center: Search Bar */}
            <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
              <div className="w-full relative">
                <div className="flex items-center bg-white rounded-full px-4 py-3 shadow-lg border border-gray-200 hover:border-red-300 transition-all focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-200">
                  <SearchIcon sx={{ color: '#9ca3af', fontSize: 22, marginRight: 3 }} />
                  <input
                    type="text"
                    placeholder="What are you looking for today? Try 'smartphone' or 'laptop'..."
                    className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-500 text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-2 rounded-full hover:from-red-700 hover:to-red-800 transition-all shadow-md hover:shadow-lg ml-4 font-medium">
                    Search
                  </button>
                </div>
              </div>
            </div>

            {/* Right Section: User Actions */}
            <div className="flex items-center space-x-4 md:space-x-6">
              {/* Desktop Navigation Links */}
              <div className="hidden lg:flex items-center space-x-6">
                <button className="text-gray-700 hover:text-red-600 transition font-medium flex items-center space-x-2 group">
                  <FlashOnIcon sx={{ fontSize: 20 }} />
                  <span>Flash Sales</span>
                  <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full animate-pulse">HOT</span>
                </button>
                <button className="text-gray-700 hover:text-red-600 transition font-medium">Today's Deals</button>
              </div>

              {/* User Actions Icons */}
              <div className="flex items-center space-x-4">
                {/* Wishlist */}
                <button className="hidden md:flex flex-col items-center text-gray-700 hover:text-red-600 transition relative group">
                  <Badge badgeContent={5} color="error" sx={{
                    '& .MuiBadge-badge': {
                      backgroundColor: '#ef4444',
                      color: 'white',
                      fontSize: '0.7rem'
                    }
                  }}>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-50 to-red-100 flex items-center justify-center shadow-sm">
                      <FavoriteBorderIcon sx={{ fontSize: 22 }} />
                    </div>
                  </Badge>
                  <span className="text-xs mt-1 font-medium hidden xl:block">Wishlist</span>
                </button>

                {/* Notifications */}
                <button className="hidden lg:flex flex-col items-center text-gray-700 hover:text-red-600 transition relative group">
                  <Badge badgeContent={3} color="error">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-50 to-blue-100 flex items-center justify-center shadow-sm">
                      <NotificationsNoneIcon sx={{ fontSize: 22 }} />
                    </div>
                  </Badge>
                  <span className="text-xs mt-1 font-medium hidden xl:block">Alerts</span>
                </button>

                {/* Account */}
                <button className="flex flex-col items-center text-gray-700 hover:text-red-600 transition relative group">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-600 to-red-700 flex items-center justify-center shadow-md">
                    <PersonIcon sx={{ fontSize: 22, color: 'white' }} />
                  </div>
                  <div className="hidden xl:flex flex-col items-center">
                    <span className="text-xs mt-1 font-medium">Hello, Sign in</span>
                    <span className="text-xs text-gray-500">My Account</span>
                  </div>
                </button>

                {/* Cart */}
                <button className="relative group">
                  <div className="flex items-center">
                    <Badge badgeContent={3} color="warning" sx={{
                      '& .MuiBadge-badge': {
                        backgroundColor: '#f59e0b',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '0.8rem'
                      }
                    }}>
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-600 to-red-700 flex items-center justify-center shadow-lg hover:shadow-xl transition-all">
                        <ShoppingCartIcon sx={{ fontSize: 24, color: 'white' }} />
                      </div>
                    </Badge>
                    <div className="hidden lg:block ml-3">
                      <div className="text-lg font-bold text-gray-800">$199.99</div>
                      <div className="text-xs text-gray-500">3 items in cart</div>
                    </div>
                  </div>
                </button>
              </div>

              {/* Mobile Search Button */}
              <button className="lg:hidden text-gray-700 hover:text-red-600 transition">
                <SearchIcon sx={{ fontSize: 24 }} />
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="lg:hidden py-3 border-t border-gray-100">
            <div className="flex items-center bg-white rounded-full px-4 py-2 shadow border border-gray-200">
              <SearchIcon sx={{ color: '#6b7280', fontSize: 20, marginRight: 2 }} />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full bg-transparent outline-none text-gray-800"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Quick Access Bar */}
          <div className="hidden lg:flex items-center justify-between py-3 border-t border-gray-100 bg-gradient-to-r from-white to-gray-50 rounded-b-xl">
            <div className="flex items-center space-x-8">
              <button className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition font-medium group">
                <TrendingUpIcon sx={{ fontSize: 18 }} />
                <span>Trending Now</span>
                <div className="w-2 h-2 bg-red-600 rounded-full group-hover:animate-pulse"></div>
              </button>
              <button className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition font-medium">
                <StoreIcon sx={{ fontSize: 18 }} />
                <span>Brand Stores</span>
              </button>
              <button className="text-gray-700 hover:text-red-600 transition font-medium">New Arrivals</button>
              <button className="text-gray-700 hover:text-red-600 transition font-medium">Clearance Sale</button>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-yellow-100 to-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-2 rounded-full text-sm font-medium">
                ⚡ <span className="font-bold">UP TO 70% OFF</span> - Limited Time!
              </div>
              <button className="text-red-600 hover:text-red-700 transition font-medium">
                Become a Seller →
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}

export default Header