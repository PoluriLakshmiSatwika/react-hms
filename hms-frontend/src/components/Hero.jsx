import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <h1>Welcome to SmartCare Hospital</h1>
      <p>Your Health, Our Priority</p>
      <div className="hero-buttons">
        <Link to="/register" className="btn">Register Now</Link>
        <Link to="/login" className="btn">Login</Link>
      </div>
    </section>
  );
};

export default Hero;