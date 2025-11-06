import "./PatientRegistration.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBirthdayCake,
  FaTint,
  FaNotesMedical,
  FaKey,
} from "react-icons/fa";

const PatientRegistrationForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    bloodGroup: "",
    medicalHistory: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);

  function validate(fields = form) {
    let temp = {};
    temp.name = fields.name ? "" : "Name is required.";
    temp.email = fields.email
      ? /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(fields.email)
        ? ""
        : "Invalid email."
      : "Email required.";
    temp.phone = fields.phone
      ? /^\d{10}$/.test(fields.phone)
        ? ""
        : "Phone must be 10 digits."
      : "Phone required.";
    temp.dob = fields.dob ? "" : "Date of Birth required.";
    temp.bloodGroup = fields.bloodGroup ? "" : "Blood Group required.";
    temp.medicalHistory = fields.medicalHistory ? "" : "Medical History required.";
    temp.password = fields.password
      ? fields.password.length >= 6
        ? ""
        : "Password must be 6+ characters."
      : "Password required.";

    setErrors(temp);
    return Object.values(temp).every((val) => val === "");
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (validate()) setShowConfirm(true);
  }

  async function handleConfirm() {
    setShowConfirm(false);
    try {
      const response = await fetch("http://localhost:8000/api/patient/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Patient registered successfully!");
        navigate("/dashboard/patient");
      } else {
        alert(`❌ ${data.message || "Registration failed"}`);
      }
    } catch (error) {
      console.error("❌ Server error:", error);
      alert("Server error. Please try again later.");
    }
  }

  return (
    <div className="patient-register-container">
      <h2 className="form-title">Patient Registration</h2>
      <form className="patient-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <FaUser className="form-icon" />
          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
          />
        </div>
        <div className="errorMsg">{errors.name}</div>

        <div className="input-group">
          <FaEnvelope className="form-icon" />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />
        </div>
        <div className="errorMsg">{errors.email}</div>

        <div className="input-group">
          <FaPhone className="form-icon" />
          <input
            name="phone"
            placeholder="Phone (10 digits)"
            value={form.phone}
            onChange={handleChange}
          />
        </div>
        <div className="errorMsg">{errors.phone}</div>

        <div className="input-group">
          <FaBirthdayCake className="form-icon" />
          <input
            name="dob"
            type="date"
            placeholder="Date of Birth"
            value={form.dob}
            onChange={handleChange}
          />
        </div>
        <div className="errorMsg">{errors.dob}</div>

        <div className="input-group">
          <FaTint className="form-icon" />
          <input
            name="bloodGroup"
            placeholder="Blood Group"
            value={form.bloodGroup}
            onChange={handleChange}
          />
        </div>
        <div className="errorMsg">{errors.bloodGroup}</div>

        <div className="input-group">
          <FaNotesMedical className="form-icon" />
          <input
            name="medicalHistory"
            placeholder="Medical History"
            value={form.medicalHistory}
            onChange={handleChange}
          />
        </div>
        <div className="errorMsg">{errors.medicalHistory}</div>

        <div className="input-group">
          <FaKey className="form-icon" />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />
        </div>
        <div className="errorMsg">{errors.password}</div>

        <button type="submit" className="btn">Register</button>

        {showConfirm && (
          <div className="confirm-popup">
            <div className="popup-content">
              <h3>Confirm Registration</h3>
              <p>You're registering as a Patient. Proceed?</p>
              <div className="popup-buttons">
                <button type="button" className="confirm" onClick={handleConfirm}>
                  Yes, Register
                </button>
                <button
                  type="button"
                  className="cancel"
                  onClick={() => setShowConfirm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default PatientRegistrationForm;
