import React, { useState } from "react";
import FileUpload from "../../components/FileUpload";

const NurseRegister = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    shift: "",
    password: "",
    idProof: null,
    certificate: null,
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFile = (name, file) =>
    setForm({ ...form, [name]: file });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Nurse registration data:", form);
    alert("Nurse registration submitted for approval!");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h2>Nurse Registration</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Full Name" onChange={handleChange} required />
        <br />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <br />
        <input name="phone" placeholder="Phone" onChange={handleChange} required />
        <br />
        <input name="department" placeholder="Department" onChange={handleChange} required />
        <br />
        <input name="shift" placeholder="Shift (Day/Night)" onChange={handleChange} required />
        <br />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        <br />
        <FileUpload label="Upload ID Proof" onFileSelect={(f) => handleFile("idProof", f)} />
        <FileUpload label="Upload Nursing Certificate" onFileSelect={(f) => handleFile("certificate", f)} />
        <button type="submit" className="btn">Submit for Approval</button>
      </form>
    </div>
  );
};

export default NurseRegister;
