import React from "react";
import { useNavigate } from "react-router-dom";

const RoleSelectionPage = () => {
  const navigate = useNavigate();
  const roles = ["Admin", "Doctor", "Nurse", "Patient"];

  return (
    <div style={{ textAlign: "center", marginTop: "80px" }}>
      <h2>Select Your Role to Register</h2>
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
            key={role}
            onClick={() => navigate(`/register/${role.toLowerCase()}`)}
            style={{
              padding: "15px 25px",
              background: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            {role}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RoleSelectionPage;
