import React, { useState, useEffect } from 'react';
import { 
  Package, Truck, Calendar, Clock, ChevronRight, 
  XCircle, AlertCircle, ShoppingBag, MapPin, 
  CreditCard, Search, Filter
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import db from '../../FireBase/firebase'; // Adjust path if needed
import { useAuth } from '../../App'; // Adjust path if needed
import { addUser } from '../../Store/ReduxSlice/userClise'; // To update Redux immediately

const OrdersPage = () => {
  const { userId } = useAuth();
  const dispatch = useDispatch();
  
  // Get orders from Redux (handle potential undefined states)
  const userOrders = useSelector(state => state.user.user?.orderData || []);
  
  // Local state for filtering
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Sort orders by date (newest first)
  const sortedOrders = [...userOrders].sort((a, b) => {
    // Handle Firestore Timestamp or JS Date objects
    const dateA = a.createdAt?.seconds ? new Date(a.createdAt.seconds * 1000) : new Date(a.createdAt);
    const dateB = b.createdAt?.seconds ? new Date(b.createdAt.seconds * 1000) : new Date(b.createdAt);
    return dateB - dateA;
  });

  // Filter Logic
  const filteredOrders = sortedOrders.filter(order => {
    const matchesSearch = order.items.some(item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // --- Utility Functions ---

  const formatDate = (dateInput) => {
    if (!dateInput) return '';
    const date = dateInput.seconds ? new Date(dateInput.seconds * 1000) : new Date(dateInput);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', month: 'long', day: 'numeric' 
    });
  };

  const getDeliveryDate = (createdAt, shippingMethod) => {
    if (!createdAt) return 'Pending';
    const date = createdAt.seconds ? new Date(createdAt.seconds * 1000) : new Date(createdAt);
    const daysToAdd = shippingMethod === 'overnight' ? 1 : shippingMethod === 'express' ? 3 : 7;
    date.setDate(date.getDate() + daysToAdd);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'processing': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'shipped': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // --- Handlers ---

  const handleCancelOrder = async (orderToCancel) => {
    if (!userId) return;
    const confirm = window.confirm("Are you sure you want to cancel this order?");
    if (!confirm) return;

    setIsLoading(true);

    try {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const currentOrders = userData.orderData || [];

        // Find and update the specific order in the array
        // We identify it by createdAt timestamp matching (assuming unique per user second)
        // A better way in production is to assign a unique UUID to every order.
        const updatedOrders = currentOrders.map(order => {
            // Compare timestamps roughly or use ID if available
            // Here we assume exact object match logic for simplicity in finding index
            if (JSON.stringify(order.createdAt) === JSON.stringify(orderToCancel.createdAt)) {
                return { ...order, status: 'cancelled' };
            }
            return order;
        });

        // Update Firestore
        await updateDoc(userRef, {
            orderData: updatedOrders
        });

        // Update Redux to reflect changes immediately
        dispatch(addUser({ ...userData, orderData: updatedOrders }));
        alert("Order cancelled successfully");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert("Failed to cancel order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#dc2626] to-[#b91c1c] text-white shadow-xl pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <ShoppingBag className="w-8 h-8" />
                My Orders
              </h1>
              <p className="text-red-100 mt-2">Track and manage your purchases</p>
            </div>
            
            {/* Stats Cards */}
            <div className="flex gap-4">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 px-6 text-center border border-white/20">
                <p className="text-2xl font-bold">{userOrders.length}</p>
                <p className="text-xs text-red-100 uppercase tracking-wider">Total Orders</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 px-6 text-center border border-white/20">
                <p className="text-2xl font-bold">
                    {userOrders.filter(o => o.status === 'pending' || o.status === 'processing').length}
                </p>
                <p className="text-xs text-red-100 uppercase tracking-wider">Active</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        
        {/* Filters & Search Bar */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Status Tabs */}
          <div className="flex p-1 bg-gray-100 rounded-lg overflow-x-auto w-full md:w-auto">
            {['all', 'pending', 'shipped', 'cancelled'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterStatus(tab)}
                className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-all whitespace-nowrap ${
                  filterStatus === tab 
                  ? 'bg-white text-[#dc2626] shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by product name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626] transition-all"
            />
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No orders found</h3>
              <p className="text-gray-500">
                {searchTerm || filterStatus !== 'all' 
                  ? "Try adjusting your search or filters" 
                  : "Looks like you haven't placed any orders yet"}
              </p>
            </div>
          ) : (
            filteredOrders.map((order, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100">
                
                {/* Order Header */}
                <div className="bg-gray-50/50 p-6 border-b border-gray-100 flex flex-wrap gap-4 justify-between items-center">
                  <div className="flex gap-6 text-sm">
                    <div>
                      <p className="text-gray-500 mb-1">Order Date</p>
                      <p className="font-semibold text-gray-800 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#dc2626]" />
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Total Amount</p>
                      <p className="font-semibold text-[#dc2626]">LKR {order.total?.toLocaleString()}</p>
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-gray-500 mb-1">Est. Delivery</p>
                      <p className="font-semibold text-gray-800 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        {getDeliveryDate(order.createdAt, order.shippingMethod)}
                      </p>
                    </div>
                  </div>

                  <div className={`px-4 py-1.5 rounded-full text-sm font-semibold border capitalize flex items-center gap-2 ${getStatusColor(order.status)}`}>
                    {order.status === 'cancelled' ? <XCircle className="w-4 h-4"/> : 
                     order.status === 'delivered' ? <Package className="w-4 h-4"/> : 
                     <Truck className="w-4 h-4"/>}
                    {order.status}
                  </div>
                </div>

                {/* Order Body */}
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row gap-8">
                    
                    {/* Items List */}
                    <div className="flex-1 space-y-4">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex gap-4 items-center">
                          <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800 line-clamp-1">{item.title}</h4>
                            <p className="text-sm text-gray-500">Qty: {item.quantity} × LKR {item.price}</p>
                          </div>
                          <div className="text-right">
                             <p className="font-bold text-gray-800">LKR {(item.price * item.quantity).toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Details Side Panel */}
                    <div className="lg:w-72 bg-gray-50 rounded-xl p-5 space-y-4 h-fit">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Shipping Address</p>
                            <div className="flex gap-2 text-sm text-gray-600">
                                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#dc2626]" />
                                <div>
                                    <p className="font-semibold text-gray-800">{order.shippingAddress?.city}</p>
                                    <p className="line-clamp-2">{order.shippingAddress?.addressLine1}</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Payment</p>
                            <div className="flex gap-2 text-sm text-gray-600">
                                <CreditCard className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#dc2626]" />
                                <span className="capitalize">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {order.status === 'pending' && (
                            <div className="pt-2 border-t border-gray-200">
                                <button 
                                    onClick={() => handleCancelOrder(order)}
                                    disabled={isLoading}
                                    className="w-full py-2 px-4 border-2 border-red-100 text-[#dc2626] rounded-lg font-semibold hover:bg-red-50 hover:border-[#dc2626] transition-colors flex items-center justify-center gap-2"
                                >
                                    <XCircle className="w-4 h-4" />
                                    Cancel Order
                                </button>
                                <p className="text-xs text-gray-400 text-center mt-2">
                                    <AlertCircle className="w-3 h-3 inline mr-1" />
                                    Can only cancel while pending
                                </p>
                            </div>
                        )}
                    </div>

                  </div>
                </div>

                {/* Tracking Footer (Visual Progress) */}
                {order.status !== 'cancelled' && (
                  <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs font-medium text-gray-500">
                        <div className={`flex items-center gap-2 ${['pending', 'processing', 'shipped', 'delivered'].includes(order.status) ? 'text-[#dc2626]' : ''}`}>
                            <div className={`w-2 h-2 rounded-full ${['pending', 'processing', 'shipped', 'delivered'].includes(order.status) ? 'bg-[#dc2626]' : 'bg-gray-300'}`}></div>
                            Order Placed
                        </div>
                        <div className={`h-0.5 flex-1 mx-2 ${['processing', 'shipped', 'delivered'].includes(order.status) ? 'bg-[#dc2626]' : 'bg-gray-200'}`}></div>
                        
                        <div className={`flex items-center gap-2 ${['processing', 'shipped', 'delivered'].includes(order.status) ? 'text-[#dc2626]' : ''}`}>
                             <div className={`w-2 h-2 rounded-full ${['processing', 'shipped', 'delivered'].includes(order.status) ? 'bg-[#dc2626]' : 'bg-gray-300'}`}></div>
                             Processing
                        </div>
                        <div className={`h-0.5 flex-1 mx-2 ${['shipped', 'delivered'].includes(order.status) ? 'bg-[#dc2626]' : 'bg-gray-200'}`}></div>

                        <div className={`flex items-center gap-2 ${['shipped', 'delivered'].includes(order.status) ? 'text-[#dc2626]' : ''}`}>
                             <div className={`w-2 h-2 rounded-full ${['shipped', 'delivered'].includes(order.status) ? 'bg-[#dc2626]' : 'bg-gray-300'}`}></div>
                             Shipped
                        </div>
                        <div className={`h-0.5 flex-1 mx-2 ${['delivered'].includes(order.status) ? 'bg-[#dc2626]' : 'bg-gray-200'}`}></div>

                        <div className={`flex items-center gap-2 ${['delivered'].includes(order.status) ? 'text-[#dc2626]' : ''}`}>
                             <div className={`w-2 h-2 rounded-full ${['delivered'].includes(order.status) ? 'bg-[#dc2626]' : 'bg-gray-300'}`}></div>
                             Delivered
                        </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;