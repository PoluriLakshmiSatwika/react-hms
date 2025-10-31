import React from "react";
import { useNavigate } from "react-router-dom";

const RoleLoginSelection = () => {
  const navigate = useNavigate();

  const roles = [
    { name: "Admin", path: "/login/admin" },
    { name: "Doctor", path: "/login/doctor" },
    { name: "Nurse", path: "/login/nurse" },
    { name: "Patient", path: "/login/patient" },
  ];

  return (
    <div style={{ textAlign: "center", marginTop: "80px" }}>
      <h2>Select Your Role to Login</h2>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "25px",
          flexWrap: "wrap",
          marginTop: "40px",
        }}
      >
        {roles.map((role) => (
          <button
            key={role.name}
            onClick={() => navigate(role.path)}
            style={{
              padding: "15px 25px",
              background: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
              minWidth: "150px",
            }}
          >
            {role.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RoleLoginSelection;
