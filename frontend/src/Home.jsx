import React, { useState } from "react";
import Carousel from "../components/Carousel.jsx";
import ProductCard from "../components/ProductCard.jsx";
import "../src/styles/home.css";
import { useNavigate } from "react-router-dom";
import axios from "axios"; 

function Home() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const gotoallP = () => {
    navigate("/allP");
  };

  const handleSubscribe = async () => {
    if (!email) return alert("Please enter a valid email.");
    try {
      await axios.post(import.meta.env.VITE_API_URL+"/api/subscribe", { email });
      alert("Thank you! Check your inbox for a welcome email.");
      setEmail("");
    } catch (err) {
      console.error(err);
      alert("Subscription failed. Please try again.");
    }
  };

  return (
    <div className="home-container">
      <h1>Welcome</h1>
      <Carousel />
      
      <section className="home-section">
        <h3 style={{color:'#27bcd3'}}>Best Selling Products</h3>
        <div className="home-products-row">
          <ProductCard id="12" />
          <ProductCard id="1" />
          <ProductCard id="6" />
          <ProductCard id="5" />
        </div>
      </section>

      <section className="home-section">
        <h3 className="section-title" onClick={gotoallP} style={{ cursor: "pointer" }}>
          Featured Products (Click to see all)
        </h3>
        <div className="home-products-row">
          <ProductCard id="3" />
          <ProductCard id="7" />
          <ProductCard id="9" />
          <ProductCard id="10" />
        </div>
      </section>

      <section className="specs-section">
        <h2 className="specs-title">Our Specifications</h2>
        <p className="specs-subtitle">We offer top-tier service to ensure your shopping is smooth and secure.</p>
        
        <div className="specs-grid">

          <div className="spec-card">
            <div className="spec-icon">🚚</div>
            <h3>Free Shipping</h3>
            <p>Enjoy fast, free delivery on every order with no conditions, just reliable doorstep service.</p>
          </div>

          <div className="spec-card">
            <div className="spec-icon">↩️</div>
            <h3>7 Days Easy Return</h3>
            <p>Change your mind? No worries. Return any item within 7 days hassle-free.</p>
          </div>

          <div className="spec-card">
            <div className="spec-icon">🎧</div>
            <h3>24/7 Customer Support</h3>
            <p>We're here for you. Get expert help anytime with our dedicated customer support.</p>
          </div>
        </div>
      </section>

      <section className="home-section newsletter">
        <h2 style={{color:'#27bcd3'}}>Join Our Community</h2>
        <div className="newsletter-input-group">
          <input 
            type="email" 
            placeholder="Enter your email here" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="newsletter-input"
          />
          <button onClick={handleSubscribe} className="newsletter-btn">
            Subscribe
          </button>
        </div>
      </section>
    </div>
  );
}

export default Home;