import { 
  IconButton, 
  Button, 
  TextField, 
  Rating, 
  Chip, 
  Tooltip,
  Divider,
  Box,
  CircularProgress
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import db from '../../FireBase/firebase';
import './ItemPage.css';

// Material Icons
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BoltIcon from '@mui/icons-material/Bolt';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SecurityIcon from '@mui/icons-material/Security';
import StarIcon from '@mui/icons-material/Star';
import InventoryIcon from '@mui/icons-material/Inventory';
import CategoryIcon from '@mui/icons-material/Category';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import VerifiedIcon from '@mui/icons-material/Verified';
import ShareIcon from '@mui/icons-material/Share';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../Store/ReduxSlice/userClise';


const ItemPage = () => {
  const dispatch = useDispatch();
  
  // Refs
  const mainImageRef = useRef();
  const subImagesRef = useRef([]);
  
  // Get variables from URL
  const { categoryId, id } = useParams();
  
  // State management
  const [itemData, setItemData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  
  // Question State
  const [newQuestion, setNewQuestion] = useState('');
  const [questionSubmitting, setQuestionSubmitting] = useState(false);
  
  // Comment State
  const [commentText, setCommentText] = useState({});
  const [commentSubmitting, setCommentSubmitting] = useState({});

  // Fetch product data
  useEffect(() => {
    if (categoryId && id) {
      fetchProductData();
      checkWishlistStatus();
    }
  }, [categoryId, id]);

  const fetchProductData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const docRef = doc(db, "category2", categoryId, "products", id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const productObject = { 
          id: docSnap.id, 
          ...docSnap.data(),
          // Enhanced data structure
          brand: docSnap.data().brand || 'Premium Brand',
          warranty: docSnap.data().warranty || '2 Years Warranty',
          weight: docSnap.data().weight || '2.5 kg',
          dimensions: docSnap.data().dimensions || '30 x 20 x 15 cm',
          sku: docSnap.data().sku || `SKU-${docSnap.id.slice(0, 8).toUpperCase()}`,
          colorOptions: docSnap.data().colorOptions || ['Classic Red', 'Matte Black', 'Silver'],
          specifications: docSnap.data().specifications || {
            'Material': 'Premium Plastic & Metal',
            'Power Consumption': '45W',
            'Noise Level': '< 25 dB',
            'Speed Settings': '4 Levels',
            'Remote Control': 'Yes',
            'Timer': '8 Hours'
          },
          highlights: docSnap.data().highlights || [
            '70ft Powerful Airflow',
            'Whisper Quiet Operation',
            'Energy Efficient',
            'Remote Controlled',
            '4 Speed Settings',
            '8 Hour Timer'
          ],
          deliveryInfo: {
            freeShipping: true,
            estimatedDelivery: '2-3 Business Days',
            returnPolicy: '30 Days Return Policy'
          }
        };
        setItemData(productObject);
        if (productObject.colorOptions && productObject.colorOptions.length > 0) {
          setSelectedColor(productObject.colorOptions[0]);
        }
      } else {
        setError("Product not found");
      }
    } catch (err) {
      setError("Error loading product");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const checkWishlistStatus = () => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setIsWishlisted(wishlist.includes(id));
  };

  // Handle wishlist toggle
  const handleWishlistToggle = () => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    
    if (isWishlisted) {
      const newWishlist = wishlist.filter(itemId => itemId !== id);
      localStorage.setItem('wishlist', JSON.stringify(newWishlist));
      setIsWishlisted(false);
    } else {
      wishlist.push(id);
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      setIsWishlisted(true);
    }
  };

  // Handle add to cart
  const handleAddToCart = () => {
   
    
    
dispatch(addToCart({test:'tt'}));
    
 
    
    // Show success notification
    alert(`✓ ${quantity} ${quantity > 1 ? 'items' : 'item'} added to cart! `);
  };

  // Handle buy now
  const handleBuyNow = () => {
    handleAddToCart();
    // In a real app, you would navigate to checkout
    alert('Redirecting to checkout...');
  };

  // Handle share product
  const handleShare = async () => {
    const shareData = {
      title: itemData.title,
      text: `Check out ${itemData.title} - Only Rs. ${itemData.price.toLocaleString()}`,
      url: window.location.href,
    };

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Product link copied to clipboard! 📋');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  // Handle compare
  const handleCompare = () => {
    const compareList = JSON.parse(localStorage.getItem('compare') || '[]');
    if (!compareList.includes(id)) {
      compareList.push(id);
      localStorage.setItem('compare', JSON.stringify(compareList));
      alert('Added to compare list!');
    } else {
      alert('Already in compare list!');
    }
  };

  // Submit question
  const handleSubmitQuestion = async () => {
    if (!newQuestion.trim()) return;
    
    setQuestionSubmitting(true);
    try {
      const docRef = doc(db, "category2", categoryId, "products", id);
      const docSnap = await getDoc(docRef);
      
      const questionObject = {
        id: Date.now().toString(),
        question: newQuestion,
        userName: 'You',
        userId: 'user123',
        timestamp: new Date().toISOString(),
        comments: []
      };

      if (docSnap.exists()) {
        const currentData = docSnap.data();
        const updatedQuestions = currentData.askQuestion 
          ? [...currentData.askQuestion, questionObject]
          : [questionObject];
        
        await updateDoc(docRef, { askQuestion: updatedQuestions });
      }
      
      await fetchProductData();
      setNewQuestion('');
      alert('Question posted successfully!');
    } catch (err) {
      console.error("Error posting question:", err);
      alert('Failed to post question. Please try again.');
    } finally {
      setQuestionSubmitting(false);
    }
  };

  // Add comment
  const handleAddComment = async (questionId) => {
    const comment = commentText[questionId];
    if (!comment?.trim()) return;

    setCommentSubmitting(prev => ({ ...prev, [questionId]: true }));

    try {
      const docRef = doc(db, "category2", categoryId, "products", id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const currentData = docSnap.data();
        if (!currentData.askQuestion) return;

        const commentObject = {
          id: Date.now().toString(),
          text: comment,
          userName: 'You',
          userId: 'user123',
          timestamp: new Date().toISOString(),
        };

        const updatedQuestions = currentData.askQuestion.map(q => {
          if (q.id === questionId) {
            const existingComments = Array.isArray(q.comments) ? q.comments : [];
            return { ...q, comments: [...existingComments, commentObject] };
          }
          return q;
        });

        await updateDoc(docRef, { askQuestion: updatedQuestions });
        await fetchProductData();
        setCommentText(prev => ({ ...prev, [questionId]: '' }));
        alert('Answer posted successfully!');
      }
    } catch (err) {
      console.error("Error adding comment:", err);
      alert('Failed to post answer.');
    } finally {
      setCommentSubmitting(prev => ({ ...prev, [questionId]: false }));
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-fef2f2 to-fee2e2'>
        <div className='text-center'>
          <CircularProgress 
            size={60} 
            thickness={4}
            sx={{ color: '#b91c1c', mb: 3 }}
          />
          <div className='text-xl font-semibold text-gray-700 mb-2'>Loading Product Details</div>
          <div className='text-sm text-gray-500'>Please wait while we fetch the product information...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !itemData) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-fef2f2 to-fee2e2'>
        <div className='text-center max-w-md p-8'>
          <div className='text-6xl mb-6'>😞</div>
          <div className='text-2xl font-bold text-red-600 mb-3'>{error || "Product Not Found"}</div>
          <div className='text-gray-600 mb-6'>We couldn't find the product you're looking for.</div>
          <Button 
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={() => window.history.back()}
            sx={{
              background: 'linear-gradient(135deg, #b91c1c, #dc2626)',
              padding: '12px 32px',
              fontSize: '16px',
              fontWeight: '700',
              borderRadius: '12px',
              '&:hover': {
                background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(185, 28, 28, 0.3)'
              }
            }}
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const itemImages = itemData.moreImage && Array.isArray(itemData.moreImage) && itemData.moreImage.length > 0 
    ? itemData.moreImage 
    : itemData.imageUrl 
      ? [itemData.imageUrl] 
      : [];

  const reviews = Array.isArray(itemData.reviews) ? itemData.reviews : [];
  const questions = Array.isArray(itemData.askQuestion) ? itemData.askQuestion : [];

  return (
    <div className='item-page-container fade-in'>
      {/* Breadcrumb Navigation */}
      <div className='breadcrumb mb-6 flex items-center text-sm text-gray-600 flex-wrap'>
        <button 
          onClick={() => window.history.back()}
          className='flex items-center gap-1 text-red-600 hover:text-red-700 font-medium mr-3'
        >
          <ArrowBackIcon fontSize='small' />
          Back
        </button>
        <span className='mr-2'>/</span>
        <a href='/' className='hover:text-red-600 transition-colors'>Home</a>
        <span className='mx-2'>/</span>
        <span className='text-gray-400'>{categoryId}</span>
        <span className='mx-2'>/</span>
        <span className='font-semibold text-gray-800 truncate'>{itemData.title}</span>
      </div>

      {/* Main Product Grid */}
      <div className='product-grid'>
        {/* Left Column - Image Gallery */}
        <div className='image-gallery'>
          {/* Main Image with Zoom */}
          <div className='main-image-container'>
            {itemImages.length > 0 && (
              <>
                <img 
                  ref={mainImageRef} 
                  src={itemImages[selectedImageIndex]} 
                  alt={itemData.title} 
                  className='main-image'
                  loading='lazy'
                />
                <div className='image-zoom-overlay'>
                  <ZoomInIcon fontSize='small' />
                  Click to Zoom
                </div>
              </>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {itemImages.length > 1 && (
            <div className='thumbnail-section'>
              <div className='text-sm font-semibold text-gray-700 mb-3'>
                More Views ({itemImages.length})
              </div>
              <div className='thumbnail-grid'>
                {itemImages.map((imageUrl, index) => (
                  <div 
                    key={index}
                    className={`thumbnail-item ${selectedImageIndex === index ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedImageIndex(index);
                      if (mainImageRef.current) {
                        mainImageRef.current.src = imageUrl;
                      }
                    }}
                  >
                    <img 
                      ref={(refEle) => (subImagesRef.current[index] = refEle)} 
                      src={imageUrl} 
                      alt={`View ${index + 1}`}  
                      className='thumbnail-image'
                      loading='lazy'
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className='quick-actions'>
            <Tooltip title="Add to Compare">
              <IconButton className='action-btn-small' onClick={handleCompare}>
                <CompareArrowsIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Share Product">
              <IconButton className='action-btn-small' onClick={handleShare}>
                <ShareIcon />
              </IconButton>
            </Tooltip>
          </div>
        </div>

        {/* Right Column - Product Information */}
        <div className='product-info-card'>
          {/* Brand & Title */}
          <div className='brand-badge'>{itemData.brand}</div>
          <h1 className='product-title'>{itemData.title}</h1>
          
          {/* Rating & Verified Badge */}
          <div className='rating-container'>
            <div className='rating-stars'>
              <Rating 
                value={parseFloat(itemData.rating) || 4.5} 
                precision={0.5} 
                readOnly 
                size="medium"
                sx={{ color: '#f59e0b' }}
              />
              <span className='rating-count ml-2'>
                ({itemData.reviewCount || '0'} reviews)
              </span>
            </div>
            <div className='verified-badge'>
              <VerifiedIcon fontSize='small' />
              Verified Purchase
            </div>
          </div>

          <Divider sx={{ my: 2, borderColor: '#fee2e2' }} />

          {/* Price Section */}
          <div className='price-section'>
            <div className='flex items-center flex-wrap gap-4'>
              <div className='current-price'>
                <span className='currency'>Rs.</span>
                {Number(itemData.price).toLocaleString()}
              </div>
              
              {itemData.originalPrice && itemData.originalPrice !== itemData.price && (
                <>
                  <span className='original-price'>
                    Rs.{Number(itemData.originalPrice).toLocaleString()}
                  </span>
                  <span className='discount-badge'>
                    {itemData.discount || Math.round((1 - itemData.price/itemData.originalPrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>
            
            {itemData.originalPrice && (
              <div className='savings-text'>
                <CheckCircleIcon fontSize='small' />
                Save Rs.{(itemData.originalPrice - itemData.price).toLocaleString()} 
                <span className='text-gray-600 text-sm ml-2'>
                  ({Math.round((1 - itemData.price/itemData.originalPrice) * 100)}% off)
                </span>
              </div>
            )}
          </div>

          {/* Stock & Status Badges */}
          <div className='badges-container'>
            <div className={`stock-badge ${itemData.inStock ? 'in-stock' : 'out-of-stock'}`}>
              <InventoryIcon fontSize='small' />
              {itemData.inStock ? 'In Stock' : 'Out of Stock'}
              {itemData.stockCount && ` (${itemData.stockCount} units)`}
            </div>
            
            {itemData.fastDelivery && (
              <div className='stock-badge delivery-badge'>
                <BoltIcon fontSize='small' />
                Fast Delivery
              </div>
            )}
            
            {itemData.isFeatured && (
              <div className='stock-badge featured-badge'>
                <StarIcon fontSize='small' />
                Featured Product
              </div>
            )}
          </div>

          {/* Product Highlights */}
          <div className='mt-6'>
            <h3 className='text-lg font-bold text-gray-800 mb-4'>Key Features</h3>
            <div className='highlights-grid'>
              {itemData.highlights?.slice(0, 4).map((highlight, index) => (
                <div key={index} className='highlight-card'>
                  <div className='highlight-icon'>✓</div>
                  <div className='text-sm font-semibold text-gray-700'>{highlight}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          {itemData.colorOptions && itemData.colorOptions.length > 0 && (
            <div className='color-options-section'>
              <div className='text-sm font-semibold text-gray-700 mb-3'>Available Colors</div>
              <div className='color-options-grid'>
                {itemData.colorOptions.map((color, index) => (
                  <Chip
                    key={index}
                    label={color}
                    className={`color-chip ${selectedColor === color ? 'selected' : ''}`}
                    onClick={() => setSelectedColor(color)}
                    clickable
                  />
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className='quantity-section'>
            <div className='quantity-label'>Quantity</div>
            <div className='quantity-controls'>
              <IconButton 
                className='quantity-btn'
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <RemoveIcon />
              </IconButton>
              
              <TextField
                type='number'
                value={quantity}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 1;
                  setQuantity(Math.max(1, Math.min(value, itemData.stockCount || 10)));
                }}
                className='quantity-input'
                variant='outlined'
                size='small'
                inputProps={{ 
                  min: 1, 
                  max: itemData.stockCount || 10,
                  style: { textAlign: 'center' }
                }}
              />
              
              <IconButton 
                className='quantity-btn'
                onClick={() => setQuantity(quantity + 1)}
                disabled={quantity >= (itemData.stockCount || 10)}
              >
                <AddIcon />
              </IconButton>
              
              <div className='text-sm text-gray-600 ml-4'>
                Max: {itemData.stockCount || 10} units
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='action-buttons'>
            <Button 
              className='buy-now-btn action-btn'
              startIcon={<CreditCardIcon />}
              onClick={handleBuyNow}
              disabled={!itemData.inStock}
            >
              BUY NOW
            </Button>
            
            <Button 
              className='add-cart-btn action-btn'
              startIcon={<AddShoppingCartIcon />}
              onClick={handleAddToCart}
              disabled={!itemData.inStock}
            >
              ADD TO CART
            </Button>
            
            <Button 
              className={`wishlist-btn action-btn ${isWishlisted ? 'active' : ''}`}
              startIcon={isWishlisted ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              onClick={handleWishlistToggle}
            >
              {isWishlisted ? 'SAVED' : 'SAVE'}
            </Button>
          </div>

          {/* Product Details */}
          <div className='product-details-grid'>
            <div className='detail-card'>
              <div className='detail-label'>Warranty</div>
              <div className='detail-value'>{itemData.warranty}</div>
            </div>
            <div className='detail-card'>
              <div className='detail-label'>SKU</div>
              <div className='detail-value'>{itemData.sku}</div>
            </div>
            <div className='detail-card'>
              <div className='detail-label'>Weight</div>
              <div className='detail-value'>{itemData.weight}</div>
            </div>
            <div className='detail-card'>
              <div className='detail-label'>Delivery</div>
              <div className='detail-value'>{itemData.deliveryInfo?.estimatedDelivery || '2-3 Days'}</div>
            </div>
          </div>

          {/* Delivery Info */}
          {itemData.deliveryInfo && (
            <div className='mt-6 p-4 bg-green-50 rounded-lg border border-green-200'>
              <div className='flex items-center gap-3 mb-2'>
                <LocalShippingIcon sx={{ color: '#059669' }} />
                <span className='font-semibold text-green-800'>Free Delivery</span>
              </div>
              <div className='text-sm text-green-700'>
                {itemData.deliveryInfo.freeShipping && '✓ Free shipping on all orders'}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs Section */}
      <div className='tabs-container'>
        <div className='tabs-header scrollbar-hide'>
          <button 
            className={`tab-button ${activeTab === 'description' ? 'active' : ''}`}
            onClick={() => setActiveTab('description')}
          >
            Description
          </button>
          <button 
            className={`tab-button ${activeTab === 'specifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('specifications')}
          >
            Specifications
          </button>
          <button 
            className={`tab-button ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews ({reviews.length})
          </button>
          <button 
            className={`tab-button ${activeTab === 'questions' ? 'active' : ''}`}
            onClick={() => setActiveTab('questions')}
          >
            Q&A ({questions.length})
          </button>
        </div>

        <div className='tab-content'>
          {/* Description Tab */}
          {activeTab === 'description' && (
            <div>
              <h2 className='text-2xl font-bold text-gray-900 mb-6'>Product Description</h2>
              <div className='prose max-w-none'>
                <p className='text-gray-700 leading-relaxed mb-6 text-lg'>
                  {itemData.description}
                </p>
                
                {itemData.highlights && itemData.highlights.length > 0 && (
                  <div className='mt-8'>
                    <h3 className='text-xl font-bold text-gray-900 mb-4'>Key Highlights</h3>
                    <ul className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                      {itemData.highlights.map((highlight, index) => (
                        <li key={index} className='flex items-start gap-3'>
                          <div className='w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1'>
                            <CheckCircleIcon sx={{ color: '#dc2626', fontSize: '16px' }} />
                          </div>
                          <span className='text-gray-700'>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Specifications Tab */}
          {activeTab === 'specifications' && (
            <div>
              <h2 className='text-2xl font-bold text-gray-900 mb-6'>Technical Specifications</h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {itemData.specifications && Object.entries(itemData.specifications).map(([key, value]) => (
                  <div key={key} className='bg-gray-50 rounded-lg p-4'>
                    <div className='text-sm text-gray-500 mb-1'>{key}</div>
                    <div className='font-semibold text-gray-900'>{value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div>
              <div className='flex justify-between items-center mb-6'>
                <h2 className='text-2xl font-bold text-gray-900'>Customer Reviews</h2>
                <div className='text-4xl font-bold text-red-600'>
                  {parseFloat(itemData.rating)?.toFixed(1) || '4.5'}/5
                </div>
              </div>

              {reviews.length === 0 ? (
                <div className='text-center py-12'>
                  <div className='text-6xl mb-4'>📝</div>
                  <h3 className='text-xl font-bold text-gray-700 mb-2'>No Reviews Yet</h3>
                  <p className='text-gray-500 mb-6'>Be the first to share your experience with this product!</p>
                  <Button 
                    variant='contained'
                    sx={{
                      background: 'linear-gradient(135deg, #b91c1c, #dc2626)',
                      padding: '12px 32px',
                      fontWeight: '700'
                    }}
                  >
                    Write a Review
                  </Button>
                </div>
              ) : (
                <div className='space-y-6'>
                  {reviews.map((review, index) => (
                    <div key={review.id || index} className='review-card'>
                      <div className='review-header'>
                        <div className='review-avatar'>
                          {review.userName?.charAt(0) || 'U'}
                        </div>
                        <div className='review-meta'>
                          <div className='flex justify-between items-start'>
                            <div>
                              <div className='font-bold text-gray-900'>{review.userName || 'Anonymous User'}</div>
                              <Rating value={review.rating || 4} readOnly size="small" />
                            </div>
                            <div className='review-date'>
                              {review.timestamp ? new Date(review.timestamp).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              }) : ''}
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className='text-gray-700'>{review.comment || 'Great product!'}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Questions Tab */}
          {activeTab === 'questions' && (
            <div>
              <h2 className='text-2xl font-bold text-gray-900 mb-6'>Questions & Answers</h2>
              
              {/* Ask Question Form */}
              <div className='bg-red-50 rounded-xl p-6 mb-8 border border-red-100'>
                <h3 className='text-lg font-bold text-gray-900 mb-4'>Have a question about this product?</h3>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="Type your question here..."
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  variant="outlined"
                  size="medium"
                  disabled={questionSubmitting}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'white',
                      borderRadius: '12px'
                    }
                  }}
                />
                <Button 
                  variant="contained"
                  onClick={handleSubmitQuestion}
                  disabled={questionSubmitting || !newQuestion.trim()}
                  sx={{
                    mt: 3,
                    background: 'linear-gradient(135deg, #b91c1c, #dc2626)',
                    padding: '12px 32px',
                    fontWeight: '700',
                    borderRadius: '12px',
                    '&:disabled': {
                      background: '#fca5a5'
                    }
                  }}
                >
                  {questionSubmitting ? (
                    <>
                      <CircularProgress size={20} sx={{ color: 'white', mr: 1 }} />
                      Posting Question...
                    </>
                  ) : 'Post Question'}
                </Button>
              </div>

              {/* Questions List */}
              {questions.length === 0 ? (
                <div className='text-center py-12'>
                  <div className='text-6xl mb-4'>❓</div>
                  <h3 className='text-xl font-bold text-gray-700 mb-2'>No Questions Yet</h3>
                  <p className='text-gray-500'>Be the first to ask a question about this product!</p>
                </div>
              ) : (
                <div className='space-y-6'>
                  {questions.map((question, index) => (
                    <div key={question.id || index} className='question-card'>
                      <div className='flex justify-between items-start mb-4'>
                        <div>
                          <div className='flex items-center gap-2 mb-1'>
                            <div className='w-8 h-8 bg-red-100 rounded-full flex items-center justify-center'>
                              <span className='text-sm font-bold text-red-600'>Q</span>
                            </div>
                            <span className='font-bold text-gray-900'>{question.userName || 'Customer'}</span>
                          </div>
                          <p className='text-lg font-semibold text-gray-800 ml-10'>{question.question}</p>
                        </div>
                        <span className='text-sm text-gray-500 whitespace-nowrap'>
                          {question.timestamp ? new Date(question.timestamp).toLocaleDateString() : ''}
                        </span>
                      </div>

                      {/* Answers */}
                      {question.comments && question.comments.length > 0 && (
                        <div className='ml-10 space-y-4'>
                          <div className='text-sm font-semibold text-gray-700 mb-2'>
                            {question.comments.length} Answer{question.comments.length !== 1 ? 's' : ''}
                          </div>
                          {question.comments.map((comment, cIndex) => (
                            <div key={comment.id || cIndex} className='bg-white rounded-lg p-4 border border-gray-200'>
                              <div className='flex justify-between items-start mb-2'>
                                <div className='flex items-center gap-2'>
                                  <div className='w-6 h-6 bg-green-100 rounded-full flex items-center justify-center'>
                                    <span className='text-xs font-bold text-green-600'>A</span>
                                  </div>
                                  <span className='font-semibold text-gray-800'>{comment.userName}</span>
                                </div>
                                <span className='text-xs text-gray-500'>
                                  {comment.timestamp ? new Date(comment.timestamp).toLocaleDateString() : ''}
                                </span>
                              </div>
                              <p className='text-gray-700'>{comment.text}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add Answer */}
                      <div className='mt-6 ml-10'>
                        <div className='text-sm font-semibold text-gray-700 mb-2'>Your Answer</div>
                        <div className='flex gap-3'>
                          <TextField
                            size="small"
                            fullWidth
                            placeholder="Write your answer..."
                            value={commentText[question.id] || ''}
                            onChange={(e) => setCommentText(prev => ({ ...prev, [question.id]: e.target.value }))}
                            disabled={commentSubmitting[question.id]}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: '10px',
                                backgroundColor: 'white'
                              }
                            }}
                          />
                          <Button 
                            variant="contained"
                            size="medium"
                            onClick={() => handleAddComment(question.id)}
                            disabled={commentSubmitting[question.id] || !commentText[question.id]?.trim()}
                            sx={{
                              background: 'linear-gradient(135deg, #b91c1c, #dc2626)',
                              borderRadius: '10px',
                              fontWeight: '700',
                              minWidth: '100px'
                            }}
                          >
                            {commentSubmitting[question.id] ? 'Posting...' : 'Answer'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Related Products Placeholder */}
      <div className='mt-12'>
        <h2 className='text-2xl font-bold text-gray-900 mb-6'>Related Products</h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className='bg-white rounded-xl p-4 border border-gray-200 hover:border-red-300 transition-colors cursor-pointer'>
              <div className='aspect-square bg-gray-100 rounded-lg mb-3'></div>
              <div className='h-4 bg-gray-200 rounded mb-2'></div>
              <div className='h-4 bg-gray-200 rounded w-3/4'></div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Delivery Banner */}
      <div className='mt-12 bg-gradient-to-r from-red-50 to-red-100 rounded-2xl p-6 border border-red-200'>
        <div className='flex flex-col md:flex-row items-center justify-between gap-4'>
          <div className='flex items-center gap-4'>
            <div className='w-12 h-12 bg-red-500 rounded-full flex items-center justify-center'>
              <LocalShippingIcon sx={{ color: 'white' }} />
            </div>
            <div>
              <div className='font-bold text-lg text-gray-900'>Free & Fast Delivery</div>
              <div className='text-gray-600'>Delivery in 2-3 business days • 30-day return policy</div>
            </div>
          </div>
          <Button 
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #b91c1c, #dc2626)',
              padding: '12px 32px',
              fontWeight: '800',
              borderRadius: '12px',
              fontSize: '16px'
            }}
          >
            Buy Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ItemPage;