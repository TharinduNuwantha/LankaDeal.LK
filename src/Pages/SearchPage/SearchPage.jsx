import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { searchProducts } from "./searchProducts";

const SearchPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Read URL parameter on mount and perform search
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlQuery = params.get("q") || params.get("") || "";
    if (urlQuery) {
      setQuery(urlQuery);
      performSearch(urlQuery);
    }
  }, [location.search]);

  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    const data = await searchProducts(searchQuery);
    setResults(data);
    setLoading(false);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!query.trim()) return;

    // Update URL with new search query
    navigate(`/search?q=${encodeURIComponent(query)}`, { replace: false });
    
    // Perform search
    await performSearch(query);
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