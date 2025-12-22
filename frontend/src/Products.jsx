import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import "./styles/products.css";
import axios from "axios";

export default function Products() {

  const [products, setProducts] = useState([]);

  useEffect(() => {
    console.log("Products component mounted");

    axios
      .get(import.meta.env.VITE_API_URL+"/api/allP")
      .then(res => setProducts(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="products-container">
      {products.map(p => (
        <ProductCard
          key={p.prod_id}
          id={p.prod_id}
          pimage={p.prodimg}
          pname={p.prodname}
          price={p.price}
        />
      ))}
    </div>
  );
}
