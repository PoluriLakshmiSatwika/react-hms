import React from "react";

const AdminDashboard = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h2>Admin Dashboard</h2>
      <p>Manage Doctors, Nurses, and Patients.</p>
      <button>View Registrations</button>
      <button>Approve Doctors/Nurses</button>
      <button>Manage Appointments</button>
    </div>
  );
};

export default AdminDashboard;
