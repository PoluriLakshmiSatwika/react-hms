import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./NurseLoginPage.css";

const NurseLoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Nurse email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
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
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/nurse/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();
if (res.ok) {
  // Store nurse info if needed
  localStorage.setItem("nurseId", data.nurseId);
  localStorage.setItem("role", data.role);

  navigate("/dashboard/nurse"); // Redirect to nurse dashboard
} else {
  setErrors({ submit: data.message || "Invalid credentials." });
}
    } catch (error) {
      console.error("Login error:", error);
      setErrors({
        submit: "Unable to connect to server. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className="nurse-login-container">
      <div className="nurse-login-card">
        <div className="login-header">
          <div className="role-icon nurse-icon">👩‍⚕️</div>
          <div className="header-text">
            <h1>Nurse Login</h1>
            <p>Access nursing dashboard and assignments</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Nurse Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "error" : ""}
              placeholder="Enter nurse email"
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? "error" : ""}
              placeholder="Enter your password"
            />
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          {/* Remember me / forgot */}
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
                      <Link to="/forgot-password" className="forgot-password">
                        Forgot Password?
                      </Link>
                    </div>
          
                    {/* Submit error */}
                    {errors.submit && (
                      <div className="submit-error">{errors.submit}</div>
                    )}
          
                    {/* Submit button */}
                    <button 
                      type="submit" 
                      className="login-button admin-button"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <div className="spinner"></div>
                          Signing In...
                        </>
                      ) : (
                        'Admin Sign In'
                      )}
                    </button>
                  </form>
          
                  <div className="login-footer">
                    <p><Link to="/">← Back to Home</Link></p>
                  </div>
                </div>
              </div>
            );
          };
          
export default NurseLoginPage;
