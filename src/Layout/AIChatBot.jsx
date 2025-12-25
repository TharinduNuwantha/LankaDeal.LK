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
        setIsOpen(true);
        
        const productMessage = {
          id: Date.now(),
          type: "bot",
          text: `Great! I've added "${product.title}" to our conversation. What would you like to know about ${selectedProducts.length > 0 ? 'these products' : 'this product'}?`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, productMessage]);
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
          categoryPath: product.categoryPath
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
                <div className={`flex gap-2 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
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
                      
                      {/* Product Links */}
                      {message.productLinks && message.productLinks.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-xs font-semibold text-gray-600 mb-2">Related Products:</p>
                          <div className="space-y-1">
                            {message.productLinks.map((product, idx) => (
                              <Link
                                key={idx}
                                to={`/category/${product.categoryPath.split('/')[1]}/${product.id}`}
                                className="block text-xs text-blue-600 hover:text-blue-800 hover:underline"
                              >
                                🔗 {product.title}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
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
                    onClick={() => setInputMessage("Compare these products")}
                    className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs whitespace-nowrap hover:bg-purple-200 transition-colors"
                  >
                    Compare All
                  </button>
                )}
                <button
                  onClick={() => setInputMessage("What are the prices?")}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs whitespace-nowrap hover:bg-blue-200 transition-colors"
                >
                  Check Prices
                </button>
                <button
                  onClick={() => setInputMessage("Which one do you recommend?")}
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
                placeholder="Ask me anything about products..."
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