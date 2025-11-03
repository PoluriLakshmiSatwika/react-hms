import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import navigation hook
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate(); // ✅ Initialize navigation

  const [pendingStaff, setPendingStaff] = useState([
    {
      id: 1,
      name: "Dr. Ramesh Kumar",
      email: "ramesh@example.com",
      phone: "9876543210",
      department: "Cardiology",
      certificate: "/uploads/dr_ramesh_certificate.pdf",
      type: "Doctor",
    },
    {
      id: 2,
      name: "Nurse Priya Sharma",
      email: "priya@example.com",
      phone: "9123456789",
      department: "Emergency",
      certificate: "/uploads/priya_id.jpg",
      type: "Nurse",
    },
  ]);

  const handleApprove = (id) => {
    alert(`✅ Approved staff ID ${id} — moved to main staff database.`);
    setPendingStaff((prev) => prev.filter((staff) => staff.id !== id));
  };

  const handleReject = (id) => {
    alert(`❌ Rejected staff ID ${id}.`);
    setPendingStaff((prev) => prev.filter((staff) => staff.id !== id));
  };

  // ✅ Logout function (redirects to role login)
  const handleLogout = () => {
    alert("You have been logged out successfully.");
    navigate("/login"); // ✅ Redirects to Role Login page
  };

  return (
    <div className="admin-dashboard">
      {/* ✅ Header with Logout Button */}
      <header className="dashboard-header">
        <h2>🧑‍💼 Admin Dashboard - Pending Staff Registrations</h2>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </header>

      <table className="staff-table">
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Department</th>
            <th>ID / Certificate</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pendingStaff.length > 0 ? (
            pendingStaff.map((staff) => (
              <tr key={staff.id}>
                <td>{staff.name}</td>
                <td>{staff.email}</td>
                <td>{staff.phone}</td>
                <td>{staff.department}</td>
                <td>
                  {staff.certificate.endsWith(".pdf") ? (
                    <a
                      href={staff.certificate}
                      target="_blank"
                      rel="noreferrer"
                      className="view-link"
                    >
                      View PDF
                    </a>
                  ) : (
                    <img
                      src={staff.certificate}
                      alt="certificate"
                      className="certificate-preview"
                    />
                  )}
                </td>
                <td>
                  <button
                    className="approve-btn"
                    onClick={() => handleApprove(staff.id)}
                  >
                    ✅ Approve
                  </button>
                  <button
                    className="reject-btn"
                    onClick={() => handleReject(staff.id)}
                  >
                    ❌ Reject
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="no-records">
                No pending registrations 🎉
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
