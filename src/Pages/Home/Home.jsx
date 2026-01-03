// myapp\src\Pages\Home\Home.jsx
import React, { useState, useEffect, useRef } from 'react';
import Ads from "./Ads";
import Product from "./Product";

// --- Lazy Loading Wrapper ---
// This component prevents the API call until the section is visible on screen
const LazySection = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Load when the user is within 100px of the section
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Stop observing once loaded
        }
      },
      { rootMargin: '100px' } 
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    // Min-height prevents layout shift (jumping) when loading
    <div ref={elementRef} style={{ minHeight: '350px' }}>
      {isVisible ? children : (
        <div style={{ 
          height: '350px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          color: '#9ca3af',
          background: '#fff' 
        }}>
          Loading Products...
        </div>
      )}
    </div>
  );
};

const Home = () => {
  return (
    <div className="home-container" style={{ backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      
      {/* 1. Ads Banner - Load Immediately */}
      <div className="ads-section mb-8">
        <Ads />
      </div>
      
      {/* 2. Flash Sale - Load Immediately (Top of page) */}
      <div className="product-section flash-sale-section mb-12">
        <Product 
          title="⚡ Flash Sale" 
          categoryName="Electronics" 
          rowsCount={1} 
          slidesPerView={4} 
          isFlashSale={true}
        />
      </div>
      
      {/* --- LAZY LOAD SECTIONS BELOW --- */}
      
      {/* Fashion */}
      <div className="product-section mb-12">
        <LazySection>
          <Product 
            title="Trendy Fashion" 
            categoryName="Fashion_and_Clothing"
            rowsCount={1} 
            slidesPerView={4} 
          />
        </LazySection>
      </div>

      {/* Tech */}
      <div className="product-section mb-12">
        <LazySection>
          <Product 
            title="Tech & Gadgets" 
            categoryName="Electronics"
            rowsCount={1} 
            slidesPerView={4} 
          />
        </LazySection>
      </div>

      {/* Beauty */}
      <div className="product-section mb-12">
        <LazySection>
          <Product 
            title="Beauty & Personal Care" 
            categoryName="Beauty_and_Personal_Care"
            rowsCount={1} 
            slidesPerView={5} 
          />
        </LazySection>
      </div>
      
      {/* Books */}
      <div className="product-section mb-12">
        <LazySection>
          <Product 
            title="Best Selling Books" 
            categoryName="Books_and_Media"
            rowsCount={1} 
            slidesPerView={5} 
          />
        </LazySection>
      </div>

      {/* Home */}
      <div className="product-section mb-12">
        <LazySection>
          <Product 
            title="Home & Kitchen Essentials" 
            categoryName="Home_and_Kitchen"
            rowsCount={1} 
            slidesPerView={4} 
          />
        </LazySection>
      </div>

      {/* Groceries (Grid) */}
      <div className="product-section mb-12">
        <LazySection>
          <Product 
            title="Daily Groceries" 
            categoryName="Groceries_and_Daily_Needs"
            rowsCount={2} 
            slidesPerView={5} 
          />
        </LazySection>
      </div>

       {/* Sports */}
       <div className="product-section mb-12">
        <LazySection>
          <Product 
            title="Sports & Fitness" 
            categoryName="Sports_and_Fitness"
            rowsCount={1} 
            slidesPerView={4} 
          />
        </LazySection>
      </div>
      
      <div className="pb-10"></div>
    </div>
  );
};

export default Home;