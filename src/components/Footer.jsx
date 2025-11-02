import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Hospital Info */}
        <div className="footer-section">
          <h3>🏥 MedCare Hospital</h3>
          <p>Your Health, Our Priority.</p>
          <p>We provide quality healthcare with compassion and care.</p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/register">Registration</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </div>

        {/* Contact Details */}
        <div className="footer-section">
          <h4>Contact Info</h4>
          <p>📍 123 Health Street, Hyderabad, India</p>
          <p>📞 +91 98765 43210</p>
          <p>📧 contact@medcarehospital.com</p>
        </div>

        {/* Social Links */}
        <div className="footer-section">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noreferrer">🌐 Facebook</a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer">🐦 Twitter</a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">📸 Instagram</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 MedCare Hospital. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;