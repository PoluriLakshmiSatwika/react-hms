import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./DoctorLogin.css";

const DoctorLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Doctor email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Input
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

  // Submit Login
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/doctor/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();
      console.log("Login response:", data);

      if (data.success) {
        localStorage.setItem("token", data.token);

        // FIXED: Save correct doctor details
        localStorage.setItem(
          "doctor",
          JSON.stringify({
            id: data.doctor.id,
            fullName: data.doctor.fullName,
            email: data.doctor.email,
            phone: data.doctor.phone,
            department: data.doctor.department,
            specialty: data.doctor.specialty,
          })
        );

        alert("✅ " + data.message);
        navigate("/dashboard/appointment");
      } else {
        setErrors({ submit: data.message || "Invalid credentials" });
      }
    } catch (err) {
      console.error("Login error:", err);
      setErrors({ submit: "Server error. Try again later." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="doctor-login-container">
      <div className="doctor-login-card">
        <div className="login-header">
          <div className="role-icon doctor-icon">👩‍⚕️</div>
          <div className="header-text">
            <h1>Doctor Login</h1>
            <p>Access Doctor dashboard and assignments</p>
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
              className={errors.email ? "error" : ""}
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
              className={errors.password ? "error" : ""}
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
            <Link to="/forgot-password" className="forgot-password">
              Forgot Password?
            </Link>
          </div>

          {errors.submit && <div className="submit-error">{errors.submit}</div>}

          <button type="submit" className="login-button admin-button" disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="spinner"></div> Signing In...
              </>
            ) : (
              "Doctor Sign In"
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

export default DoctorLogin;
