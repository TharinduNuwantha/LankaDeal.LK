import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { generateAIResponse, searchRelatedProducts } from "../Pages/SearchPage/services/geminiService";
import { canAnswerLocally, generateLocalResponse } from "../Pages/SearchPage/services/localResponseGenerator";

const AIChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      text: "Hello! 👋 I'm your AI shopping assistant powered by Gemini. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [fullProductDetails, setFullProductDetails] = useState({}); // Store full product details
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Listen for product additions
  useEffect(() => {
    const handleProductAdd = (event) => {
      console.log("Event received in AIChatBot:", event.detail);
      const product = event.detail;
      
      const exists = selectedProducts.some(p => p.id === product.id);
      
      if (!exists) {
        setSelectedProducts(prev => [...prev, product]);
        // Store full product details
        setFullProductDetails(prev => ({
          ...prev,
          [product.id]: product
        }));
        setIsOpen(true);
        
        const productMessage = {
          id: Date.now(),
          type: "bot",
          text: `Great! I've added "${product.title}" to our conversation. What would you like to know about ${selectedProducts.length > 0 ? 'these products' : 'this product'}?`,
          timestamp: new Date()
        };
        // setMessages(prev => [...prev, productMessage]);
      } else {
        setIsOpen(true);
        const alreadyAddedMessage = {
          id: Date.now(),
          type: "bot",
          text: `"${product.title}" is already in our conversation. Ask me anything about it!`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, alreadyAddedMessage]);
      }
    };

    window.addEventListener('addProductToChat', handleProductAdd);
    return () => window.removeEventListener('addProductToChat', handleProductAdd);
  }, [selectedProducts]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const removeProduct = (productId) => {
    const removedProduct = selectedProducts.find(p => p.id === productId);
    setSelectedProducts(prev => prev.filter(p => p.id !== productId));
    
    // Remove from full details
    setFullProductDetails(prev => {
      const newDetails = { ...prev };
      delete newDetails[productId];
      return newDetails;
    });
    
    const removeMessage = {
      id: Date.now(),
      type: "bot",
      text: `I've removed "${removedProduct?.title}" from our conversation.`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, removeMessage]);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      text: inputMessage,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage("");
    
    setIsTyping(true);
    
    try {
      let botResponse;
      let productLinks = [];

      // Try local response first
      if (canAnswerLocally(currentInput)) {
        const localResult = generateLocalResponse(currentInput, selectedProducts);
        
        if (localResult.canAnswer) {
          botResponse = localResult.response;
          productLinks = localResult.productLinks || [];
          console.log("Response generated locally");
        }
      }

      // If local can't answer or needs more context, use AI
      if (!botResponse) {
        console.log("Using Gemini AI for response");
        
        // Check if we need more product context
        let additionalProducts = [];
        if (selectedProducts.length < 3) {
          additionalProducts = await searchRelatedProducts(currentInput, 10);
          console.log(`Found ${additionalProducts.length} related products from database`);
          
          // Store full details for additional products
          additionalProducts.forEach(product => {
            setFullProductDetails(prev => ({
              ...prev,
              [product.id]: product
            }));
          });
        }

        botResponse = await generateAIResponse(
          currentInput,
          selectedProducts,
          additionalProducts.length > 0 ? additionalProducts : null
        );

        // Extract product references from AI response
        productLinks = extractProductLinks(botResponse, [...selectedProducts, ...additionalProducts]);
      }

      const botMessage = {
        id: Date.now() + 1,
        type: "bot",
        text: botResponse,
        productLinks: productLinks,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Error generating response:", error);
      const errorMessage = {
        id: Date.now() + 1,
        type: "bot",
        text: "I apologize, but I'm having trouble processing your request. Please try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const extractProductLinks = (responseText, products) => {
    const links = [];
    products.forEach(product => {
      if (responseText.includes(product.title)) {
        links.push({
          id: product.id,
          title: product.title,
          categoryPath: product.categoryPath,
          // Include additional details for full display
          price: product.price,
          imageUrl: product.imageUrl,
          rating: product.rating,
          discount: product.discount,
          brand: product.brand
        });
      }
    });
    return links;
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        type: "bot",
        text: "Chat cleared! Add products and ask me anything!",
        timestamp: new Date()
      }
    ]);
    setSelectedProducts([]);
    setFullProductDetails({});
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Format price with commas
  const formatPrice = (price) => {
    return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || '0';
  };

  return (
    <>
      {/* Floating Chat Button with Magical/Professional Effect */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-20 h-20 rounded-full shadow-2xl transition-all duration-500 transform hover:scale-110 group"
        aria-label="Toggle chat"
        style={{
          background: 'radial-gradient(circle at 30% 30%, #e43b3b 0%, #b82c2c 100%)',
          boxShadow: `
            0 0 20px rgba(228, 59, 59, 0.4),
            0 0 40px rgba(228, 59, 59, 0.2),
            0 0 60px rgba(228, 59, 59, 0.1),
            inset 0 2px 4px rgba(255, 255, 255, 0.3)
          `
        }}
      >
        {/* Pulsing Ring Effect */}
        <div className="absolute inset-0 rounded-full animate-ping-slow opacity-20"
          style={{
            background: 'linear-gradient(45deg, #e43b3b, #ff6b6b)',
            animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite'
          }}>
        </div>
        
        {/* Outer Ring Glow */}
        <div className="absolute inset-[-4px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: 'linear-gradient(45deg, transparent, rgba(228, 59, 59, 0.3), transparent)',
            filter: 'blur(8px)'
          }}>
        </div>
        
        {/* Inner Content */}
        <div className="relative w-full h-full rounded-full flex items-center justify-center">
          {/* Icon Container */}
          <div className="relative transform transition-transform duration-300 group-hover:rotate-12">
            {isOpen ? (
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <>
                {/* AI Icon with Sparkle Effect */}
                <div className="relative">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  
                  {/* Sparkle Dots */}
                  <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-yellow-400 animate-pulse"></div>
                  <div className="absolute -bottom-1 -left-1 w-2 h-2 rounded-full bg-blue-400 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                </div>
                
                {/* Product Count Badge */}
                {selectedProducts.length > 0 && (
                  <span className="absolute -top-2 -right-2 w-7 h-7 bg-white text-red-600 text-xs rounded-full flex items-center justify-center font-bold border-2 border-red-500 shadow-lg animate-bounce"
                    style={{ animationDuration: '2s' }}>
                    {selectedProducts.length}
                  </span>
                )}
              </>
            )}
          </div>
        </div>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-32 right-6 z-50 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 animate-slideUp max-sm:w-[calc(100vw-2rem)] max-sm:h-[calc(100vh-8rem)] max-sm:bottom-20 max-sm:right-4"
          style={{
            boxShadow: '0 20px 60px rgba(228, 59, 59, 0.15)'
          }}>
          
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 text-white p-4 flex items-center justify-between"
            style={{ background: 'linear-gradient(135deg, #e43b3b 0%, #d13232 100%)' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                <span className="text-2xl">🤖</span>
              </div>
              <div>
                <h3 className="font-bold text-lg">AI Shopping Assistant</h3>
                <p className="text-xs text-red-100">
                  {selectedProducts.length > 0 ? `${selectedProducts.length} product${selectedProducts.length > 1 ? 's' : ''} selected` : 'Powered by Gemini AI'}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={clearChat}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                title="Clear chat and products"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Selected Products Grid */}
          {selectedProducts.length > 0 && (
            <div className="bg-gradient-to-r from-red-50 to-pink-50 p-3 border-b border-red-100">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-semibold text-red-800">Selected Products ({selectedProducts.length})</h4>
              </div>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                {selectedProducts.map((product) => (
                  <div 
                    key={product.id} 
                    className="bg-white rounded-lg p-2 shadow-sm hover:shadow-md transition-all duration-300 relative group border border-red-100"
                  >
                    <button
                      onClick={() => removeProduct(product.id)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 text-xs font-bold hover:bg-red-600 z-10 shadow-md"
                      title="Remove product"
                    >
                      ×
                    </button>
                    <img 
                      src={product.imageUrl} 
                      alt={product.title}
                      className="w-full h-16 object-cover rounded mb-1"
                    />
                    <p className="text-xs font-semibold text-gray-800 line-clamp-1">{product.title}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-red-600 font-bold">Rs. {formatPrice(product.price)}</p>
                      {product.rating && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-1 rounded">
                          ⭐ {product.rating}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Chat Messages */}
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-white to-red-50/50"
            style={{ scrollBehavior: 'smooth' }}
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-2 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === 'user' 
                      ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
                      : 'bg-gradient-to-br from-red-500 to-red-600'
                  } shadow-md`}>
                    {message.type === 'user' ? (
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    ) : (
                      <span className="text-white text-sm">AI</span>
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div>
                    <div className={`rounded-2xl px-4 py-3 ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-tr-none shadow-md'
                        : 'bg-white text-gray-800 border border-red-100 rounded-tl-none shadow-sm'
                    }`}>
                      <p className="text-sm whitespace-pre-line">{message.text}</p>
                      
                      {/* Full Product Cards Display */}
                      {message.productLinks && message.productLinks.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-xs font-semibold text-red-700 mb-3 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            Related Products:
                          </p>
                          <div className="space-y-3">
                            {message.productLinks.map((product, idx) => {
                              const fullProduct = fullProductDetails[product.id] || product;
                              return (
                                <Link
                                  key={idx}
                                  to={`/category/${product.categoryPath?.split('/')[1] || 'products'}/${product.id}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block group"
                                >
                                  <div className="bg-gradient-to-r from-red-50 to-white rounded-xl p-3 border border-red-200 hover:border-red-400 transition-all duration-300 hover:shadow-md">
                                    <div className="flex gap-3">
                                      {/* Product Image */}
                                      <div className="w-16 h-16 flex-shrink-0">
                                        <img 
                                          src={fullProduct.imageUrl || 'https://via.placeholder.com/100'} 
                                          alt={fullProduct.title}
                                          className="w-full h-full object-cover rounded-lg border border-gray-200"
                                        />
                                      </div>
                                      
                                      {/* Product Details */}
                                      <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-red-600 transition-colors">
                                          {fullProduct.title}
                                        </h4>
                                        
                                        {/* Rating and Brand */}
                                        <div className="flex items-center gap-3 mt-1">
                                          {fullProduct.rating && (
                                            <span className="flex items-center gap-1 text-xs bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full">
                                              ⭐ {fullProduct.rating}
                                            </span>
                                          )}
                                          {fullProduct.brand && (
                                            <span className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                                              {fullProduct.brand}
                                            </span>
                                          )}
                                        </div>
                                        
                                        {/* Price */}
                                        <div className="flex items-center gap-2 mt-2">
                                          <span className="text-lg font-bold text-red-600">
                                            Rs. {formatPrice(fullProduct.price)}
                                          </span>
                                          {fullProduct.discount && (
                                            <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                              {fullProduct.discount}% OFF
                                            </span>
                                          )}
                                        </div>
                                        
                                        {/* View Product Link */}
                                        <div className="mt-2 flex items-center justify-between">
                                          <span className="text-xs text-blue-600 font-semibold flex items-center gap-1">
                                            View Product
                                            <svg className="w-3 h-3 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                          </span>
                                          <span className="text-xs text-gray-400">
                                            Opens in new tab
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                    <p className={`text-xs mt-1 px-2 ${message.type === 'user' ? 'text-blue-400 text-right' : 'text-gray-400'}`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-md">
                    <span className="text-white text-sm">AI</span>
                  </div>
                  <div className="bg-white border border-red-100 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {selectedProducts.length > 0 && (
            <div className="px-4 py-2 bg-white border-t border-red-100">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {selectedProducts.length > 1 && (
                  <button
                    onClick={() => setInputMessage("Compare these products")}
                    className="px-4 py-2 bg-gradient-to-r from-red-100 to-pink-100 text-red-700 rounded-xl text-sm whitespace-nowrap hover:from-red-200 hover:to-pink-200 transition-all duration-300 shadow-sm hover:shadow"
                  >
                    Compare All
                  </button>
                )}
                <button
                  onClick={() => setInputMessage("මේ භාණ්ඩ අතර වෙනස මොකක්ද?")}
                  className="px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-xl text-sm whitespace-nowrap hover:from-green-200 hover:to-emerald-200 transition-all duration-300 shadow-sm hover:shadow"
                >
                  සසඳා බලන්න
                </button>

                <button
                  onClick={() => setInputMessage("මට ගැලපෙන හොඳම දේවල් මොනවාද?")}
                  className="px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-xl text-sm whitespace-nowrap hover:from-green-200 hover:to-emerald-200 transition-all duration-300 shadow-sm hover:shadow"
                >
                  යෝජනා කරන්න
                </button>

                <button
                  onClick={() => setInputMessage("දැනට තියෙන අඩුම මිල ගණන් මොනවාද?")}
                  className="px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-xl text-sm whitespace-nowrap hover:from-green-200 hover:to-emerald-200 transition-all duration-300 shadow-sm hover:shadow"
                >
                  මිල ගණන් බලන්න
                </button>
                <button
                  onClick={() => setInputMessage("දැනට තියෙන විශේෂ වට්ටම් මොනවාද?")}
                  className="px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-xl text-sm whitespace-nowrap hover:from-green-200 hover:to-emerald-200 transition-all duration-300 shadow-sm hover:shadow"
                >
                  වට්ටම් බලන්න
                </button>
                <button
                  onClick={() => setInputMessage("What are the prices?")}
                  className="px-4 py-2 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 rounded-xl text-sm whitespace-nowrap hover:from-blue-200 hover:to-cyan-200 transition-all duration-300 shadow-sm hover:shadow"
                >
                  Check Prices
                </button>
                <button
                  onClick={() => setInputMessage("Which one do you recommend?")}
                  className="px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-xl text-sm whitespace-nowrap hover:from-green-200 hover:to-emerald-200 transition-all duration-300 shadow-sm hover:shadow"
                >
                  Recommend
                </button>
              </div>
            </div>
          )}

          {/* Chat Input */}
          <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-red-100">
            <div className="flex gap-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask me anything about products..."
                className="flex-1 px-5 py-3 border border-red-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm placeholder-gray-400 bg-red-50/50"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-md hover:shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #e43b3b 0%, #d13232 100%)'
                }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        
        @keyframes ping-slow {
          75%, 100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
        
        .animate-ping-slow {
          animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        /* Smooth scrollbar styling */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-track {
          background: rgba(228, 59, 59, 0.05);
          border-radius: 3px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: rgba(228, 59, 59, 0.2);
          border-radius: 3px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: rgba(228, 59, 59, 0.4);
        }
        
        /* Line clamp utility */
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </>
  );
};

export default AIChatBot;