import React, { useEffect, useState } from 'react';
import {
  MapPin, CreditCard, Truck, Package, CheckCircle,
  Edit2, Plus, ChevronRight, Wallet, Building2,
  Smartphone, Mail, User, Home, AlertCircle, Trash2,
  Upload, X
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { arrayUnion, doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import db from '../../FireBase/firebase';
import { userSelecter } from '../../Store/ReduxSlice/userClise';

// 1. Import useAuth from App (adjust the path ../../App if your folder structure differs)
import { useAuth } from '../../App';

const PlaceOrderPage = () => {

  // 2. Get userId from the context created in App.jsx
  const { userId } = useAuth();


  const cart = useSelector(state => state.user.user?.cart || []);
  const userData = useSelector(userSelecter);

  const [orderItems, setOrderItems] = useState(cart);

  useEffect(() => {
    if (cart && cart.length > 0) {
      setOrderItems(cart);
    }
  }, [cart]);

  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    phone: '',
    email: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    postalCode: '',
    country: 'Sri Lanka'
  });

  // Sync shipping address with user data from DB
  useEffect(() => {
    if (userData && userData.name && userData.name !== 'default' && userData.name !== 'no-user') {
      setShippingAddress({
        fullName: userData.name || '',
        phone: userData.phoneNumber || '',
        email: userData.email || '',
        addressLine1: userData.address || '',
        addressLine2: userData.district ? `${userData.district}, ${userData.province || ''}` : '',
        city: userData.city || '',
        postalCode: userData.zip || '',
        country: userData.country || 'Sri Lanka'
      });
    }
  }, [userData]);

  const [selectedShipping, setSelectedShipping] = useState('standard');
  const [selectedPayment, setSelectedPayment] = useState('cod');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  // Card details state
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  // Bank transfer state
  const [bankSlip, setBankSlip] = useState(null);
  const [bankSlipPreview, setBankSlipPreview] = useState(null);

  const shippingOptions = [
    {
      id: 'standard',
      name: 'Standard Delivery',
      duration: '5-7 Business Days',
      price: 500,
      icon: Package
    },
    {
      id: 'express',
      name: 'Express Delivery',
      duration: '2-3 Business Days',
      price: 1000,
      icon: Truck
    },
    {
      id: 'overnight',
      name: 'Overnight Delivery',
      duration: '1 Business Day',
      price: 2000,
      icon: Truck
    }
  ];

  const paymentMethods = [
    {
      id: 'cod',
      name: 'Cash on Delivery',
      description: 'Pay when you receive your order',
      icon: Wallet
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      description: 'Visa, Mastercard, Amex',
      icon: CreditCard
    },
    {
      id: 'bank',
      name: 'Bank Transfer',
      description: 'Direct bank transfer',
      icon: Building2
    }
  ];

  // Remove item from order
  const handleRemoveItem = (itemId) => {
    setOrderItems(orderItems.filter(item => item.id !== itemId));
  };

  // Calculate totals
  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const selectedShippingCost = shippingOptions.find(s => s.id === selectedShipping)?.price || 0;
  const total = subtotal + selectedShippingCost;
  const totalItems = orderItems.reduce((sum, item) => sum + item.quantity, 0);

  // Handle card input changes
  const handleCardChange = (field, value) => {
    setCardDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle bank slip upload
  const handleBankSlipUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBankSlip(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBankSlipPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove bank slip
  const handleRemoveBankSlip = () => {
    setBankSlip(null);
    setBankSlipPreview(null);
  };

  const handlePlaceOrder = () => {
    if (!userId) {
      alert("User not logged in. Please login again.");
      return;
    }

    if (orderItems.length === 0) {
      alert('Your order is empty. Please add items to continue.');
      return;
    }

    if (!selectedShipping || !selectedPayment) {
      alert('Please select shipping and payment method');
      return;
    }

    if (selectedPayment === 'card') {
      if (!cardDetails?.cardNumber || !cardDetails?.cardName || !cardDetails?.expiryDate || !cardDetails?.cvv) {
        alert('Please fill in all card details');
        return;
      }
    }

    if (selectedPayment === 'bank' && !bankSlip) {
      alert('Please upload your bank transfer slip');
      return;
    }

    const newOrder = {
      items: orderItems,
      shippingAddress,
      shippingMethod: selectedShipping,
      paymentMethod: selectedPayment,
      cardDetails: selectedPayment === 'card' ? cardDetails : null,
      bankSlip: selectedPayment === 'bank' ? bankSlip : null,
      total,
      createdAt: new Date(),
      status: 'pending'
    };

    const userRef = doc(db, "users", userId);

    getDoc(userRef)
      .then((userSnap) => {
        if (!userSnap.exists()) {
          throw new Error("User not found");
        }

        const userData = userSnap.data();

        if (!userData.orderData) {
          return updateDoc(userRef, { orderData: [newOrder] });
        } else {
          return updateDoc(userRef, { orderData: arrayUnion(newOrder) });
        }
      })
      .then(() => {
        console.log("Order added successfully");
        setOrderPlaced(true); // ✅ move here
      })
      .catch((error) => {
        console.error("Error adding order:", error);
        alert("Failed to place order");
      });
  };


  const handleAddressChange = (field, value) => {
    setShippingAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-white rounded-3xl shadow-2xl p-12 text-center">
          <div className="w-28 h-28 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle className="w-16 h-16 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-gray-800">Order Placed Successfully!</h1>
          <p className="text-gray-600 mb-3 text-lg">
            Thank you for your order!
          </p>
          <div className="bg-gradient-to-r from-[#fef2f2] to-[#fee2e2] border-2 border-[#fecaca] rounded-2xl p-6 mb-8">
            <p className="text-sm text-gray-600 mb-2">Order Number</p>
            <p className="text-2xl font-bold text-[#dc2626]">#ORD-{Math.floor(Math.random() * 100000)}</p>
          </div>
          <p className="text-gray-600 mb-8">
            We've sent a confirmation email to <strong>{shippingAddress.email}</strong>
          </p>
          <button
            onClick={() => {
              setOrderPlaced(false);
              setOrderItems([]);
              setCardDetails({ cardNumber: '', cardName: '', expiryDate: '', cvv: '' });
              setBankSlip(null);
              setBankSlipPreview(null);
            }}
            className="w-full bg-gradient-to-r from-[#dc2626] to-[#b91c1c] text-white py-4 rounded-xl font-semibold text-lg hover:from-[#b91c1c] hover:to-[#991b1b] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#dc2626] to-[#b91c1c] text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Place Your Order</h1>
              <p className="text-sm text-white/80">Review and confirm your purchase</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-white p-6 border-b-2 border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#dc2626] to-[#b91c1c] text-white rounded-xl flex items-center justify-center font-bold">
                      1
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        Shipping Address
                      </h2>
                      <p className="text-sm text-gray-500">Where should we deliver your order?</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsEditingAddress(!isEditingAddress)}
                    className="flex items-center gap-2 text-[#dc2626] hover:bg-[#fef2f2] px-4 py-2 rounded-lg transition-all"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span className="font-medium">{isEditingAddress ? 'Save' : 'Edit'}</span>
                  </button>
                </div>
              </div>

              <div className="p-6">
                {isEditingAddress ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <User className="w-4 h-4 inline mr-1" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.fullName}
                        onChange={(e) => handleAddressChange('fullName', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#dc2626] focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Smartphone className="w-4 h-4 inline mr-1" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={shippingAddress.phone}
                        onChange={(e) => handleAddressChange('phone', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#dc2626] focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Mail className="w-4 h-4 inline mr-1" />
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={shippingAddress.email}
                        onChange={(e) => handleAddressChange('email', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#dc2626] focus:outline-none transition-colors"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Home className="w-4 h-4 inline mr-1" />
                        Address Line 1
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.addressLine1}
                        onChange={(e) => handleAddressChange('addressLine1', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#dc2626] focus:outline-none transition-colors"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Address Line 2 (Optional)
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.addressLine2}
                        onChange={(e) => handleAddressChange('addressLine2', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#dc2626] focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.city}
                        onChange={(e) => handleAddressChange('city', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#dc2626] focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.postalCode}
                        onChange={(e) => handleAddressChange('postalCode', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#dc2626] focus:outline-none transition-colors"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Country
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.country}
                        onChange={(e) => handleAddressChange('country', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#dc2626] focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="bg-gradient-to-r from-gray-50 to-white border-2 border-gray-100 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#dc2626] to-[#b91c1c] text-white rounded-xl flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800 text-lg mb-2">{shippingAddress.fullName}</h3>
                        <p className="text-gray-600 mb-1">{shippingAddress.addressLine1}</p>
                        {shippingAddress.addressLine2 && (
                          <p className="text-gray-600 mb-1">{shippingAddress.addressLine2}</p>
                        )}
                        <p className="text-gray-600 mb-3">
                          {shippingAddress.city}, {shippingAddress.postalCode}
                        </p>
                        <p className="text-gray-600 mb-1">
                          <strong>Phone:</strong> {shippingAddress.phone}
                        </p>
                        <p className="text-gray-600">
                          <strong>Email:</strong> {shippingAddress.email}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Shipping Method */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-white p-6 border-b-2 border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#dc2626] to-[#b91c1c] text-white rounded-xl flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">Shipping Method</h2>
                    <p className="text-sm text-gray-500">Choose your preferred delivery speed</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-3">
                {shippingOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = selectedShipping === option.id;
                  return (
                    <button
                      key={option.id}
                      onClick={() => setSelectedShipping(option.id)}
                      className={`w-full text-left p-5 rounded-xl border-2 transition-all ${isSelected
                          ? 'border-[#dc2626] bg-gradient-to-r from-[#fef2f2] to-[#fee2e2] shadow-lg'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isSelected ? 'bg-gradient-to-br from-[#dc2626] to-[#b91c1c] text-white' : 'bg-gray-100 text-gray-600'
                            }`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className={`font-bold ${isSelected ? 'text-[#dc2626]' : 'text-gray-800'}`}>
                              {option.name}
                            </h3>
                            <p className="text-sm text-gray-600">{option.duration}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-xl font-bold ${isSelected ? 'text-[#dc2626]' : 'text-gray-800'}`}>
                            LKR {option.price.toLocaleString()}
                          </p>
                          {isSelected && (
                            <div className="flex items-center justify-end gap-1 text-[#dc2626] text-sm font-semibold mt-1">
                              <CheckCircle className="w-4 h-4" />
                              Selected
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-white p-6 border-b-2 border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#dc2626] to-[#b91c1c] text-white rounded-xl flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">Payment Method</h2>
                    <p className="text-sm text-gray-500">Select how you'd like to pay</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-3">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  const isSelected = selectedPayment === method.id;
                  return (
                    <button
                      key={method.id}
                      onClick={() => setSelectedPayment(method.id)}
                      className={`w-full text-left p-5 rounded-xl border-2 transition-all ${isSelected
                          ? 'border-[#dc2626] bg-gradient-to-r from-[#fef2f2] to-[#fee2e2] shadow-lg'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isSelected ? 'bg-gradient-to-br from-[#dc2626] to-[#b91c1c] text-white' : 'bg-gray-100 text-gray-600'
                            }`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className={`font-bold ${isSelected ? 'text-[#dc2626]' : 'text-gray-800'}`}>
                              {method.name}
                            </h3>
                            <p className="text-sm text-gray-600">{method.description}</p>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="flex items-center gap-1 text-[#dc2626] text-sm font-semibold">
                            <CheckCircle className="w-5 h-5" />
                            Selected
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}

                {/* Cash on Delivery Info */}
                {selectedPayment === 'cod' && (
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 flex gap-3 mt-4">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-blue-800 font-semibold mb-1">Cash on Delivery</p>
                      <p className="text-xs text-blue-700">
                        Please keep exact change ready. Our delivery partner will collect the payment upon delivery.
                      </p>
                    </div>
                  </div>
                )}

                {/* Card Details Form */}
                {selectedPayment === 'card' && (
                  <div className="bg-gradient-to-r from-gray-50 to-white border-2 border-[#dc2626] rounded-xl p-6 mt-4">
                    <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-[#dc2626]" />
                      Enter Card Details
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Card Number
                        </label>
                        <input
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          maxLength="19"
                          value={cardDetails.cardNumber}
                          onChange={(e) => handleCardChange('cardNumber', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#dc2626] focus:outline-none transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          placeholder="John Doe"
                          value={cardDetails.cardName}
                          onChange={(e) => handleCardChange('cardName', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#dc2626] focus:outline-none transition-colors"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            maxLength="5"
                            value={cardDetails.expiryDate}
                            onChange={(e) => handleCardChange('expiryDate', e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#dc2626] focus:outline-none transition-colors"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            CVV
                          </label>
                          <input
                            type="text"
                            placeholder="123"
                            maxLength="3"
                            value={cardDetails.cvv}
                            onChange={(e) => handleCardChange('cvv', e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#dc2626] focus:outline-none transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bank Transfer Upload */}
                {selectedPayment === 'bank' && (
                  <div className="bg-gradient-to-r from-gray-50 to-white border-2 border-[#dc2626] rounded-xl p-6 mt-4">
                    <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-[#dc2626]" />
                      Upload Bank Transfer Slip
                    </h4>

                    <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-4">
                      <p className="text-sm text-blue-800 font-semibold mb-2">Bank Details:</p>
                      <p className="text-xs text-blue-700 mb-1">Bank: Commercial Bank</p>
                      <p className="text-xs text-blue-700 mb-1">Account Name: Your Company Name</p>
                      <p className="text-xs text-blue-700 mb-1">Account Number: 1234567890</p>
                      <p className="text-xs text-blue-700">Branch: Colombo</p>
                    </div>

                    {!bankSlipPreview ? (
                      <label className="block">
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#dc2626] transition-colors cursor-pointer">
                          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-sm font-semibold text-gray-700 mb-1">
                            Click to upload slip
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG or PDF (Max 5MB)
                          </p>
                        </div>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={handleBankSlipUpload}
                          className="hidden"
                        />
                      </label>
                    ) : (
                      <div className="relative border-2 border-[#dc2626] rounded-xl p-4 bg-white">
                        <button
                          onClick={handleRemoveBankSlip}
                          className="absolute -top-2 -right-2 w-8 h-8 bg-[#dc2626] text-white rounded-full flex items-center justify-center hover:bg-[#b91c1c] transition-all shadow-lg"
                        >
                          <X className="w-5 h-5" />
                        </button>
                        {bankSlip.type.startsWith('image/') ? (
                          <img
                            src={bankSlipPreview}
                            alt="Bank slip"
                            className="w-full rounded-lg"
                          />
                        ) : (
                          <div className="text-center py-4">
                            <p className="text-sm font-semibold text-gray-700">
                              {bankSlip.name}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              PDF uploaded successfully
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Order Items */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-[#dc2626] to-[#b91c1c] text-white p-6">
                  <h3 className="font-bold text-xl flex items-center gap-2">
                    <Package className="w-6 h-6" />
                    Order Items ({totalItems})
                  </h3>
                </div>

                <div className="p-6 max-h-[500px] overflow-y-auto space-y-4">
                  {orderItems.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 font-medium">No items in order</p>
                      <p className="text-sm text-gray-400 mt-1">Add items to continue</p>
                    </div>
                  ) : (
                    orderItems.map((item) => (
                      <div key={item.id} className="group relative flex gap-4 pb-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 p-3 rounded-lg transition-colors">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-20 h-20 object-cover rounded-lg shadow-md flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-800 text-sm line-clamp-2 mb-1">
                            {item.title}
                          </h4>
                          <p className="text-xs text-gray-500 mb-2">Qty: {item.quantity}</p>
                          <p className="text-lg font-bold text-[#dc2626]">
                            LKR {(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="absolute top-2 right-2 w-7 h-7 bg-red-100 text-[#dc2626] rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-[#dc2626] hover:text-white transition-all"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Price Summary */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-6 space-y-4">
                  <h3 className="font-bold text-lg text-gray-800 mb-4">Price Summary</h3>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-gray-700">
                      <span>Subtotal</span>
                      <span className="font-semibold">LKR {subtotal.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between items-center text-gray-700">
                      <span>Shipping</span>
                      <span className="font-semibold">LKR {selectedShippingCost.toLocaleString()}</span>
                    </div>

                    <div className="border-t-2 border-gray-200 pt-4 flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-800">Total</span>
                      <span className="text-3xl font-bold bg-gradient-to-r from-[#dc2626] to-[#b91c1c] bg-clip-text text-transparent">
                        LKR {total.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handlePlaceOrder}
                    disabled={orderItems.length === 0}
                    className="w-full bg-gradient-to-r from-[#dc2626] to-[#b91c1c] text-white py-4 rounded-xl font-bold text-lg hover:from-[#b91c1c] hover:to-[#991b1b] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2 mt-6 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Place Order
                  </button>

                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4 mt-4">
                    <div className="flex items-center gap-2 text-green-700 mb-2">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-semibold">Secure Checkout</span>
                    </div>
                    <p className="text-xs text-green-600">
                      Your payment information is encrypted and secure
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderPage;