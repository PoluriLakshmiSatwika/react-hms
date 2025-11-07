import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import './ForgotPassword.css';
import API_BASE_URL from "../../api/apiConfig";

const ResetPasswordPage = () => {
  const { token } = useParams(); // get token from URL path (e.g., /reset-password/:token)
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState('');

  // Redirect if no token is present
  useEffect(() => {
    if (!token) {
      navigate('/login/select', { replace: true });
    }
  }, [token, navigate]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    setIsLoading(true);
    setErrors({});
    setSuccessMsg('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/password/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword: formData.newPassword })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessMsg('✅ Password reset successful! Redirecting to login...');
        setTimeout(() => navigate('/login/select'), 2500);
      } else {
        setErrors({ submit: data.message || 'Failed to reset password' });
      }
    } catch (error) {
      console.error('Reset Password Error:', error);
      setErrors({ submit: '❌ Unable to connect to backend server.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <div className="password-header">
          <h1>Reset Password</h1>
          <p>Create your new password</p>
        </div>

        <form onSubmit={handleSubmit} className="password-form">
          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className={errors.newPassword ? 'error' : ''}
              placeholder="Enter new password"
            />
            {errors.newPassword && (
              <span className="error-message">{errors.newPassword}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? 'error' : ''}
              placeholder="Confirm new password"
            />
            {errors.confirmPassword && (
              <span className="error-message">{errors.confirmPassword}</span>
            )}
          </div>

          {errors.submit && <div className="error-message">{errors.submit}</div>}
          {successMsg && <div className="success-message">{successMsg}</div>}

          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <div className="password-footer">
          <p><Link to="/login/select">← Back to Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
