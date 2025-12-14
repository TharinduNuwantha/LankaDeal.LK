
import Ads from "./Ads";
import Product from "./Product";

const Home = () => {
  return (
    <div className="px-4 py-4 md:px-6 md:py-6 w-full">
      {/* Ads Banner - Separate Container */}
      <div className="max-w-full h-[200px] md:h-[300px] rounded-xl overflow-hidden mb-6 md:mb-8">
        <Ads />
      </div>
      
      {/* Product Section - Separate Container */}
      <div className="mt-6 md:mt-8">
        <Product title="Trending Products" rowsCount={1} slidesPerView={3}/>
      </div>
      

    </div>
  );
};

export default Home;