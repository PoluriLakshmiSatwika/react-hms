import React from 'react';
import './Home.css';

const Home = () => {
  const handleLogin = (userType) => {
    alert(`Redirecting to ${userType} Login`);
    // In real application, this would navigate to respective login page
  };

  const handleAppointment = () => {
    alert('Redirecting to Appointment Booking');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Hospital Management System',
        text: 'Check out this Hospital Management System',
        url: window.location.href
      });
    } else {
      alert('Share functionality not supported');
    }
  };

  return (
    <div className="hms-container">
      {/* Header */}
      <header className="hms-header">
        <div className="header-container">
          <div className="logo"></div>
          <nav className="navigation">
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#services">Services</a></li>
              <li><a href="#about">About Us</a></li>
              <li><a href="#gallery">Gallery</a></li>
              <li><a href="#contact">Contact Us</a></li>
            </ul>
          </nav>
          <button className="appointment-btn" onClick={handleAppointment}>
            Book an Appointment
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <h1 className="hero-title">Welcome to Hospital</h1>
          <button className="share-btn" onClick={handleShare}>
            SHARE
          </button>
        </div>
      </section>

      {/* Login Section */}
      <section className="login-section">
        <div className="login-container">
          <h2 className="section-title">Logins</h2>
          <div className="login-cards">
            {/* Admin Login Card */}
            <div className="login-card">
              <div className="card-icon admin-icon">🧑‍💼</div>
              <h3>Admin Login</h3>
              <button 
                className="login-btn admin-btn"
                onClick={() => handleLogin('Admin')}
              >
                Admin Login
              </button>
            </div>

            {/* Doctor Login Card */}
            <div className="login-card">
              <div className="card-icon doctor-icon">👨‍⚕</div>
              <h3>Doctors Login</h3>
              <button 
                className="login-btn doctor-btn"
                onClick={() => handleLogin('Doctor')}
              >
                Doctors Login
              </button>
            </div>

            {/* Nurse Login Card */}
            <div className="login-card">
              <div className="card-icon nurse-icon">👩‍⚕</div>
              <h3>Nurse Login</h3>
              <button 
                className="login-btn nurse-btn"
                onClick={() => handleLogin('Nurse')}
              >
                Nurse Login
              </button>
            </div>

            {/* Patient Login Card */}
            <div className="login-card">
              <div className="card-icon patient-icon">👤</div>
              <h3>Patient Login</h3>
              <button 
                className="login-btn patient-btn"
                onClick={() => handleLogin('Patient')}
              >
                Patient Login
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;