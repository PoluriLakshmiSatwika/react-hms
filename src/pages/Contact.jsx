import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, User, FileText } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 3000);
  };

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .contact-container {
          min-height: 100vh;
          background: linear-gradient(180deg, #5b8def 0%, #4a7fe0 50%, #e3f2fd 100%);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          padding-bottom: 60px;
        }

        .contact-hero {
          background: transparent;
          color: white;
          padding: 100px 20px 80px;
          text-align: center;
        }

        .hero-content {
          max-width: 1200px;
          margin: 0 auto;
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: bold;
          margin-bottom: 16px;
          text-shadow: 2px 2px 8px rgba(0,0,0,0.2);
        }

        .hero-subtitle {
          font-size: 1.3rem;
          opacity: 0.95;
          text-shadow: 1px 1px 4px rgba(0,0,0,0.1);
        }

        .contact-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .content-grid {
          display: grid;
          grid-template-columns: 460px 1fr;
          gap: 40px;
          align-items: start;
        }

        .contact-info-section {
          background: white;
          border-radius: 24px;
          padding: 40px 32px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.15);
        }

        .info-title {
          font-size: 2rem;
          color: #1f2937;
          margin-bottom: 32px;
          font-weight: bold;
        }

        .info-item {
          display: flex;
          align-items: start;
          margin-bottom: 28px;
          padding: 24px;
          border-radius: 16px;
          background: linear-gradient(135deg, #e3f2fd, #bbdefb);
          transition: all 0.3s ease;
        }

        .info-item:hover {
          transform: translateX(8px);
          box-shadow: 0 5px 20px rgba(59, 130, 246, 0.25);
        }

        .info-icon {
          color: #1976d2;
          margin-right: 16px;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .info-content h3 {
          font-size: 1.2rem;
          color: #1f2937;
          margin-bottom: 10px;
          font-weight: 600;
        }

        .info-content p {
          color: #4b5563;
          line-height: 1.7;
          font-size: 0.95rem;
        }

        .info-content a {
          color: #1976d2;
          text-decoration: none;
          transition: color 0.3s ease;
          font-weight: 500;
        }

        .info-content a:hover {
          color: #0d47a1;
          text-decoration: underline;
        }

        .emergency-banner {
          background: linear-gradient(135deg, #ef5350, #c62828);
          color: white;
          padding: 28px;
          border-radius: 16px;
          text-align: center;
          margin-top: 24px;
          box-shadow: 0 6px 24px rgba(239, 83, 80, 0.4);
        }

        .emergency-banner h3 {
          font-size: 1.4rem;
          margin-bottom: 10px;
          font-weight: 600;
        }

        .emergency-number {
          font-size: 2.5rem;
          font-weight: bold;
          letter-spacing: 3px;
          margin: 8px 0;
        }

        .emergency-text {
          font-size: 1rem;
          opacity: 0.95;
        }

        .contact-form-section {
          background: white;
          border-radius: 24px;
          padding: 44px 40px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.15);
        }

        .form-title {
          font-size: 2rem;
          color: #1f2937;
          margin-bottom: 32px;
          font-weight: bold;
        }

        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-label {
          font-size: 0.95rem;
          color: #374151;
          margin-bottom: 10px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .form-input,
        .form-textarea,
        .form-select {
          padding: 14px 18px;
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.3s ease;
          font-family: inherit;
          background: #fafafa;
        }

        .form-input:focus,
        .form-textarea:focus,
        .form-select:focus {
          outline: none;
          border-color: #5b8def;
          background: white;
          box-shadow: 0 0 0 4px rgba(91, 141, 239, 0.1);
        }

        .form-textarea {
          resize: vertical;
          min-height: 140px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .submit-btn {
          background: linear-gradient(135deg, #5b8def, #4a7fe0);
          color: white;
          padding: 18px 40px;
          border: none;
          border-radius: 12px;
          font-size: 1.15rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          box-shadow: 0 6px 24px rgba(91, 141, 239, 0.4);
          margin-top: 8px;
        }

        .submit-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(91, 141, 239, 0.5);
        }

        .submit-btn:active {
          transform: translateY(-1px);
        }

        .success-message {
          background: linear-gradient(135deg, #66bb6a, #43a047);
          color: white;
          padding: 18px;
          border-radius: 12px;
          text-align: center;
          font-weight: 500;
          font-size: 1.05rem;
          animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .map-section {
          margin-top: 50px;
          background: white;
          border-radius: 24px;
          padding: 44px 40px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.15);
        }

        .map-title {
          font-size: 2rem;
          color: #1f2937;
          margin-bottom: 28px;
          font-weight: bold;
          text-align: center;
        }

        .map-container {
          width: 100%;
          height: 450px;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 6px 24px rgba(0,0,0,0.12);
        }

        .map-placeholder {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #bbdefb, #90caf9);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #1976d2;
          font-size: 1.2rem;
          font-weight: 500;
        }

        .hours-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
          margin-top: 12px;
        }

        .hours-item {
          display: flex;
          justify-content: space-between;
          padding: 14px 16px;
          background: white;
          border-radius: 10px;
          border: 1px solid #e3f2fd;
        }

        .day {
          font-weight: 600;
          color: #1f2937;
          font-size: 0.95rem;
        }

        .time {
          color: #1976d2;
          font-weight: 500;
          font-size: 0.95rem;
        }

        @media (max-width: 1200px) {
          .content-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }

          .hero-title {
            font-size: 2.5rem;
          }

          .contact-hero {
            padding: 80px 20px 60px;
          }

          .contact-info-section,
          .contact-form-section,
          .map-section {
            padding: 32px 24px;
          }
        }

        @media (max-width: 640px) {
          .hero-title {
            font-size: 2rem;
          }

          .hero-subtitle {
            font-size: 1.1rem;
          }
        }
      `}</style>

      <div className="contact-container">
        <div className="contact-hero">
          <div className="hero-content">
            <h1 className="hero-title">Contact Us</h1>
            <p className="hero-subtitle">We're here to help. Reach out to us anytime!</p>
          </div>
        </div>

        <div className="contact-content">
          <div className="content-grid">
            <div className="contact-info-section">
              <h2 className="info-title">Get In Touch</h2>
              
              <div className="info-item">
                <MapPin className="info-icon" size={24} />
                <div className="info-content">
                  <h3>Our Address</h3>
                  <p>123 Healthcare Street,<br />Medical District,<br />City Name - 500001</p>
                </div>
              </div>

              <div className="info-item">
                <Phone className="info-icon" size={24} />
                <div className="info-content">
                  <h3>Phone Numbers</h3>
                  <p>
                    Main: <a href="tel:+911234567890">+91 123 456 7890</a><br />
                    Appointments: <a href="tel:+911234567891">+91 123 456 7891</a>
                  </p>
                </div>
              </div>

              <div className="info-item">
                <Mail className="info-icon" size={24} />
                <div className="info-content">
                  <h3>Email</h3>
                  <p>
                    General: <a href="mailto:info@hospital.com">info@hospital.com</a><br />
                    Support: <a href="mailto:support@hospital.com">support@hospital.com</a>
                  </p>
                </div>
              </div>

              <div className="info-item">
                <Clock className="info-icon" size={24} />
                <div className="info-content">
                  <h3>Working Hours</h3>
                  <div className="hours-grid">
                    <div className="hours-item">
                      <span className="day">Monday - Friday</span>
                      <span className="time">24/7</span>
                    </div>
                    <div className="hours-item">
                      <span className="day">Saturday - Sunday</span>
                      <span className="time">24/7</span>
                    </div>
                    <div className="hours-item">
                      <span className="day">Emergency</span>
                      <span className="time">24/7</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="emergency-banner">
                <h3>🚨 Emergency</h3>
                <div className="emergency-number">108</div>
                <p className="emergency-text">Available 24/7</p>
              </div>
            </div>

            <div className="contact-form-section">
              <h2 className="form-title">Send Us a Message</h2>
              
              {submitted ? (
                <div className="success-message">
                  ✓ Thank you! Your message has been sent successfully. We'll get back to you soon.
                </div>
              ) : (
                <div className="contact-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">
                        <User size={16} />
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        className="form-input"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        <Mail size={16} />
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        className="form-input"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">
                        <Phone size={16} />
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        className="form-input"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        <FileText size={16} />
                        Subject *
                      </label>
                      <select
                        name="subject"
                        className="form-select"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select a subject</option>
                        <option value="appointment">Appointment Inquiry</option>
                        <option value="general">General Question</option>
                        <option value="feedback">Feedback</option>
                        <option value="complaint">Complaint</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <MessageSquare size={16} />
                      Message *
                    </label>
                    <textarea
                      name="message"
                      className="form-textarea"
                      placeholder="Type your message here..."
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <button type="button" onClick={handleSubmit} className="submit-btn">
                    <Send size={20} />
                    Send Message
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="map-section">
            <h2 className="map-title">Find Us Here</h2>
            <div className="map-container">
              <div className="map-placeholder">
                <MapPin size={48} style={{marginRight: '12px'}} />
                Map Integration: Add Google Maps or OpenStreetMap iframe here
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}