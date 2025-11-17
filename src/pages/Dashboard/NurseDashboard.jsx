import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./NurseDashboard.css";

const NurseDashboard = () => {
  const navigate = useNavigate();
  const nurse = JSON.parse(localStorage.getItem("nurse")); 
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState("");

  const fetchAssignments = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/nurse/assignments/${nurse._id}`);
      const data = await res.json();
      if (data.success) setAssignments(data.assignments);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setNotification("Error fetching assignments");
      setLoading(false);
    }
  }, [nurse._id]);

  useEffect(() => {
    if (!nurse) navigate("/login");
    else fetchAssignments();
  }, [nurse, fetchAssignments, navigate]);

  const acceptAssignment = async (assignmentId) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/nurse/assignments/${assignmentId}/accept`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setNotification("Assignment accepted!");
        setAssignments((prev) =>
          prev.map((a) =>
            a._id === assignmentId ? { ...a, status: "accepted" } : a
          )
        );
      }
    } catch (err) {
      console.error(err);
      setNotification("Failed to accept assignment");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("nurse");
    navigate("/login");
  };

  return (
    <div className="nurse-dashboard">
      {notification && <div className="notification">{notification}</div>}

      <header className="dashboard-header">
        <h1>👩‍⚕️ Nurse Dashboard — {nurse?.fullName}</h1>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </header>

      {loading ? (
        <p>Loading assignments...</p>
      ) : (
        <table className="assignments-table">
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Disease</th>
              <th>Appointment Date</th>
              <th>Slot Time</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {assignments.length === 0 ? (
              <tr><td colSpan="8">No assignments yet.</td></tr>
            ) : assignments.map((a) => (
              <tr key={a._id}>
                <td>{a.patientId?.fullName}</td>
                <td>{a.patientId?.email}</td>
                <td>{a.patientId?.phone}</td>
                <td>{a.disease}</td>
                <td>{new Date(a.appointmentDate).toLocaleDateString()}</td>
                <td>{a.slotTime}</td>
                <td>{a.status}</td>
                <td>
                  {a.status !== "accepted" && <button onClick={() => acceptAssignment(a._id)} className="accept-btn">Accept</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default NurseDashboard;
