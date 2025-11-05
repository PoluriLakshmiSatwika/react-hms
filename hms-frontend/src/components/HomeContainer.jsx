import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../pages/HomePage.css";


const HomeContainer = ({ children }) => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* Navbar */}
      <header className="navbar">
        <div className="logo">HMS🏥</div>
        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/register">Registration</Link>
          <Link to="/login">Login</Link>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact Us</Link>
        </nav>
        <button
          className="appointment-btn"
          onClick={() => navigate("/patient-register")}
        >
          Book an Appointment
        </button>
      </header>

      {/* Page-specific content */}
      <main>{children}</main>
    </div>
  );
};

export default HomeContainer;
