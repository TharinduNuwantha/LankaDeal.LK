import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { IconButton } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import './Category.css';

const categoryArr = [
    {
        imageUrl: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&h=600&fit=crop&q=80',
        categoryTitle: 'Electronics',
        categoryId: 'electronics',
        productCount: 1245,
        color: '#3b82f6'
    },
    {
        imageUrl: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=600&h=600&fit=crop&q=80',
        categoryTitle: 'Fashion',
        categoryId: 'fashion',
        productCount: 876,
        color: '#8b5cf6'
    },
    {
        imageUrl: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&h=600&fit=crop&q=80',
        categoryTitle: 'Home & Living',
        categoryId: 'home-living',
        productCount: 543,
        color: '#10b981'
    },
    {
        imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=600&fit=crop&q=80',
        categoryTitle: 'Groceries',
        categoryId: 'groceries',
        productCount: 2341,
        color: '#f59e0b'
    },
    {
        imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&h=600&fit=crop&q=80',
        categoryTitle: 'Beauty',
        categoryId: 'beauty',
        productCount: 654,
        color: '#ec4899'
    },
    {
        imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&h=600&fit=crop&q=80',
        categoryTitle: 'Sports',
        categoryId: 'sports',
        productCount: 432,
        color: '#ef4444'
    },
    {
        imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=600&fit=crop&q=80',
        categoryTitle: 'Books',
        categoryId: 'books',
        productCount: 987,
        color: '#6366f1'
    },
    {
        imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=600&fit=crop&q=80',
        categoryTitle: 'Toys',
        categoryId: 'toys',
        productCount: 321,
        color: '#06b6d4'
    },
    {
        imageUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&h=600&fit=crop&q=80',
        categoryTitle: 'Automotive',
        categoryId: 'automotive',
        productCount: 198,
        color: '#f97316'
    },
    {
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop&q=80',
        categoryTitle: 'Health',
        categoryId: 'health',
        productCount: 765,
        color: '#14b8a6'
    },
    {
        imageUrl: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&h=600&fit=crop&q=80',
        categoryTitle: 'Jewelry',
        categoryId: 'jewelry',
        productCount: 234,
        color: '#a855f7'
    },
    {
        imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=600&fit=crop&q=80',
        categoryTitle: 'Pet Supplies',
        categoryId: 'pet-supplies',
        productCount: 456,
        color: '#84cc16'
    }
];

const Category = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = categoryArr.filter(category =>
    category.categoryTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              <span className="stat-number">{categoryArr.length}</span>
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
            <IconButton className="filter-btn" aria-label="Filter categories">
              <FilterListIcon />
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
              <span className="item-count">{categoryArr.length}</span>
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

          <div className={`category-grid ${viewMode === 'list' ? 'list-layout' : 'grid-layout'}`}>
            {filteredCategories.map((category, index) => (
              <CategoryItem 
                key={category.categoryId}
                {...category}
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
      <button className="mobile-filter-btn">
        <FilterListIcon />
        <span>Filter & Sort</span>
      </button>
    </div>
  );
};

export default Category;

const CategoryItem = ({ imageUrl, categoryTitle, categoryId, productCount, color, index, viewMode }) => (
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