import React from "react";

const PatientDashboard = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h2>Patient Dashboard</h2>
      <p>Manage appointments and view medical records.</p>
      <button>Book Appointment</button>
      <button>View Prescriptions</button>
      <button>Medical History</button>
    </div>
  );
};

export default PatientDashboard;
