// myapp\src\components\Footer\Footer.jsx
import HomeIcon from '@mui/icons-material/Home';
import CategoryIcon from '@mui/icons-material/Category';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import Badge from '@mui/material/Badge';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [activeTab, setActiveTab] = useState('home');

  // Single row mobile navigation - NO DUPLICATES
  const mobileFooterItems = [
    { id: 'home', icon: HomeIcon, label: 'Home', badge: 0, linkUrl:'/' },
    { id: 'categories', icon: CategoryIcon, label: 'Category', badge: 0, linkUrl:'/category' },
    { id: 'search', icon: SearchIcon, label: 'Search', badge: 0,linkUrl:'/search' },
    { id: 'wishlist', icon: FavoriteBorderIcon, label: 'Wishlist', badge: 3,linkUrl:'/' },
    { id: 'cart', icon: ShoppingCartIcon, label: 'Cart', badge: 3,linkUrl:'/' },
    { id: 'account', icon: PersonIcon, label: 'Account', badge: 0,linkUrl:'/profile' },
  ];

  return (
    <>
      {/* Desktop Footer */}
      <footer className="hidden md:block bg-gradient-to-b from-gray-900 to-gray-950 text-white mt-12">
        <div className="container mx-auto px-6 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info & Contact */}
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
                Sri Lanka's leading online marketplace. Trusted by millions for quality products, fast delivery, and secure shopping.
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <PhoneIcon sx={{ fontSize: 16, color: '#ef4444' }} />
                  <span className="text-gray-300">+94 77 123 4567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <EmailIcon sx={{ fontSize: 16, color: '#ef4444' }} />
                  <span className="text-gray-300">support@lankadeal.lk</span>
                </div>
              </div>
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
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-bold mb-5 text-white border-l-4 border-red-600 pl-3">Quick Links</h3>
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
                  Careers
                </a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition flex items-center group">
                  <span className="w-2 h-2 bg-red-600 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition"></span>
                  Sell on LankaDeal
                </a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition flex items-center group">
                  <span className="w-2 h-2 bg-red-600 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition"></span>
                  Affiliate Program
                </a></li>
              </ul>
            </div>

            {/* Help & Support */}
            <div>
              <h3 className="text-lg font-bold mb-5 text-white border-l-4 border-red-600 pl-3">Help & Support</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition flex items-center group">
                  <LocalShippingIcon sx={{ fontSize: 16, marginRight: 2 }} />
                  Track Your Order
                </a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">FAQs</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Shipping Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Returns & Refunds</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Privacy Policy</a></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-lg font-bold mb-5 text-white border-l-4 border-red-600 pl-3">Stay Updated</h3>
              <p className="text-gray-400 text-sm mb-4">Subscribe to get special offers, free giveaways, and new arrivals</p>
              <div className="flex mb-6">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="bg-gray-800 text-white px-4 py-3 rounded-l-lg w-full outline-none placeholder-gray-500"
                />
                <button className="bg-gradient-to-r from-red-600 to-red-700 px-5 py-3 rounded-r-lg hover:from-red-700 hover:to-red-800 transition font-medium whitespace-nowrap">
                  Subscribe
                </button>
              </div>
              <div>
                <h4 className="font-bold mb-3 text-white">Payment Methods</h4>
                <div className="flex flex-wrap gap-3">
                  <div className="w-12 h-8 bg-gray-800 rounded flex items-center justify-center">
                    <span className="text-xs font-bold text-white">VISA</span>
                  </div>
                  <div className="w-12 h-8 bg-gray-800 rounded flex items-center justify-center">
                    <span className="text-xs font-bold text-white">MC</span>
                  </div>
                  <div className="w-12 h-8 bg-gray-800 rounded flex items-center justify-center">
                    <span className="text-xs font-bold text-white">COD</span>
                  </div>
                  <div className="w-12 h-8 bg-gray-800 rounded flex items-center justify-center">
                    <span className="text-xs font-bold text-white">PP</span>
                  </div>
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
              <div className="flex items-center space-x-4">
                <span className="text-gray-500 text-sm">We Accept:</span>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-6 bg-blue-900 rounded flex items-center justify-center">
                    <span className="text-xs font-bold text-white">VISA</span>
                  </div>
                  <div className="w-10 h-6 bg-red-900 rounded flex items-center justify-center">
                    <span className="text-xs font-bold text-white">MC</span>
                  </div>
                  <div className="w-10 h-6 bg-green-900 rounded flex items-center justify-center">
                    <span className="text-xs font-bold text-white">COD</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation - SINGLE ROW ONLY */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-2xl z-50 safe-bottom">
        <div className="flex items-center justify-around py-3 px-1">
          {mobileFooterItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <Link to={item.linkUrl}>
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
                      <Icon sx={{ fontSize: 24 }} />
                    </Badge>
                  ) : (
                    <Icon sx={{ fontSize: 24 }} />
                  )}
                </div>
                <span className="text-xs mt-1 font-medium">
                  {item.label}
                </span>
              </button>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Footer;