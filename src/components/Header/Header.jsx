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
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Badge from '@mui/material/Badge';
import { useState } from 'react';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="w-full bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-white">
        <div className="container mx-auto px-4 py-2">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <LocalShippingIcon sx={{ fontSize: 16 }} />
                <span className="font-medium">🚚 FREE Shipping Islandwide | </span>
              </div>
              <div className="hidden md:flex items-center space-x-2">
                <PhoneIcon sx={{ fontSize: 16 }} />
                <span>📞 Hotline: +94 77 123 4567 | </span>
              </div>
              <div className="hidden lg:flex items-center space-x-1 animate-pulse">
                <span className="bg-yellow-500 text-black px-2 py-0.5 rounded text-xs font-bold">HOT</span>
                <span>Up to 70% OFF on Electronics</span>
              </div>
            </div>
            <div className="flex items-center space-x-4 mt-2 md:mt-0">
              <button className="hover:text-yellow-200 transition text-xs md:text-sm">Become a Seller</button>
              <span className="hidden md:inline text-gray-300">|</span>
              <button className="hidden md:inline hover:text-yellow-200 transition">Help Center</button>
              <span className="hidden lg:inline text-gray-300">|</span>
              <button className="hidden lg:inline hover:text-yellow-200 transition">Track Order</button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header - Professional Design */}
      <header className='w-full bg-gradient-to-r from-red-600 to-red-700 shadow-xl sticky top-0 z-50'>
        <div className="container mx-auto px-4">
          {/* First Row: Logo, Search, User Actions */}
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <div className="flex items-center">
              <button className="lg:hidden text-white mr-4">
                <MenuIcon sx={{ fontSize: 28 }} />
              </button>
              
              <div className="flex items-center cursor-pointer">
                <div className="bg-white rounded-lg p-2 shadow-lg">
                  <h1 className="text-2xl font-bold">
                    <span className="text-red-600">Lanka</span>
                    <span className="text-gray-800">Deal</span>
                    <span className="text-yellow-500 text-3xl">.</span>
                    <span className="text-red-600 font-extrabold">LK</span>
                  </h1>
                </div>
                <div className="hidden xl:block ml-4">
                  <p className="text-white text-sm font-light">Sri Lanka's #1 Online Marketplace</p>
                </div>
              </div>
            </div>

            {/* Search Bar - Large and Prominent */}
            <div className="hidden lg:flex flex-1 mx-8 max-w-3xl">
              <div className="w-full relative">
                <div className="flex items-center bg-white rounded-xl shadow-2xl px-4 py-3 border-2 border-red-500">
                  <div className="flex items-center border-r border-gray-300 pr-4">
                    <CategoryIcon sx={{ color: '#6b7280', fontSize: 22 }} />
                    <select className="bg-transparent outline-none ml-2 text-gray-700 font-medium cursor-pointer">
                      <option>All Categories</option>
                      <option>Electronics</option>
                      <option>Fashion</option>
                      <option>Home & Garden</option>
                      <option>Sports</option>
                      <option>Beauty</option>
                    </select>
                    <ExpandMoreIcon sx={{ color: '#6b7280', fontSize: 20 }} />
                  </div>
                  
                  <input
                    type="text"
                    placeholder="Search for products, brands, and more..."
                    className="flex-1 px-6 bg-transparent outline-none text-gray-800 placeholder-gray-500 text-base"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  
                  <button className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-3 rounded-lg hover:from-red-700 hover:to-red-800 transition-all shadow-lg flex items-center space-x-2">
                    <SearchIcon sx={{ fontSize: 22 }} />
                    <span className="font-bold">Search</span>
                  </button>
                </div>
                
                {/* Search Suggestions */}
                <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-2xl p-4 hidden group-hover:block z-50">
                  <div className="text-sm text-gray-600 mb-2">Popular Searches:</div>
                  <div className="flex flex-wrap gap-2">
                    {['Smartphone', 'Laptop', 'Headphones', 'Watch', 'Shoes', 'Dress', 'TV'].map((item, index) => (
                      <button key={index} className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-sm transition">
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-4">
              {/* Mobile Search */}
              <button className="lg:hidden text-white">
                <SearchIcon sx={{ fontSize: 24 }} />
              </button>

              {/* Desktop Actions */}
              <div className="hidden md:flex items-center space-x-6">
                {/* Account */}
                <button className="flex items-center space-x-2 text-white hover:text-yellow-200 transition group">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                    <PersonIcon sx={{ fontSize: 22, color: 'white' }} />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-sm">Hello, Sign in</div>
                    <div className="text-xs text-gray-200">Account & Lists</div>
                  </div>
                  <ExpandMoreIcon sx={{ fontSize: 18, color: 'white' }} />
                </button>

                {/* Orders */}
                <button className="flex items-center space-x-2 text-white hover:text-yellow-200 transition">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                      <LocalShippingIcon sx={{ fontSize: 22, color: 'white' }} />
                    </div>
                    <Badge badgeContent={2} color="error" sx={{
                      position: 'absolute',
                      top: -5,
                      right: -5,
                      '& .MuiBadge-badge': {
                        backgroundColor: '#f59e0b',
                        color: 'white',
                        fontWeight: 'bold'
                      }
                    }} />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-sm">Orders</div>
                    <div className="text-xs text-gray-200">Track & Return</div>
                  </div>
                </button>

                {/* Cart */}
                <button className="flex items-center space-x-2 text-white hover:text-yellow-200 transition group relative">
                  <div className="relative">
                    <Badge badgeContent={3} color="warning" sx={{
                      '& .MuiBadge-badge': {
                        backgroundColor: '#f59e0b',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '0.8rem'
                      }
                    }}>
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 flex items-center justify-center shadow-lg">
                        <ShoppingCartIcon sx={{ fontSize: 24, color: 'white' }} />
                      </div>
                    </Badge>
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-lg">$199.99</div>
                    <div className="text-xs text-gray-200">3 items</div>
                  </div>
                </button>
              </div>

              {/* Mobile Cart */}
              <button className="md:hidden relative">
                <Badge badgeContent={3} color="warning" sx={{
                  '& .MuiBadge-badge': {
                    backgroundColor: '#f59e0b',
                    color: 'white',
                    fontWeight: 'bold'
                  }
                }}>
                  <ShoppingCartIcon sx={{ fontSize: 28, color: 'white' }} />
                </Badge>
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="lg:hidden py-3 border-t border-red-500">
            <div className="flex items-center bg-white rounded-xl px-4 py-3 shadow-lg">
              <SearchIcon sx={{ color: '#6b7280', fontSize: 20, marginRight: 2 }} />
              <input
                type="text"
                placeholder="Search products..."
                className="flex-1 bg-transparent outline-none text-gray-800"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg ml-2">
                Go
              </button>
            </div>
          </div>

          {/* Navigation Bar */}
          <div className="hidden lg:flex items-center justify-between py-3 border-t border-red-500">
            {/* All Categories Button */}
            <button className="flex items-center space-x-3 bg-white text-red-600 px-6 py-3 rounded-lg hover:bg-gray-50 transition-all shadow-md group">
              <MenuIcon sx={{ fontSize: 24 }} />
              <span className="font-bold">All Categories</span>
              <ExpandMoreIcon sx={{ fontSize: 20 }} />
              
              {/* Categories Dropdown */}
              <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-2xl p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 border">
                {[
                  { icon: '📱', name: 'Electronics', count: '1.2K+' },
                  { icon: '👕', name: 'Fashion', count: '2.5K+' },
                  { icon: '🏠', name: 'Home & Garden', count: '850+' },
                  { icon: '💄', name: 'Beauty & Health', count: '620+' },
                  { icon: '⚽', name: 'Sports', count: '450+' },
                  { icon: '🎮', name: 'Toys & Games', count: '320+' },
                ].map((cat, index) => (
                  <a 
                    key={index} 
                    href="#" 
                    className="flex items-center justify-between py-3 px-2 hover:bg-red-50 rounded-lg transition group/item"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{cat.icon}</span>
                      <span className="font-medium text-gray-800 group-hover/item:text-red-600">{cat.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">{cat.count}</span>
                      <ArrowForwardIosIcon sx={{ fontSize: 14, color: '#9ca3af' }} />
                    </div>
                  </a>
                ))}
              </div>
            </button>

            {/* Navigation Links */}
            <div className="flex items-center space-x-8">
              <button className="flex items-center space-x-2 text-white hover:text-yellow-200 transition group">
                <FlashOnIcon sx={{ fontSize: 20 }} />
                <span className="font-bold">Flash Sales</span>
                <span className="bg-yellow-500 text-black text-xs px-2 py-0.5 rounded font-bold animate-pulse">
                  🔥 LIVE
                </span>
              </button>
              
              <button className="text-white hover:text-yellow-200 transition font-medium">
                Today's Deals
              </button>
              
              <button className="text-white hover:text-yellow-200 transition font-medium flex items-center space-x-1">
                <TrendingUpIcon sx={{ fontSize: 18 }} />
                <span>Trending</span>
              </button>
              
              <button className="text-white hover:text-yellow-200 transition font-medium">
                New Arrivals
              </button>
              
              <button className="text-white hover:text-yellow-200 transition font-medium">
                Brands
              </button>
              
              <button className="text-white hover:text-yellow-200 transition font-medium hidden xl:block">
                Clearance
              </button>
            </div>

            {/* Additional Features */}
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 text-white hover:text-yellow-200 transition">
                <StoreIcon sx={{ fontSize: 20 }} />
                <span className="font-medium">Sell on LankaDeal</span>
              </button>
              
              <div className="h-6 w-px bg-white/30"></div>
              
              <button className="flex items-center space-x-1 text-white hover:text-yellow-200 transition">
                <LanguageIcon sx={{ fontSize: 18 }} />
                <span>EN</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Promotional Banner */}
      <div className="w-full bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 text-black py-2 hidden lg:block">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center space-x-6">
            <div className="flex items-center space-x-2">
              <span className="font-bold">🎁</span>
              <span>Festival Sale: Extra 20% OFF</span>
            </div>
            <span className="text-gray-800">|</span>
            <div className="flex items-center space-x-2">
              <span className="font-bold">🚀</span>
              <span>Same Day Delivery in Colombo</span>
            </div>
            <span className="text-gray-800">|</span>
            <div className="flex items-center space-x-2">
              <span className="font-bold">💳</span>
              <span>EMI Available on All Products</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Header