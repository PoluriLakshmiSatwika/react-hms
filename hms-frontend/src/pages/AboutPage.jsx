import React from 'react';
import { Heart, Users, Award, Clock, Shield, Stethoscope } from 'lucide-react';
import './AboutPage.css'; // ✅ External CSS import
import HomeContainer from '../components/HomeContainer';

export default function AboutPage() {
  const features = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Patient-Centered Care",
      description: "Your health and comfort are our top priorities. We provide compassionate, personalized care."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Expert Medical Team",
      description: "Our experienced doctors, nurses, and staff are dedicated to providing excellent healthcare."
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Advanced Technology",
      description: "We use state-of-the-art medical equipment and innovative treatment methods."
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "24/7 Emergency Care",
      description: "Round-the-clock emergency services ensure you get help whenever you need it."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Quality & Safety",
      description: "We maintain the highest standards of medical care and patient safety protocols."
    },
    {
      icon: <Stethoscope className="w-8 h-8" />,
      title: "Comprehensive Services",
      description: "From preventive care to specialized treatments, we offer complete healthcare solutions."
    }
  ];

  const stats = [
    { number: "50+", label: "Expert Doctors" },
    { number: "100+", label: "Healthcare Staff" },
    { number: "10,000+", label: "Patients Served" },
    { number: "15+", label: "Specializations" }
  ];

  const specializations = [
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

  return (
    
    <div className="about-container">
      {/* Hero Section */}
       <HomeContainer />
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">About Our Hospital</h1>
          <p className="hero-description">
            Committed to providing exceptional healthcare services with compassion, 
            innovation, and excellence for over a decade.
          </p>
        </div>
      </div>

      {/* Mission & Vision Section */}
      <div className="mission-vision-section">
        <div className="mission-vision-grid">
          <div className="mission-card">
            <h2>Our Mission</h2>
            <p className="card-text">
              To deliver world-class healthcare services that are accessible, affordable, 
              and compassionate. We strive to improve the health and well-being of our 
              community through excellence in medical care, research, and education.
            </p>
          </div>
          <div className="vision-card">
            <h2>Our Vision</h2>
            <p className="card-text">
              To be the leading healthcare provider recognized for clinical excellence, 
              innovative treatments, and patient-centered care. We envision a healthier 
              community where everyone has access to quality medical services.
            </p>
          </div>
        </div>
      </div>

      {/* Specializations Section */}
      <div className="specializations-section">
        <div className="specializations-content">
          <h2 className="section-title">Our Services</h2>
          <div className="specializations-grid">
            {specializations.map((spec, index) => (
              <div key={index} className="specialization-item">
                <p className="specialization-text">{spec}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="stats-section">
        <div className="stats-content">
          <h2 className="stats-title">Our Achievements</h2>
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <h2 className="section-title">Why Choose Us</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Values Section */}
      <div className="values-section">
        <h2 className="section-title">Our Core Values</h2>
        <div className="values-grid">
          <div className="value-item">
            <div className="value-emoji">💙</div>
            <h3 className="value-title">Compassion</h3>
            <p className="value-description">We care deeply about every patient</p>
          </div>
          <div className="value-item">
            <div className="value-emoji">⚡</div>
            <h3 className="value-title">Excellence</h3>
            <p className="value-description">We strive for the highest standards</p>
          </div>
          <div className="value-item">
            <div className="value-emoji">🤝</div>
            <h3 className="value-title">Integrity</h3>
            <p className="value-description">We act with honesty and ethics</p>
          </div>
          <div className="value-item">
            <div className="value-emoji">🌟</div>
            <h3 className="value-title">Innovation</h3>
            <p className="value-description">We embrace new technologies</p>
          </div>
        </div>
      </div>
    </div>
  );
}
