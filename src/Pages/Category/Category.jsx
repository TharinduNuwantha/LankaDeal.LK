import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { IconButton, Slider, Checkbox, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import CloseIcon from '@mui/icons-material/Close';
import TuneIcon from '@mui/icons-material/Tune';
import SortIcon from '@mui/icons-material/Sort';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import StarIcon from '@mui/icons-material/Star';
import './Category.css';
import getDataFromColaction from '../../utils/dataFetch/getDataFromColaction';
import Loarding from '../Loarding/Loarding';



const Category = () => {
   const [categoryData,setCategoryData] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    
    priceRange: [0, 10000],
    ratings: [],
    categories: [],
    sortBy: 'popular',
    inStock: false,
    onSale: false
  });

  const filteredCategories = categoryData.filter(category =>
    category.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleApplyFilters = () => {
    // Apply filters logic here
    console.log('Applying filters:', filters);
    setFilterOpen(false);
  };

  const handleResetFilters = () => {
    setFilters({
      priceRange: [0, 10000],
      ratings: [],
      categories: [],
      sortBy: 'popular',
      inStock: false,
      onSale: false
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.ratings.length > 0) count += filters.ratings.length;
    if (filters.inStock) count += 1;
    if (filters.onSale) count += 1;
    return count;
  };

  const FilterPopup = () => (
    <div className="filter-popup-overlay" onClick={() => setFilterOpen(false)}>
      <div className="filter-popup-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="filter-popup-header">
          <div className="filter-header-content">
            <TuneIcon className="filter-header-icon" />
            <div>
              <h3 className="filter-popup-title">Filters & Sorting</h3>
              <p className="filter-popup-subtitle">Refine your search results</p>
            </div>
          </div>
          <button 
            className="filter-close-btn"
            onClick={() => setFilterOpen(false)}
            aria-label="Close filters"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Content */}
        <div className="filter-popup-content">
          {/* Sort By Section */}
          <div className="filter-section">
            <div className="filter-section-header">
              <SortIcon className="section-icon" />
              <h4 className="section-title">Sort By</h4>
            </div>
            <RadioGroup
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="sort-radio-group"
            >
              <FormControlLabel 
                value="popular" 
                control={<Radio />} 
                label="Most Popular" 
                className="radio-item"
              />
              <FormControlLabel 
                value="newest" 
                control={<Radio />} 
                label="Newest First" 
                className="radio-item"
              />
              <FormControlLabel 
                value="price-low" 
                control={<Radio />} 
                label="Price: Low to High" 
                className="radio-item"
              />
              <FormControlLabel 
                value="price-high" 
                control={<Radio />} 
                label="Price: High to Low" 
                className="radio-item"
              />
              <FormControlLabel 
                value="name" 
                control={<Radio />} 
                label="Name: A to Z" 
                className="radio-item"
              />
            </RadioGroup>
          </div>

          {/* Price Range */}
          <div className="filter-section">
            <div className="filter-section-header">
              <LocalOfferIcon className="section-icon" />
              <h4 className="section-title">Price Range</h4>
              <span className="price-range-values">
                Rs. {filters.priceRange[0].toLocaleString()} - Rs. {filters.priceRange[1].toLocaleString()}
              </span>
            </div>
            <div className="price-slider-container">
              <Slider
                value={filters.priceRange}
                onChange={(e, newValue) => handleFilterChange('priceRange', newValue)}
                valueLabelDisplay="auto"
                min={0}
                max={10000}
                step={100}
                className="price-slider"
              />
              <div className="price-limits">
                <span>Rs. 0</span>
                <span>Rs. 10,000</span>
              </div>
            </div>
          </div>

          {/* Ratings */}
          <div className="filter-section">
            <div className="filter-section-header">
              <StarIcon className="section-icon" />
              <h4 className="section-title">Customer Ratings</h4>
            </div>
            <div className="ratings-container">
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
                      icon={<CheckBoxOutlineBlankIcon />}
                      checkedIcon={<CheckBoxIcon />}
                    />
                  }
                  label={
                    <div className="rating-label">
                      <div className="rating-stars">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon key={i} className={i < rating ? 'star-filled' : 'star-empty'} />
                        ))}
                      </div>
                      <span className="rating-text">& above</span>
                    </div>
                  }
                  className="checkbox-item"
                />
              ))}
            </div>
          </div>

          {/* Additional Filters */}
          <div className="filter-section">
            <div className="filter-section-header">
              <FilterListIcon className="section-icon" />
              <h4 className="section-title">More Filters</h4>
            </div>
            <div className="additional-filters">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.inStock}
                    onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                    icon={<CheckBoxOutlineBlankIcon />}
                    checkedIcon={<CheckBoxIcon />}
                  />
                }
                label="In Stock Only"
                className="checkbox-item"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.onSale}
                    onChange={(e) => handleFilterChange('onSale', e.target.checked)}
                    icon={<CheckBoxOutlineBlankIcon />}
                    checkedIcon={<CheckBoxIcon />}
                  />
                }
                label="On Sale"
                className="checkbox-item"
              />
            </div>
          </div>

          {/* Selected Filters */}
          {(filters.ratings.length > 0 || filters.inStock || filters.onSale) && (
            <div className="selected-filters">
              <h5 className="selected-filters-title">Active Filters:</h5>
              <div className="filter-chips">
                {filters.ratings.map(rating => (
                  <span key={rating} className="filter-chip">
                    {rating}+ Stars
                    <button 
                      onClick={() => handleFilterChange('ratings', filters.ratings.filter(r => r !== rating))}
                      className="chip-remove"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {filters.inStock && (
                  <span className="filter-chip">
                    In Stock
                    <button 
                      onClick={() => handleFilterChange('inStock', false)}
                      className="chip-remove"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.onSale && (
                  <span className="filter-chip">
                    On Sale
                    <button 
                      onClick={() => handleFilterChange('onSale', false)}
                      className="chip-remove"
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
        <div className="filter-popup-footer">
          <button 
            className="filter-btn reset-btn"
            onClick={handleResetFilters}
          >
            Reset All
          </button>
          <button 
            className="filter-btn apply-btn"
            onClick={handleApplyFilters}
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
 
  useEffect(()=>{
    getDataFromColaction('category',setCategoryData)
  },[])
  console.log('category Component Data',categoryData);
  if(categoryData.length === 0){
    return <Loarding/>
  }
  
  return (
    <div className="category-page">
      {/* Header Section */}
      <div className="category-header">
        <div className="header-content">
          <div>
            <h1 className="category-main-title">Shop by Category</h1>
            <p className="category-subtitle">Discover products from our curated collections</p>
          </div>
          <div className="header-stats">
            <div className="stat-item">
              <span className="stat-number">{categoryData.length}</span>
              <span className="stat-label">Categories</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">10,000+</span>
              <span className="stat-label">Products</span>
            </div>
          </div>
        </div>

        {/* Search and Controls */}
        <div className="category-controls">
          <div className="search-container">
            <SearchIcon className="search-icon" />
            <input
              type="text"
              placeholder="Search categories..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="view-controls">
            <IconButton 
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
            >
              <GridViewIcon />
            </IconButton>
            <IconButton 
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              aria-label="List view"
            >
              <ViewListIcon />
            </IconButton>
            <IconButton 
              className="filter-btn"
              onClick={() => setFilterOpen(true)}
              aria-label="Filter categories"
            >
              <FilterListIcon />
              {getActiveFilterCount() > 0 && (
                <span className="filter-indicator"></span>
              )}
            </IconButton>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="category-container">
        {/* Sidebar (Desktop only) */}
        <aside className="category-sidebar">
          <h3 className="sidebar-title">Quick Links</h3>
          <ul className="sidebar-menu">
            <li className="sidebar-item active">
              <span>All Categories</span>
              <span className="item-count">{categoryData.length}</span>
            </li>
            <li className="sidebar-item">
              <span>Popular</span>
              <KeyboardArrowRightIcon className="arrow-icon" />
            </li>
            <li className="sidebar-item">
              <span>New Arrivals</span>
              <KeyboardArrowRightIcon className="arrow-icon" />
            </li>
            <li className="sidebar-item">
              <span>On Sale</span>
              <KeyboardArrowRightIcon className="arrow-icon" />
            </li>
          </ul>

          <div className="sidebar-banner">
            <h4>Special Offer</h4>
            <p>Up to 50% off on selected categories</p>
            <button className="banner-btn">Shop Now</button>
          </div>
        </aside>

        {/* Category Grid */}
        <main className={`category-main ${viewMode === 'list' ? 'list-view' : ''}`}>
          <div className="category-grid-header">
            <h2 className="grid-title">
              All Categories <span className="title-count">({filteredCategories.length})</span>
            </h2>
            <div className="sort-options">
              <select className="sort-select">
                <option>Sort by: Popular</option>
                <option>Sort by: Name</option>
                <option>Sort by: Product Count</option>
              </select>
            </div>
          </div>
              {console.log(filteredCategories)}
          <div className={`category-grid ${viewMode === 'list' ? 'list-layout' : 'grid-layout'}`}>
            {filteredCategories.map((category, index) => (
                
              <CategoryUnitItem 
                key={category.categoryId}
                imageUrl={category.img}
                categoryTitle={category.title}
                categoryId={category.categoryId}
                productCount={0}
                color={['#dc2626', '#fbbf24', '#000000'][index % 3]}
                index={index}
                viewMode={viewMode}
              />
            ))}
          </div>

          {/* Empty State */}
          {filteredCategories.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>No categories found</h3>
              <p>Try adjusting your search or filter to find what you're looking for.</p>
              <button 
                className="reset-btn"
                onClick={() => setSearchQuery('')}
              >
                Clear Search
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filter Button */}
      <button 
        className="mobile-filter-btn"
        onClick={() => setFilterOpen(true)}
      >
        <FilterListIcon />
        <span>Filter & Sort</span>
        {getActiveFilterCount() > 0 && (
          <span className="filter-badge">{getActiveFilterCount()}</span>
        )}
      </button>

      {/* Filter Popup */}
      {filterOpen && <FilterPopup />}
    </div>
  );
};

export default Category;

const CategoryUnitItem = ({ imageUrl, categoryTitle, categoryId, productCount, color, index, viewMode }) => (
  <Link to={`/category/${categoryId}`} className="category-link">
    <div className={`category-card ${viewMode === 'list' ? 'list-card' : 'grid-card'}`}>
      {/* Badge */}
      <div className="category-badge" style={{ backgroundColor: color }}>
        {productCount}+
      </div>

      {/* Image Container */}
      <div className="category-image-container" style={{ borderColor: color }}>
        <img 
          src={imageUrl} 
          alt={categoryTitle}
          className="category-image"
          loading="lazy"
        />
        <div className="image-overlay" style={{ background: `linear-gradient(135deg, ${color}20, ${color}10)` }}></div>
      </div>

      {/* Content */}
      <div className="category-content">
        <h3 className="category-title">{categoryTitle}</h3>
        <p className="category-count">{productCount.toLocaleString()} products</p>
        
        {viewMode === 'list' && (
          <div className="category-description">
            Explore our wide range of {categoryTitle.toLowerCase()} products at competitive prices.
          </div>
        )}
        
        <div className="category-action">
          <span className="action-text">View Products</span>
          <KeyboardArrowRightIcon className="action-icon" />
        </div>
      </div>
    </div>
  </Link>
);