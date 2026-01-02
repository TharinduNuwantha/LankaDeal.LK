// myapp\src\Pages\Home\Product.jsx
import React, { useRef, useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../FireBase/firebase'; 
import { Swiper, SwiperSlide } from 'swiper/react';
import { Grid, Pagination, Mousewheel, FreeMode, Navigation } from 'swiper/modules';
import { useDispatch, useSelector } from 'react-redux';
import { userSelecter } from '../../Store/ReduxSlice/userClise';
import { addToCart } from '../../utils/AddToCart/addToCart';
import { Snackbar, Alert } from '@mui/material';

// Icons
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
import FlashOnIcon from '@mui/icons-material/FlashOn';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WhatshotIcon from '@mui/icons-material/Whatshot';

import './Styles/Product.css';

const Product = ({ title, rowsCount, slidesPerView, isFlashSale = false }) => {
  const swiperRef = useRef(null);
  
  // Redux & State
  const userData = useSelector(userSelecter);
  const dispatch = useDispatch();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [wishlisted, setWishlisted] = useState({});
  const [cartItems, setCartItems] = useState({});
  const [timer, setTimer] = useState({ hours: 2, minutes: 45, seconds: 18 });

  // Notification State
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Helper to show notifications
  const showNotification = (message, severity = 'success') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  const handleCloseNotification = (event, reason) => {
    if (reason === 'clickaway') return;
    setNotification({ ...notification, open: false });
  };

  // --- 1. Fetch & Duplicate Data ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const productsRef = collection(db, "category2", "Electronics", "products");
        const querySnapshot = await getDocs(productsRef);
        
        let fetchedData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            priceNumeric: parseInt(data.price || 0),
            originalPriceNumeric: parseInt(data.originalPrice || 0),
            discountNumeric: parseInt(data.discount ? data.discount.replace('%', '') : 0),
            stockNumeric: parseInt(data.stockCount || 0),
            ratingNumeric: parseFloat(data.rating || 0),
            features: data.keywords || [],
          };
        });

        if (isFlashSale) {
          fetchedData = fetchedData.sort((a, b) => b.discountNumeric - a.discountNumeric);
        }

        const TARGET_MIN_ITEMS = 12; 
        let finalData = [...fetchedData];

        if (finalData.length > 0 && finalData.length < TARGET_MIN_ITEMS) {
          while (finalData.length < TARGET_MIN_ITEMS) {
            const clones = fetchedData.map((item, index) => ({
              ...item,
              id: `${item.id}_clone_${finalData.length + index}`
            }));
            finalData = [...finalData, ...clones];
          }
        }
        
        setProducts(finalData.slice(0, 20));

      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [title, isFlashSale]);

  // --- Timer Logic ---
  useEffect(() => {
    if (isFlashSale) {
      const interval = setInterval(() => {
        setTimer(prev => {
          const seconds = prev.seconds - 1;
          const minutes = seconds < 0 ? prev.minutes - 1 : prev.minutes;
          const hours = minutes < 0 ? prev.hours - 1 : prev.hours;
          return {
            hours: hours < 0 ? 0 : hours,
            minutes: minutes < 0 ? 59 : minutes,
            seconds: seconds < 0 ? 59 : seconds
          };
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isFlashSale]);

  // --- Mouse Wheel Logic ---
  useEffect(() => {
    const handleWheel = (e) => {
      if (swiperRef.current && isHovered && Math.abs(e.deltaX) < Math.abs(e.deltaY)) {
        e.preventDefault();
        if (e.deltaY > 0) swiperRef.current.swiper.slideNext();
        else swiperRef.current.swiper.slidePrev();
      }
    };
    const container = document.querySelector(`.premium-swiper-${title.replace(/\s/g, '')}`);
    if (container) container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      if (container) container.removeEventListener('wheel', handleWheel);
    };
  }, [isHovered, title]);

  const progressPercentage = products.length > 0 ? ((activeIndex + 1) / products.length) * 100 : 0;

  // Real Add to Cart Logic
  const handleAddToCart = (product) => {
    if (!userData || !userData.uid) {
        showNotification("Please login first to add items to cart!", "warning");
        return;
    }
    
    // Default quantity is 1 for list view adds
    const productWithQuantity = {
        ...product,
        quantity: 1 
    };

    addToCart(userData.uid, productWithQuantity, userData.cart || [], dispatch);
    showNotification(`Added ${product.title} to cart!`, "success");
    
    // Trigger local visual feedback
    setCartItems(prev => ({ ...prev, [product.id]: true }));
  };

  const getSlidesPerView = () => Number(slidesPerView);

  if (loading) return <div className="p-10 text-center text-gray-400">Loading {title}...</div>;
  if (products.length === 0) return null;

  return (
    <section className="premium-product-section">
      {/* Notification Snackbar */}
      <Snackbar 
        open={notification.open} 
        autoHideDuration={3000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ zIndex: 9999 }} // Ensure it appears on top
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity} 
          variant="filled"
          sx={{ width: '100%', borderRadius: 2, fontWeight: '500' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>

      <div className="premium-swiper-container">
        
        {/* Header */}
        <div className="section-header-premium">
          <div className="section-header-content">
            <div className="title-wrapper">
              <h1 className="section-title">
                {isFlashSale ? (
                  <>
                    <span className="flash-icon"><FlashOnIcon /></span>
                    <span className="title-text">{title}</span>
                  </>
                ) : (
                  <>
                    <TrendingUpIcon className="trending-icon" />
                    <span className="title-text">{title}</span>
                  </>
                )}
              </h1>
              {isFlashSale && (
                <div className="hot-badge">
                  <WhatshotIcon className="fire-icon" />
                  <span>HOT DEALS</span>
                </div>
              )}
            </div>
            <div className="section-tagline">
              {isFlashSale 
                ? 'Limited time offers with exclusive discounts.' 
                : 'Discover premium electronics directly from top categories'
              }
            </div>
          </div>
          
          <div className="nav-controls-premium">
            <div className="slider-status">
              <span className="current-slide">{activeIndex + 1}</span>
              <span className="total-slides">/{products.length}</span>
            </div>
            <button 
              className={`nav-btn-premium swiper-button-prev-custom-${title.replace(/\s/g, '')}`}
              onClick={() => swiperRef.current?.swiper.slidePrev()}
            >
              <ArrowBackIosNewIcon sx={{ fontSize: 16 }} />
            </button>
            <button 
              className={`nav-btn-premium swiper-button-next-custom-${title.replace(/\s/g, '')}`}
              onClick={() => swiperRef.current?.swiper.slideNext()}
            >
              <ArrowForwardIosIcon sx={{ fontSize: 16 }} />
            </button>
          </div>
        </div>

        {/* Timer UI */}
        {isFlashSale && (
          <div className="flash-sale-timer">
            <div className="timer-content">
              <div className="timer-label">Sale ends in</div>
              <div className="timer-display">
                <div className="timer-unit">
                  <span className="timer-value">{timer.hours.toString().padStart(2, '0')}</span>
                  <span className="timer-label-small">HRS</span>
                </div>
                <div className="timer-separator">:</div>
                <div className="timer-unit">
                  <span className="timer-value">{timer.minutes.toString().padStart(2, '0')}</span>
                  <span className="timer-label-small">MIN</span>
                </div>
                <div className="timer-separator">:</div>
                <div className="timer-unit">
                  <span className="timer-value">{timer.seconds.toString().padStart(2, '0')}</span>
                  <span className="timer-label-small">SEC</span>
                </div>
              </div>
            </div>
            <div className="sale-progress">
              <div className="sold-indicator">
                <span className="sold-text">Selling Fast!</span>
                <span className="sold-percentage">78%</span>
              </div>
              <div className="progress-bar-sale">
                <div className="progress-fill-sale" style={{ width: '78%' }}></div>
              </div>
            </div>
          </div>
        )}

        {/* Swiper Slider */}
        <div 
          className="premium-swiper-wrapper"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Swiper
            ref={swiperRef}
            slidesPerView={getSlidesPerView()}
            grid={{ rows: Number(rowsCount), fill: 'row' }}
            spaceBetween={20}
            pagination={{ clickable: true, dynamicBullets: true }}
            mousewheel={{ forceToAxis: true, sensitivity: 0.8, releaseOnEdges: true }}
            freeMode={{ enabled: true, momentum: true }}
            navigation={{
              nextEl: `.swiper-button-next-custom-${title.replace(/\s/g, '')}`,
              prevEl: `.swiper-button-prev-custom-${title.replace(/\s/g, '')}`,
            }}
            modules={[Grid, Pagination, Mousewheel, FreeMode, Navigation]}
            className={`premium-swiper premium-swiper-${title.replace(/\s/g, '')}`}
            onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
            breakpoints={{
              320: { slidesPerView: 2.2, spaceBetween: 12, grid: { rows: Number(rowsCount), fill: 'row' } },
              375: { slidesPerView: 2.4, spaceBetween: 12 },
              480: { slidesPerView: 2.6, spaceBetween: 12 },
              540: { slidesPerView: 2.8, spaceBetween: 14 },
              768: { slidesPerView: Math.max(Number(slidesPerView) - 0.5, 2), spaceBetween: 16, grid: { rows: Number(rowsCount), fill: 'row' } },
              900: { slidesPerView: Number(slidesPerView), spaceBetween: 20 },
              1024: { slidesPerView: Math.max(Number(slidesPerView) - 0.5, 2), spaceBetween: 24 },
              1280: { slidesPerView: Number(slidesPerView), spaceBetween: 28 },
              1536: { slidesPerView: Number(slidesPerView), spaceBetween: 32 }
            }}
          >
            {products.map((product) => (
              <SwiperSlide key={product.id}>
                <PremiumProductUnit 
                  product={product}
                  wishlisted={wishlisted[product.id]}
                  inCart={cartItems[product.id]}
                  onWishlistToggle={() => setWishlisted(prev => ({ ...prev, [product.id]: !prev[product.id] }))}
                  onAddToCart={() => handleAddToCart(product)} // Pass the handler
                  isFlashSale={isFlashSale}
                />
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="progress-indicator">
            <div className="progress-text">Showing {activeIndex + 1} of {products.length}</div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progressPercentage}%` }}></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Product;

// Sub-Component: Product Card
const PremiumProductUnit = ({ product, wishlisted, inCart, onWishlistToggle, onAddToCart, isFlashSale }) => {
  const { 
    imageUrl, price, originalPrice, discount, title: productTitle, 
    categoryPath, ratingNumeric, reviewCount, stockNumeric, features,
    isFeatured, discountNumeric
  } = product;

  // Ensure category string is safe
  const displayCategory = categoryPath ? categoryPath.split('/')[1] : 'Electronics';

  return (
    <div className="premium-product-card">
      <div className="premium-badges">
        <div className="premium-badge badge-new">NEW</div>
        {isFeatured && <div className="premium-badge badge-featured">TOP</div>}
        {discountNumeric > 5 && <div className="premium-badge badge-sale">-{discount}</div>}
        {isFlashSale && <div className="premium-badge badge-flash">FLASH</div>}
        {stockNumeric < 10 && stockNumeric > 0 && <div className="premium-badge badge-low">{stockNumeric} LEFT</div>}
      </div>

      <div className="premium-quick-actions">
        <button 
          className="premium-action-btn wishlist-btn"
          onClick={onWishlistToggle}
          data-active={wishlisted}
        >
          {wishlisted ? <FavoriteIcon sx={{ fontSize: 18, color: '#dc2626' }} /> : <FavoriteBorderIcon sx={{ fontSize: 18 }} />}
        </button>
        <button className="premium-action-btn"><VisibilityIcon sx={{ fontSize: 18 }} /></button>
      </div>

      <div className="premium-image-container">
        <img 
          src={imageUrl} 
          alt={productTitle} 
          className="premium-product-image" 
          loading="lazy"
          onError={(e) => { e.target.src = 'https://placehold.co/600x600?text=No+Image'; }}
        />
        {isFlashSale && (
          <div className="flash-overlay">
            <div className="flash-text"><FlashOnIcon sx={{ fontSize: 14 }} /> FLASH SALE</div>
          </div>
        )}
      </div>

      <div className="premium-product-info">
        <div className="premium-product-meta">
          <div className="premium-product-category">
            <span className="category-badge">{displayCategory}</span>
            <span className="delivery-badge">
              <LocalShippingIcon sx={{ fontSize: 12 }} /> 
              {product.fastDelivery ? 'Fast' : 'Standard'}
            </span>
          </div>
          
          <h3 className="premium-product-title">{productTitle}</h3>
          
          <div className="premium-rating-container">
            <div className="premium-stars">
              {[...Array(5)].map((_, i) => (
                i < Math.floor(ratingNumeric) ? 
                  <StarIcon key={i} className="star-filled" sx={{ fontSize: 14 }} /> : 
                  <StarBorderIcon key={i} className="star-empty" sx={{ fontSize: 14 }} />
              ))}
              <span className="rating-text">{ratingNumeric || '5.0'}</span>
            </div>
            <div className="premium-sold-count">
              <span className="sold-icon">💬</span> {reviewCount || 0} reviews
            </div>
          </div>

          <div className="premium-features-mobile">
            {features && features.slice(0, 2).map((feature, index) => (
              <div key={index} className="premium-feature">
                <CheckCircleIcon sx={{ fontSize: 12, color: '#10b981' }} />
                <span>{feature}</span>
              </div>
            ))}
          </div>
          
          <div className="premium-price-section">
            <div className="price-content">
              <div className="premium-prices">
                <span className="premium-price">Rs.{price}</span>
                <span className="premium-original-price">Rs.{originalPrice}</span>
              </div>
              <div className="savings-badge">
                 Save Rs.{ (product.originalPriceNumeric - product.priceNumeric).toLocaleString() }
              </div>
            </div>
            <div className="premium-discount-badge">-{discount} OFF</div>
          </div>

          {stockNumeric > 0 && stockNumeric < 20 && (
            <div className="stock-indicator">
              <div className="stock-info">
                <div className="stock-text">Only {stockNumeric} left!</div>
                <div className="stock-percentage">{(stockNumeric / 50 * 100).toFixed(0)}%</div>
              </div>
              <div className="stock-bar">
                <div className="stock-fill" style={{ width: `${Math.min((stockNumeric / 50) * 100, 100)}%` }}></div>
              </div>
            </div>
          )}

          {/* Updated Action Buttons: Removed Buy Now, Expanded Add to Cart */}
          <div className="premium-action-buttons">
            <button 
              className={`premium-cart-btn ${inCart ? 'in-cart' : ''}`}
              onClick={(e) => {
                  e.stopPropagation(); // Prevents clicking the card if it's a link
                  onAddToCart();
              }}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <ShoppingCartIcon sx={{ fontSize: 18 }} />
              <span className="btn-text">{inCart ? 'Added' : 'Add to Cart'}</span>
            </button>
            {/* Buy Now Button Removed */}
          </div>
        </div>
      </div>
    </div>
  );
};