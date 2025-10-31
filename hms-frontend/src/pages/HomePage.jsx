import React from 'react';
import Hero from '../components/Hero';
import Card from '../components/Card';

const HomePage = () => {
  return (
    <>
      <Hero />
      <div className="card-container">
        <Card title="Register" link="/register" />
        <Card title="Login" link="/login" />
        <Card title="About Us" link="/about" />
        <Card title="Contact Us" link="/contact" />
      </div>
    </>
  );
};

export default HomePage;
