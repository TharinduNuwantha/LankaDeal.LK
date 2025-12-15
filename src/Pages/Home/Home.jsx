// myapp\src\Pages\Home\Home.jsx
import React from 'react';
import Ads from "./Ads";
import Product from "./Product";

const Home = () => {
  return (
    <div className="home-container">
      {/* Ads Banner */}
      <div className="ads-section">
        <Ads />
      </div>
      
      {/* Product Sections with INVERTED display logic */}
      {/* Mobile shows MORE products, Desktop shows FEWER */}
      
      <div className="product-section">
        <Product 
          title="Trending Products" 
          rowsCount={1} 
          slidesPerView={2.5} // Base for mobile
          key="trending"
        />
      </div>
      
      <div className="product-section flash-sale-section">
        <Product 
          title="⚡ Flash Sale" 
          rowsCount={1} 
          slidesPerView={2.8} // More on mobile
          isFlashSale={true}
          key="flash"
        />
      </div>
      
      <div className="product-section">
        <Product 
          title="Recommended For You" 
          rowsCount={2} 
          slidesPerView={2.2} // Base for mobile
          key="recommended"
        />
      </div>
      
      <div className="product-section">
        <Product 
          title="New Arrivals" 
          rowsCount={1} 
          slidesPerView={2.5} // Base for mobile
          key="new"
        />
      </div>
      
      {/* Add some spacing */}
      <div className="mb-8"></div>
    </div>
  );
};

export default Home;