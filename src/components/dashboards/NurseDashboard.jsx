// NurseDashboard.jsx
import React, { useState, useEffect, useCallback } from "react";
import "./NurseDashboard.css";
const NurseDashboard = () => {
  const API_BASE = process.env.REACT_APP_API_URL || ""; // ex: https://react-hms-backend.onrender.com
  const [available, setAvailable] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ message: "", type: "" });

  // fetch assignments from backend
  const fetchAssignments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/nurse/assignments`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error(`API ${res.status}`);
      const data = await res.json();
      // Expecting array in data.data or data (adjust if backend differs)
      const list = data?.data || data || [];
      setAssignments(Array.isArray(list) ? list : []);
    } catch (err) {
      // fallback: show mock so UI still works
      console.warn("Failed to load assignments:", err);
      setError("Failed to fetch assignments (showing mock data).");
      setAssignments([
        { _id: "m1", patientName: "John Doe", time: "09:00 AM", room: "101", status: "pending" },
        { _id: "m2", patientName: "Jane Smith", time: "10:30 AM", room: "203", status: "pending" }
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [API_BASE]);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  // show small notification
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: "", type: "" }), 3000);
  };

  // toggle nurse availability (calls backend)
  const handleToggleAvailability = async () => {
    const newVal = !available;
    setAvailable(newVal); // optimistic UI
    try {
      await fetch(`${API_BASE}/api/nurse/availability`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ available: newVal }),
        credentials: "include",
      });
      showNotification(`You are now ${newVal ? "available" : "unavailable"}`, "success");
    } catch (err) {
      console.error("Availability update failed:", err);
      setAvailable(!newVal); // revert
      showNotification("Failed to update availability", "error");
    }
  };

  // accept assignment (marks accepted and optionally call backend)
  const handleAcceptAssignment = async (id) => {
    try {
      // optimistic update
      setAssignments(prev => prev.map(a => a._id === id ? { ...a, status: "accepted" } : a));

      const res = await fetch(`${API_BASE}/api/nurse/assignments/${id}/accept`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error(`API ${res.status}`);
      }
      showNotification("Assignment accepted", "success");
    } catch (err) {
      console.error("Accept failed:", err);
      // revert if error
      setAssignments(prev => prev.map(a => a._id === id ? { ...a, status: "pending" } : a));
      showNotification("Failed to accept assignment", "error");
    }
  };

  // mark a single assignment as completed (optional endpoint)
  const handleCompleteAssignment = async (id) => {
    try {
      setAssignments(prev => prev.map(a => a._id === id ? { ...a, status: "completed" } : a));
      await fetch(`${API_BASE}/api/nurse/assignments/${id}/complete`, { method: "PUT", credentials: "include" });
      showNotification("Marked completed", "success");
    } catch (err) {
      console.error(err);
      showNotification("Failed to mark completed", "error");
    }
  };

  return (
    <div className="nurse-dashboard">
      {notification.message && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <header className="dashboard-header">
        <h1>👩‍⚕️ Nurse Dashboard</h1>
        <div>
          <button
            onClick={() => { window.location.href = "/login"; }}
            className="logout-btn"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-controls">
        <button
          className={`availability-btn ${available ? "available" : "unavailable"}`}
          onClick={handleToggleAvailability}
          disabled={isLoading}
        >
          {available ? "✅ Available" : "🚫 Not Available"}
        </button>

        <button onClick={fetchAssignments} className="refresh-btn">
          Refresh
        </button>
      </div>

      <main className="assignments-section">
        <h2>Assigned Appointments</h2>
        {error && <div className="error-message">{error}</div>}

        {isLoading ? (
          <div className="loading">Loading assignments...</div>
        ) : assignments.length === 0 ? (
          <p className="no-assignments">No assignments yet.</p>
        ) : (
          <div className="assignments-list">
            {assignments.map((assignment) => (
              <div key={assignment._id} className="assignment-card">
                <div className="assignment-info">
                  <p><strong>Patient:</strong> {assignment.patientName || assignment.patient?.fullName}</p>
                  <p><strong>Time:</strong> {assignment.time || assignment.appointmentDate}</p>
                  <p><strong>Room:</strong> {assignment.room || assignment.location || "-"}</p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span className={`status ${assignment.status || "pending"}`}>
                      {assignment.status || "pending"}
                    </span>
                  </p>
                </div>

                <div className="assignment-actions">
                  {assignment.status === "pending" && (
                    <button className="accept-btn" onClick={() => handleAcceptAssignment(assignment._id)}>
                      Accept
                    </button>
                  )}

                  {assignment.status === "accepted" && (
                    <>
                      <button className="complete-btn" onClick={() => handleCompleteAssignment(assignment._id)}>
                        Mark Completed
                      </button>
                    </>
                  )}
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
