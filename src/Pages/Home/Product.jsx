// myapp\src\Pages\Home\Product.jsx
import React, { useRef, useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Grid, Pagination, Mousewheel, FreeMode, Navigation } from 'swiper/modules';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
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
        imageUrl:'https://images.unsplash.com/photo-1600003263720-95b45a4035d5?w=600&h=600&fit=crop&q=80',
        price:'25,600',
        originalPrice: '32,500',
        discount: 21,
        productTitle:'Apple MacBook Pro 14" M3 Pro Chip',
        category: 'Electronics › Laptops',
        rating: 4.8,
        reviews: 428,
        sold: 156,
        features: ['M3 Pro Chip', '36GB RAM', '1TB SSD', 'Liquid Retina XDR'],
        isNew: true,
        isFeatured: true
    },
    {
        id: 2,
        imageUrl:'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop&q=80',
        price:'89,500',
        originalPrice: '105,000',
        discount: 15,
        productTitle:'Sony WH-1000XM5 Wireless Headphones',
        category: 'Electronics › Audio',
        rating: 4.7,
        reviews: 312,
        sold: 289,
        features: ['Noise Cancelling', '30hr Battery', 'Hi-Res Audio', 'Touch Controls'],
        isFeatured: true
    },
    {
        id: 3,
        imageUrl:'',
        price:'12,500',
        originalPrice: '16,800',
        discount: 26,
        productTitle:'Samsung Galaxy Watch 6 Classic',
        category: 'Wearables › Smart Watches',
        rating: 4.6,
        reviews: 189,
        sold: 412,
        features: ['ECG Monitor', '5ATM Waterproof', 'Sleep Tracking', 'GPS'],
        isNew: true
    },
    {
        id: 4,
        imageUrl:'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&h=600&fit=crop&q=80',
        price:'34,200',
        originalPrice: '42,500',
        discount: 20,
        productTitle:'Canon EOS R6 Mirrorless Camera',
        category: 'Electronics › Cameras',
        rating: 4.9,
        reviews: 156,
        sold: 78,
        features: ['20.1MP Full Frame', '4K Video', 'IBIS', 'Dual Pixel AF'],
        isNew: true
    },
    {
        id: 5,
        imageUrl:'https://images.unsplash.com/photo-1600003263720-95b45a4035d5?w=600&h=600&fit=crop&q=80',
        price:'72,800',
        originalPrice: '89,900',
        discount: 19,
        productTitle:'LG OLED C3 65" 4K Smart TV',
        category: 'Electronics › Televisions',
        rating: 4.8,
        reviews: 267,
        sold: 134,
        features: ['OLED evo', 'α9 AI Processor', '120Hz', 'Dolby Vision'],
        isFeatured: true
    },
    {
        id: 6,
        imageUrl:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop&q=80',
        price:'15,500',
        originalPrice: '19,900',
        discount: 22,
        productTitle:'DJI Mini 3 Pro Drone with Camera',
        category: 'Electronics › Drones',
        rating: 4.7,
        reviews: 189,
        sold: 256,
        features: ['4K/60fps', '34min Flight', 'Obstacle Sensing', 'Lightweight'],
        isNew: true
    },
    {
        id: 7,
        imageUrl:'https://images.unsplash.com/photo-1600003263720-95b45a4035d5?w=600&h=600&fit=crop&q=80',
        price:'9,800',
        originalPrice: '12,500',
        discount: 22,
        productTitle:'Xiaomi Robot Vacuum S10+',
        category: 'Home › Smart Home',
        rating: 4.5,
        reviews: 312,
        sold: 567,
        features: ['Lidar Navigation', 'Self-Emptying', 'Mopping', 'App Control'],
        isFeatured: true
    },
    {
        id: 8,
        imageUrl:'https://images.unsplash.com/photo-1600003263720-95b45a4035d5?w=600&h=600&fit=crop&q=80',
        price:'21,500',
        originalPrice: '27,000',
        discount: 20,
        productTitle:'PlayStation 5 Console + 2 Controllers',
        category: 'Gaming › Consoles',
        rating: 4.9,
        reviews: 489,
        sold: 312,
        features: ['825GB SSD', '4K/120fps', 'Ray Tracing', 'DualSense'],
        isNew: true
    },
];

