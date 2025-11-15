// Nurse login updated
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

  // ✅ Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) newErrors.email = "Nurse email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // ✅ Submit login
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/nurse/login`,{
        
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await res.json();
      console.log("Login response:", data);

      if (data.success) {
        // ⭐ Save Nurse info
        localStorage.setItem(
          "nurse",
          JSON.stringify({
            id: data.nurse.id,
            fullName: data.nurse.fullName,
            email: data.nurse.email,
            department: data.nurse.department,
            phone: data.nurse.phone,
            shiftTiming: data.nurse.shiftTiming,
          })
        );

        // ⭐ FIX: Save JWT token (important for dashboard)
        localStorage.setItem("token", data.token);

        alert("Nurse login successful");

        navigate("/dashboard/nurse");
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

          <div className="form-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              <span className="checkmark"></span> Remember me
            </label>

            <Link to="/forgot-password" className="forgot-password">
              Forgot Password?
            </Link>
          </div>

          {errors.submit && (
            <div className="submit-error">{errors.submit}</div>
          )}

          <button type="submit" className="login-button admin-button" disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="spinner"></div> Signing In...
              </>
            ) : (
              "Nurse Sign In"
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>
            <Link to="/">← Back to Home</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NurseLoginPage;
