import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [pendingStaff, setPendingStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendingStaff = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/admin/pending-staff");
        const data = await res.json();
        setPendingStaff(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching pending staff:", error);
        setPendingStaff([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPendingStaff();
  }, []);

  const handleApprove = async (id) => {
    const res = await fetch(`http://localhost:8000/api/admin/approve/${id}`, {
      method: "POST",
    });
    const data = await res.json();
    alert(data.message);
    setPendingStaff((prev) => prev.filter((staff) => staff._id !== id));
  };

  const handleReject = async (id) => {
    const res = await fetch(`http://localhost:8000/api/admin/reject/${id}`, {
      method: "POST",
    });
    const data = await res.json();
    alert(data.message);
    setPendingStaff((prev) => prev.filter((staff) => staff._id !== id));
  };

  if (loading) {
    return <p style={{ textAlign: "center", marginTop: "20px" }}>Loading pending staff...</p>;
  }

  return (
    <div className="admin-dashboard-container">
      <h2>Pending Staff</h2>
      {pendingStaff.length === 0 ? (
        <p style={{ textAlign: "center", marginTop: "20px" }}>No pending staff at the moment.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Department</th>
              <th>Shift / Specialization</th>
              <th>ID Proof</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingStaff.map((staff) => (
              <tr key={staff._id}>
                <td>{staff.fullName}</td>
                <td>{staff.email}</td>
                <td>{staff.role}</td>
                <td>{staff.department}</td>
                <td>{staff.role === "nurse" ? staff.shiftTiming : staff.specialization}</td>
                <td>
                  {staff.uploadId ? (
                    <a
                      href={`http://localhost:8000/${staff.uploadId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View ID
                    </a>
                  ) : (
                    "No file"
                  )}
                </td>
                <td>
                  <button onClick={() => handleApprove(staff._id)}>Approve</button>
                  <button onClick={() => handleReject(staff._id)}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};


export default AdminDashboard;
