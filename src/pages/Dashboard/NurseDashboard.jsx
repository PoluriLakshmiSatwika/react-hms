// // NurseDashboard.jsx


// NurseDashboard.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./NurseDashboard.css";

const NurseDashboard = () => {
  const navigate = useNavigate();

  // Load nurse info from localStorage
  const nurse = JSON.parse(localStorage.getItem("nurse")) || {};
  const nurseName = nurse.fullName;

  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });

  const token = localStorage.getItem("token");
  console.log("Token in dashboard:", token);

  // ====================== Notifications ======================
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: "", type: "" }), 2500);
  };

  // ====================== Fetch Assignments ======================
  const fetchAssignments = useCallback(async () => {
    if (!token) return;

    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/nurse/assignments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.success) setAssignments(data.data || []);
      else setAssignments([]);
    } catch (err) {
      console.error("FETCH ERROR:", err);
      setAssignments([]);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  // ====================== Auto Fetch on Mount ======================
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetchAssignments();
  }, [navigate, fetchAssignments, token]);

  // ====================== Accept Assignment ======================
  const handleAcceptAssignment = async (id) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/nurse/assignments/${id}/accept`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!data.success) {
        return showNotification(data.message || "Failed to accept assignment", "error");
      }

      showNotification("👍 Appointment accepted!", "success");
      fetchAssignments(); // refresh assignments
    } catch (err) {
      console.error(err);
      showNotification("Server error while accepting assignment", "error");
    }
  };

  // ====================== Complete Assignment ======================
  const handleCompleteAssignment = async (id) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/nurse/assignments/${id}/complete`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (!data.success)
        return showNotification(data.message || "Failed to complete assignment", "error");

      showNotification("✔ Appointment completed", "success");
      fetchAssignments();
    } catch (err) {
      console.error(err);
      showNotification("Server error while completing assignment", "error");
    }
  };

  // ====================== Logout ======================
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("nurse");
    navigate("/login");
  };

  // ====================== UI ======================
  return (
    <div className="nurse-dashboard">
      {notification.message && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      {/* HEADER */}
      <header className="dashboard-header">
        <h1>👩‍⚕️ Nurse Dashboard — {nurseName}</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>

      {/* CONTROLS */}
      <div className="dashboard-controls">
        <button className="refresh-btn" onClick={fetchAssignments}>
          🔄 Refresh
        </button>
      </div>

      {/* ASSIGNMENTS */}
      <main className="assignments-section">
        <h2>Assigned Appointments</h2>

        {isLoading ? (
          <p className="loading">Loading...</p>
        ) : assignments.length === 0 ? (
          <p className="no-assignments">No assignments yet.</p>
        ) : (
          <div className="assignments-list">
            {assignments.map((a) => (
              <div key={a._id} className="assignment-card">
                <p>
                  <strong>Patient:</strong> {a.patientId?.fullName || a.patientName || "Unknown"}
                </p>
                <p>
                  <strong>Time:</strong> {a.time}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span className={`status ${a.status?.toLowerCase() || "pending"}`}>
                    {a.status || "Pending"}
                  </span>
                </p>
                <div className="assignment-actions">
                  {a.status === "Pending" || !a.status ? (
                    <button
                      className="accept-btn"
                      onClick={() => handleAcceptAssignment(a._id)}
                    >
                      Accept
                    </button>
                  ) : a.status === "Accepted" ? (
                    <button
                      className="complete-btn"
                      onClick={() => handleCompleteAssignment(a._id)}
                    >
                      Complete
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default NurseDashboard;

