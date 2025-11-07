import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ForgotPassword.css';
import API_BASE_URL from "../../api/apiConfig";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('admin'); // default role, can change dynamically
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setError('');

    try {
      // ✅ Call backend API for forgot-password
      const response = await fetch(`${API_BASE_URL}/api/password/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage('✅ Reset link sent! Check your email inbox.');
      } else {
        setError(`❌ ${data.message || 'Failed to send reset link.'}`);
      }
    } catch (err) {
      console.error('Forgot Password Error:', err);
      setError('⚠️ Unable to connect to the backend server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <div className="password-header">
          <h1>Forgot Password?</h1>
          <p>Enter your registered email to reset your password</p>
        </div>

        <form onSubmit={handleSubmit} className="password-form">
          <div className="form-group">
            <label htmlFor="role">Select Role</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="role-select"
              required
            >
              <option value="admin">Admin</option>
              <option value="doctor">Doctor</option>
              <option value="nurse">Nurse</option>
              <option value="patient">Patient</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your registered email"
              required
            />
          </div>

          {message && <div className="success-message">{message}</div>}
          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="password-footer">
          <p>Remember your password? <Link to="/login/select">Sign In</Link></p>
          <p><Link to="/">← Back to Home</Link></p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
