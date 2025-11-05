import React from "react";
import {useNavigate } from "react-router-dom";
import "../pages/HomePage.css";

const HomeContainer = ({ children }) => {
  const navigate = useNavigate();

  // ✅ Helper function for smooth scroll navigation
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="home-container">
      {/* ✅ Navbar / Header */}
      <header className="navbar">
        <div className="logo">HMS🏥</div>

        <nav className="nav-links">
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            Home
          </a>
          <a
            href="#about"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("about");
            }}
          >
            About Us
          </a>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("contact");
            }}
          >
            Contact Us
          </a>
        </nav>

        <div className="navbar-buttons">
          <button
            className="appointment-btn"
            onClick={() => navigate("/patient-register")}
          >
            Book an Appointment
          </button>
          <button
            className="auth-link symbol-link"
            onClick={() => navigate("/login")}
            title="Register / Login"
          >
            👤
          </button>
        </div>
      </header>

      {/* ✅ Page content */}
      <main>{children}</main>
    </div>
  );
};

export default HomeContainer;
