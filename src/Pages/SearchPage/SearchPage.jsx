import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { searchProducts } from "./searchProducts";
import AIChatBot from "../../Layout/AIChatBot";
import { useSelector } from "react-redux";
import { userSelecter } from "../../Store/ReduxSlice/userClise";
import ModelLogging from "../../modals/ModelLogging";

const SearchPage = () => {
    const modellogginRef = useRef()
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [allResults, setAllResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const userData = useSelector(userSelecter);
  
  const [filters, setFilters] = useState({
    categories: [],
    priceRange: { min: "", max: "" },
    availability: "all",
    delivery: "all"
  });

  const [availableCategories, setAvailableCategories] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlQuery = params.get("q") || params.get("") || "";
    if (urlQuery) {
      setQuery(urlQuery);
      performSearch(urlQuery);
    }
  }, [location.search]);

  useEffect(() => {
    applyFilters();
  }, [filters, allResults]);

  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    const data = await searchProducts(searchQuery);
    setAllResults(data);
    
    const categories = [...new Set(data.map(item => {
      const parts = item.categoryPath.split('/');
      return parts[1] || parts[0];
    }))];
    setAvailableCategories(categories);
    
    setLoading(false);
  };

  const applyFilters = () => {
    let filtered = [...allResults];

    if (filters.categories.length > 0) {
      filtered = filtered.filter(item => {
        const itemCategory = item.categoryPath.split('/')[1] || item.categoryPath.split('/')[0];
        return filters.categories.includes(itemCategory);
      });
    }

    if (filters.priceRange.min !== "" || filters.priceRange.max !== "") {
      filtered = filtered.filter(item => {
        const price = parseFloat(item.price);
        const min = filters.priceRange.min === "" ? 0 : parseFloat(filters.priceRange.min);
        const max = filters.priceRange.max === "" ? Infinity : parseFloat(filters.priceRange.max);
        return price >= min && price <= max;
      });
    }

    if (filters.availability === "inStock") {
      filtered = filtered.filter(item => item.inStock === true);
    } else if (filters.availability === "outOfStock") {
      filtered = filtered.filter(item => item.inStock === false);
    }

    if (filters.delivery === "fast") {
      filtered = filtered.filter(item => item.fastDelivery === true);
    } else if (filters.delivery === "standard") {
      filtered = filtered.filter(item => !item.fastDelivery);
    }

    setFilteredResults(filtered);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!query.trim()) return;

    setFilters({
      categories: [],
      priceRange: { min: "", max: "" },
      availability: "all",
      delivery: "all"
    });

    navigate(`/search?q=${encodeURIComponent(query)}`, { replace: false });
    await performSearch(query);
  };

  const handleCategoryToggle = (category) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handlePriceRangeChange = (type, value) => {
    setFilters(prev => ({
      ...prev,
      priceRange: {
        ...prev.priceRange,
        [type]: value
      }
    }));
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
      priceRange: { min: "", max: "" },
      availability: "all",
      delivery: "all"
    });
  };

  const handleAddToCart = (product) => {
    if(userData.name){
        if(userData.name === 'default' || userData.name === '' || userData.name === 'no-user'){
            modellogginRef.current.handleOpen()
            
        }
    }
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingProductIndex = existingCart.findIndex(item => item.id === product.id);
    
    if (existingProductIndex > -1) {
      existingCart[existingProductIndex].quantity = (existingCart[existingProductIndex].quantity || 1) + 1;
    } else {
      existingCart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem("cart", JSON.stringify(existingCart));
    // alert(`${product.title} added to cart!`);
  };

  const handleAddToAIChat = (product) => {
    console.log("Adding product to chat:", product);
    const event = new CustomEvent('addProductToChat', { 
      detail: {
        id: product.id,
        title: product.title,
        price: product.price,
        originalPrice: product.originalPrice,
        discount: product.discount,
        description: product.description,
        categoryPath: product.categoryPath,
        imageUrl: product.imageUrl,
        inStock: product.inStock,
        fastDelivery: product.fastDelivery,
        stockCount: product.stockCount
      }
    });
    window.dispatchEvent(event);
  };

  const activeFiltersCount = 
    filters.categories.length + 
    (filters.priceRange.min || filters.priceRange.max ? 1 : 0) + 
    (filters.availability !== "all" ? 1 : 0) + 
    (filters.delivery !== "all" ? 1 : 0);

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
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
            <ModelLogging ref={modellogginRef} />
          {allResults.length > 0 && (
            <div className="mb-4 lg:hidden">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="w-full flex items-center justify-between px-4 py-3 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  <span className="font-medium">Filters</span>
                  {activeFiltersCount > 0 && (
                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                      {activeFiltersCount}
                    </span>
                  )}
                </div>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {showFilters ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  )}
                </svg>
              </button>
            </div>
          )}

          <div className="flex gap-6">
            {allResults.length > 0 && (
              <div className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-64 flex-shrink-0`}>
                <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                      </svg>
                      Filters
                    </h2>
                    {activeFiltersCount > 0 && (
                      <button
                        onClick={clearFilters}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Clear All
                      </button>
                    )}
                  </div>

                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-800 mb-3">Category</h3>
                    <div className="space-y-2">
                      {availableCategories.map(category => (
                        <label key={category} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                          <input
                            type="checkbox"
                            checked={filters.categories.includes(category)}
                            onChange={() => handleCategoryToggle(category)}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="text-gray-700 text-sm">{category.replace(/_/g, ' ')}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-800 mb-3">Price Range</h3>
                    <div className="space-y-2">
                      <input
                        type="number"
                        placeholder="Min Price"
                        value={filters.priceRange.min}
                        onChange={(e) => handlePriceRangeChange('min', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      <input
                        type="number"
                        placeholder="Max Price"
                        value={filters.priceRange.max}
                        onChange={(e) => handlePriceRangeChange('max', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-800 mb-3">Availability</h3>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                        <input
                          type="radio"
                          name="availability"
                          checked={filters.availability === "all"}
                          onChange={() => setFilters(prev => ({ ...prev, availability: "all" }))}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-gray-700 text-sm">All Products</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                        <input
                          type="radio"
                          name="availability"
                          checked={filters.availability === "inStock"}
                          onChange={() => setFilters(prev => ({ ...prev, availability: "inStock" }))}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-gray-700 text-sm">In Stock</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                        <input
                          type="radio"
                          name="availability"
                          checked={filters.availability === "outOfStock"}
                          onChange={() => setFilters(prev => ({ ...prev, availability: "outOfStock" }))}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-gray-700 text-sm">Out of Stock</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Delivery</h3>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                        <input
                          type="radio"
                          name="delivery"
                          checked={filters.delivery === "all"}
                          onChange={() => setFilters(prev => ({ ...prev, delivery: "all" }))}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-gray-700 text-sm">All Delivery</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                        <input
                          type="radio"
                          name="delivery"
                          checked={filters.delivery === "fast"}
                          onChange={() => setFilters(prev => ({ ...prev, delivery: "fast" }))}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-gray-700 text-sm">Fast Delivery 🚀</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                        <input
                          type="radio"
                          name="delivery"
                          checked={filters.delivery === "standard"}
                          onChange={() => setFilters(prev => ({ ...prev, delivery: "standard" }))}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-gray-700 text-sm">Standard Delivery</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex-1">
              {!loading && query && allResults.length > 0 && (
                <div className="mb-4 text-gray-600">
                  Showing {filteredResults.length} of {allResults.length} results for "{query}"
                </div>
              )}

              {loading && (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  <p className="mt-4 text-gray-600">Loading...</p>
                </div>
              )}
              
              {!loading && query && allResults.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">No products found for "{query}"</p>
                </div>
              )}

              {!loading && allResults.length > 0 && filteredResults.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">No products match the selected filters</p>
                  <button
                    onClick={clearFilters}
                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredResults.map((item) => (
                  <div 
                    key={item.id} 
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                  >
                    <Link to={`/category/${item.categoryPath.split('/')[1]}/${item.id}`}>
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

                    <div className="p-4">
                      <Link to={`/category/${item.categoryPath.split('/')[1]}/${item.id}`}>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2 hover:text-blue-600 transition-colors line-clamp-2">
                          {item.title}
                        </h3>
                      </Link>
                      
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {item.description}
                      </p>

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
        </div>
      </div>

      {/* AI Chat Bot Component */}
      <AIChatBot />
    </>
  );
};

export default SearchPage;