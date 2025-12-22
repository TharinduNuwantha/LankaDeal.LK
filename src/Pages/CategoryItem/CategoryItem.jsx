import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { categorySelector } from "../../Store/ReduxSlice/categorySlice";
import { useParams } from "react-router-dom";
import { IconButton, Rating, Slider, Checkbox, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import VisibilityIcon from '@mui/icons-material/Visibility';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import CloseIcon from '@mui/icons-material/Close';
import TuneIcon from '@mui/icons-material/Tune';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import getDataFromSubCollection from '../../utils/dataFetch/getDataFromSubCollection';
import Loarding from '../Loarding/Loarding';

const CategoryItem = () => {
  const category = useSelector(categorySelector);
  const { categoryId } = useParams();
  
  // Find category title safely
  const categoryTitle = category.find((ele) => ele.id === categoryId) || { title: 'Category' };

  const [viewMode, setViewMode] = useState('grid');
  const [filterOpen, setFilterOpen] = useState(false);
  const [wishlisted, setWishlisted] = useState({});
  const [categoryItemsData, setCategoryItemsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    priceRange: [0, 10000],
    ratings: [],
    sortBy: 'popular',
    inStock: false,
    onSale: false,
    fastDelivery: false
  });

  useEffect(() => {
    if (categoryId) {
      setLoading(true);
      setError(null);
      
      // Fetch products from the 'products' subcollection
      getDataFromSubCollection('category', categoryId, 'products', (data) => {
        setCategoryItemsData(data);
        setLoading(false);
      });
    }
  }, [categoryId]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleApplyFilters = () => {
    console.log('Applying filters:', filters);
    setFilterOpen(false);
  };

  const handleResetFilters = () => {
    setFilters({
      priceRange: [0, 10000],
      ratings: [],
      sortBy: 'popular',
      inStock: false,
      onSale: false,
      fastDelivery: false
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.ratings.length > 0) count += filters.ratings.length;
    if (filters.inStock) count += 1;
    if (filters.onSale) count += 1;
    if (filters.fastDelivery) count += 1;
    return count;
  };

  // Apply filters to data
  const getFilteredData = () => {
    let filtered = [...categoryItemsData];

    // Price filter
    filtered = filtered.filter(item => 
      item.price >= filters.priceRange[0] && 
      item.price <= filters.priceRange[1]
    );

    // Rating filter
    if (filters.ratings.length > 0) {
      filtered = filtered.filter(item => {
        const itemRating = Math.floor(item.rating || 0);
        return filters.ratings.includes(itemRating);
      });
    }

    // In stock filter
    if (filters.inStock) {
      filtered = filtered.filter(item => item.inStock !== false);
    }

    // On sale filter
    if (filters.onSale) {
      filtered = filtered.filter(item => item.onSale === true);
    }

    // Fast delivery filter
    if (filters.fastDelivery) {
      filtered = filtered.filter(item => item.fastDelivery === true);
    }

    // Sort
    switch (filters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
        filtered.sort((a, b) => (b.id || '').localeCompare(a.id || ''));
        break;
      default:
        // Popular - you might want to add a popularity field
        break;
    }

    return filtered;
  };

  const filteredData = getFilteredData();

  const FilterPopup = () => (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-center md:items-center"
      onClick={() => setFilterOpen(false)}
    >
      <div 
        className="bg-white w-full max-w-2xl md:max-w-lg max-h-[85vh] md:max-h-[80vh] rounded-t-3xl md:rounded-3xl shadow-2xl flex flex-col animate-slide-up md:animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-black to-gray-900 text-white p-6 rounded-t-3xl md:rounded-t-3xl relative">
          <div className="flex items-center gap-3">
            <TuneIcon className="text-3xl text-yellow-500" />
            <div>
              <h3 className="text-xl font-bold">Filters & Sorting</h3>
              <p className="text-gray-300 text-sm">Refine your product selection</p>
            </div>
          </div>
          <button 
            className="absolute top-6 right-6 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
            onClick={() => setFilterOpen(false)}
          >
            <CloseIcon className="text-lg" />
          </button>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-red-600 to-yellow-500 rounded-full"></div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Sort By */}
          <div className="mb-8 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <SortIcon className="text-red-600" />
              <h4 className="text-lg font-bold text-gray-900">Sort By</h4>
            </div>
            <RadioGroup
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="space-y-3"
            >
              {[
                { value: 'popular', label: 'Most Popular' },
                { value: 'newest', label: 'Newest First' },
                { value: 'price-low', label: 'Price: Low to High' },
                { value: 'price-high', label: 'Price: High to Low' },
                { value: 'rating', label: 'Highest Rated' }
              ].map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={
                    <Radio 
                      className="text-red-600" 
                      checkedIcon={<div className="w-5 h-5 rounded-full border-2 border-red-600 flex items-center justify-center"><div className="w-2.5 h-2.5 rounded-full bg-red-600"></div></div>}
                    />
                  }
                  label={<span className="text-gray-700 font-medium">{option.label}</span>}
                  className="m-0 hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors"
                />
              ))}
            </RadioGroup>
          </div>

          {/* Price Range */}
          <div className="mb-8 pb-6 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">💰</span>
                <h4 className="text-lg font-bold text-gray-900">Price Range</h4>
              </div>
              <span className="bg-gradient-to-r from-red-50 to-yellow-50 text-red-700 font-bold px-3 py-1 rounded-full text-sm border border-red-200">
                ₹{filters.priceRange[0].toLocaleString()} - ₹{filters.priceRange[1].toLocaleString()}
              </span>
            </div>
            <div className="px-2">
              <Slider
                value={filters.priceRange}
                onChange={(e, newValue) => handleFilterChange('priceRange', newValue)}
                min={0}
                max={100000}
                step={1000}
                className="text-red-600"
                sx={{
                  '& .MuiSlider-thumb': {
                    width: 24,
                    height: 24,
                    backgroundColor: '#000',
                    border: '3px solid #fbbf24',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                  },
                  '& .MuiSlider-track': {
                    background: 'linear-gradient(90deg, #dc2626, #fbbf24)',
                  }
                }}
              />
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>₹0</span>
                <span>₹1,00,000</span>
              </div>
            </div>
          </div>

          {/* Ratings */}
          <div className="mb-8 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">⭐</span>
              <h4 className="text-lg font-bold text-gray-900">Customer Ratings</h4>
            </div>
            <div className="space-y-3">
              {[4, 3, 2, 1].map(rating => (
                <FormControlLabel
                  key={rating}
                  control={
                    <Checkbox
                      checked={filters.ratings.includes(rating)}
                      onChange={(e) => {
                        const newRatings = e.target.checked
                          ? [...filters.ratings, rating]
                          : filters.ratings.filter(r => r !== rating);
                        handleFilterChange('ratings', newRatings);
                      }}
                      icon={<div className="w-5 h-5 border-2 border-gray-300 rounded"></div>}
                      checkedIcon={<div className="w-5 h-5 bg-red-600 rounded flex items-center justify-center"><CheckBoxIcon className="text-white text-sm" /></div>}
                    />
                  }
                  label={
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          i < rating ? (
                            <StarIcon key={i} className="text-yellow-500 text-sm" />
                          ) : (
                            <StarBorderIcon key={i} className="text-gray-300 text-sm" />
                          )
                        ))}
                      </div>
                      <span className="text-gray-700 font-medium">& above</span>
                    </div>
                  }
                  className="m-0"
                />
              ))}
            </div>
          </div>

          {/* Additional Filters */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <FilterListIcon className="text-red-600" />
              <h4 className="text-lg font-bold text-gray-900">More Filters</h4>
            </div>
            <div className="space-y-3">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.inStock}
                    onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                    icon={<div className="w-5 h-5 border-2 border-gray-300 rounded"></div>}
                    checkedIcon={<div className="w-5 h-5 bg-red-600 rounded flex items-center justify-center"><CheckBoxIcon className="text-white text-sm" /></div>}
                  />
                }
                label={<span className="text-gray-700 font-medium">In Stock Only</span>}
                className="m-0"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.onSale}
                    onChange={(e) => handleFilterChange('onSale', e.target.checked)}
                    icon={<div className="w-5 h-5 border-2 border-gray-300 rounded"></div>}
                    checkedIcon={<div className="w-5 h-5 bg-red-600 rounded flex items-center justify-center"><CheckBoxIcon className="text-white text-sm" /></div>}
                  />
                }
                label={<span className="text-gray-700 font-medium">On Sale</span>}
                className="m-0"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.fastDelivery}
                    onChange={(e) => handleFilterChange('fastDelivery', e.target.checked)}
                    icon={<div className="w-5 h-5 border-2 border-gray-300 rounded"></div>}
                    checkedIcon={<div className="w-5 h-5 bg-red-600 rounded flex items-center justify-center"><CheckBoxIcon className="text-white text-sm" /></div>}
                  />
                }
                label={<span className="text-gray-700 font-medium">Fast Delivery</span>}
                className="m-0"
              />
            </div>
          </div>

          {/* Active Filters */}
          {(filters.ratings.length > 0 || filters.inStock || filters.onSale || filters.fastDelivery) && (
            <div className="bg-gradient-to-r from-red-50 to-yellow-50 border border-red-100 rounded-2xl p-4 mb-6">
              <h5 className="font-bold text-gray-900 mb-3">Active Filters:</h5>
              <div className="flex flex-wrap gap-2">
                {filters.ratings.map(rating => (
                  <span key={rating} className="bg-white border border-red-200 text-red-700 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1">
                    {rating}+ Stars
                    <button 
                      onClick={() => handleFilterChange('ratings', filters.ratings.filter(r => r !== rating))}
                      className="w-5 h-5 rounded-full bg-red-100 text-red-700 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {filters.inStock && (
                  <span className="bg-white border border-red-200 text-red-700 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1">
                    In Stock
                    <button 
                      onClick={() => handleFilterChange('inStock', false)}
                      className="w-5 h-5 rounded-full bg-red-100 text-red-700 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.onSale && (
                  <span className="bg-white border border-red-200 text-red-700 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1">
                    On Sale
                    <button 
                      onClick={() => handleFilterChange('onSale', false)}
                      className="w-5 h-5 rounded-full bg-red-100 text-red-700 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.fastDelivery && (
                  <span className="bg-white border border-red-200 text-red-700 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1">
                    Fast Delivery
                    <button 
                      onClick={() => handleFilterChange('fastDelivery', false)}
                      className="w-5 h-5 rounded-full bg-red-100 text-red-700 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-3xl md:rounded-b-3xl flex gap-3">
          <button 
            className="flex-1 bg-white border border-gray-300 text-gray-700 font-bold py-3 px-6 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
            onClick={handleResetFilters}
          >
            Reset All
          </button>
          <button 
            className="flex-1 bg-gradient-to-r from-black to-gray-900 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 hover:shadow-xl"
            onClick={handleApplyFilters}
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <Loarding />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Error loading products</h2>
          <p className="text-gray-600 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Breadcrumb & Header */}
      <div className="bg-gradient-to-r from-black via-gray-900 to-black text-white py-6 md:py-8 px-4 md:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 via-transparent to-yellow-500/10"></div>
        <div className="max-w-7xl mx-auto relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-300 mb-2">
                <span className="hover:text-yellow-500 cursor-pointer">Home</span>
                <span className="text-red-500">›</span>
                <span className="hover:text-yellow-500 cursor-pointer">Categories</span>
                <span className="text-red-500">›</span>
                <span className="font-semibold text-yellow-500">{categoryTitle.title}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {categoryTitle.title}
                <span className="text-yellow-500 ml-2">({filteredData.length})</span>
              </h1>
              <p className="text-gray-300 max-w-2xl">
                Explore our premium collection of {categoryTitle.title} products. 
                Handpicked quality with competitive prices.
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-500">{filteredData.length}</div>
                  <div className="text-sm text-gray-300">Products</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          {/* Search */}
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="search"
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent shadow-sm transition-all duration-300"
              placeholder="Search products..."
            />
          </div>

          {/* View Controls */}
          <div className="flex items-center gap-3">
            <div className="flex bg-gray-100 p-1 rounded-xl">
              <button
                className={`p-2 rounded-lg transition-all duration-300 ${viewMode === 'grid' ? 'bg-white shadow-md text-red-600' : 'text-gray-600 hover:text-red-600'}`}
                onClick={() => setViewMode('grid')}
              >
                <GridViewIcon />
              </button>
              <button
                className={`p-2 rounded-lg transition-all duration-300 ${viewMode === 'list' ? 'bg-white shadow-md text-red-600' : 'text-gray-600 hover:text-red-600'}`}
                onClick={() => setViewMode('list')}
              >
                <ViewListIcon />
              </button>
            </div>

            <button
              className="flex items-center gap-2 bg-gradient-to-r from-black to-gray-900 text-white px-4 py-3 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              onClick={() => setFilterOpen(true)}
            >
              <FilterListIcon />
              <span className="font-semibold">Filter & Sort</span>
              {getActiveFilterCount() > 0 && (
                <span className="bg-red-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                  {getActiveFilterCount()}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Products Grid/List */}
        {filteredData.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-2xl font-bold text-gray-700 mb-4">No products found</h3>
            <p className="text-gray-500">Try adjusting your filters or search term</p>
          </div>
        ) : (
          <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'flex flex-col'} gap-6`}>
            {filteredData.map((product) => (
              <CategoryItemUnit
                key={product.id}
                {...product}
                viewMode={viewMode}
                wishlisted={wishlisted[product.id]}
                onWishlistToggle={() => setWishlisted(prev => ({
                  ...prev,
                  [product.id]: !prev[product.id]
                }))}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {filteredData.length > 0 && (
          <div className="mt-12 flex justify-center">
            <div className="flex items-center gap-2">
              <button className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-lg hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-colors">
                <ArrowBackIosNewIcon className="text-sm" />
              </button>
              {[1, 2, 3, '...', 8].map((page, idx) => (
                <button
                  key={idx}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium transition-all duration-300 ${page === 1 ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg' : 'bg-white border border-gray-200 hover:bg-red-50 hover:border-red-300 hover:text-red-600'}`}
                >
                  {page}
                </button>
              ))}
              <button className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-lg hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-colors">
                <ArrowForwardIosIcon className="text-sm" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Filter Popup */}
      {filterOpen && <FilterPopup />}
    </div>
  );
};

