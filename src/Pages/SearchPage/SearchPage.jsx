// myapp\src\Pages\SearchPage\SearchPage.jsx

import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { searchProducts } from "./searchProducts";
import AIChatBot from "../../Layout/AIChatBot";
import { useDispatch, useSelector } from "react-redux";
import { userSelecter } from "../../Store/ReduxSlice/userClise";
import ModelLogging from "../../modals/ModelLogging";
import "./SearchPage.css"; // Import the CSS file
import { addToCart } from '../../../src/utils/AddToCart/addToCart'


const SearchPage = () => {


  const modellogginRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [allResults, setAllResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const userData = useSelector(userSelecter);
  const dispatch = useDispatch()
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  
  const [filters, setFilters] = useState({
    categories: [],
    priceRange: { min: "", max: "" },
    availability: "all",
    delivery: "all"
  });

  const [availableCategories, setAvailableCategories] = useState([]);
  const [searchProgress, setSearchProgress] = useState(0);

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

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredResults]);

  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setSearchProgress(0);
    
    // Simulate search progress
    const progressInterval = setInterval(() => {
      setSearchProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 100);
    
    const data = await searchProducts(searchQuery);
    setAllResults(data);
    
    const categories = [...new Set(data.map(item => {
      const parts = item.categoryPath?.split('/') || [];
      return parts[1] || parts[0] || 'Uncategorized';
    }))];
    setAvailableCategories(categories);
    
    setSearchProgress(100);
    setTimeout(() => {
      setLoading(false);
      clearInterval(progressInterval);
    }, 300);
  };

  const applyFilters = () => {
    let filtered = [...allResults];

    if (filters.categories.length > 0) {
      filtered = filtered.filter(item => {
        const parts = item.categoryPath?.split('/') || [];
        const itemCategory = parts[1] || parts[0] || 'Uncategorized';
        return filters.categories.includes(itemCategory);
      });
    }

    if (filters.priceRange.min !== "" || filters.priceRange.max !== "") {
      filtered = filtered.filter(item => {
        const price = parseFloat(item.price) || 0;
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

    setCurrentPage(1);
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
            modellogginRef.current.handleOpen();
            return;
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
    
    // Show success feedback
    const button = document.activeElement;
    if (button) {
      const originalText = button.textContent;
      button.textContent = "✓ Added!";
      button.style.background = "linear-gradient(135deg, #10b981, #059669)";
      setTimeout(() => {
        button.textContent = originalText;
        button.style.background = "linear-gradient(135deg, #dc2626, #e43b3b)";
      }, 1500);
    }

    addToCart(userData.uid,product,userData.cart,dispatch)
    console.log('මම සර්ච් පේජ් එක  බ්‍රෝ');
    
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
        stockCount: product.stockCount,
        rating: product.rating,
        reviewCount: product.reviewCount,
        keywords: product.keywords
      }
    });
    window.dispatchEvent(event);
    
    // Show success feedback
    const button = document.activeElement;
    if (button) {
      const originalText = button.textContent;
      button.textContent = "✓ Added to Chat!";
      button.style.background = "linear-gradient(135deg, #fff133, #ffcc00)";
      setTimeout(() => {
        button.textContent = originalText;
        button.style.background = "linear-gradient(135deg, #facc15, #f59e0b)";
      }, 1500);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate savings
  const calculateSavings = (originalPrice, price) => {
    const original = parseFloat(originalPrice);
    const current = parseFloat(price);
    if (original && current && original > current) {
      const savings = original - current;
      const percentage = Math.round((savings / original) * 100);
      return { amount: savings, percentage };
    }
    return null;
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentResults = filteredResults.slice(startIndex, endIndex);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePageClick = (pageNum) => {
    setCurrentPage(pageNum);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

const activeFiltersCount = 
  (filters.categories?.length || 0) +  // Fix 1: Add ?. and || 0
  (filters.priceRange?.min || filters.priceRange?.max ? 1 : 0) + 
  (filters.availability !== "all" ? 1 : 0) + 
  (filters.delivery !== "all" ? 1 : 0);

  return (
    <>


      <div className="search-page min-h-screen py-8 px-4">
        <div className="max-w-7xl mx-auto">
            <form onSubmit={handleSearch} className="search-form mb-8">
            <div className="search-form-container">
                <div className="relative flex-1">
                <svg className="search-icon w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                    type="text"
                    placeholder="Search products, brands, categories..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="search-input"
                />
                </div>
                <button 
                type="submit"
                className="search-btn text-white font-semibold"
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
                className="filter-toggle-btn w-full flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  <span className="font-semibold">Filters</span>
                  {activeFiltersCount > 0 && (
                    <span className="filter-badge text-white text-xs px-2 rounded-full">
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
              <>
                {/* Mobile filter overlay */}
                <div className={`filter-overlay ${showFilters ? 'open' : ''}`} onClick={() => setShowFilters(false)} />
                
                <div className={`filter-sidebar ${showFilters ? 'open' : ''} w-full lg:w-72 flex-shrink-0`}>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                        Filters
                      </h2>
                      <div className="flex items-center gap-3">
                        {activeFiltersCount > 0 && (
                          <button
                            onClick={clearFilters}
                            className="text-sm text-red-600 hover:text-red-700 font-semibold"
                          >
                            Clear All
                          </button>
                        )}
                        <button
                          onClick={() => setShowFilters(false)}
                          className="lg:hidden text-gray-500 hover:text-gray-700"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h3 className="filter-section-title">Categories</h3>
                      <div className="space-y-1">
                        {availableCategories.map(category => (
                          <label key={category} className="filter-category-item flex items-center gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={filters.categories.includes(category)}
                              onChange={() => handleCategoryToggle(category)}
                              className="filter-checkbox"
                            />
                            <span className="text-gray-700 text-sm">{category.replace(/_/g, ' ')}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="mb-6">
                      <h3 className="filter-section-title">Price Range</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500 text-sm">Rs.</span>
                          <input
                            type="number"
                            placeholder="Min"
                            value={filters.priceRange.min}
                            onChange={(e) => handlePriceRangeChange('min', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500 text-sm">Rs.</span>
                          <input
                            type="number"
                            placeholder="Max"
                            value={filters.priceRange.max}
                            onChange={(e) => handlePriceRangeChange('max', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h3 className="filter-section-title">Availability</h3>
                      <div className="space-y-2">
                        <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                          <input
                            type="radio"
                            name="availability"
                            checked={filters.availability === "all"}
                            onChange={() => setFilters(prev => ({ ...prev, availability: "all" }))}
                            className="w-4 h-4 text-red-600 focus:ring-2 focus:ring-red-500"
                          />
                          <span className="text-gray-700 text-sm">All Products</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                          <input
                            type="radio"
                            name="availability"
                            checked={filters.availability === "inStock"}
                            onChange={() => setFilters(prev => ({ ...prev, availability: "inStock" }))}
                            className="w-4 h-4 text-red-600 focus:ring-2 focus:ring-red-500"
                          />
                          <span className="text-gray-700 text-sm">In Stock</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                          <input
                            type="radio"
                            name="availability"
                            checked={filters.availability === "outOfStock"}
                            onChange={() => setFilters(prev => ({ ...prev, availability: "outOfStock" }))}
                            className="w-4 h-4 text-red-600 focus:ring-2 focus:ring-red-500"
                          />
                          <span className="text-gray-700 text-sm">Out of Stock</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <h3 className="filter-section-title">Delivery Options</h3>
                      <div className="space-y-2">
                        <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                          <input
                            type="radio"
                            name="delivery"
                            checked={filters.delivery === "all"}
                            onChange={() => setFilters(prev => ({ ...prev, delivery: "all" }))}
                            className="w-4 h-4 text-red-600 focus:ring-2 focus:ring-red-500"
                          />
                          <span className="text-gray-700 text-sm">All Delivery</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                          <input
                            type="radio"
                            name="delivery"
                            checked={filters.delivery === "fast"}
                            onChange={() => setFilters(prev => ({ ...prev, delivery: "fast" }))}
                            className="w-4 h-4 text-red-600 focus:ring-2 focus:ring-red-500"
                          />
                          <span className="text-gray-700 text-sm">Fast Delivery 🚀</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                          <input
                            type="radio"
                            name="delivery"
                            checked={filters.delivery === "standard"}
                            onChange={() => setFilters(prev => ({ ...prev, delivery: "standard" }))}
                            className="w-4 h-4 text-red-600 focus:ring-2 focus:ring-red-500"
                          />
                          <span className="text-gray-700 text-sm">Standard Delivery</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="flex-1">
              {!loading && query && allResults.length > 0 && (
                <div className="mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="text-gray-700">
                      <p className="text-sm text-gray-500 mb-1">Search Results</p>
                      <p className="font-semibold">
                        Showing <span className="text-red-600">{startIndex + 1}-{Math.min(endIndex, filteredResults.length)}</span> of{" "}
                        <span className="text-red-600">{filteredResults.length}</span> results for{" "}
                        <span className="text-gray-900 font-bold">"{query}"</span>
                      </p>
                    </div>
                    {activeFiltersCount > 0 && (
                      <button
                        onClick={clearFilters}
                        className="text-sm text-red-600 hover:text-red-700 font-semibold flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Clear Filters ({activeFiltersCount})
                      </button>
                    )}
                  </div>
                  
                  {loading && searchProgress > 0 && (
                    <div className="mt-4">
                      <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-red-500 to-red-400 rounded-full transition-all duration-300"
                          style={{ width: `${searchProgress}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1 text-right">
                        Loading... {searchProgress}%
                      </p>
                    </div>
                  )}
                </div>
              )}

              {loading && (
                <div className="loading-container">
                  <div className="loading-spinner" />
                  <p className="loading-text">Searching for products...</p>
                  <div className="mt-4 w-64 h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-red-500 to-red-400 rounded-full transition-all duration-300"
                      style={{ width: `${searchProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {searchProgress}% complete
                  </p>
                </div>
              )}
              
              {!loading && query && allResults.length === 0 && (
                <div className="empty-state">
                  <div className="empty-state-icon">🔍</div>
                  <h3 className="empty-state-title">No products found</h3>
                  <p className="empty-state-description">
                    We couldn't find any products matching "{query}". Try different keywords or check the spelling.
                  </p>
                  <button
                    onClick={() => navigate('/')}
                    className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-400 text-white rounded-lg hover:shadow-lg transition-all font-semibold"
                  >
                    Browse All Products
                  </button>
                </div>
              )}

              {!loading && allResults.length > 0 && filteredResults.length === 0 && (
                <div className="empty-state">
                  <div className="empty-state-icon">🎯</div>
                  <h3 className="empty-state-title">No matching products</h3>
                  <p className="empty-state-description">
                    No products match the selected filters. Try adjusting your filter criteria.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-400 text-white rounded-lg hover:shadow-lg transition-all font-semibold"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {currentResults.map((item) => {
                  const savings = calculateSavings(item.originalPrice, item.price);
                  const categoryParts = item.categoryPath?.split('/') || [];
                  const mainCategory = categoryParts[1] || categoryParts[0] || 'Uncategorized';
                  
                  return (
                    <div 
                      key={item.id} 
                      className="product-card"
                    >
                      <Link to={`/category/${mainCategory}/${item.id}`}>
                        <div className="product-image-container">
                          <img 
                            src={item.imageUrl} 
                            alt={item.title}
                            className="product-image"
                            loading="lazy"
                          />
                          {!item.inStock && (
                            <div className="badge badge-out-of-stock">
                              Out of Stock
                            </div>
                          )}
                          {item.fastDelivery && (
                            <div className="badge badge-fast-delivery">
                              Fast Delivery 🚀
                            </div>
                          )}
                          {item.isFeatured && (
                            <div className="absolute top-14 right-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                              Featured
                            </div>
                          )}
                          {savings && (
                            <div className="absolute bottom-3 left-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-lg text-sm font-bold shadow-lg">
                              Save Rs.{savings.amount}
                            </div>
                          )}
                        </div>
                      </Link>

                      <div className="product-info">
                        <div className="flex items-start justify-between mb-2">
                          <Link to={`/category/${mainCategory}/${item.id}`}>
                            <h3 className="product-title">
                              {item.title}
                            </h3>
                          </Link>
                        </div>
                        
                        <p className="product-description mb-3">
                          {item.description}
                        </p>

                        {/* Enhanced Product Details */}
                        <div className="product-details-grid">
                          <div className="product-detail-item">
                            <svg className="product-detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Stock: {item.stockCount || 0} units</span>
                          </div>
                          
                          <div className="product-detail-item">
                            <svg className="product-detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>Added: {formatDate(item.createdAt)}</span>
                          </div>
                          
                          <div className="product-detail-item">
                            <svg className="product-detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            <span>Category: {mainCategory.replace(/_/g, ' ')}</span>
                          </div>
                        </div>

                        {/* Keywords */}
                        {item.keywords && item.keywords.length > 0 && (
                          <div className="product-keywords">
                            {item.keywords.slice(0, 3).map((keyword, index) => (
                              <span key={index} className="keyword-tag">
                                {keyword}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Price Section */}
                        <div className="mt-4 mb-4">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="product-price">
                              Rs.{item.price}
                            </span>
                            {item.originalPrice && item.originalPrice !== item.price && (
                              <>
                                <span className="product-original-price">
                                  Rs.{item.originalPrice}
                                </span>
                                {item.discount && (
                                  <span className="bg-gradient-to-r from-red-500 to-red-400 text-white text-xs font-bold px-2 py-1 rounded-lg">
                                    {item.discount} OFF
                                  </span>
                                )}
                              </>
                            )}
                          </div>
                          {savings && (
                            <p className="text-xs text-green-600 font-semibold">
                              You save Rs.{savings.amount} ({savings.percentage}%)
                            </p>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="product-actions">
                          <button
                            onClick={() => handleAddToCart(item)}
                            disabled={!item.inStock}
                            className={`btn-cart ${!item.inStock ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                          </button>
                          
                          <button
                            onClick={() => handleAddToAIChat(item)}
                            className="btn-chat"
                          >
                            <span className="flex items-center justify-center gap-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                              </svg>
                              Send to AI
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination Controls */}
              {filteredResults.length > itemsPerPage && (
                <div className="pagination mt-8">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="pagination-btn bg-white text-gray-700 border border-gray-300"
                  >
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Previous
                    </span>
                  </button>

                  <div className="flex gap-1">
                    {getPageNumbers().map((page, index) => (
                      page === '...' ? (
                        <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">
                          ...
                        </span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => handlePageClick(page)}
                          className={`pagination-btn ${currentPage === page ? 'active' : 'bg-white text-gray-700 border border-gray-300'}`}
                        >
                          {page}
                        </button>
                      )
                    ))}
                  </div>

                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="pagination-btn bg-white text-gray-700 border border-gray-300"
                  >
                    <span className="flex items-center gap-2">
                      Next
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* AI Chat Bot Component */}
      <AIChatBot />
      <br/><br/>
    </>
  );
};

export default SearchPage;