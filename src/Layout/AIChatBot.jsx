import { useState, useEffect, useRef } from "react";

const AIChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      text: "Hello! 👋 I'm your shopping assistant. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Listen for product additions from other components
  useEffect(() => {
    const handleProductAdd = (event) => {
      console.log("Event received in AIChatBot:", event.detail);
      const product = event.detail;
      
      // Check if product already exists
      const exists = selectedProducts.some(p => p.id === product.id);
      
      if (!exists) {
        // Add product to selected products
        setSelectedProducts(prev => [...prev, product]);
        
        // Open chat
        setIsOpen(true);
        
        // Add bot message
        const productMessage = {
          id: Date.now(),
          type: "bot",
          text: `Great! I've added "${product.title}" to our conversation. What would you like to know about ${selectedProducts.length > 0 ? 'these products' : 'this product'}?`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, productMessage]);
      } else {
        // Product already added
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

  // Auto-scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const removeProduct = (productId) => {
    const removedProduct = selectedProducts.find(p => p.id === productId);
    setSelectedProducts(prev => prev.filter(p => p.id !== productId));
    
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

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: "user",
      text: inputMessage,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    
    // Simulate bot typing
    setIsTyping(true);
    
    // Simulate AI response
    setTimeout(() => {
      const botResponse = generateBotResponse(inputMessage, selectedProducts);
      const botMessage = {
        id: Date.now() + 1,
        type: "bot",
        text: botResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const generateBotResponse = (userMsg, products) => {
    const msg = userMsg.toLowerCase();
    
    if (products.length === 0) {
      return "You haven't added any products yet. Click 'Add to Chat' on any product to start discussing it with me!";
    }
    
    // Compare products
    if (msg.includes("compare") && products.length > 1) {
      let comparison = "Here's a comparison of your selected products:\n\n";
      products.forEach((p, idx) => {
        comparison += `${idx + 1}. ${p.title}\n   Price: Rs. ${p.price}\n   Stock: ${p.inStock ? 'In Stock' : 'Out of Stock'}\n   Delivery: ${p.fastDelivery ? 'Fast 🚀' : 'Standard'}\n\n`;
      });
      return comparison;
    }
    
    // Price related
    if (msg.includes("price") || msg.includes("cost") || msg.includes("cheap")) {
      if (products.length === 1) {
        const p = products[0];
        return `The ${p.title} is priced at Rs. ${p.price}. ${p.originalPrice ? `That's ${p.discount} off from the original price of Rs. ${p.originalPrice}!` : ''}`;
      } else {
        const prices = products.map(p => `${p.title}: Rs. ${p.price}`).join('\n');
        const cheapest = products.reduce((min, p) => parseFloat(p.price) < parseFloat(min.price) ? p : min);
        return `Here are the prices:\n\n${prices}\n\nThe most affordable option is ${cheapest.title} at Rs. ${cheapest.price}.`;
      }
    }
    
    // Delivery related
    if (msg.includes("delivery") || msg.includes("shipping")) {
      const fastDelivery = products.filter(p => p.fastDelivery);
      if (fastDelivery.length === products.length) {
        return `Great news! All selected products qualify for fast delivery 🚀 (2-3 business days).`;
      } else if (fastDelivery.length > 0) {
        return `${fastDelivery.length} of your selected products have fast delivery 🚀. The others have standard delivery (5-7 business days).`;
      } else {
        return `All selected products have standard delivery, which typically takes 5-7 business days.`;
      }
    }
    
    // Stock related
    if (msg.includes("stock") || msg.includes("available")) {
      const inStock = products.filter(p => p.inStock);
      if (inStock.length === products.length) {
        return `All ${products.length} selected products are in stock and ready to ship!`;
      } else if (inStock.length > 0) {
        return `${inStock.length} out of ${products.length} products are currently in stock. Some items may require waiting for restock.`;
      } else {
        return `Unfortunately, all selected products are currently out of stock. Would you like me to help you find alternatives?`;
      }
    }
    
    // Details about all products
    if (msg.includes("details") || msg.includes("tell me more") || msg.includes("info")) {
      let details = "Here are the details for your selected products:\n\n";
      products.forEach((p, idx) => {
        details += `${idx + 1}. ${p.title}\n`;
        details += `   ${p.description}\n`;
        details += `   Price: Rs. ${p.price}\n`;
        details += `   Stock: ${p.inStock ? 'Available' : 'Out of Stock'}\n\n`;
      });
      return details;
    }
    
    // Recommendation
    if (msg.includes("recommend") || msg.includes("suggest") || msg.includes("which one")) {
      if (products.length === 1) {
        return `You've selected a great product! The ${products[0].title} is ${products[0].inStock ? 'in stock and ready to ship' : 'currently out of stock'}. Would you like to know more about it?`;
      } else {
        const inStock = products.filter(p => p.inStock);
        const fastDelivery = inStock.filter(p => p.fastDelivery);
        
        if (fastDelivery.length > 0) {
          const best = fastDelivery.reduce((min, p) => parseFloat(p.price) < parseFloat(min.price) ? p : min);
          return `Based on your selection, I recommend the ${best.title} at Rs. ${best.price}. It's in stock and offers fast delivery! 🚀`;
        } else if (inStock.length > 0) {
          const best = inStock.reduce((min, p) => parseFloat(p.price) < parseFloat(min.price) ? p : min);
          return `I recommend the ${best.title} at Rs. ${best.price}. It's currently in stock!`;
        }
      }
    }
    
    // Total price
    if (msg.includes("total") || msg.includes("all together")) {
      const total = products.reduce((sum, p) => sum + parseFloat(p.price), 0);
      return `The total for all ${products.length} selected products would be Rs. ${total.toFixed(2)}.`;
    }
    
    // General responses
    if (msg.includes("hello") || msg.includes("hi")) {
      return `Hello! I see you have ${products.length} product${products.length > 1 ? 's' : ''} selected. How can I help you with ${products.length > 1 ? 'them' : 'it'}?`;
    }
    
    if (msg.includes("help")) {
      return "I can help you with:\n• Compare products\n• Price information\n• Delivery options\n• Stock availability\n• Product recommendations\n\nWhat would you like to know?";
    }
    
    if (msg.includes("thank")) {
      return "You're welcome! Is there anything else I can help you with?";
    }
    
    return `I'd be happy to help you with your ${products.length} selected product${products.length > 1 ? 's' : ''}! You can ask me to compare them, check prices, delivery options, or get recommendations.`;
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
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 ${
          isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-gradient-to-br from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
        }`}
        aria-label="Toggle chat"
      >
        {isOpen ? (
          <svg className="w-8 h-8 mx-auto text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <div className="relative">
            <svg className="w-8 h-8 mx-auto text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            {selectedProducts.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold border-2 border-white">
                {selectedProducts.length}
              </span>
            )}
            <span className="absolute top-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></span>
          </div>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 animate-slideUp max-sm:w-[calc(100vw-2rem)] max-sm:h-[calc(100vh-8rem)] max-sm:bottom-20 max-sm:right-4">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-2xl">🤖</span>
              </div>
              <div>
                <h3 className="font-bold text-lg">AI Shopping Assistant</h3>
                <p className="text-xs text-purple-100">
                  {selectedProducts.length > 0 ? `${selectedProducts.length} product${selectedProducts.length > 1 ? 's' : ''} selected` : 'Ready to help'}
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
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-3 border-b border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-semibold text-gray-700">Selected Products ({selectedProducts.length})</h4>
              </div>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                {selectedProducts.map((product) => (
                  <div 
                    key={product.id} 
                    className="bg-white rounded-lg p-2 shadow-sm hover:shadow-md transition-shadow relative group"
                  >
                    <button
                      onClick={() => removeProduct(product.id)}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold hover:bg-red-600"
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
                    <p className="text-xs text-purple-600 font-bold">Rs. {product.price}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Chat Messages */}
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
            style={{ scrollBehavior: 'smooth' }}
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === 'user' ? 'bg-blue-600' : 'bg-gradient-to-br from-purple-600 to-blue-600'
                  }`}>
                    {message.type === 'user' ? (
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    ) : (
                      <span className="text-white">🤖</span>
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div>
                    <div className={`rounded-2xl px-4 py-2 ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none shadow-sm'
                    }`}>
                      <p className="text-sm whitespace-pre-line">{message.text}</p>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 px-2">
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
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                    <span className="text-white">🤖</span>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {selectedProducts.length > 0 && (
            <div className="px-4 py-2 bg-white border-t border-gray-200">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {selectedProducts.length > 1 && (
                  <button
                    onClick={() => {
                      setInputMessage("Compare these products");
                      document.querySelector('input[type="text"]')?.focus();
                    }}
                    className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs whitespace-nowrap hover:bg-purple-200 transition-colors"
                  >
                    Compare All
                  </button>
                )}
                <button
                  onClick={() => {
                    setInputMessage("What are the prices?");
                    document.querySelector('input[type="text"]')?.focus();
                  }}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs whitespace-nowrap hover:bg-blue-200 transition-colors"
                >
                  Check Prices
                </button>
                <button
                  onClick={() => {
                    setInputMessage("Which one do you recommend?");
                    document.querySelector('input[type="text"]')?.focus();
                  }}
                  className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs whitespace-nowrap hover:bg-green-200 transition-colors"
                >
                  Recommend
                </button>
              </div>
            </div>
          )}

          {/* Chat Input */}
          <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-full hover:from-purple-700 hover:to-blue-700 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Custom CSS for animation */}
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
      `}</style>
    </>
  );
};

export default AIChatBot;