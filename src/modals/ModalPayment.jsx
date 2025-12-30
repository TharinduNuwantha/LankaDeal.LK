import { Modal } from '@mui/material';
import { addDoc, collection, serverTimestamp, doc, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore';
import React, { useImperativeHandle, useState, forwardRef } from 'react';
import db from '../FireBase/firebase';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity, clearCart } from '../../src/Store/ReduxSlice/userClise';

const ModalPayment = forwardRef((props, ref) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [deletingItem, setDeletingItem] = useState(null);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const dispatch = useDispatch();
  const cart = useSelector((state) => state.user.user.cart || []);
  const userId = useSelector((state) => state.user.user.uid || state.user.user.id);

  const handleClose = () => {
    setOpen(false);
    setOrderPlaced(false);
    setCustomerInfo({ name: '', email: '', phone: '', address: '' });
  };

  useImperativeHandle(ref, () => ({
    handleOpen: () => setOpen(true),
  }));

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => {
    const price = parseFloat(item.price) || 0;
    const quantity = item.quantity || 1;
    return sum + price * quantity;
  }, 0);

  const deliveryFee = cart.some((item) => item.fastDelivery) ? 500 : 0;
  const total = subtotal + deliveryFee;
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const handleInputChange = (e) => {
    setCustomerInfo({
      ...customerInfo,
      [e.target.name]: e.target.value,
    });
  };

  // Delete item from cart
  const handleDeleteItem = async (item) => {
    if (!userId) {
      alert('User not logged in');
      return;
    }

    setDeletingItem(item.id);

    try {
      // 1. Remove from Firebase
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        cart: arrayRemove(item)
      });

      // 2. Remove from Redux
      dispatch(removeFromCart(item.id));

      console.log('Item deleted successfully');
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item. Please try again.');
    } finally {
      setDeletingItem(null);
    }
  };

  // Update quantity
  const handleUpdateQuantity = async (item, newQuantity) => {
    if (!userId || newQuantity < 1) return;

    try {
      // 1. Remove old item and add updated item in Firebase
      const userRef = doc(db, 'users', userId);
      const updatedItem = { ...item, quantity: newQuantity };

      await updateDoc(userRef, {
        cart: arrayRemove(item)
      });

      await updateDoc(userRef, {
        cart: arrayUnion(updatedItem)
      });

      // 2. Update Redux
      dispatch(updateQuantity({ id: item.id, quantity: newQuantity }));

    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handlePlaceOrder = async () => {
    // Validate customer info
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone || !customerInfo.address) {
      alert('Please fill in all customer information');
      return;
    }

    setLoading(true);

    try {
      // Create order object
      const order = {
        userId,
        customerInfo,
        items: cart,
        subtotal,
        deliveryFee,
        total,
        status: 'pending',
        createdAt: new Date().toISOString(),
        orderDate: serverTimestamp(),
      };

      // Add order to Firestore
      const ordersRef = collection(db, 'orders');
      await addDoc(ordersRef, order);

      // Clear cart from Firebase
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        cart: []
      });

      // Clear cart from Redux
      dispatch(clearCart());

      setOrderPlaced(true);
      setLoading(false);

    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
      setLoading(false);
    }
  };

  // Format category path
  const formatCategoryPath = (categoryPath) => {
    if (!categoryPath) return '';
    // Replace "category2" with "category" and format nicely
    return categoryPath
      .replace(/category\d+/gi, 'category')
      .split('/')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' > ');
  };

  // Success screen
  if (orderPlaced) {
    return (
      <Modal
        open={open}
        onClose={handleClose}
        className="flex items-center justify-center"
      >
        <div className="w-[90%] max-w-md bg-white rounded-2xl p-8 text-center outline-none shadow-2xl">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold mb-2 text-gray-800">Order Placed!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for your order. We'll send you a confirmation email shortly.
          </p>
          <button
            onClick={handleClose}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl"
          >
            Continue Shopping
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal open={open} onClose={handleClose} className="flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-gradient-to-br from-gray-50 to-white rounded-2xl max-h-[95vh] overflow-y-auto outline-none shadow-2xl">
        {/* Modern Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-6 flex items-center justify-between z-10 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Shopping Cart</h2>
              <p className="text-sm text-white/80">{totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-white/20 rounded-xl transition-all backdrop-blur-sm"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {cart.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h3>
              <p className="text-gray-500">Add some products to get started!</p>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Cart Items - Modern Design */}
              <div className="lg:col-span-2 space-y-4">
                {cart.map((item, index) => (
                  <div 
                    key={item.id || index} 
                    className="bg-white border border-gray-200 rounded-2xl p-5 flex gap-5 hover:shadow-lg transition-all duration-300 relative overflow-hidden group"
                  >
                    {/* Gradient accent */}
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-500"></div>
                    
                    <div className="relative flex-shrink-0">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-28 h-28 object-cover rounded-xl shadow-md"
                      />
                      {item.discount && (
                        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                          {item.discount}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-800 mb-2 line-clamp-2">{item.title}</h3>
                      
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        <span>{formatCategoryPath(item.categoryPath)}</span>
                      </div>
                      
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl font-bold text-gray-800">
                          LKR {parseFloat(item.price).toLocaleString()}
                        </span>
                        {item.originalPrice && item.originalPrice !== item.price && (
                          <span className="text-sm text-gray-400 line-through">
                            LKR {parseFloat(item.originalPrice).toLocaleString()}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-wrap">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                            <button
                              onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="w-7 h-7 flex items-center justify-center bg-white rounded-md hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                              </svg>
                            </button>
                            <span className="w-8 text-center font-semibold">{item.quantity}</span>
                            <button
                              onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                              disabled={item.quantity >= parseInt(item.stockCount)}
                              className="w-7 h-7 flex items-center justify-center bg-white rounded-md hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                            </button>
                          </div>
                          
                          {item.fastDelivery && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold flex items-center gap-1">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                              </svg>
                              Fast Delivery
                            </span>
                          )}
                          
                          {item.inStock ? (
                            <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                              {item.stockCount} in stock
                            </span>
                          ) : (
                            <span className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full font-semibold">
                              Out of Stock
                            </span>
                          )}
                        </div>
                        
                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteItem(item)}
                          disabled={deletingItem === item.id}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
                          title="Remove from cart"
                        >
                          {deletingItem === item.id ? (
                            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Sidebar - Modern Design */}
              <div className="space-y-5">
                {/* Customer Information */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-lg text-gray-800">Delivery Details</h3>
                  </div>
                  <div className="space-y-4">
                    <input
                      type="text"
                      name="name"
                      placeholder="Full Name *"
                      value={customerInfo.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      required
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address *"
                      value={customerInfo.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      required
                    />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number *"
                      value={customerInfo.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      required
                    />
                    <textarea
                      name="address"
                      placeholder="Delivery Address *"
                      value={customerInfo.address}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition"
                      required
                    />
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-6 shadow-lg">
                  <h3 className="font-bold text-lg text-gray-800 mb-5 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    Order Summary
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-gray-700">
                      <span>Subtotal ({totalItems} items)</span>
                      <span className="font-semibold">LKR {subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-700">
                      <span>Delivery Fee</span>
                      <span className="font-semibold">LKR {deliveryFee.toLocaleString()}</span>
                    </div>
                    <div className="border-t-2 border-blue-200 pt-3 flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-800">Total</span>
                      <span className="text-2xl font-bold text-blue-600">LKR {total.toLocaleString()}</span>
                    </div>
                  </div>

                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading || cart.length === 0}
                    className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        Place Order
                      </span>
                    )}
                  </button>
                  
                  <p className="text-xs text-gray-600 text-center mt-4">
                    By placing an order, you agree to our terms and conditions
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
});

ModalPayment.displayName = 'ModalPayment';

export default ModalPayment;