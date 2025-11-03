import "./NurseRegistration.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import navigate hook
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBuilding,
  FaKey,
  FaClock,
} from "react-icons/fa";

const NurseRegistrationForm = () => {
  const navigate = useNavigate(); // ✅ Initialize navigate
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    shift: "",
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
    temp.department = fields.department ? "" : "Department required.";
    temp.shift = fields.shift ? "" : "Shift timing required.";
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
    alert("Nurse registered successfully!");
    navigate("/dashboard/nurse");
  }

  return (
    <div className="nurse-register-container">
      <h2 className="form-title">Nurse Registration</h2>
      <form className="nurse-form" onSubmit={handleSubmit}>
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
          <FaClock className="form-icon" />
          <input
            name="shift"
            placeholder="Shift Timing"
            value={form.shift}
            onChange={handleChange}
          />
        </div>
        <div className="errorMsg">{errors.shift}</div>

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
              <p>You're registering as a Nurse. Proceed?</p>
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

export default NurseRegistrationForm;