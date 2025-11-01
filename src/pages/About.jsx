import React from 'react';
import { Heart, Users, Award, Clock, Shield, Stethoscope } from 'lucide-react';

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
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .about-container {
          min-height: 100vh;
          background: linear-gradient(to bottom, #e0f2fe, #ffffff);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        /* Hero Section */
        .hero-section {
          background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
          color: white;
          padding: 80px 20px;
          text-align: center;
        }

        .hero-content {
          max-width: 1200px;
          margin: 0 auto;
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: bold;
          margin-bottom: 24px;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
        }

        .hero-description {
          font-size: 1.25rem;
          line-height: 1.8;
          max-width: 800px;
          margin: 0 auto;
          opacity: 0.95;
        }

        /* Mission & Vision */
        .mission-vision-section {
          max-width: 1200px;
          margin: 0 auto;
          padding: 64px 20px;
        }

        .mission-vision-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 32px;
        }

        .mission-card, .vision-card {
          background: white;
          padding: 40px;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .mission-card:hover, .vision-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(0,0,0,0.15);
        }

        .mission-card h2 {
          color: #3b82f6;
          font-size: 2rem;
          margin-bottom: 16px;
        }

        .vision-card h2 {
          color: #10b981;
          font-size: 2rem;
          margin-bottom: 16px;
        }

        .card-text {
          color: #4b5563;
          line-height: 1.8;
          font-size: 1.05rem;
        }

        /* Statistics Section */
        .stats-section {
          background: linear-gradient(135deg, #6366f1 0%, #3b82f6 100%);
          color: white;
          padding: 64px 20px;
        }

        .stats-content {
          max-width: 1200px;
          margin: 0 auto;
        }

        .stats-title {
          font-size: 2.5rem;
          font-weight: bold;
          text-align: center;
          margin-bottom: 48px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 32px;
          text-align: center;
        }

        .stat-item {
          padding: 20px;
        }

        .stat-number {
          font-size: 3rem;
          font-weight: bold;
          margin-bottom: 8px;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
        }

        .stat-label {
          font-size: 1.25rem;
          opacity: 0.95;
        }

        /* Features Section */
        .features-section {
          max-width: 1200px;
          margin: 0 auto;
          padding: 64px 20px;
        }

        .section-title {
          font-size: 2.5rem;
          font-weight: bold;
          text-align: center;
          color: #1f2937;
          margin-bottom: 48px;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 32px;
        }

        .feature-card {
          background: white;
          padding: 32px;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          transition: all 0.3s ease;
          border-left: 4px solid #3b82f6;
        }

        .feature-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 35px rgba(0,0,0,0.15);
          border-left-color: #10b981;
        }

        .feature-icon {
          color: #3b82f6;
          margin-bottom: 16px;
        }

        .feature-title {
          font-size: 1.35rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 12px;
        }

        .feature-description {
          color: #6b7280;
          line-height: 1.7;
          font-size: 1rem;
        }

        /* Specializations Section */
        .specializations-section {
          background: linear-gradient(to bottom, #f0fdf4, #ecfdf5);
          padding: 64px 20px;
        }

        .specializations-content {
          max-width: 1200px;
          margin: 0 auto;
        }

        .specializations-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
        }

        .specialization-item {
          background: white;
          padding: 24px;
          border-radius: 12px;
          text-align: center;
          box-shadow: 0 2px 10px rgba(0,0,0,0.06);
          transition: all 0.3s ease;
          border: 2px solid transparent;
        }

        .specialization-item:hover {
          background: linear-gradient(135deg, #dbeafe, #e0f2fe);
          border-color: #3b82f6;
          transform: scale(1.05);
        }

        .specialization-text {
          color: #374151;
          font-weight: 500;
          font-size: 1.05rem;
        }

        /* Values Section */
        .values-section {
          max-width: 1200px;
          margin: 0 auto;
          padding: 64px 20px;
        }

        .values-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 32px;
          margin-top: 48px;
        }

        .value-item {
          text-align: center;
          padding: 32px 24px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.08);
          transition: all 0.3s ease;
        }

        .value-item:hover {
          transform: translateY(-10px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.15);
        }

        .value-emoji {
          font-size: 3.5rem;
          margin-bottom: 16px;
        }

        .value-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 12px;
          color: #1f2937;
        }

        .value-description {
          color: #6b7280;
          font-size: 1rem;
        }

        /* CTA Section */
        .cta-section {
          background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
          color: white;
          padding: 80px 20px;
          text-align: center;
        }

        .cta-content {
          max-width: 900px;
          margin: 0 auto;
        }

        .cta-title {
          font-size: 2.5rem;
          font-weight: bold;
          margin-bottom: 24px;
        }

        .cta-description {
          font-size: 1.35rem;
          margin-bottom: 40px;
          opacity: 0.95;
        }

        .cta-buttons {
          display: flex;
          justify-content: center;
          gap: 20px;
          flex-wrap: wrap;
        }

        .btn-primary {
          background: white;
          color: #3b82f6;
          padding: 16px 40px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 1.1rem;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }

        .btn-primary:hover {
          background: #f0f9ff;
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.3);
        }

        .btn-secondary {
          background: transparent;
          color: white;
          padding: 16px 40px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 1.1rem;
          border: 3px solid white;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-secondary:hover {
          background: white;
          color: #3b82f6;
          transform: translateY(-3px);
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }
          
          .hero-description {
            font-size: 1.1rem;
          }
          
          .section-title {
            font-size: 2rem;
          }
          
          .stat-number {
            font-size: 2.5rem;
          }
        }
      `}</style>

      <div className="about-container">
        {/* Hero Section */}
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

        {/* Specializations Section */}
        <div className="specializations-section">
          <div className="specializations-content">
            <h2 className="section-title">Our Specializations</h2>
            <div className="specializations-grid">
              {specializations.map((spec, index) => (
                <div key={index} className="specialization-item">
                  <p className="specialization-text">{spec}</p>
                </div>
              ))}
            </div>
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

        {/* Call to Action */}
        <div className="cta-section">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Experience Quality Healthcare?</h2>
            <p className="cta-description">
              Join thousands of satisfied patients who trust us with their health
            </p>
            <div className="cta-buttons">
              <button className="btn-primary">Register Now</button>
              <button className="btn-secondary">Contact Us</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}