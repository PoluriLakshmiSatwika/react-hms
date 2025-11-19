// Footer.js
import React from 'react';
import './Footer.css';
import { useNavigate } from "react-router-dom";


// ⭐ Add Professional Social Media Icons
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";



const Footer = () => {
  const currentYear = new Date().getFullYear();
const navigate = useNavigate();

  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Main Footer Content */}
        <div className="footer-main">

          {/* Brand & Contact Section */}
          <div className="footer-brand-section">
            <div className="footer-brand">

              <div className="hospital-logo">
                <div className="logo-icon">🏥</div>
                <div className="logo-text">
                  <h3>HMS</h3>
                  <p>Multispeciality Hospital</p>
                </div>
              </div>

              <p className="brand-description">
                Providing exceptional healthcare services with compassion, 
                innovation, and excellence since 1995.
              </p>

              {/* Emergency Contact */}
              <div className="emergency-contact">
                <div className="emergency-badge">
                  <span className="emergency-icon">🚨</span>
                  <div className="emergency-info">
                    <span className="emergency-label">24/7 Emergency</span>
                    <span className="emergency-number">+1 (555) 123-4567</span>
                  </div>
                </div>
              </div>

              {/* Operating Hours */}
              <div className="operating-hours">
                <h4>Operating Hours</h4>
                <div className="hours-grid">

                  <div className="hour-item">
                    <span className="hour-type">Emergency:</span>
                    <span className="hour-time">24/7</span>
                  </div>

                  <div className="hour-item">
                    <span className="hour-type">OPD:</span>
                    <span className="hour-time">6:00 AM - 10:00 PM</span>
                  </div>

                </div>
              </div>

            </div>
          </div>

          {/* Quick Links */}
<div className="footer-links-section">
  <div className="links-group">
    <h4 className="links-title">Quick Links</h4>
    <ul className="footer-links">

      <li>
        <button className="footer-link link-button" onClick={() => window.scrollTo({top: 0, behavior: "smooth"})}>
          Home
        </button>
      </li>

      <li>
        <button className="footer-link link-button" onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}>
          About Us
        </button>
      </li>

      <li>
        <button className="footer-link link-button" onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}>
          Services
        </button>
      </li>

      <li>
        <button className="footer-link link-button" onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>
          Contact
        </button>
      </li>

      <li>
        <button className="footer-link appointment-link link-button" onClick={() => navigate('/login')}>
          Book Appointment
        </button>
      </li>

    </ul>
  </div>
</div>


          {/* Services */}
          <div className="footer-services-section">
            <div className="links-group">
              <h4 className="links-title">Our Services</h4>
              <ul className="footer-links">
                <li><a href="#" className="footer-link">Emergency Care</a></li>
                <li><a href="#" className="footer-link">Cardiology</a></li>
                <li><a href="#" className="footer-link">Orthopedics</a></li>
                <li><a href="#" className="footer-link">Neurology</a></li>
                <li><a href="#" className="footer-link">Pediatrics</a></li>
                <li><a href="#" className="footer-link">View All Services</a></li>
              </ul>
            </div>
          </div>

          {/* Contact Info */}
          <div className="footer-contact-section">
            <div className="contact-group">

              <h4 className="links-title">Contact Info</h4>

              <div className="contact-details">

                <div className="contact-item">
                  <div className="contact-icon">📍</div>
                  <div className="contact-text">
                    <span>123 Healthcare Avenue</span>
                    <span>Medical District, City 12345</span>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">📞</div>
                  <div className="contact-text">
                    <span>+1 (555) 123-4567</span>
                    <span className="contact-note">Emergency & General</span>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">📧</div>
                  <div className="contact-text">
                    <span>info@HMS.com</span>
                    <span>support@HMS.com</span>
                  </div>
                </div>

              </div>

              {/* ⭐ UPDATED SOCIAL ICONS (NO EMOJIS) */}
              <div className="social-section">
                <h5>Follow Us</h5>

                <div className="social-links">
                  <a href="javascript:void(0)" className="social-link" aria-label="Facebook">
                    <FaFacebookF className="social-icon" />
                  </a>

                  <a href="javascript:void(0)" className="social-link" aria-label="Twitter">
                    <FaTwitter className="social-icon" />
                  </a>

                  <a href="javascript:void(0)" className="social-link" aria-label="Instagram">
                    <FaInstagram className="social-icon" />
                  </a>

                  <a href="javascript:void(0)" className="social-link" aria-label="LinkedIn">
                    <FaLinkedinIn className="social-icon" />
                  </a>
                </div>

              </div>

            </div>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="copyright">
              <p>&copy; {currentYear} MediCare Plus Hospital. All rights reserved.</p>
            </div>

            <div className="legal-links">
              <a href="/privacy" className="legal-link">Privacy Policy</a>
              <a href="/terms" className="legal-link">Terms of Service</a>
              <a href="/sitemap" className="legal-link">Sitemap</a>
            </div>

            <div className="certification">
              <span className="cert-badge">🏆 JCI Accredited</span>
            </div>

          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
