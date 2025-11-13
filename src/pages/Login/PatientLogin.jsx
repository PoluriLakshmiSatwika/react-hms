import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./PatientLoginPage.css";

const PatientLoginPage = () => {
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
    if (!formData.email) {
      newErrors.email = 'Patient email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Handle form change
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
const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  setIsLoading(true);
  setErrors({});

  try {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/patient/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: formData.email, password: formData.password }),
    });

    const data = await res.json();
    console.log("Login response:", data);

    if (data.success) {
      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "patient",
        JSON.stringify({
          id: data.patient._id,
          fullName: data.patient.fullName,
          email: data.patient.email,
          phone: data.patient.phone,
          age: data.patient.age,
          gender: data.patient.gender,
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


  // // ✅ Handle submit
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!validateForm()) return;

  //   setIsLoading(true);
  //   setErrors({}); // clear previous errors

  //   try {
  //     const res = await fetch(`${process.env.REACT_APP_API_URL}/api/patient/login`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         email: formData.email,
  //         password: formData.password
  //       }),
  //     });

  //     const data = await res.json();

  //     if (res.ok) {
  //       // ✅ Successful login
  //       // Save patient ID and name in localStorage
      
  //       alert("✅ " + data.message);
  //       navigate("/dashboard/appointment");
  //       //navigate("/dashboard/patient");
  //     } else {
  //       // ❌ Invalid login
  //       setErrors({ submit: data.message });
  //     }

  //   } catch (error) {
  //     console.error("Login error:", error);
  //     setErrors({ submit: "Server error. Try again later." });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return (
    <div className="patient-login-container">
      <div className="patient-login-card">
        <div className="login-header">
          <div className="role-icon patient-icon">👤</div>
          <div className="header-text">
            <h1>Patient Login</h1>
            <p>Access your medical records and appointments</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Patient Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "error" : ""}
              placeholder="Enter patient email"
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
                        'Patient Sign In'
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
          
export default PatientLoginPage;
