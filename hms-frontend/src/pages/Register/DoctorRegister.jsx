import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import navigate hook
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBuilding,
  FaKey,
  FaStethoscope,
} from "react-icons/fa";
import "./DoctorRegistration.css";

const DoctorRegistrationForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    specialty: "",
    department: "",
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
    temp.specialty = fields.specialty ? "" : "Specialty required.";
    temp.department = fields.department ? "" : "Department required.";
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

  function handleConfirm() {
    setShowConfirm(false);
    alert("Doctor registered successfully!");
    navigate("/dashboard/doctor");
  }

  return (
    <div className="doctor-register-container">
      <h2 className="form-title">Doctor Registration</h2>
      <form className="doctor-form" onSubmit={handleSubmit}>
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
          <FaStethoscope className="form-icon" />
          <input
            name="specialty"
            placeholder="Specialty"
            value={form.specialty}
            onChange={handleChange}
          />
        </div>
        <div className="errorMsg">{errors.specialty}</div>

        <div className="input-group">
          <FaBuilding className="form-icon" />
          <input
            name="department"
            placeholder="Department"
            value={form.department}
            onChange={handleChange}
          />
        </div>
        <div className="errorMsg">{errors.department}</div>

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
              <p>You're registering as a Doctor. Proceed?</p>
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

export default DoctorRegistrationForm;