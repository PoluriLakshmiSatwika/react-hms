import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthPage.css";

const AuthPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login");

  const handleLogin = (e) => {
    e.preventDefault();
    alert("Login successful!");
    navigate("/"); // back to homepage
  };

  const handleRegister = (e) => {
    e.preventDefault();
    alert("Registration successful!");
    navigate("/"); // back to homepage
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <h2>Welcome to HMS Portal 👨‍⚕️</h2>

        {/* Tabs */}
        <div className="tabs">
          <button
            className={activeTab === "login" ? "active" : ""}
            onClick={() => setActiveTab("login")}
          >
            Login
          </button>
          <button
            className={activeTab === "register" ? "active" : ""}
            onClick={() => setActiveTab("register")}
          >
            Register
          </button>
        </div>

        {/* Login Form */}
        {activeTab === "login" && (
          <form className="form" onSubmit={handleLogin}>
            <input type="email" placeholder="Email" required />
            <input type="password" placeholder="Password" required />
            <button type="submit">Login</button>
          </form>
        )}

        {/* Register Form */}
        {activeTab === "register" && (
          <form className="form" onSubmit={handleRegister}>
            <input type="text" placeholder="Full Name" required />
            <input type="email" placeholder="Email" required />
            <input type="password" placeholder="Password" required />
            <button type="submit">Register</button>
          </form>
        )}

        <button className="back-btn" onClick={() => navigate("/")}>
          ← Back to Home
        </button>
      </div>
    </div>
  );
};

export default AuthPage;
