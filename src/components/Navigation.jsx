import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="logo">🏥 MedCare Hospital</div>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/register">Registration</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/about">About Us</Link></li>
          <li><Link to="/contact">Contact Us</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;