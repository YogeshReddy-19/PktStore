import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../src/styles/cart.css"; 

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const processedRef = useRef(false);

  const getUser = () => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return null;
    try { return JSON.parse(storedUser); } catch (e) { return null; }
  };
  const user = getUser();
  useEffect(() => {
    if (!user) {
      alert("Please log in.");
      navigate("/auth");
      return;
    }
    fetchCart();

    const isSuccess = searchParams.get("success");
    
    if (isSuccess && !processedRef.current) {
      processedRef.current = true; 
      completeOrder();
    }
  }, []);

  const fetchCart = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_API_URL+`/api/cart/${user.id}`);
      setCartItems(res.data);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 401) navigate("/auth");
    }
  };

  const makePayment = async () => {
    if (cartItems.length === 0) return alert("Cart is empty");

    try {
      const response = await axios.post(import.meta.env.VITE_API_URL+"/api/create-checkout-session", {
        userId: user.id
      });

      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (err) {
      console.error("Payment Error:", err);
      alert("Payment failed. Check console.");
    }
  };

  const completeOrder = async () => {
    try {
      console.log("Finalizing Order...");
      
      await axios.post(import.meta.env.VITE_API_URL+"/api/orders/place", { userId: user.id });
      
      setCartItems([]);
      alert("Payment Successful! Order Placed.");
      
      window.history.replaceState(null, "", "/cart");
      
    } catch (err) {
      console.error("Order Save Error:", err);
    }
  };

  const handleUpdate = async (productId, action) => {
    try {
      const res = await axios.put(import.meta.env.VITE_API_URL+"/api/cart/update", {
        userId: user.id,
        productId,
        action, 
      });
      setCartItems(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const totalAmount = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <div className="cart-container">
      <h1>Your Shopping Cart</h1>

      {searchParams.get("canceled") && (
        <p style={{ color: "red", fontWeight: "bold" }}>Payment was canceled.</p>
      )}

      {cartItems.length === 0 ? (
        <p className="empty-cart-msg">Your cart is empty.</p>
      ) : (
        <div className="cart-content">
          
          <div className="cart-items">
            {cartItems.map((item, index) => (
              <div key={index} className="cart-card">
                <img src={`${item.img}`} alt={item.name} />
                
                <div className="cart-details">
                  <h3>{item.name}</h3>
                  <p>Unit Price: ₹{item.price}</p>
                  
                  <div className="qty-controls">
                    <button className="btn-qty" onClick={() => handleUpdate(item.id, "decrease")}>-</button>
                    <span className="qty-value">{item.quantity}</span>
                    <button className="btn-qty" onClick={() => handleUpdate(item.id, "increase")}>+</button>
                  </div>

                  <button className="btn-remove" onClick={() => handleUpdate(item.id, "remove")}>
                    Remove
                  </button>
                </div>
                
                <div className="cart-item-total">
                  ₹{item.price * item.quantity}
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>₹{totalAmount}</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span style={{ color: "green" }}>Free</span>
            </div>
            <hr />
            <div className="summary-row total">
              <span>Total:</span>
              <span>₹{totalAmount}</span>
            </div>
            
            <button className="btn-checkout" onClick={makePayment}>
              Pay Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}