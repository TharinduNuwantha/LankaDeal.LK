// myapp\src\Pages\Home\Home.jsx
import Ads from "./Ads";
import Product from "./Product";

const Home = () => {
  return (
    <div className="home-container">
      {/* Ads Banner */}
      <div className="ads-section">
        <Ads />
      </div>
      
      {/* Product Sections with inverted display logic */}
      {/* Mobile shows MORE (3-4 slides), Desktop shows FEWER (2-3 slides) */}
      
      <div className="product-section">
        <Product 
          title="Trending Products" 
          rowsCount={1} 
          slidesPerView={2.5}
          key="trending"
        />
      </div>
      
      <div className="product-section flash-sale-section">
        <Product 
          title="⚡ Flash Sale" 
          rowsCount={1} 
          slidesPerView={3}
          isFlashSale={true}
          key="flash"
        />
      </div>
      
      <div className="product-section">
        <Product 
          title="Recommended For You" 
          rowsCount={2} 
          slidesPerView={2.5}
          key="recommended"
        />
      </div>
      
      <div className="product-section">
        <Product 
          title="New Arrivals" 
          rowsCount={1} 
          slidesPerView={3}
          key="new"
        />
      </div>
    </div>
  );
};

export default Home;