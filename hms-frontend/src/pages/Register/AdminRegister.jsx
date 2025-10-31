import React, { useState } from "react";

const AdminRegister = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    password: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Admin registration data:", form);
    alert("Admin registered successfully!");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h2>Admin Registration</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Full Name" onChange={handleChange} required />
        <br />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <br />
        <input name="phone" placeholder="Phone" onChange={handleChange} required />
        <br />
        <input name="department" placeholder="Department" onChange={handleChange} required />
        <br />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        <br />
        <button type="submit" className="btn">Register</button>
      </form>
    </div>
  );
};

export default AdminRegister;
