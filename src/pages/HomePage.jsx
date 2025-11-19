// HomePage.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";
import hospitalBg from "../assets/hospital-bg.jpeg";

const HomePage = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMenuOpen(false);
    }
  };

  const services = [
    { name: "Cardiology", icon: "❤️", color: "#e74c3c", description: "Comprehensive heart care with advanced cardiac treatments" },
    { name: "Orthopedics", icon: "🦴", color: "#3498db", description: "Bone and joint treatments with modern surgical techniques" },
    { name: "Pediatrics", icon: "👶", color: "#9b59b6", description: "Specialized care for children's health and development" },
    { name: "Neurology", icon: "🧠", color: "#e67e22", description: "Expert diagnosis and treatment for neurological disorders" },
    { name: "Oncology", icon: "🎗️", color: "#2ecc71", description: "Advanced cancer care with compassionate support" },
    { name: "Dermatology", icon: "🌟", color: "#f1c40f", description: "Skin care treatments using latest dermatological advances" },
    { name: "Gynecology", icon: "🌸", color: "#e84393", description: "Women's health services and reproductive care" },
    { name: "ENT", icon: "👂", color: "#00cec9", description: "Ear, nose, and throat specialists for complete care" },
  ];

  const achievements = [
    { number: "50+", title: "Expert Doctors", icon: "👨‍⚕️" },
    { number: "10,000+", title: "Happy Patients", icon: "😊" },
    { number: "24/7", title: "Emergency Services", icon: "🚑" },
    { number: "15+", title: "Medical Departments", icon: "🏥" },
  ];

  return (
    <div className="home-container">
      <header className="navbar">
        <div className="nav-container">

          <div className="logo">
            🏥 <span>HMS</span>
          </div>

          {/* Desktop Links + Mobile Open State */}
          <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
            <a href="#home" onClick={(e)=>{e.preventDefault(); scrollToSection("home")}}>Home</a>
            <a href="#about" onClick={(e)=>{e.preventDefault(); scrollToSection("about")}}>About Us</a>
            {/* <a href="#services" onClick={(e)=>{e.preventDefault(); scrollToSection("services")}}>Services</a> */}
            <a href="#contact" onClick={(e)=>{e.preventDefault(); scrollToSection("contact")}}>Contact</a>

            <button
              className="login-btn mobile-login"
              onClick={() => { navigate("/login"); setMenuOpen(false); }}
            >
              👤 Login
            </button>
          </nav>

          <button
            className="login-btn desktop-login"
            onClick={() => navigate("/login")}
          >
            👤 Login
          </button>

          {/* Hamburger */}
          <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            <span className={menuOpen ? "bar open" : "bar"}></span>
            <span className={menuOpen ? "bar open" : "bar"}></span>
            <span className={menuOpen ? "bar open" : "bar"}></span>
          </div>

        </div>
      </header>

      {/* HERO */}
      <section id="home" className="hero-section">
        <div className="hero-bg" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${hospitalBg})` }}></div>

        <div className="hero-content">
          <div className={`hero-text ${isVisible ? "visible" : ""}`}>

  <span className="badge">Trusted Healthcare Since 1995</span>

  <h1 className="hero-title">
    Excellence in <span className="highlight">HMS</span>
  </h1>

  <p className="hero-subtitle">
    Your Health, Our Priority – Always
  </p>

  <p className="hero-desc">
    We provide world-class medical treatment backed by advanced technology, 
    experienced doctors, and compassionate care for every patient.
  </p>

  <p className="hero-desc">
    From emergency services to specialized departments, we ensure 
    safe, reliable, and personalized healthcare for you and your family.
  </p>

  {/* <div className="hero-btns">
    <button className="btn-primary" onClick={() => scrollToSection("services")}>
      Explore Services
    </button>
    <button className="btn-secondary" onClick={() => scrollToSection("contact")}>
      Get Directions
    </button>
  </div> */}

</div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="about-section">
        <div className="section-container">

          <div className="section-header">
            <h2>About HMS</h2>
            <p>Leading Healthcare Excellence for Over 25 Years</p>
          </div>

          <div className="about-grid">
            <div className="about-text">
              <h3>Our Legacy of Care</h3>
              <p>
                Founded in 1995, HMS has become one of the region’s most trusted
                healthcare institutions.
              </p>

              <div className="features">
                <div className="feature">
                  <div className="feature-icon">🏆</div>
                  <div>
                    <h4>JCI Accredited</h4>
                    <p>International quality standards</p>
                  </div>
                </div>

                <div className="feature">
                  <div className="feature-icon">🔬</div>
                  <div>
                    <h4>Advanced Technology</h4>
                    <p>State-of-the-art medical equipment</p>
                  </div>
                </div>

                <div className="feature">
                  <div className="feature-icon">👨‍⚕️</div>
                  <div>
                    <h4>Expert Team</h4>
                    <p>Highly qualified specialists</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="about-visual">
              <div className="visual-placeholder">
                <div className="visual-content">
                  <div className="visual-badge">Advanced Facility</div>
                  <span>🏥 Modern Hospital</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="services-section">
        <div className="section-container">
          
          <div className="section-header">
            <h2>Our Medical Services</h2>
            <p>Comprehensive healthcare solutions for all your needs</p>
          </div>

          <div className="services-grid">
            {services.map((srv, i) => (
              <div key={i} className="service-card">
                <div className="service-icon" style={{ backgroundColor: srv.color }}>{srv.icon}</div>
                <h3>{srv.name}</h3>
                <p>{srv.description}</p>
                <div className="service-features">
                  <span>✓ Advanced Diagnostics</span>
                  <span>✓ Expert Specialists</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ACHIEVEMENTS */}
      <section className="achievements-section">
        <div className="section-container">
          <div className="achievements-grid">
            {achievements.map((a, i) => (
              <div key={i} className="achievement-card">
                <div className="achievement-icon">{a.icon}</div>
                <div>
                  <h3 className="achievement-number">{a.number}</h3>
                  <p className="achievement-title">{a.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="contact-section">
        <div className="section-container">

          <div className="section-header">
            <h2>Contact Us</h2>
            <p>We’re here to help – get in touch</p>
          </div>

          <div className="contact-grid">

            <div className="contact-info">
              <div className="contact-item">
                <div className="contact-icon">📍</div>
                <div>
                  <h4>Main Campus</h4>
                  <p>123 Healthcare Avenue<br />City 12345</p>
                </div>
              </div>

              <div className="contact-item emergency">
                <div className="contact-icon">📞</div>
                <div>
                  <h4>Emergency Hotline</h4>
                  <p className="emergency-number">+1 (555) 123-EMER</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">📧</div>
                <div>
                  <h4>Email</h4>
                  <p>info@hms.com</p>
                </div>
              </div>

            </div>

            <div className="contact-map">
              <div className="map-placeholder">
                <span>📍 Interactive Map</span>
                <button className="map-btn">Open Maps</button>
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};

export default HomePage;
