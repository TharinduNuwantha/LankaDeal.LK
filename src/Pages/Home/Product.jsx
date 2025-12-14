// myapp\src\Pages\Home\Product.jsx
import React, { useRef, useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Grid, Pagination, Mousewheel, FreeMode, Navigation } from 'swiper/modules';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import VisibilityIcon from '@mui/icons-material/Visibility';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import './Styles/Product.css';

const premiumProductArr = [
  {
    id: 1,
    imageUrl: 'https://images.unsplash.com/photo-1600003263720-95b45a4035d5?w=600&h=600&fit=crop&q=80',
    price: '25,600',
    originalPrice: '32,500',
    discount: 21,
    productTitle: 'Apple MacBook Pro 14" M3 Pro Chip',
    category: 'Electronics › Laptops',
    rating: 4.8,
    reviews: 428,
    sold: 156,
    features: ['M3 Pro Chip', '36GB RAM', '1TB SSD', 'Liquid Retina XDR'],
    isNew: true,
    isFeatured: true,
    stock: 12,
    delivery: 'Free 1-day'
  },
  {
    id: 2,
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop&q=80',
    price: '89,500',
    originalPrice: '105,000',
    discount: 15,
    productTitle: 'Sony WH-1000XM5 Wireless Headphones',
    category: 'Electronics › Audio',
    rating: 4.7,
    reviews: 312,
    sold: 289,
    features: ['Noise Cancelling', '30hr Battery', 'Hi-Res Audio', 'Touch Controls'],
    isFeatured: true,
    stock: 25,
    delivery: 'Free 2-day'
  },
  {
    id: 3,
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop&q=80',
    price: '12,500',
    originalPrice: '16,800',
    discount: 26,
    productTitle: 'Samsung Galaxy Watch 6 Classic',
    category: 'Wearables › Smart Watches',
    rating: 4.6,
    reviews: 189,
    sold: 412,
    features: ['ECG Monitor', '5ATM Waterproof', 'Sleep Tracking', 'GPS'],
    isNew: true,
    stock: 8,
    delivery: 'Free 1-day'
  },
  {
    id: 4,
    imageUrl: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&h=600&fit=crop&q=80',
    price: '34,200',
    originalPrice: '42,500',
    discount: 20,
    productTitle: 'Canon EOS R6 Mirrorless Camera',
    category: 'Electronics › Cameras',
    rating: 4.9,
    reviews: 156,
    sold: 78,
    features: ['20.1MP Full Frame', '4K Video', 'IBIS', 'Dual Pixel AF'],
    isNew: true,
    stock: 15,
    delivery: 'Free 2-day'
  },
  {
    id: 5,
    imageUrl: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=600&fit=crop&q=80',
    price: '72,800',
    originalPrice: '89,900',
    discount: 19,
    productTitle: 'LG OLED C3 65" 4K Smart TV',
    category: 'Electronics › Televisions',
    rating: 4.8,
    reviews: 267,
    sold: 134,
    features: ['OLED evo', 'α9 AI Processor', '120Hz', 'Dolby Vision'],
    isFeatured: true,
    stock: 6,
    delivery: 'Free 3-day'
  },
  {
    id: 6,
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop&q=80',
    price: '15,500',
    originalPrice: '19,900',
    discount: 22,
    productTitle: 'DJI Mini 3 Pro Drone with Camera',
    category: 'Electronics › Drones',
    rating: 4.7,
    reviews: 189,
    sold: 256,
    features: ['4K/60fps', '34min Flight', 'Obstacle Sensing', 'Lightweight'],
    isNew: true,
    stock: 18,
    delivery: 'Free 2-day'
  },
  {
    id: 7,
    imageUrl: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=600&fit=crop&q=80',
    price: '9,800',
    originalPrice: '12,500',
    discount: 22,
    productTitle: 'Xiaomi Robot Vacuum S10+',
    category: 'Home › Smart Home',
    rating: 4.5,
    reviews: 312,
    sold: 567,
    features: ['Lidar Navigation', 'Self-Emptying', 'Mopping', 'App Control'],
    isFeatured: true,
    stock: 32,
    delivery: 'Free 3-day'
  },
  {
    id: 8,
    imageUrl: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&h=600&fit=crop&q=80',
    price: '21,500',
    originalPrice: '27,000',
    discount: 20,
    productTitle: 'PlayStation 5 Console + 2 Controllers',
    category: 'Gaming › Consoles',
    rating: 4.9,
    reviews: 489,
    sold: 312,
    features: ['825GB SSD', '4K/120fps', 'Ray Tracing', 'DualSense'],
    isNew: true,
    stock: 4,
    delivery: 'Free 1-day'
  }
];

