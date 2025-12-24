import { IconButton, Button, TextField, Rating } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore'
import db from '../../FireBase/firebase'

const ItemPage = () => {
  // 1. Refs at the top level
  const mainImageRef = useRef();
  const subImagesRef = useRef([]);

  // 2. Get variables from URL
  const { categoryId, id } = useParams();
  
  // 3. State management
  const [itemData, setItemData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('reviews'); // 'reviews' or 'questions'
  
  // Question State
  const [newQuestion, setNewQuestion] = useState('');
  const [questionSubmitting, setQuestionSubmitting] = useState(false);
  
  // Comment State
  const [commentText, setCommentText] = useState({});
  const [commentSubmitting, setCommentSubmitting] = useState({});

  // 4. Fetch product data
  useEffect(() => {
    if (categoryId && id) {
      fetchProductData();
    }
  }, [categoryId, id]);

  const fetchProductData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const docRef = doc(db, "category2", categoryId, "products", id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const productObject = { id: docSnap.id, ...docSnap.data() };
        setItemData(productObject);
        console.log("Product data loaded:", productObject);
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

  // 5. Handle submitting a new question with proper key creation/append
  const handleSubmitQuestion = async () => {
    if (!newQuestion.trim()) {
      alert('Please enter a question');
      return;
    }

    setQuestionSubmitting(true);
    try {
      const docRef = doc(db, "category2", categoryId, "products", id);
      const docSnap = await getDoc(docRef);
      
      const questionObject = {
        id: Date.now().toString(),
        question: newQuestion,
        userName: 'Anonymous User', // Replace with actual user name from auth
        userId: 'user123', // Replace with actual user ID from auth
        timestamp: new Date().toISOString(),
        comments: []
      };

      if (docSnap.exists()) {
        const currentData = docSnap.data();
        
        // Check if askQuestion key exists and is an array
        if (currentData.askQuestion && Array.isArray(currentData.askQuestion)) {
          // Key exists - append to existing array
          await updateDoc(docRef, {
            askQuestion: [...currentData.askQuestion, questionObject]
          });
        } else {
          // Key doesn't exist or is not an array - create new array
          await updateDoc(docRef, {
            askQuestion: [questionObject]
          });
        }
      } else {
        // Document doesn't exist - create it with the question
        await setDoc(docRef, {
          askQuestion: [questionObject]
        });
      }

      // Refresh data
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

  // 6. Handle adding comment to question with proper key handling
  const handleAddComment = async (questionId) => {
    const comment = commentText[questionId];
    if (!comment?.trim()) {
      alert('Please enter a comment');
      return;
    }

    // Set submitting state for this specific comment
    setCommentSubmitting(prev => ({ ...prev, [questionId]: true }));

    try {
      const docRef = doc(db, "category2", categoryId, "products", id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const currentData = docSnap.data();
        
        // Check if askQuestion exists and is an array
        if (!currentData.askQuestion || !Array.isArray(currentData.askQuestion)) {
          alert('Question not found');
          return;
        }

        const commentObject = {
          id: Date.now().toString(),
          text: comment,
          userName: 'Anonymous User',
          userId: 'user123', // Replace with actual user ID
          timestamp: new Date().toISOString(),
          commentInComment: []
        };

        // Update the specific question's comments
        const updatedQuestions = currentData.askQuestion.map(q => {
          if (q.id === questionId) {
            // Check if comments array exists
            const existingComments = Array.isArray(q.comments) ? q.comments : [];
            return {
              ...q,
              comments: [...existingComments, commentObject]
            };
          }
          return q;
        });

        await updateDoc(docRef, { askQuestion: updatedQuestions });
        await fetchProductData();
        setCommentText(prev => ({ ...prev, [questionId]: '' }));
        alert('Comment added successfully!');
      }
    } catch (err) {
      console.error("Error adding comment:", err);
      alert('Failed to add comment');
    } finally {
      setCommentSubmitting(prev => ({ ...prev, [questionId]: false }));
    }
  };

  // 7. Initialize reviews key if it doesn't exist (optional helper function)
  const initializeReviewsIfNeeded = async () => {
    try {
      const docRef = doc(db, "category2", categoryId, "products", id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const currentData = docSnap.data();
        
        // If reviews key doesn't exist, create it
        if (!currentData.reviews) {
          await updateDoc(docRef, {
            reviews: []
          });
          console.log('Reviews key initialized');
        }
      }
    } catch (err) {
      console.error("Error initializing reviews:", err);
    }
  };

  // 8. Render logic
  if (loading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <div className='text-xl'>Loading...</div>
      </div>
    );
  }

  if (error || !itemData) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <div className='text-xl text-red-500'>{error || "Product not found"}</div>
      </div>
    );
  }

  // Get images array with error handling
  const itemImages = itemData.moreImage && Array.isArray(itemData.moreImage) && itemData.moreImage.length > 0 
    ? itemData.moreImage 
    : itemData.imageUrl 
      ? [itemData.imageUrl] 
      : [];

  // Safe access to reviews and questions with error handling
  const reviews = Array.isArray(itemData.reviews) ? itemData.reviews : [];
  const questions = Array.isArray(itemData.askQuestion) ? itemData.askQuestion : [];

  return (
    <div className='px-5 py-[10px] w-full h-screen overflow-y-scroll'>
      {/* Title */}
      <h1 className='text-lg font-bold px-3 mb-7'>{itemData.title || 'Item Title'}</h1>
      
      {/* Main Image */}
      {itemImages.length > 0 && (
        <img 
          ref={mainImageRef} 
          src={itemImages[0]} 
          alt={itemData.title || 'Product Image'} 
          className='w-full object-contain rounded-md max-h-96'
        />
      )}
      
      {/* Thumbnail Images Grid */}
      {itemImages.length > 1 && (
        <div className='w-full mt-5 grid grid-cols-4 text-center grid-rows-1 gap-3'>
          {itemImages.map((imageUrl, index) => (
            <IconButton 
              key={index} 
              sx={{
                padding: '0',
                borderRadius: "2px"
              }} 
              onClick={() => {
                if (subImagesRef.current[index] && mainImageRef.current) {
                  subImagesRef.current[index].style.border = '1px solid gold';
                  mainImageRef.current.src = subImagesRef.current[index].src;
                  for (let i = 0; i < itemImages.length; i++) {
                    if (i !== index && subImagesRef.current[i]) {
                      subImagesRef.current[i].style.border = "none";
                    }
                  }
                }
              }}
            >
              <img 
                ref={(refEle) => (subImagesRef.current[index] = refEle)} 
                src={imageUrl} 
                alt={`${itemData.title} - Image ${index + 1}`}  
                className='w-full object-contain rounded-sm'
              />
            </IconButton>
          ))}
        </div>
      )}

      {/* Product Details */}
      <div className='mt-7 px-3'>
        {/* Price Section */}
        <div className='mb-5'>
          <div className='flex items-center gap-3'>
            <span className='text-2xl font-bold text-green-600'>
              Rs. {itemData.price ? Number(itemData.price).toLocaleString() : '0'}
            </span>
            {itemData.originalPrice && itemData.originalPrice !== itemData.price && (
              <>
                <span className='text-lg line-through text-gray-400'>
                  Rs. {Number(itemData.originalPrice).toLocaleString()}
                </span>
                {itemData.discount && (
                  <span className='text-sm bg-red-500 text-white px-2 py-1 rounded'>
                    {itemData.discount} OFF
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        {/* Stock Status */}
        <div className='mb-5'>
          {itemData.inStock ? (
            <span className='text-green-600 font-semibold'>
              In Stock {itemData.stockCount && `(${itemData.stockCount} available)`}
            </span>
          ) : (
            <span className='text-red-600 font-semibold'>Out of Stock</span>
          )}
          {itemData.fastDelivery && (
            <span className='ml-3 text-blue-600 font-semibold'>⚡ Fast Delivery</span>
          )}
        </div>

        {/* Rating */}
        {itemData.rating && (
          <div className='mb-5'>
            <span className='text-yellow-500 font-semibold'>
              ⭐ {itemData.rating}/5
            </span>
            {itemData.reviewCount && (
              <span className='text-gray-500 ml-2'>
                ({itemData.reviewCount} reviews)
              </span>
            )}
          </div>
        )}

        {/* Description */}
        {itemData.description && (
          <div className='mb-5'>
            <h2 className='text-lg font-semibold mb-2'>Description</h2>
            <p className='text-gray-700 leading-relaxed'>{itemData.description}</p>
          </div>
        )}

        {/* Featured Badge */}
        {itemData.isFeatured && (
          <div className='mb-5'>
            <span className='bg-purple-500 text-white px-3 py-1 rounded-full text-sm'>
              ⭐ Featured Product
            </span>
          </div>
        )}

        {/* Reviews and Questions Section */}
        <div className='mt-10 border-t pt-5'>
          {/* Tabs */}
          <div className='flex gap-4 mb-5 border-b'>
            <button
              className={`pb-2 px-4 font-semibold ${activeTab === 'reviews' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews ({reviews.length})
            </button>
            <button
              className={`pb-2 px-4 font-semibold ${activeTab === 'questions' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
              onClick={() => setActiveTab('questions')}
            >
              Questions ({questions.length})
            </button>
          </div>

          {/* Reviews Tab - Read Only */}
          {activeTab === 'reviews' && (
            <div>
              <h3 className='text-lg font-semibold mb-5'>Customer Reviews</h3>

              {reviews.length === 0 ? (
                <div className='text-center py-8'>
                  <p className='text-gray-500 mb-2'>No reviews yet.</p>
                  <p className='text-sm text-gray-400'>Be the first to share your experience!</p>
                </div>
              ) : (
                <div className='space-y-4'>
                  {reviews.map((review, index) => (
                    <div key={review.id || index} className='border rounded-lg p-4 bg-gray-50 shadow-sm'>
                      <div className='flex items-start justify-between mb-2'>
                        <div>
                          <p className='font-semibold text-gray-800'>{review.userName || 'Anonymous'}</p>
                          <Rating value={review.rating || 0} readOnly size="small" />
                        </div>
                        <span className='text-sm text-gray-500'>
                          {review.timestamp ? new Date(review.timestamp).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          }) : ''}
                        </span>
                      </div>
                      <p className='text-gray-700 mt-2'>{review.comment || ''}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Questions Tab */}
          {activeTab === 'questions' && (
            <div>
              <h3 className='text-lg font-semibold mb-5'>Questions & Answers</h3>
              
              {/* Ask Question Form */}
              <div className='mb-6 border rounded-lg p-4 bg-blue-50 shadow-sm'>
                <h4 className='font-semibold mb-3 text-gray-800'>Have a question about this product?</h4>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Type your question here..."
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  variant="outlined"
                  size="small"
                  disabled={questionSubmitting}
                />
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={handleSubmitQuestion}
                  disabled={questionSubmitting || !newQuestion.trim()}
                  sx={{ mt: 2 }}
                >
                  {questionSubmitting ? 'Posting...' : 'Post Question'}
                </Button>
              </div>

              {/* Questions List */}
              {questions.length === 0 ? (
                <div className='text-center py-8'>
                  <p className='text-gray-500 mb-2'>No questions yet.</p>
                  <p className='text-sm text-gray-400'>Be the first to ask!</p>
                </div>
              ) : (
                <div className='space-y-6'>
                  {questions.map((question, index) => (
                    <div key={question.id || index} className='border rounded-lg p-4 bg-gray-50 shadow-sm'>
                      <div className='mb-3'>
                        <div className='flex items-start justify-between mb-2'>
                          <div className='flex-1'>
                            <p className='font-semibold text-blue-600 text-base'>Q: {question.question || ''}</p>
                          </div>
                          <span className='text-sm text-gray-500 ml-3'>
                            {question.timestamp ? new Date(question.timestamp).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            }) : ''}
                          </span>
                        </div>
                        <p className='text-sm text-gray-600'>
                          Asked by <span className='font-medium'>{question.userName || 'Anonymous'}</span>
                        </p>
                      </div>

                      {/* Comments */}
                      {Array.isArray(question.comments) && question.comments.length > 0 && (
                        <div className='ml-4 mt-4 space-y-3 border-l-2 border-blue-300 pl-4'>
                          <p className='text-sm font-semibold text-gray-700 mb-2'>
                            {question.comments.length} {question.comments.length === 1 ? 'Answer' : 'Answers'}
                          </p>
                          {question.comments.map((comment, cIndex) => (
                            <div key={comment.id || cIndex} className='bg-white p-3 rounded shadow-sm'>
                              <div className='flex items-start justify-between mb-1'>
                                <p className='font-semibold text-sm text-gray-800'>{comment.userName || 'Anonymous'}</p>
                                <span className='text-xs text-gray-500'>
                                  {comment.timestamp ? new Date(comment.timestamp).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric'
                                  }) : ''}
                                </span>
                              </div>
                              <p className='text-gray-700 text-sm mt-1'>{comment.text || ''}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add Comment */}
                      <div className='mt-4 flex gap-2'>
                        <TextField
                          size="small"
                          fullWidth
                          placeholder="Add your answer..."
                          value={commentText[question.id] || ''}
                          onChange={(e) => setCommentText(prev => ({ ...prev, [question.id]: e.target.value }))}
                          disabled={commentSubmitting[question.id]}
                        />
                        <Button 
                          variant="outlined" 
                          size="small"
                          onClick={() => handleAddComment(question.id)}
                          disabled={commentSubmitting[question.id] || !commentText[question.id]?.trim()}
                        >
                          {commentSubmitting[question.id] ? 'Posting...' : 'Answer'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemPage;