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
import HomeIcon from '@mui/icons-material/Home';
import Badge from '@mui/material/Badge';
import { useState } from 'react';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white hidden md:block">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <LocalShippingIcon sx={{ fontSize: 16 }} />
                <span>Free Islandwide Delivery</span>
              </div>
              <div className="flex items-center space-x-2">
                <PhoneIcon sx={{ fontSize: 16 }} />
                <span>Support: +94 77 123 4567</span>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <button className="hover:text-yellow-200 transition">Track Order</button>
              <button className="hover:text-yellow-200 transition">Daily Deals</button>
              <div className="flex items-center space-x-2">
                <LanguageIcon sx={{ fontSize: 16 }} />
                <select className="bg-transparent outline-none cursor-pointer">
                  <option>English</option>
                  <option>Sinhala</option>
                  <option>Tamil</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className='w-full bg-white shadow-md fixed top-0 left-0 right-0 z-50'>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            {/* Left Section: Logo & Menu */}
            <div className="flex items-center space-x-4">
              {/* Mobile Menu Button */}
              <button className="md:hidden text-gray-700">
                <MenuIcon sx={{ fontSize: 28 }} />
              </button>

              {/* Logo */}
              <div className="flex items-center cursor-pointer">
                <div className="relative">
                  <h1 className="text-2xl font-bold">
                    <span className="text-red-600">Lanka</span>
                    <span className="text-gray-800">Deal</span>
                    <span className="text-yellow-500 text-3xl">.</span>
                    <span className="text-red-600 font-extrabold">LK</span>
                  </h1>
                </div>
              </div>

              {/* Desktop Categories */}
              <div className="hidden lg:flex items-center space-x-6 ml-8">
                <button className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">
                  <CategoryIcon sx={{ fontSize: 20 }} />
                  <span className="font-medium">Categories</span>
                </button>
                <button className="text-gray-700 hover:text-red-600 transition font-medium">Today's Deals</button>
                <button className="text-gray-700 hover:text-red-600 transition font-medium">New Arrivals</button>
              </div>
            </div>

            {/* Center: Search Bar */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <div className="w-full relative">
                <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 hover:bg-gray-200 transition focus-within:bg-white focus-within:ring-2 focus-within:ring-red-500">
                  <SearchIcon sx={{ color: '#6b7280', fontSize: 20, marginRight: 2 }} />
                  <input
                    type="text"
                    placeholder="Search for products, brands, and categories..."
                    className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition ml-2">
                    Search
                  </button>
                </div>
              </div>
            </div>

            {/* Right Section: User Actions */}
            <div className="flex items-center space-x-4 md:space-x-6">
              {/* Wishlist */}
              <button className="hidden md:flex flex-col items-center text-gray-700 hover:text-red-600 transition relative">
                <Badge badgeContent={5} color="error">
                  <FavoriteBorderIcon sx={{ fontSize: 24 }} />
                </Badge>
                <span className="text-xs mt-1 font-medium hidden lg:block">Wishlist</span>
              </button>

              {/* Notifications */}
              <button className="hidden md:flex flex-col items-center text-gray-700 hover:text-red-600 transition relative">
                <Badge badgeContent={3} color="error">
                  <NotificationsNoneIcon sx={{ fontSize: 24 }} />
                </Badge>
                <span className="text-xs mt-1 font-medium hidden lg:block">Notifications</span>
              </button>

              {/* Account */}
              <button className="flex flex-col items-center text-gray-700 hover:text-red-600 transition relative group">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <PersonIcon sx={{ fontSize: 20 }} />
                </div>
                <div className="hidden lg:flex flex-col items-center">
                  <span className="text-xs mt-1 font-medium">Hello, Sign in</span>
                  <span className="text-xs text-gray-500">Account</span>
                </div>
              </button>

              {/* Cart */}
              <button className="relative group">
                <div className="flex items-center">
                  <Badge badgeContent={3} color="warning" sx={{
                    '& .MuiBadge-badge': {
                      backgroundColor: '#f59e0b',
                      color: 'white',
                      fontWeight: 'bold'
                    }
                  }}>
                    <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center">
                      <ShoppingCartIcon sx={{ fontSize: 22, color: 'white' }} />
                    </div>
                  </Badge>
                  <div className="hidden lg:block ml-2">
                    <div className="text-sm font-bold text-gray-800">$199.99</div>
                    <div className="text-xs text-gray-500">3 items</div>
                  </div>
                </div>
              </button>
            </div>

            {/* Mobile Search Button */}
            <button className="md:hidden text-gray-700">
              <SearchIcon sx={{ fontSize: 24 }} />
            </button>
          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden py-3 border-t">
            <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
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

          {/* Quick Categories */}
          <div className="hidden md:flex items-center justify-between py-3 border-t">
            <div className="flex items-center space-x-6">
              <button className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition">
                <FlashOnIcon sx={{ fontSize: 18 }} />
                <span className="font-medium">Flash Sales</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition">
                <TrendingUpIcon sx={{ fontSize: 18 }} />
                <span className="font-medium">Trending</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition">
                <StoreIcon sx={{ fontSize: 18 }} />
                <span className="font-medium">Brand Stores</span>
              </button>
            </div>
            <button className="text-red-600 font-medium hover:text-red-700 transition">
              🎉 Up to 70% OFF
            </button>
          </div>
        </div>
      </header>
    </>
  )
}

export default Header