const CategoryItemUnit = ({ 
  id,
  imageUrl, 
  title, 
  price = 0, 
  originalPrice = 0, 
  discount = 0, 
  rating = 0, 
  reviewCount = 0,
  isNew = false,
  isFeatured = false,
  fastDelivery = false,
  inStock = true,
  viewMode,
  wishlisted,
  onWishlistToggle
}) => {
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<StarIcon key={i} className="text-yellow-500" />);
    }

    if (hasHalfStar) {
      stars.push(<StarHalfIcon key="half" className="text-yellow-500" />);
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<StarBorderIcon key={`empty-${i}`} className="text-gray-300" />);
    }

    return stars;
  };

  // Calculate discount if not provided
  const calculatedDiscount = discount || (originalPrice > 0 
    ? Math.round(((originalPrice - price) / originalPrice) * 100) 
    : 0);

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-red-200 transition-all duration-500 hover:shadow-2xl group">
        <div className="flex flex-col md:flex-row gap-6 p-6">
          {/* Image Container */}
          <div className="relative md:w-64 md:h-64 w-full h-56 overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Badges */}
            <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
              {isNew && (
                <span className="bg-gradient-to-r from-red-600 to-red-700 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  NEW
                </span>
              )}
              {isFeatured && (
                <span className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  FEATURED
                </span>
              )}
              {calculatedDiscount > 20 && (
                <span className="bg-gradient-to-r from-black to-gray-900 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  -{calculatedDiscount}%
                </span>
              )}
            </div>

            {/* Quick Actions */}
            <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg hover:bg-red-600 hover:text-white transition-all duration-300 transform hover:scale-110"
                onClick={onWishlistToggle}
              >
                {wishlisted ? <FavoriteIcon className="text-red-600" /> : <FavoriteBorderIcon />}
              </button>
              <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg hover:bg-red-600 hover:text-white transition-all duration-300 transform hover:scale-110">
                <VisibilityIcon />
              </button>
            </div>

            {/* Image */}
            {imageUrl ? (
              <img 
                src={imageUrl} 
                alt={title}
                className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col">
            {/* Category & Stock */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <LocalShippingIcon className="text-sm" />
                <span>Category</span>
              </div>
              {!inStock && (
                <span className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-red-700 transition-colors">
              {title || 'Untitled Product'}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center">
                {renderStars()}
              </div>
              <span className="text-sm text-gray-600 font-semibold">{rating.toFixed(1)}</span>
              <span className="text-sm text-gray-500">({reviewCount} reviews)</span>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-2 mb-6">
              {fastDelivery && (
                <span className="flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-sm">
                  <CheckCircleIcon className="text-sm" />
                  Fast Delivery
                </span>
              )}
              <span className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm">Warranty</span>
              {originalPrice > price && (
                <span className="bg-purple-50 text-purple-700 px-3 py-1.5 rounded-full text-sm">Sale</span>
              )}
            </div>

            {/* Price & Actions */}
            <div className="mt-auto flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-3xl font-bold text-gray-900">₹{price.toLocaleString()}</span>
                  {originalPrice > price && (
                    <>
                      <span className="text-lg text-gray-500 line-through">₹{originalPrice.toLocaleString()}</span>
                      <span className="bg-gradient-to-r from-red-600 to-red-700 text-white px-3 py-1 rounded-full text-sm font-bold">
                        Save {calculatedDiscount}%
                      </span>
                    </>
                  )}
                </div>
                <p className="text-sm text-gray-500">EMI starts at ₹{Math.round(price/12).toLocaleString()}/month</p>
              </div>
              
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  <ShoppingCartIcon />
                  <span className="font-semibold">Add to Cart</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-transparent transition-all duration-500 hover:shadow-2xl group">
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          {isNew && (
            <span className="bg-gradient-to-r from-red-600 to-red-700 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              NEW
            </span>
          )}
          {isFeatured && (
            <span className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              FEATURED
            </span>
          )}
          {calculatedDiscount > 20 && (
            <span className="bg-gradient-to-r from-black to-gray-900 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              -{calculatedDiscount}%
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg hover:bg-red-600 hover:text-white transition-all duration-300 transform hover:scale-110"
            onClick={onWishlistToggle}
          >
            {wishlisted ? <FavoriteIcon className="text-red-600" /> : <FavoriteBorderIcon />}
          </button>
          <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg hover:bg-red-600 hover:text-white transition-all duration-300 transform hover:scale-110">
            <VisibilityIcon />
          </button>
        </div>

        {/* Image */}
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title}
            className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}

        {/* Gradient Border Effect */}
        <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-gradient-to-r group-hover:from-red-600 group-hover:via-yellow-500 group-hover:to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Category */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <LocalShippingIcon className="text-sm" />
          <span>Category</span>
          {!inStock && (
            <span className="ml-auto bg-red-50 text-red-700 px-2 py-1 rounded text-xs font-semibold">
              Out of Stock
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-red-700 transition-colors">
          {title || 'Untitled Product'}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center">
            {renderStars()}
          </div>
          <span className="text-sm text-gray-600 font-semibold">{rating.toFixed(1)}</span>
          <span className="text-sm text-gray-500">({reviewCount})</span>
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-2 mb-4">
          {fastDelivery && (
            <span className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs">
              <CheckCircleIcon className="text-xs" />
              Fast Delivery
            </span>
          )}
          <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs">Warranty</span>
        </div>

        {/* Price */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl font-bold text-gray-900">₹{price.toLocaleString()}</span>
            {originalPrice > price && (
              <span className="text-base text-gray-500 line-through">₹{originalPrice.toLocaleString()}</span>
            )}
          </div>
          <p className="text-xs text-gray-500">EMI ₹{Math.round(price/12).toLocaleString()}/mo</p>
        </div>

        {/* Action Button */}
        <button className="w-full bg-gradient-to-r from-black to-gray-900 text-white py-3 rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 flex items-center justify-center gap-2">
          <ShoppingCartIcon />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default CategoryItem;