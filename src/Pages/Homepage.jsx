import React from "react";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import "../App.css"; // for styling

const HomePage = () => {
  return (
    <div className="homepage">
      {/* Hero Section */}
      <Hero />

      {/* Quick Access Section */}
      <section className="quick-access">
        <h2>Quick Access</h2>
        <p>Select one of the options below to get started.</p>

        <div className="cards-container">
          <div className="card">
            <h3>🧾 Registration</h3>
            <p>Register as a new patient or staff member.</p>
            <Link to="/register" className="card-btn">Register</Link>
          </div>

          <div className="card">
            <h3>🔐 Login</h3>
            <p>Access your account as a patient, doctor, or admin.</p>
            <Link to="/login" className="card-btn">Login</Link>
          </div>

          <div className="card">
            <h3>ℹ About Us</h3>
            <p>Learn more about our hospital and services.</p>
            <Link to="/about" className="card-btn">About</Link>
          </div>

          <div className="card">
            <h3>📞 Contact Us</h3>
            <p>Get in touch with our hospital staff.</p>
            <Link to="/contact" className="card-btn">Contact</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;