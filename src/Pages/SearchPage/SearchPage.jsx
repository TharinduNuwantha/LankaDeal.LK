import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { searchProducts } from "./searchProducts";

const SearchPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Read URL parameter on mount and perform search
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlQuery = params.get("q") || params.get("") || "";
    if (urlQuery) {
      setQuery(urlQuery);
      performSearch(urlQuery);
    }
  }, [location.search]);

  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    const data = await searchProducts(searchQuery);
    setResults(data);
    setLoading(false);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!query.trim()) return;

    // Update URL with new search query
    navigate(`/search?q=${encodeURIComponent(query)}`, { replace: false });
    
    // Perform search
    await performSearch(query);
  };

  const handleAddToCart = (product) => {
    // Get existing cart from localStorage
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    
    // Check if product already exists in cart
    const existingProductIndex = existingCart.findIndex(item => item.id === product.id);
    
    if (existingProductIndex > -1) {
      // Increase quantity if product exists
      existingCart[existingProductIndex].quantity = (existingCart[existingProductIndex].quantity || 1) + 1;
    } else {
      // Add new product with quantity 1
      existingCart.push({ ...product, quantity: 1 });
    }
    
    // Save to localStorage
    localStorage.setItem("cart", JSON.stringify(existingCart));
    
    // Optional: Show success message
    alert(`${product.title} added to cart!`);
  };

  const handleAddToAIChat = (product) => {
    // Navigate to AI chat with product information
    const productInfo = encodeURIComponent(JSON.stringify({
      id: product.id,
      title: product.title,
      price: product.price,
      description: product.description,
      categoryPath: product.categoryPath
    }));
    
    navigate(`/ai-chat?product=${productInfo}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2 max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search products (e.g. pro, cricket, bat)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button 
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Search
            </button>
          </div>
        </form>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        )}
        
        {/* No Results */}
        {!loading && query && results.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No products found for "{query}"</p>
          </div>
        )}

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {results.map((item) => (
            <div 
              key={item.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {/* Product Image */}
              <Link to={`/${item.categoryPath}/product/${item.id}`}>
                <div className="relative h-48 bg-gray-100">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  {!item.inStock && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Out of Stock
                    </div>
                  )}
                  {item.fastDelivery && (
                    <div className="absolute top-2 left-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Fast Delivery 🚀
                    </div>
                  )}
                </div>
              </Link>

              {/* Product Info */}
              <div className="p-4">
                <Link to={`/${item.categoryPath}/product/${item.id}`}>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 hover:text-blue-600 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                </Link>
                
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {item.description}
                </p>

                {/* Price */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl font-bold text-gray-900">
                    Rs. {item.price}
                  </span>
                  {item.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">
                      Rs. {item.originalPrice}
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleAddToCart(item)}
                    disabled={!item.inStock}
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-colors duration-200 ${
                      item.inStock
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Add to Cart
                  </button>
                  
                  <button
                    onClick={() => handleAddToAIChat(item)}
                    className="w-full py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 font-medium"
                  >
                    Add to Chat 🤖
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;