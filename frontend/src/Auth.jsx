import React, { useState } from "react";
import axios from "axios";
import "./styles/auth.css";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mobilenumber, setMobilenumber] = useState("");
  const [address, setAddress] = useState("");
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        import.meta.env.VITE_API_URL+"/api/login",
        { username, password },
        { withCredentials: true }
      );
      console.log("FULL SERVER RESPONSE:", res.data);

      if (res.data.success || res.data.message === "Login successful") { 
        if (res.data.user) {
           localStorage.setItem("user", JSON.stringify(res.data.user));
           console.log("✅ Saved to LocalStorage:", res.data.user);
           alert("Login successful!");
           window.location.href = "/"; 
        } else {
           console.error("❌ ERROR: Server returned success but user data is MISSING.");
           alert("Login Issue: Backend did not send user details. Check Server code.");
        }

      } else {
        alert("Login failed: " + (res.data.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Login Request Failed:", err);
      alert("Login connection failed. Is the server running?");
    }
  };
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(import.meta.env.VITE_API_URL+"/api/register", {
        username,
        password,
        mobilenumber,
        address
      });
      alert("Registration successful");
      setUsername("");
      setPassword("");
      setMobilenumber("");
      setAddress("");
    } catch (err) {
      console.error(err);
      alert("Registration failed");
    }
  };

  return (
    <div className={`auth-container ${isLogin ? "" : "show-register"}`}>
    <div className="form-box">
    <form className="form login-form" onSubmit={handleLogin}>
      <h2>Login</h2>
      <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit" className="btn">Login</button>
      <p className="switch-text">Don't have an account? <span onClick={() => setIsLogin(false)}>Sign Up</span></p>
    </form>

    <form className="form register-form" onSubmit={handleRegister}>
      <h2>Sign Up</h2>
      <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
      <input type="text" placeholder="Mobile Number" value={mobilenumber} onChange={e => setMobilenumber(e.target.value)} />
      <input type="text" placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit" className="btn">Register</button>
      <p className="switch-text">Already have an account? <span onClick={() => setIsLogin(true)}>Login</span></p>
    </form>
  </div>
  <br />  <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
</div>
  );
}
