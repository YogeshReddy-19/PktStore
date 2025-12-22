import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/ProductCard.jsx"; 
import "../src/styles/home.css"; 

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q"); 
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await axios.get(import.meta.env.VITE_API_URL+`/api/product/search?q=${query}`);
        setResults(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (query) {
      fetchResults();
    }
  }, [query]);

  return (
    <div className="home-container" style={{ paddingTop: "20px" }}>
      <h2>Search Results for "{query}"</h2>
      
      {loading ? (
        <p>Searching...</p>
      ) : results.length === 0 ? (
        <p>No products found matching "{query}"</p>
      ) : (
        <div className="home-products-row" style={{ flexWrap: "wrap" }}>
          {results.map((product) => (
             <ProductCard key={product.prod_id} id={product.prod_id} />
          ))}
        </div>
      )}
    </div>
  );
}