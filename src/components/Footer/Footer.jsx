// myapp\src\components\Footer\Footer.jsx
import HomeIcon from '@mui/icons-material/Home';
import CategoryIcon from '@mui/icons-material/Category';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Badge from '@mui/material/Badge';
import { useState } from 'react';

const Footer = () => {
  const [activeTab, setActiveTab] = useState('home');

  const footerItems = [
    { id: 'home', icon: HomeIcon, label: 'Home', badge: 0 },
    { id: 'categories', icon: CategoryIcon, label: 'Categories', badge: 0 },
    { id: 'search', icon: SearchIcon, label: 'Search', badge: 0 },
    { id: 'wishlist', icon: FavoriteBorderIcon, label: 'Wishlist', badge: 5 },
    { id: 'account', icon: PersonIcon, label: 'Account', badge: 0 },
    { id: 'cart', icon: ShoppingCartIcon, label: 'Cart', badge: 3 },
  ];

  return (
    <>
      {/* Desktop Footer */}
      <footer className="hidden md:block bg-gray-900 text-white mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <h2 className="text-2xl font-bold">
                  <span className="text-red-400">Lanka</span>
                  <span className="text-white">Deal</span>
                  <span className="text-yellow-400">.LK</span>
                </h2>
              </div>
              <p className="text-gray-400 text-sm">
                Your trusted online shopping destination in Sri Lanka. Best deals, fast delivery, and secure payments.
              </p>
              <div className="flex space-x-4">
                <button className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition">
                  <i className="fab fa-facebook-f"></i>
                </button>
                <button className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition">
                  <i className="fab fa-instagram"></i>
                </button>
                <button className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition">
                  <i className="fab fa-twitter"></i>
                </button>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">FAQs</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Terms & Conditions</a></li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h3 className="text-lg font-bold mb-4">Customer Service</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Track Your Order</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Returns & Refunds</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Shipping Info</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Size Guide</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Help Center</a></li>
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-lg font-bold mb-4">Top Categories</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Electronics</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Fashion</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Home & Garden</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Sports & Fitness</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Beauty & Health</a></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-lg font-bold mb-4">Stay Updated</h3>
              <p className="text-gray-400 text-sm mb-4">Subscribe to our newsletter for the latest deals</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="bg-gray-800 text-white px-4 py-2 rounded-l-lg w-full outline-none"
                />
                <button className="bg-red-600 px-4 py-2 rounded-r-lg hover:bg-red-700 transition">
                  Subscribe
                </button>
              </div>
              <div className="mt-6">
                <h4 className="font-bold mb-2">Download App</h4>
                <div className="flex space-x-2">
                  <button className="flex-1 bg-gray-800 hover:bg-gray-700 py-2 rounded-lg text-sm">
                    Google Play
                  </button>
                  <button className="flex-1 bg-gray-800 hover:bg-gray-700 py-2 rounded-lg text-sm">
                    App Store
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 mt-8 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">© 2024 LankaDeal.LK. All rights reserved.</p>
              <div className="flex items-center space-x-6 mt-4 md:mt-0">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/2560px-Mastercard-logo.svg.png" alt="Mastercard" className="h-8" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Visa_Logo.svg/2560px-Visa_Logo.svg.png" alt="Visa" className="h-8" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/PayPal_Logo_Icon_2014.svg/1024px-PayPal_Logo_Icon_2014.svg.png" alt="PayPal" className="h-8" />
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-40">
        <div className="flex items-center justify-around py-2">
          {footerItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center p-2 rounded-lg transition-all ${
                  isActive 
                    ? 'text-red-600 bg-red-50' 
                    : 'text-gray-600 hover:text-red-600'
                }`}
              >
                {item.badge > 0 && item.id !== 'cart' ? (
                  <Badge badgeContent={item.badge} color="error">
                    <Icon sx={{ fontSize: 24 }} />
                  </Badge>
                ) : (
                  <Icon sx={{ fontSize: 24 }} />
                )}
                <span className="text-xs mt-1 font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Footer;