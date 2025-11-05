import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import hospitalBg from "../assets/hospital-bg.jpeg";

const HomePage = () => {
  const navigate = useNavigate();

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Services data
  const services = [
    "Cardiology",
    "Orthopedics", 
    "Pediatrics",
    "Neurology",
    "Oncology",
    "Dermatology",
    "Gynecology",
    "ENT",
    "Gastroenterology",
    "Urology",
    "Ophthalmology",
    "Psychiatry"
  ];

  // Achievements data
  const achievements = [
    { number: "50+", title: "Expert Doctors" },
    { number: "10,000+", title: "Happy Patients" },
    { number: "24/7", title: "Emergency Services" },
    { number: "15+", title: "Medical Departments" }
  ];

  return (
    <div className="home-container">
      {/* Header / Navbar */}
      <header className="navbar">
        <div className="logo">HMS🏥</div>
        <nav className="nav-links">
          <a href="#home" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
            Home
          </a>
          <a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection("about"); }}>
            About Us
          </a>
          <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection("contact"); }}>
            Contact Us
          </a>
        </nav>

        <button
          className="appointment-btn"
          onClick={() => navigate("/patient-register")}
        >
          Book an Appointment
        </button>
        <button
          className="auth-link symbol-link"
          onClick={() => navigate("/auth")}
          title="Register / Login"
        >
          👤
        </button>
      </header>

      {/* Hero Section */}
      <section
        id="home"
        className="hero-section"
        style={{ backgroundImage: `url(${hospitalBg})` }}
      >
        <div className="overlay">
          <h1>Welcome to our Hospital</h1>
          <p>Your Health, Our Priority</p>
          <p className="hero-description">
            Hospitals complement and amplify the effectiveness
            of many other parts of the health system, providing continuous
            availability of services for acute and complex conditions. 
            They concentrate scarce resources within well-planned referral networks to respond efficiently to population health needs.
          </p>
        </div>
      </section>

      {/* About Section - Now includes Services and Achievements */}
      <section id="about" className="about-section">
        <div className="about-container">
          {/* About Content */}
          <div className="about-content">
            <h4>About Our Hospital</h4>
            <p>
              Our hospital is a state-of-the-art healthcare facility dedicated to providing 
              comprehensive medical services to our community. With a team of highly skilled 
              professionals and cutting-edge technology, we ensure the highest standards of 
              patient care and medical excellence.
            </p>
          </div>

          {/* Services Section */}
          <div className="services-subsection">
            <h4>Our Services</h4>
            <div className="services-grid">
              {services.map((service, index) => (
                <div key={index} className="service-item">
                  {service}
                </div>
              ))}
            </div>
          </div>

          {/* Achievements Section */}
          <div className="achievements-subsection">
            <h4>Our Achievements</h4>
            <div className="achievements-grid">
              {achievements.map((achievement, index) => (
                <div key={index} className="achievement-item">
                  <div className="achievement-number">{achievement.number}</div>
                  <div className="achievement-title">{achievement.title}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <div className="contact-container">
          <h3>Contact Us</h3>
          <div className="contact-content">
            <div className="contact-info">
              <div className="contact-item">
                <h4>📍 Address</h4>
                <p>123 Healthcare Street<br />Medical City, MC 12345</p>
              </div>
              <div className="contact-item">
                <h4>📞 Phone</h4>
                <p>Emergency: +1 (555) 123-4567<br />General: +1 (555) 123-4568</p>
              </div>
              <div className="contact-item">
                <h4>📧 Email</h4>
                <p>info@hmshospital.com<br />emergency@hmshospital.com</p>
              </div>
              <div className="contact-item">
                <h4>🕒 Hours</h4>
                <p>24/7 Emergency Services<br />OPD: 8:00 AM - 8:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;