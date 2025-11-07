import React, { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBuilding,
  FaKey,
  FaLevelUpAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // ✅ Import navigation hook
import "./AdminRegister.css";

const AdminRegister = () => {
  const navigate = useNavigate(); // ✅ Initialize navigation

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    accessLevel: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
 

  // ✅ Validation
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
    temp.accessLevel = fields.accessLevel ? "" : "Access Level required.";
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
  async function handleSubmit(e) {
  e.preventDefault();
  if (!validate()) return;

  try {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      alert("✅ " + data.message);
      navigate("/dashboard/admin"); // redirect on success
    } else {
      alert("❌ " + data.message);
    }
  } catch (error) {
    console.error("Registration failed:", error);
    alert("Server error. Try again later.");
  }
}

/*  function handleSubmit(e) {
    e.preventDefault();
    if (validate()) setShowConfirm(true);
  }

  // ✅ Handle Confirm — Redirect to Dashboard
  function handleConfirm() {
    setShowConfirm(false);
    alert("✅ Admin registered successfully!");
    navigate("/dashboard/admin"); // ✅ Redirect to Admin Dashboard
  }*/

  return (
    <div className="admin-register-container">
      <h2 className="form-title">Admin Registration</h2>
      <form className="admin-form" onSubmit={handleSubmit}>
        {/* Name */}
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

        {/* Email */}
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

        {/* Phone */}
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

        {/* Department */}
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

        {/* Access Level */}
        <div className="input-group">
          <FaLevelUpAlt className="form-icon" />
          <input
            name="accessLevel"
            placeholder="Access Level"
            value={form.accessLevel}
            onChange={handleChange}
          />
        </div>
        <div className="errorMsg">{errors.accessLevel}</div>

        {/* Password */}
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

        <button type="submit" className="btn">
          Register
        </button>

        
            
          
      </form>
    </div>
  );
};

export default AdminRegister;
