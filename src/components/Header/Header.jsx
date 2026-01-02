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
import HomeIcon from '@mui/icons-material/Home';
import Badge from '@mui/material/Badge';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { userSelecter } from '../../Store/ReduxSlice/userClise';

 
const Header = ({paymentModelRef}) => {
    const userData = useSelector(userSelecter)
  const cart = useSelector(
  (state) => state.user.user.cart
);
const cartLength = cart?.length ? cart.length : 0;
const totalAmount = cart.reduce((total, item) => {
    return total + (Number(item.price) * item.quantity);
  }, 0);

  const CartPrice = totalAmount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });


const orderDataCount = userData?.orderData?.length ? userData.orderData.length : 0;

  const [searchQuery, setSearchQuery] = useState('');
   const navigate = useNavigate();
  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      // Redirect to /search with query parameter
      navigate(`/search?=${encodeURIComponent(searchQuery)}`);
    }
  };
  return (
    <>
      {/* Top Announcement Bar */}
      <div className="w-full bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-white">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4 overflow-hidden">
              <div className="flex items-center space-x-2 whitespace-nowrap">
                <LocalShippingIcon sx={{ fontSize: 14 }} />
                <span className="font-medium hidden xs:inline">FREE Shipping Islandwide</span>
              </div>
              <span className="hidden md:inline text-gray-300">|</span>
              <div className="hidden md:flex items-center space-x-2">
                <PhoneIcon sx={{ fontSize: 14 }} />
                <span>Hotline: +94 77 123 4567</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="hidden lg:inline hover:text-yellow-200 transition">Become a Seller</button>
              <span className="hidden lg:inline text-gray-300">|</span>
              <button className="hidden xl:inline hover:text-yellow-200 transition">Help Center</button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className='w-full bg-gradient-to-r from-red-600 to-red-700 shadow-xl sticky top-0 z-50'>
        <div className="container mx-auto px-3 sm:px-4">
          {/* First Row: Logo, Search, User Actions */}
          <div className="flex items-center justify-between py-3">
            {/* Logo & Mobile Menu */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button className="lg:hidden text-white">
                <MenuIcon sx={{ fontSize: 28 }} />
              </button>
                 <Link to={'/'}>
              <div className="flex items-center cursor-pointer">
             
                <div className="bg-white rounded-lg p-2 shadow-lg">
                  <h1 className="text-xl sm:text-2xl font-bold">
                    <span className="text-red-600">Lanka</span>
                    <span className="text-gray-800">Deal</span>
                    <span className="text-yellow-500 text-2xl sm:text-3xl">.</span>
                    <span className="text-red-600 font-extrabold">LK</span>
                  </h1>
                </div>
                <div className="hidden xl:block ml-3">
                  <p className="text-white text-xs font-light">Sri Lanka's #1 Online Marketplace</p>
                </div>
         
              </div>       </Link>
            </div>

            {/* Desktop Search Bar */}
            <div className="hidden lg:flex flex-1 mx-4 xl:mx-8 max-w-2xl 2xl:max-w-3xl">
              <div className="w-full relative group">
                <div className="flex items-center bg-white rounded-xl shadow-2xl px-3 xl:px-4 py-2 xl:py-3 border-2 border-red-500">
                  <div className="hidden xl:flex items-center border-r border-gray-300 pr-3 xl:pr-4">
                    <CategoryIcon sx={{ color: '#6b7280', fontSize: 20 }} />
                    <select className="bg-transparent outline-none ml-1 xl:ml-2 text-gray-700 font-medium cursor-pointer text-sm xl:text-base">
                      <option>All Categories</option>
                      <option>Electronics</option>
                      <option>Fashion</option>
                      <option>Home & Garden</option>
                    </select>
                    <ExpandMoreIcon sx={{ color: '#6b7280', fontSize: 18 }} />
                  </div>
                  
                  <input
                    type="text"
                    placeholder="Search for products..."
                    className="flex-1 px-3 xl:px-4 bg-transparent outline-none text-gray-800 placeholder-gray-500 text-sm xl:text-base"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  
                  <button className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 xl:px-6 py-2 xl:py-3 rounded-lg hover:from-red-700 hover:to-red-800 transition-all shadow-lg"
                   onClick={handleSearch}
                  >
                    <SearchIcon sx={{ fontSize: 20 }} />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Actions - RESPONSIVE FIXES */}
            <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
              {/* Mobile Search Button */}
              <button className="lg:hidden text-white">
                <SearchIcon sx={{ fontSize: 24 }} />
              </button>

              {/* Desktop Actions - Show differently at different breakpoints */}
              <div className="hidden md:flex items-center space-x-3 lg:space-x-4 xl:space-x-6">
                {/* Account - Show only icon on md, full on lg+ */}
                <Link to={'profile'}>
                <button className="flex items-center text-white hover:text-yellow-200 transition group">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 xl:w-10 xl:h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                    <PersonIcon sx={{ fontSize: 20, color: 'white' }} />
                  </div>
                  <div className="hidden xl:block ml-2 text-left">
                    <div className="font-bold text-sm">Hello, {userData.name === 'no-user'?<Link to={'/login'} className="text-white/90 hover:text-white hover:underline underline-offset-4 transition-all">Sign in</Link>:userData.name.split(" ")[0]}</div>
                    <div className="text-xs text-gray-200"></div>
                  </div>
                </button></Link>

                {/* Orders - Show only on xl+ */} 
                <Link to={'Orders'}>
                <button className="hidden xl:flex items-center space-x-2 text-white hover:text-yellow-200 transition">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                      <LocalShippingIcon sx={{ fontSize: 20, color: 'white' }} />
                    </div>
                    <Badge badgeContent={orderDataCount} color="error" sx={{
                      position: 'absolute',
                      top: -5,
                      right: -5,
                      '& .MuiBadge-badge': {
                        backgroundColor: '#f59e0b',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '0.7rem'
                      }
                    }} />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-sm">Orders</div>
                    <div className="text-xs text-gray-200">Track & Return</div>
                  </div>
                </button>
                </Link>

                {/* Cart - FIXED TO BE VISIBLE AT ALL SIZES */}
                <button className="flex items-center space-x-1 xl:space-x-2 text-white hover:text-yellow-200 transition group relative">
                  <div className="relative">
                    <Badge 
                      badgeContent={cartLength} 
                      color="warning"
                      sx={{
                        '& .MuiBadge-badge': {
                          backgroundColor: '#f59e0b',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '0.7rem',
                          minWidth: '18px',
                          height: '18px'
                        }
                      }}
                    >
                      <div className="w-10 h-10 xl:w-12 xl:h-12 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 flex items-center justify-center shadow-lg" 
                        
                      >
                        <ShoppingCartIcon sx={{ fontSize: 22, color: 'white' }} onClick={()=>paymentModelRef.current.handleOpen()}/>

                      </div>
                    </Badge>
                  </div>
                  {/* Show price on lg+, show items count on xl+ */}
                  <div className="hidden lg:block text-left">
                    <div className="font-bold text-sm xl:text-base">Rs.{CartPrice}</div>
                    <div className="hidden xl:block text-xs text-gray-200">{cartLength} items</div>
                  </div>
                </button>

                {/* Wishlist - Show only on xl+ */}
                <button className="hidden xl:flex flex-col items-center text-white hover:text-yellow-200 transition relative">
                  <Badge badgeContent={cartLength} color="error" sx={{
                    '& .MuiBadge-badge': {
                      backgroundColor: '#ef4444',
                      color: 'white',
                      fontSize: '0.7rem'
                    }
                  }}>
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                      <FavoriteBorderIcon sx={{ fontSize: 20, color: 'white' }} />
                    </div>
                  </Badge>
                  <span className="text-xs mt-1 font-medium">Wishlist</span>
                </button>
              </div>

              {/* Mobile Cart Button */}
              <button className="md:hidden relative">
                <Badge 
                  badgeContent={cartLength} 
                  color="warning"
                  sx={{
                    '& .MuiBadge-badge': {
                      backgroundColor: '#f59e0b',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '0.7rem',
                      minWidth: '18px',
                      height: '18px'
                    }
                  }}
                >
                  <ShoppingCartIcon sx={{ fontSize: 28, color: 'white' }} onClick={()=>paymentModelRef.current.handleOpen()}/>
                </Badge>
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="lg:hidden py-2 border-t border-red-500">
            <div className="flex items-center bg-white rounded-xl px-3 py-2 shadow-lg">
              <SearchIcon sx={{ color: '#6b7280', fontSize: 20, marginRight: 2 }} />
              <input
                type="text"
                placeholder="Search products..."
                className="flex-1 bg-transparent outline-none text-gray-800 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="bg-red-600 text-white px-3 py-1 rounded-lg ml-1 text-sm" onClick={handleSearch}>
                Search
              </button>
            </div>
          </div>

          {/* Desktop Navigation Bar - Responsive adjustments */}
          <div className="hidden lg:flex items-center justify-between py-2 border-t border-red-500">
            {/* All Categories Button - Adjust width */}
            <button className="flex items-center space-x-2 bg-white text-red-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-all shadow-md group min-w-[160px] xl:min-w-[180px]">
              <MenuIcon sx={{ fontSize: 20 }} />
              <span className="font-bold text-sm xl:text-base">All Categories</span>
              <ExpandMoreIcon sx={{ fontSize: 18 }} />
            </button>

            {/* Navigation Links - Responsive spacing */}
            <div className="flex items-center space-x-4 xl:space-x-6 overflow-x-auto scrollbar-hide px-2">
              <button className="flex items-center space-x-1 text-white hover:text-yellow-200 transition whitespace-nowrap">
                <FlashOnIcon sx={{ fontSize: 18 }} />
                <span className="font-bold text-sm">Flash Sales</span>
                <span className="bg-yellow-500 text-black text-xs px-1.5 py-0.5 rounded font-bold animate-pulse">
                  LIVE
                </span>
              </button>
              
              <button className="text-white hover:text-yellow-200 transition font-medium text-sm xl:text-base whitespace-nowrap">
                Today's Deals
              </button>
              
              <button className="hidden xl:flex items-center space-x-1 text-white hover:text-yellow-200 transition">
                <TrendingUpIcon sx={{ fontSize: 18 }} />
                <span>Trending</span>
              </button>
              
              <button className="text-white hover:text-yellow-200 transition font-medium text-sm xl:text-base whitespace-nowrap">
                New Arrivals
              </button>
              
              <button className="hidden xl:inline text-white hover:text-yellow-200 transition">
                Brands
              </button>
              
              <button className="hidden 2xl:inline text-white hover:text-yellow-200 transition">
                Clearance
              </button>
            </div>

            {/* Additional Features - Responsive */}
            <div className="flex items-center space-x-3 xl:space-x-4">
              <button className="hidden xl:flex items-center space-x-1 text-white hover:text-yellow-200 transition whitespace-nowrap">
                <StoreIcon sx={{ fontSize: 18 }} />
                <span className="font-medium">Sell</span>
              </button>
              
              <div className="hidden xl:block h-6 w-px bg-white/30"></div>
              
              <button className="flex items-center space-x-1 text-white hover:text-yellow-200 transition">
                <LanguageIcon sx={{ fontSize: 16 }} />
                <span className="text-sm">EN</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Promotional Banner */}
      <div className="w-full bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 text-black py-2 hidden lg:block">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center space-x-4 xl:space-x-6 text-sm">
            <div className="flex items-center space-x-1">
              <span className="font-bold">🎁</span>
              <span>Festival Sale: Extra 20% OFF</span>
            </div>
            <span className="text-gray-800">|</span>
            <div className="flex items-center space-x-1">
              <span className="font-bold">🚀</span>
              <span>Same Day Delivery</span>
            </div>
            <span className="hidden xl:inline text-gray-800">|</span>
            <div className="hidden xl:flex items-center space-x-1">
              <span className="font-bold">💳</span>
              <span>EMI Available</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Header