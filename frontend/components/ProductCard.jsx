import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../src/styles/pcard.css";

function ProductCard({ id }) {

  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_API_URL+`/api/product/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.log(err));
  }, [id]);

  if (!product) return null;

  const openProduct = () => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="pcard" onClick={openProduct}>
      <img src={`${product.prodimg}`} alt="productimg" />
      <h3>{product.prodname}</h3>
      <p>₹{product.price}</p>
    </div>
  );
}

export default ProductCard;
