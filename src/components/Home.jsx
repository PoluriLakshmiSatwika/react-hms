import React from "react";
import "./Home.css";
import hospitalBg from "../assets/hospital-bg.jpeg";

const Home = () => {
  return (
    <div className="home-container">
      {/* Header / Navbar */}
      <header className="navbar">
        <div className="logo">HMS🏥</div>
        <nav className="nav-links">
          <a href="#home">Home</a>
          <a href="#register">Registration</a>
          <a href="#login">Login</a>
          <a href="#about">About Us</a>
          <a href="#contact">Contact Us</a>
        </nav>
        <button className="appointment-btn">Book an Appointment</button>
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
            <button className="btn primary">Register Now</button>
            <button className="btn secondary">Login</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
