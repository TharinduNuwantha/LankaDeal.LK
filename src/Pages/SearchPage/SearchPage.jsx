import { useState } from "react";
import { searchProducts } from "./searchProducts";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = await searchProducts(query);
    setResults(data);
    setLoading(false);
  };

  return (
    <div className="search-page">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search products (e.g. pro, cricket, bat)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {loading && <p>Loading...</p>}

      {!loading && query && results.length === 0 && (
        <p>No products found</p>
      )}

      <div className="product-grid">
        {results.map((item) => (
          <div key={item.id} className="product-card">
            <img src={item.imageUrl} alt={item.title} />
            <h3>{item.title}</h3>
            <p>{item.description}</p>

            <div className="price">
              <span className="new">Rs. {item.price}</span>
              <span className="old">Rs. {item.originalPrice}</span>
            </div>

            {!item.inStock && <p className="out">Out of stock</p>}
            {item.fastDelivery && <p className="fast">Fast Delivery 🚀</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;