const Product = ({ title, rowsCount, slidesPerView, isFlashSale = false }) => {
  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [wishlisted, setWishlisted] = useState({});
  const [cartItems, setCartItems] = useState({});
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Calculate progress
  const progressPercentage = ((activeIndex + 1) / premiumProductArr.length) * 100;

  // Handle cart action
  const handleCartToggle = (productId) => {
    setCartItems(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  // Simplified mobile breakpoints - FIXED for no overlap
  const getBreakpoints = () => {
    return {
      // Mobile: Show MORE products but with proper spacing
      320: {
        slidesPerView: 1.2, // Reduced from 2.5 to prevent overlap
        spaceBetween: 12,
        grid: { rows: 1, fill: 'row' }
      },
      375: {
        slidesPerView: 1.3,
        spaceBetween: 12
      },
      480: {
        slidesPerView: 1.5,
        spaceBetween: 14
      },
      640: {
        slidesPerView: 1.8,
        spaceBetween: 16
      },
      // Tablet: Transition
      768: {
        slidesPerView: 2.2,
        spaceBetween: 20,
        grid: { rows: Number(rowsCount), fill: 'row' }
      },
      900: {
        slidesPerView: 2.5,
        spaceBetween: 22
      },
      // Desktop: Show fewer for premium focus
      1024: {
        slidesPerView: Number(slidesPerView),
        spaceBetween: 24
      },
      1280: {
        slidesPerView: Number(slidesPerView) + 0.5,
        spaceBetween: 32
      }
    };
  };

  return (
    <section className="premium-product-section">
      <div className="premium-swiper-container">
        {/* Premium Section Header */}
        <div className="section-header-premium">
          <div className="section-header-content">
            <h1 className="section-title">
              {isFlashSale && <span className="flash-badge">⚡</span>}
              {title}
            </h1>
            {!isMobile && (
              <div className="section-tagline">
                {isFlashSale 
                  ? 'Limited time offers with exclusive discounts. Hurry before they sell out!' 
                  : 'Discover premium products with cutting-edge technology and exceptional quality'
                }
              </div>
            )}
          </div>
          
          <div className="nav-controls-premium">
            <button 
              className="nav-btn-premium swiper-button-prev-custom"
              onClick={() => swiperRef.current?.swiper.slidePrev()}
              aria-label="Previous products"
            >
              <ArrowBackIosNewIcon sx={{ fontSize: 18 }} />
            </button>
            <button 
              className="nav-btn-premium swiper-button-next-custom"
              onClick={() => swiperRef.current?.swiper.slideNext()}
              aria-label="Next products"
            >
              <ArrowForwardIosIcon sx={{ fontSize: 18 }} />
            </button>
          </div>
        </div>

        {isFlashSale && (
          <div className="flash-sale-timer">
            <div className="timer-label">Sale ends in:</div>
            <div className="timer-display">
              <span className="timer-unit">02</span>
              <span className="timer-separator">:</span>
              <span className="timer-unit">45</span>
              <span className="timer-separator">:</span>
              <span className="timer-unit">18</span>
            </div>
          </div>
        )}

        {/* Mouse Wheel Indicator - Desktop Only */}
        {!isMobile && (
          <div className="mouse-wheel-indicator-premium glass-effect">
            <div className="premium-mouse">
              <div className="premium-mouse-wheel"></div>
            </div>
            <div className="premium-hint-text">
              Scroll horizontally<br/>to navigate
            </div>
          </div>
        )}

        {/* Premium Swiper */}
        <div className="premium-swiper-wrapper">
          <Swiper
            ref={swiperRef}
            slidesPerView={Number(slidesPerView)}
            grid={{
              rows: Number(rowsCount),
              fill: 'row'
            }}
            spaceBetween={24}
            pagination={{
              clickable: true,
              dynamicBullets: true,
              el: '.premium-pagination',
            }}
            mousewheel={{
              forceToAxis: true,
              sensitivity: 0.8,
              releaseOnEdges: true,
              thresholdDelta: 20,
            }}
            freeMode={{
              enabled: true,
              momentum: true,
              momentumBounce: false,
              momentumVelocityRatio: 0.7,
              momentumRatio: 0.7,
            }}
            navigation={{
              nextEl: '.swiper-button-next-custom',
              prevEl: '.swiper-button-prev-custom',
            }}
            modules={[Grid, Pagination, Mousewheel, FreeMode, Navigation]}
            className="premium-swiper"
            onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
            breakpoints={getBreakpoints()}
          >
            {premiumProductArr.map((product) => (
              <SwiperSlide key={product.id}>
                <PremiumProductUnit 
                  {...product} 
                  wishlisted={wishlisted[product.id]}
                  inCart={cartItems[product.id]}
                  onWishlistToggle={() => setWishlisted(prev => ({
                    ...prev,
                    [product.id]: !prev[product.id]
                  }))}
                  onCartToggle={() => handleCartToggle(product.id)}
                  isFlashSale={isFlashSale}
                  isMobile={isMobile}
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Progress Indicator */}
          <div className="progress-indicator">
            <div className="progress-text">
              {activeIndex + 1} / {premiumProductArr.length}
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Custom Pagination */}
          <div className="premium-pagination"></div>
        </div>
      </div>
    </section>
  );
};

export default Product;

const PremiumProductUnit = ({ 
  imageUrl, 
  price, 
  originalPrice, 
  discount, 
  productTitle, 
  category,
  rating,
  reviews,
  sold,
  features,
  isNew,
  isFeatured,
  wishlisted,
  inCart,
  onWishlistToggle,
  onCartToggle,
  isFlashSale,
  stock,
  delivery,
  isMobile,
  id 
}) => (
  <div className="premium-product-card">
    {/* Badges - Simplified for mobile */}
    <div className="premium-badges">
      {isNew && <div className="premium-badge badge-new">NEW</div>}
      {isFeatured && <div className="premium-badge badge-featured">FEATURED</div>}
      {discount > 15 && <div className="premium-badge badge-sale">-{discount}%</div>}
      {isFlashSale && <div className="premium-badge badge-flash">FLASH</div>}
      {stock < 10 && stock > 0 && <div className="premium-badge badge-low">LOW</div>}
    </div>

    {/* Quick Actions - Always visible on mobile */}
    <div className={`premium-quick-actions ${isMobile ? 'mobile-visible' : ''}`}>
      <button 
        className="premium-action-btn"
        onClick={onWishlistToggle}
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        {wishlisted ? (
          <FavoriteIcon sx={{ fontSize: isMobile ? 16 : 20, color: '#ef4444' }} />
        ) : (
          <FavoriteBorderIcon sx={{ fontSize: isMobile ? 16 : 20 }} />
        )}
      </button>
      {!isMobile && (
        <button className="premium-action-btn" aria-label="Quick view">
          <VisibilityIcon sx={{ fontSize: 20 }} />
        </button>
      )}
    </div>

    {/* Product Image */}
    <div className="premium-image-container">
      <img 
        src={imageUrl} 
        alt={productTitle} 
        className="premium-product-image" 
        loading="lazy"
        onError={(e) => {
          e.target.src = 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=600&h=600&fit=crop&q=80';
        }}
      />
      {isFlashSale && (
        <div className="flash-overlay">
          <div className="flash-text">FLASH SALE</div>
        </div>
      )}
    </div>

    {/* Product Info */}
    <div className="premium-product-info">
      <div className="premium-product-meta">
        <div className="premium-product-category">
          <LocalShippingIcon sx={{ fontSize: isMobile ? 12 : 14, color: '#6b7280' }} />
          <span className="category-text">{category.split('›')[0]}</span>
          <span className="delivery-badge">{delivery}</span>
        </div>
        
        <h3 className="premium-product-title">{productTitle}</h3>
        
        {/* Rating & Sold Info */}
        <div className="premium-rating-container">
          <div className="premium-stars">
            {[...Array(5)].map((_, i) => (
              i < Math.floor(rating) ? (
                <StarIcon key={i} className="star-filled" sx={{ fontSize: isMobile ? 14 : 16 }} />
              ) : (
                <StarBorderIcon key={i} className="star-empty" sx={{ fontSize: isMobile ? 14 : 16 }} />
              )
            ))}
          </div>
          <div className="premium-rating-info">
            <span className="premium-rating-value">{rating}</span>
            <span className="premium-reviews">({reviews})</span>
          </div>
          <div className="premium-sold-count">
            {sold}+ sold
          </div>
        </div>

        {/* Features (Desktop only) */}
        {!isMobile && (
          <div className="premium-features-desktop">
            {features.slice(0, 2).map((feature, index) => (
              <div key={index} className="premium-feature">
                <CheckCircleIcon sx={{ fontSize: 14, color: '#10b981' }} />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        )}
        
        {/* Price Section */}
        <div className="premium-price-section">
          <div className="premium-prices">
            <span className="premium-price">Rs. {price}</span>
            <span className="premium-original-price">Rs. {originalPrice}</span>
          </div>
          <div className="premium-discount-badge">-{discount}%</div>
        </div>

        {/* Stock Indicator - Mobile only */}
        {isMobile && stock > 0 && stock < 15 && (
          <div className="stock-indicator-mobile">
            <div className="stock-text-mobile">
              Only {stock} left
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="premium-action-buttons">
          <button 
            className={`premium-cart-btn ${inCart ? 'in-cart' : ''}`}
            onClick={onCartToggle}
          >
            <ShoppingCartIcon sx={{ fontSize: isMobile ? 18 : 20 }} />
            <span className="cart-btn-text">
              {inCart ? 'Added' : 'Add to Cart'}
            </span>
          </button>
          {!isMobile && (
            <button className="premium-view-btn" onClick={() => console.log('View details', id)}>
              Details
            </button>
          )}
        </div>
      </div>
    </div>
  </div>
);