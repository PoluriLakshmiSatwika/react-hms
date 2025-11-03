import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./HomePage.css";
import hospitalBg from "../assets/hospital-bg.jpeg";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* Header / Navbar */}
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

      {/* Hero Section */}
      <section
        className="hero-section"
        style={{ backgroundImage: `url(${hospitalBg})` }}
      >
        <div className="overlay">
          <h1>Welcome to our Hospital</h1>
          <p>Your Health, Our Priority</p>
          <div className="hero-buttons">
            <Link to="/register" className="btn primary">
              Register Now
            </Link>
            <Link to="/login" className="btn secondary">
              Login
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
