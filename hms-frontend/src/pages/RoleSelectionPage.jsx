import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import HomeContainer from "../components/HomeContainer";
import "./Login/RoleLoginSelection.css";

const RoleSelectionPage = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("");

  const roles = [
    {
      id: "admin",
      title: "Admin",
      description: "Hospital administration and management",
      icon: "👨‍💼",
      color: "#dc3545",
    },
    {
      id: "doctor",
      title: "Doctor",
      description: "Medical practitioners and specialists",
      icon: "👨‍⚕️",
      color: "#007bff",
    },
    {
      id: "nurse",
      title: "Nurse",
      description: "Healthcare nursing staff",
      icon: "👩‍⚕️",
      color: "#28a745",
    },
    {
      id: "patient",
      title: "Patient",
      description: "Patients and their families",
      icon: "👤",
      color: "#6f42c1",
    },
  ];

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
    navigate(`/register/${roleId}`);
  };

  return (
    <HomeContainer>
      <div className="role-selection-container">
        <div className="role-selection-card">
          <div className="selection-section">
            <h2>Select Your Role to Register</h2>
            <p className="section-description">
              Choose your role to access the registration portal
            </p>

            <div className="roles-grid">
              {roles.map((role) => (
                <div
                  key={role.id}
                  className={`role-card ${
                    selectedRole === role.id ? "selected" : ""
                  }`}
                  onClick={() => handleRoleSelect(role.id)}
                  style={{ "--role-color": role.color }}
                >
                  <div
                    className="role-icon"
                    style={{ backgroundColor: role.color }}
                  >
                    {role.icon}
                  </div>
                  <h3>{role.title}</h3>
                  <p>{role.description}</p>
                  <div className="select-indicator">
                    <span>Register →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="footer-links">
            <p>
              Already have an account? <a href="/login">Login here</a>
            </p>
            <p>
              <a href="/">← Back to Home</a>
            </p>
          </div>
        </div>
      </div>
    </HomeContainer>
  );
};

export default RoleSelectionPage;
