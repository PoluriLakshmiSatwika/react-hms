import "./NurseRegistration.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBuilding,
  FaKey,
  FaClock,
  FaIdCard,
} from "react-icons/fa";

const NurseRegistrationForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    department: "",
    shiftTiming: "",
    password: "",
    uploadId: null,
  });
  const [errors, setErrors] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);

  const validate = () => {
    let temp = {};
    temp.fullName = form.fullName ? "" : "Name is required.";
    temp.email = form.email
      ? /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)
        ? ""
        : "Invalid email."
      : "Email required.";
    temp.phone = form.phone
      ? /^\d{10}$/.test(form.phone)
        ? ""
        : "Phone must be 10 digits."
      : "Phone required.";
    temp.department = form.department ? "" : "Department required.";
    temp.shiftTiming = form.shiftTiming ? "" : "Shift timing required.";
    temp.password = form.password
      ? form.password.length >= 6
        ? ""
        : "Password must be 6+ characters."
      : "Password required.";
    temp.uploadId = form.uploadId ? "" : "ID proof required.";

    setErrors(temp);
    return Object.values(temp).every((val) => val === "");
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));

    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) setShowConfirm(true);
  };

  const handleConfirm = async () => {
    const formData = new FormData();
    Object.keys(form).forEach((key) => formData.append(key, form[key]));

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/nurse/register`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Registration failed");

      alert(data.message);
      setShowConfirm(false);
      navigate("/");
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="nurse-register-container">
      <h2 className="form-title">Nurse Registration</h2>
      <form className="nurse-form" onSubmit={handleSubmit}>

        <div className="input-group">
          <FaUser className="form-icon" />
          <input
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
          />
        </div>
        <div className="errorMsg">{errors.fullName}</div>

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
            name="shiftTiming"
            placeholder="Shift Timing"
            value={form.shiftTiming}
            onChange={handleChange}
          />
        </div>
        <div className="errorMsg">{errors.shiftTiming}</div>

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

        <div className="input-group">
          <FaIdCard className="form-icon" />
          <input
            type="file"
            name="uploadId"
            onChange={handleChange}
          />
        </div>
        <div className="errorMsg">{errors.uploadId}</div>

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
