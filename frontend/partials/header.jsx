import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../src/styles/header.css";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState("");
  
  const [showProfile, setShowProfile] = useState(false);
  const [orders, setOrders] = useState([]);

  const getUserFromStorage = () => {
    try { return JSON.parse(localStorage.getItem("user")); } 
    catch (e) { return null; }
  };
  const [user, setUser] = useState(getUserFromStorage());

  useEffect(() => {
    setUser(getUserFromStorage());
  }, [location]);

  const handleSearch = (e) => {
    if (e.key === "Enter" && query.trim() !== "") {
      navigate(`/search?q=${query}`);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setShowProfile(false);
    navigate("/auth");
  };
  const handleOpenProfile = async () => {
    if (!showProfile) {
      setShowProfile(true);
      try {
        const res = await axios.get(import.meta.env.VITE_API_URL+`/api/orders/${user.id}`);
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      }
    } else {
      setShowProfile(false);
    }
  };

  return (
    <>
      <header>
        <div className="navbar">
          <img className="logo" src="/logo.png" alt="logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }} />

          <div className="centrenav">
            <button className="smbtn" onClick={() => navigate("/")}>Home</button>
            <button className="smbtn" onClick={() => navigate("/allP")}>All Products</button>
            <input 
              type="search" 
              id="searchb" 
              placeholder="Search product..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>

          <div className="rightnav">
            <img className="cartl" src="/cart.png" alt="cart" />
            <button className="cart" onClick={() => navigate("/cart")}>Cart</button>
            
            <div className="user-section">
              {user ? (
                <>
                  <h6 
                    onClick={handleOpenProfile} 
                    className="username-trigger"
                  >
                    {user.username} ▾
                  </h6>
                  <button onClick={logout}>Logout</button>
                </>
              ) : (
                <button onClick={() => navigate("/auth")}>Login</button>
              )}
            </div>
          </div>
        </div>
      </header>

      {showProfile && user && (
        <div className="profile-overlay" onClick={() => setShowProfile(false)}>
          <div className="profile-card" onClick={(e) => e.stopPropagation()}>
            
            <div className="profile-header">
              <h2>User Profile</h2>
              <button className="close-btn" onClick={() => setShowProfile(false)}>×</button>
            </div>

            <div className="profile-details">
              <p><strong>Username:</strong> {user.username}</p>
              <p><strong>Mobile:</strong> {user.mobilenumber || "N/A"}</p>
              <p><strong>Address:</strong> {user.address || "N/A"}</p>
            </div>

            <hr />

            <div className="profile-orders">
              <h3>Order History</h3>
              {orders.length === 0 ? (
                <p style={{fontSize:"0.9rem", color:"#666"}}>No orders found.</p>
              ) : (
                <div className="mini-order-list">
                  {orders.map((order) => (
                    <div key={order.ordid} className="mini-order-item">
                      <img src={`${order.prodimg}`} alt="prod" />
                      <div>
                        <span className="ord-name">{order.prodname}</span>
                        <span className="ord-meta">Qty: {order.quantity} | ₹{order.totalam}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
}

export default Header;