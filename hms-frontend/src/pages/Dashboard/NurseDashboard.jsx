import React from "react";

const NurseDashboard = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h2>Nurse Dashboard</h2>
      <p>View assigned patients and update vital information.</p>
      <button>Assigned Wards</button>
      <button>Patient Vitals</button>
      <button>Shift Schedule</button>
    </div>
  );
};

export default NurseDashboard;
