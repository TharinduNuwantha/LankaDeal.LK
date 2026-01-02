// myapp\src\Pages\Home\Home.jsx
import Ads from "./Ads";
import Product from "./Product";

const Home = ({ paymentModelRef }) => {
  return (
    <div className="home-container">
      {/* Ads Banner */}
      <div className="ads-section">
        <Ads />
      </div>
      
      {/* Product Sections */}
      {/* Each section fetches data independently. 
         If data is low, Product.jsx will auto-fill it to look "full" 
      */}
      
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
          slidesPerView={2.8} 
          isFlashSale={true}
          key="flash"
        />
      </div>
      
      <div className="product-section">
        <Product 
          title="Recommended For You" 
          rowsCount={2} 
          slidesPerView={2.2} 
          key="recommended"
        />
      </div>
      
      <div className="product-section">
        <Product 
          title="New Arrivals" 
          rowsCount={1} 
          slidesPerView={2.5} 
          key="new"
        />
      </div>
      
      {/* Add some spacing */}
      <div className="mb-8"></div>
    </div>
  );
};

export default Home;