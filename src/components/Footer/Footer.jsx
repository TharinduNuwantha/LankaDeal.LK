// myapp\src\components\Footer\Footer.jsx
import HomeIcon from '@mui/icons-material/Home';
import CategoryIcon from '@mui/icons-material/Category';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StoreIcon from '@mui/icons-material/Store';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import Badge from '@mui/material/Badge';
import { useState } from 'react';

const Footer = () => {
  const [activeTab, setActiveTab] = useState('home');

  // Mobile bottom navigation items WITH DUPLICATES
  const mobileFooterItems = [
    { id: 'home', icon: HomeIcon, label: 'Home', badge: 0 },
    { id: 'categories', icon: CategoryIcon, label: 'Category', badge: 0 },
    { id: 'search', icon: SearchIcon, label: 'Search', badge: 0 },
    { id: 'deals', icon: FlashOnIcon, label: 'Deals', badge: 5 }, // Duplicate icon
    { id: 'wishlist', icon: FavoriteBorderIcon, label: 'Wishlist', badge: 3 },
    { id: 'cart', icon: ShoppingCartIcon, label: 'Cart', badge: 3 },
    { id: 'account', icon: PersonIcon, label: 'Account', badge: 0 },
    { id: 'store', icon: StoreIcon, label: 'Store', badge: 0 }, // Duplicate icon
  ];

  return (
    <>
      {/* Desktop Footer */}
      <footer className="hidden md:block bg-gradient-to-b from-gray-900 to-gray-950 text-white mt-12">
        <div className="container mx-auto px-6 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Company Info */}
            <div className="space-y-5">
              <div className="flex items-center space-x-2">
                <div className="bg-white rounded-lg p-2">
                  <h2 className="text-2xl font-bold">
                    <span className="text-red-600">Lanka</span>
                    <span className="text-gray-800">Deal</span>
                    <span className="text-yellow-500">.</span>
                    <span className="text-red-600 font-extrabold">LK</span>
                  </h2>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Your trusted online shopping destination in Sri Lanka. Best deals, fast delivery, and secure payments.
              </p>
              <div className="flex space-x-4">
                <button className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition hover:scale-110">
                  <i className="fab fa-facebook-f text-white"></i>
                </button>
                <button className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition hover:scale-110">
                  <i className="fab fa-instagram text-white"></i>
                </button>
                <button className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition hover:scale-110">
                  <i className="fab fa-twitter text-white"></i>
                </button>
                <button className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition hover:scale-110">
                  <i className="fab fa-youtube text-white"></i>
                </button>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-bold mb-5 text-white">Quick Links</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition flex items-center group">
                  <span className="w-2 h-2 bg-red-600 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition"></span>
                  About Us
                </a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition flex items-center group">
                  <span className="w-2 h-2 bg-red-600 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition"></span>
                  Contact Us
                </a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition flex items-center group">
                  <span className="w-2 h-2 bg-red-600 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition"></span>
                  FAQs
                </a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition flex items-center group">
                  <span className="w-2 h-2 bg-red-600 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition"></span>
                  Privacy Policy
                </a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition flex items-center group">
                  <span className="w-2 h-2 bg-red-600 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition"></span>
                  Terms & Conditions
                </a></li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h3 className="text-lg font-bold mb-5 text-white">Customer Service</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition flex items-center group">
                  <LocalShippingIcon sx={{ fontSize: 16, marginRight: 2 }} />
                  Track Your Order
                </a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition flex items-center group">
                  <span className="text-red-400 mr-2">↩️</span>
                  Returns & Refunds
                </a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition flex items-center group">
                  <span className="text-green-400 mr-2">📦</span>
                  Shipping Info
                </a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition flex items-center group">
                  <span className="text-blue-400 mr-2">📏</span>
                  Size Guide
                </a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition flex items-center group">
                  <span className="text-yellow-400 mr-2">❓</span>
                  Help Center
                </a></li>
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-lg font-bold mb-5 text-white">Top Categories</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition">📱 Electronics</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">👕 Fashion</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">🏠 Home & Garden</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">⚽ Sports & Fitness</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">💄 Beauty & Health</a></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-lg font-bold mb-5 text-white">Stay Updated</h3>
              <p className="text-gray-400 text-sm mb-4">Get the latest deals and offers</p>
              <div className="flex mb-6">
                <input
                  type="email"
                  placeholder="Your email"
                  className="bg-gray-800 text-white px-4 py-3 rounded-l-lg w-full outline-none placeholder-gray-500"
                />
                <button className="bg-gradient-to-r from-red-600 to-red-700 px-4 py-3 rounded-r-lg hover:from-red-700 hover:to-red-800 transition font-medium">
                  Subscribe
                </button>
              </div>
              <div className="mt-6">
                <h4 className="font-bold mb-3 text-white">Download App</h4>
                <div className="flex space-x-3">
                  <button className="flex-1 bg-gray-800 hover:bg-gray-700 py-3 rounded-lg text-sm flex items-center justify-center space-x-2">
                    <span className="text-2xl">📱</span>
                    <div className="text-left">
                      <div className="text-xs text-gray-400">Get it on</div>
                      <div className="font-bold">Google Play</div>
                    </div>
                  </button>
                  <button className="flex-1 bg-gray-800 hover:bg-gray-700 py-3 rounded-lg text-sm flex items-center justify-center space-x-2">
                    <span className="text-2xl">🍎</span>
                    <div className="text-left">
                      <div className="text-xs text-gray-400">Download on</div>
                      <div className="font-bold">App Store</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 mt-10 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-center md:text-left mb-4 md:mb-0">
                <p className="text-gray-400 text-sm">© 2024 LankaDeal.LK. All rights reserved.</p>
                <p className="text-gray-500 text-xs mt-1">Registered Commercial Entity in Sri Lanka</p>
              </div>
              <div className="flex items-center space-x-6">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/2560px-Mastercard-logo.svg.png" alt="Mastercard" className="h-6 opacity-80" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Visa_Logo.svg/2560px-Visa_Logo.svg.png" alt="Visa" className="h-6 opacity-80" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/PayPal_Logo_Icon_2014.svg/1024px-PayPal_Logo_Icon_2014.svg.png" alt="PayPal" className="h-6 opacity-80" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Verve_Logo.svg/2560px-Verve_Logo.svg.png" alt="Verve" className="h-6 opacity-80" />
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation WITH DUPLICATE ICONS */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-2xl z-50 safe-bottom">
        <div className="flex items-center justify-around py-2 px-1">
          {mobileFooterItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center p-1 rounded-xl transition-all flex-1 mx-0.5 ${
                  isActive 
                    ? 'text-red-600 bg-red-50' 
                    : 'text-gray-600 hover:text-red-600'
                }`}
              >
                <div className="relative">
                  {item.badge > 0 ? (
                    <Badge 
                      badgeContent={item.badge} 
                      color="error"
                      sx={{
                        '& .MuiBadge-badge': {
                          backgroundColor: '#ef4444',
                          color: 'white',
                          fontSize: '0.6rem',
                          minWidth: '16px',
                          height: '16px'
                        }
                      }}
                    >
                      <Icon sx={{ fontSize: 22 }} />
                    </Badge>
                  ) : (
                    <Icon sx={{ fontSize: 22 }} />
                  )}
                </div>
                <span className="text-[10px] mt-0.5 font-medium truncate w-full text-center">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
        
        {/* Extra row of icons (optional duplicate row) */}
        <div className="flex items-center justify-around py-1 px-1 border-t border-gray-100">
          <button className="flex flex-col items-center p-1 text-gray-600 hover:text-red-600 transition flex-1">
            <NotificationsNoneIcon sx={{ fontSize: 18 }} />
            <span className="text-[9px] mt-0.5">Alerts</span>
          </button>
          <button className="flex flex-col items-center p-1 text-gray-600 hover:text-red-600 transition flex-1">
            <LocalShippingIcon sx={{ fontSize: 18 }} />
            <span className="text-[9px] mt-0.5">Orders</span>
          </button>
          <button className="flex flex-col items-center p-1 text-gray-600 hover:text-red-600 transition flex-1">
            <FlashOnIcon sx={{ fontSize: 18 }} />
            <span className="text-[9px] mt-0.5">Flash</span>
          </button>
          <button className="flex flex-col items-center p-1 text-gray-600 hover:text-red-600 transition flex-1">
            <StoreIcon sx={{ fontSize: 18 }} />
            <span className="text-[9px] mt-0.5">Stores</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Footer;