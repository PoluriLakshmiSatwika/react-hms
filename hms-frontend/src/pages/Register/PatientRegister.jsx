import React, { useState } from "react";

const PatientRegister = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    bloodGroup: "",
    password: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Patient registration data:", form);
    alert("Patient registered successfully!");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h2>Patient Registration</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Full Name" onChange={handleChange} required />
        <br />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <br />
        <input name="phone" placeholder="Phone" onChange={handleChange} required />
        <br />
        <input name="dob" type="date" onChange={handleChange} required />
        <br />
        <input name="bloodGroup" placeholder="Blood Group" onChange={handleChange} required />
        <br />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        <br />
        <button type="submit" className="btn">Register</button>
      </form>
    </div>
  );
};

export default PatientRegister;
