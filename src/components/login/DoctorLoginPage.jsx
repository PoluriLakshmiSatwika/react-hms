// DoctorLoginPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './DoctorLoginPage.css';

import API_BASE_URL from "../../api/apiConfig";

const DoctorLoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Doctor email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };



const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) return;
  setIsLoading(true);
  setErrors({});

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        role: "doctor",  // change to "doctor", "nurse", or "patient" for other pages
        email: formData.email,
        password: formData.password,
      }),
    });

    const data = await response.json();

    if (data.success) {
      localStorage.setItem("token", data.token);
      console.log("✅ Login successful:", data);
      navigate(`/doctor/dashboard`);
    } else {
      setErrors({ submit: data.message || "Invalid credentials" });
    }
  } catch (error) {
    console.error("❌ Login Error:", error);
    setErrors({ submit: "Unable to connect to backend server." });
  } finally {
    setIsLoading(false);
  }
};


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="doctor-login-container">
      <div className="doctor-login-card">
        <div className="login-header">
          <div className="role-icon doctor-icon">
            👨‍⚕️
          </div>
          <div className="header-text">
            <h1>Doctor Login</h1>
            <p>Access medical dashboard and appointments</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Doctor Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              placeholder="Enter doctor email"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
              placeholder="Enter your password"
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              <span className="checkmark"></span>
              Remember me
            </label>
            <a href="/forgot-password" className="forgot-password">
              Forgot Password?
            </a>
          </div>

          {errors.submit && (
            <div className="submit-error">{errors.submit}</div>
          )}

          <button 
            type="submit" 
            className="login-button doctor-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="spinner"></div>
                Signing In...
              </>
            ) : (
              'Doctor Sign In'
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Not a doctor? <Link to="/login/select">Select different role</Link>
          </p>
          <p>
            <Link to="/">← Back to Home</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default DoctorLoginPage;