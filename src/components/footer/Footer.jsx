import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{ 
      backgroundColor: '#2c3e50', 
      color: 'white', 
      padding: '30px 20px',
      marginTop: '50px'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '30px'
      }}>
        
        {/* Hospital Info */}
        <div>
          <h3 style={{ color: '#3498db', marginBottom: '15px' }}>
            City General Hospital
          </h3>
          <p>123 Healthcare Avenue</p>
          <p>Medical District, City 12345</p>
          <p>Phone: (555) 123-4567</p>
          <p>Email: info@citygeneral.com</p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ marginBottom: '15px' }}>Quick Links</h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '8px' }}>
              <Link to="/about" style={{ color: '#ecf0f1', textDecoration: 'none' }}>
                About Us
              </Link>
            </li>
            <li style={{ marginBottom: '8px' }}>
              <Link to="/contact" style={{ color: '#ecf0f1', textDecoration: 'none' }}>
                Contact Us
              </Link>
            </li>
            <li style={{ marginBottom: '8px' }}>
              <Link to="/privacy" style={{ color: '#ecf0f1', textDecoration: 'none' }}>
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h4 style={{ marginBottom: '15px' }}>Follow Us</h4>
          <div style={{ display: 'flex', gap: '15px' }}>
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" style={{ color: 'white' }}>Facebook</a>
            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" style={{ color: 'white' }}>Twitter</a>
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" style={{ color: 'white' }}>LinkedIn</a>
          </div>
        </div>

      </div>
      
      {/* Copyright */}
      <div style={{ 
        textAlign: 'center', 
        marginTop: '30px', 
        paddingTop: '20px',
        borderTop: '1px solid #34495e'
      }}>
        <p>© 2025 City General Hospital Management System | All Rights Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;