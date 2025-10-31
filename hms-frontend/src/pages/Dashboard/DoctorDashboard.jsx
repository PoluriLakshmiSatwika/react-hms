import React from "react";

const DoctorDashboard = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h2>Doctor Dashboard</h2>
      <p>View patients, update records, and write prescriptions.</p>
      <button>My Patients</button>
      <button>Appointments</button>
      <button>Prescriptions</button>
    </div>
  );
};

export default DoctorDashboard;
