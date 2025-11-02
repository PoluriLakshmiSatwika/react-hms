import React from "react";
import { Link } from "react-router-dom";
import "./Hero.css";

const Hero = () => {
  return (
    <div className="hero">
      <div className="hero-content">
        <h1>Welcome to MedCare Hospital</h1>
        <p>Your Health, Our Priority</p>
        <div className="hero-buttons">
          <Link to="/register" className="btn btn-primary">Register Now</Link>
          <Link to="/login" className="btn btn-outline">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;