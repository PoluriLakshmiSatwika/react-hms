import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const PatientLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = { email, role: "patient", token: "patient123" };
    login(userData);
    navigate("/dashboard/patient");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "60px" }}>
      <h2>Patient Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)} required />
        <br />
        <input type="password" placeholder="Password" value={password}
          onChange={(e) => setPassword(e.target.value)} required />
        <br />
        <button type="submit" className="btn">Login</button>
      </form>
    </div>
  );
};

export default PatientLogin;