const Product = ({title, rowsCount, slidesPerView}) => {
  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [wishlisted, setWishlisted] = useState({});

  // Mouse wheel navigation
  useEffect(() => {
    const handleWheel = (e) => {
      if (swiperRef.current && isHovered && Math.abs(e.deltaX) < Math.abs(e.deltaY)) {
        e.preventDefault();
        if (e.deltaY > 0) {
          swiperRef.current.swiper.slideNext();
        } else {
          swiperRef.current.swiper.slidePrev();
        }
      }
    };

    const container = document.querySelector('.premium-swiper');
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
    };
  }, [isHovered]);

  // Calculate progress
  const progressPercentage = ((activeIndex + 1) / premiumProductArr.length) * 100;

  return (
    <section className="premium-product-section">
      <div className="premium-swiper-container">
        {/* Premium Section Header */}
        <div className="section-header-premium">
          <div>
            <h1>{title}</h1>
            <div className="section-tagline">
              Discover premium products with cutting-edge technology and exceptional quality
            </div>
          </div>
          
          <div className="nav-controls-premium">
            <button 
              className="nav-btn-premium swiper-button-prev-custom"
              onClick={() => swiperRef.current?.swiper.slidePrev()}
            >
              <ArrowBackIosNewIcon sx={{ fontSize: 18 }} />
            </button>
            <button 
              className="nav-btn-premium swiper-button-next-custom"
              onClick={() => swiperRef.current?.swiper.slideNext()}
            >
              <ArrowForwardIosIcon sx={{ fontSize: 18 }} />
            </button>
          </div>
        </div>

        {/* Mouse Wheel Indicator */}
        <div className="mouse-wheel-indicator-premium glass-effect">
          <div className="premium-mouse">
            <div className="premium-mouse-wheel"></div>
          </div>
          <div className="premium-hint-text">
            Scroll horizontally<br/>to navigate
          </div>
        </div>

        {/* Premium Swiper */}
        <div 
          className="premium-swiper-wrapper"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
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
            breakpoints={{
              320: {
                slidesPerView: 1.2,
                spaceBetween: 16,
                grid: { rows: 1, fill: 'row' }
              },
              640: {
                slidesPerView: 2.2,
                spaceBetween: 20,
                grid: { rows: Number(rowsCount), fill: 'row' }
              },
              768: {
                slidesPerView: 2.5,
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: Number(slidesPerView),
                spaceBetween: 24,
              },
              1280: {
                slidesPerView: Number(slidesPerView),
                spaceBetween: 32,
              }
            }}
          >
            {premiumProductArr.map((product) => (
              <SwiperSlide key={product.id}>
                <PremiumProductUnit 
                  {...product} 
                  wishlisted={wishlisted[product.id]}
                  onWishlistToggle={() => setWishlisted(prev => ({
                    ...prev,
                    [product.id]: !prev[product.id]
                  }))}
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
  onWishlistToggle,
  id 
}) => (
  <div className="premium-product-card">
    {/* Badges */}
    <div className="premium-badges">
      {isNew && <div className="premium-badge badge-new">NEW</div>}
      {isFeatured && <div className="premium-badge badge-featured">FEATURED</div>}
      {discount > 15 && <div className="premium-badge badge-sale">SALE</div>}
    </div>

    {/* Quick Actions */}
    <div className="premium-quick-actions">
      <button 
        className="premium-action-btn"
        onClick={onWishlistToggle}
      >
        <FavoriteBorderIcon 
          sx={{ 
            fontSize: 20,
            color: wishlisted ? '#ef4444' : 'inherit',
            fill: wishlisted ? '#ef4444' : 'none'
          }} 
        />
      </button>
      <button className="premium-action-btn">
        <VisibilityIcon sx={{ fontSize: 20 }} />
      </button>
    </div>

    {/* Product Image */}
    <div className="premium-image-container">
      <img 
        src={imageUrl} 
        alt={`premium_product_${id}`} 
        className="premium-product-image" 
        loading="lazy"
      />
    </div>

    {/* Product Info */}
    <div className="premium-product-info">
      <div className="premium-product-category">
        <LocalShippingIcon sx={{ fontSize: 14, color: '#6b7280' }} />
        {category}
      </div>
      
      <h3 className="premium-product-title">{productTitle}</h3>
      
            {/* Rating */}
            <div className="premium-rating-container">
              <div className="premium-stars">
                {[...Array(5)].map((_, i) => (
                  i < Math.floor(rating) ? (
                    <StarIcon key={i} className="star-filled" sx={{ fontSize: 16 }} />
                  ) : (
                    <StarBorderIcon key={i} className="star-empty" sx={{ fontSize: 16 }} />
                  )
                ))}
              </div>
              <div className="premium-rating-info">
                <span className="premium-rating-value">{rating}</span>
                <span className="premium-reviews">({reviews} reviews)</span>
              </div>
            </div>
      
            {/* Price Section */}
            <div className="premium-price-section">
              <div className="premium-prices">
                <span className="premium-price">Rs. {price}</span>
                <span className="premium-original-price">Rs. {originalPrice}</span>
              </div>
              <div className="premium-discount-badge">-{discount}%</div>
            </div>
      

          </div>
        </div>
      );