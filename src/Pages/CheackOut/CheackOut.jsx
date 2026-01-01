import React, { useState } from 'react';
import { 
  MapPin, CreditCard, Truck, Package, CheckCircle, 
  Edit2, Plus, ChevronRight, Wallet, Building2, 
  Smartphone, Mail, User, Home, AlertCircle
} from 'lucide-react';

const PlaceOrderPage = () => {
  // Order items passed as props (simulated here)
  const [orderItems] = useState([
    {
      id: 1,
      title: 'Wireless Bluetooth Headphones',
      price: 15000,
      quantity: 1,
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
      categoryPath: 'Electronics/Audio/Headphones'
    },
    {
      id: 2,
      title: 'Smart Watch Pro Series 6',
      price: 45000,
      quantity: 2,
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
      categoryPath: 'Electronics/Wearables/Smart Watches'
    }
  ]);

  const [shippingAddress, setShippingAddress] = useState({
    fullName: 'John Doe',
    phone: '+94 77 123 4567',
    email: 'john.doe@example.com',
    addressLine1: '123 Main Street',
    addressLine2: 'Apartment 4B',
    city: 'Colombo',
    postalCode: '00100',
    country: 'Sri Lanka'
  });

  const [selectedShipping, setSelectedShipping] = useState('standard');
  const [selectedPayment, setSelectedPayment] = useState('cod');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);

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

  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const selectedShippingCost = shippingOptions.find(s => s.id === selectedShipping)?.price || 0;
  const total = subtotal + selectedShippingCost;
  const totalItems = orderItems.reduce((sum, item) => sum + item.quantity, 0);

  const handlePlaceOrder = () => {
    // Validate before placing order
    if (!selectedShipping || !selectedPayment) {
      alert('Please select shipping and payment method');
      return;
    }
    
    // Here you would typically send the order to your backend
    console.log({
      items: orderItems,
      shippingAddress,
      shippingMethod: selectedShipping,
      paymentMethod: selectedPayment,
      total
    });
    
    setOrderPlaced(true);
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
            onClick={() => setOrderPlaced(false)}
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
                      className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
                        isSelected
                          ? 'border-[#dc2626] bg-gradient-to-r from-[#fef2f2] to-[#fee2e2] shadow-lg'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            isSelected ? 'bg-gradient-to-br from-[#dc2626] to-[#b91c1c] text-white' : 'bg-gray-100 text-gray-600'
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
                      className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
                        isSelected
                          ? 'border-[#dc2626] bg-gradient-to-r from-[#fef2f2] to-[#fee2e2] shadow-lg'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            isSelected ? 'bg-gradient-to-br from-[#dc2626] to-[#b91c1c] text-white' : 'bg-gray-100 text-gray-600'
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

                {selectedPayment === 'cod' && (
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 flex gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-blue-800 font-semibold mb-1">Cash on Delivery</p>
                      <p className="text-xs text-blue-700">
                        Please keep exact change ready. Our delivery partner will collect the payment upon delivery.
                      </p>
                    </div>
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

                <div className="p-6 max-h-96 overflow-y-auto space-y-4">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0">
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
                    </div>
                  ))}
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
                    className="w-full bg-gradient-to-r from-[#dc2626] to-[#b91c1c] text-white py-4 rounded-xl font-bold text-lg hover:from-[#b91c1c] hover:to-[#991b1b] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2 mt-6"
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