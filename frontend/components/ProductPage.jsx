import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../src/styles/ppage.css"; 

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");

  const getUser = () => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return null;
    try { return JSON.parse(storedUser); } catch (e) { return null; }
  };
  const user = getUser();

  const fetchProduct = () => {
    axios
      .get(import.meta.env.VITE_API_URL+`/api/product/${id}`)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data[0] : res.data;
        setProduct(data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      alert("Please log in to add items to cart!");
      navigate("/auth");
      return;
    }

    const cartItem = {
      id: product.prod_id, 
      name: product.prodname,
      price: parseFloat(product.price),
      img: product.prodimg,
    };

    try {
      await axios.post(import.meta.env.VITE_API_URL+"/api/cart/add", { 
        userId: user.id, 
        product: cartItem 
      });
      alert("Product added to cart!");
      navigate("/cart"); 
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 401) {
          navigate("/auth");
      } else {
          alert("Failed to add to cart.");
      }
    }
  };

  const submitReview = (e) => {
    e.preventDefault();

    if (!user) {
      alert("You must be logged in to leave a review.");
      navigate("/auth");
      return;
    }

    let currentReviews = [];
    try {
      if (Array.isArray(product.reviews)) {
        currentReviews = product.reviews;
      } else if (typeof product.reviews === "string") {
        currentReviews = JSON.parse(product.reviews);
      }
    } catch (e) { currentReviews = []; }

    const alreadyReviewed = currentReviews.some(
      (r) => r.user === user.username
    );

    if (alreadyReviewed) {
      alert("You have already reviewed this product!");
      return;
    }

    const newReview = {
      user: user.username, 
      rating: reviewRating,
      text: reviewText,
      date: new Date().toLocaleString(),
    };

    axios
      .post(import.meta.env.VITE_API_URL+`/api/product/${id}/addReview`, newReview)
      .then(() => {
        alert("Review submitted successfully!");
        setReviewRating(5);
        setReviewText("");
        fetchProduct(); 
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to submit review.");
      });
  };

  if (!product) return <h2 className="loading-text">Loading...</h2>;

  let reviews = [];
  try {
    if (Array.isArray(product.reviews)) reviews = product.reviews;
    else if (typeof product.reviews === "string") reviews = JSON.parse(product.reviews);
  } catch (e) { reviews = []; }

  return (
    <div className="product-page-container">
      
      <div className="product-hero">
        <div className="product-image-wrapper">
          <img
            src={`${product.prodimg}`}
            alt={product.prodname}
            className="product-image"
          />
        </div>

        <div className="product-details">
          <h1 className="product-title">{product.prodname}</h1>
          <h2 className="product-price">₹{product.price}</h2>
          <p className="product-desc">{product.description}</p>
          <button className="btn-add-cart" onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>

      <hr />

      <div className="reviews-section">
        <h2 className="section-heading">Customer Reviews</h2>

        {reviews.length === 0 ? (
          <p>No reviews yet. Be the first to review!</p>
        ) : (
          <div className="reviews-grid">
            {reviews.map((r, i) => (
              <div key={i} className="review-card">
                <div className="review-header">
                  <span className="review-user">{r.user}</span>
                  <span className="review-stars">⭐ {r.rating}</span>
                </div>
                <p className="review-text">"{r.text}"</p>
                <p className="review-date">{r.date}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="review-form-container">
        <h2 className="section-heading">Write a Review</h2>

        {user ? (
          <form onSubmit={submitReview} className="review-form">
            <p style={{marginBottom: "10px", fontWeight: "bold", color: "#555"}}>
              Posting as: <span style={{color: "#27bcd3"}}>{user.username}</span>
            </p>

            <select
              value={reviewRating}
              onChange={(e) => setReviewRating(e.target.value)}
              className="form-select"
            >
              <option value="5">5 Stars - Excellent</option>
              <option value="4">4 Stars - Good</option>
              <option value="3">3 Stars - Average</option>
              <option value="2">2 Stars - Poor</option>
              <option value="1">1 Star - Terrible</option>
            </select>

            <textarea
              placeholder="Share your experience..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              required
              className="form-textarea"
              rows="4"
            ></textarea>

            <button type="submit" className="btn-submit">
              Submit Review
            </button>
          </form>
        ) : (
          <div style={{textAlign: "center", padding: "20px", background: "#f9f9f9", borderRadius: "8px"}}>
            <p>Please log in to write a review.</p>
            <button 
              onClick={() => navigate("/auth")} 
              style={{marginTop:"10px", padding:"8px 16px", cursor:"pointer", background:"black", color:"white", border:"none"}}
            >
              Go to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}