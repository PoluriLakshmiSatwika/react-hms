import React, { useState, useEffect, useCallback } from "react";
import "./NurseDashboard.css";
import API_BASE_URL from "../../api/apiConfig";

const NurseDashboard = () => {
  const nurseId = localStorage.getItem("nurseId");
  const nurseName = localStorage.getItem("nurseName");

  const [available, setAvailable] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({
    message: "",
    type: "",
  });

  // ==========================
  // FETCH ASSIGNMENTS
  // ==========================
  const fetchAssignments = useCallback(async () => {
    if (!nurseId) {
      setError("No nurseId found. Please login again.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/nurse/assignments?nurseId=${nurseId}`,
        { credentials: "include" }
      );

      if (!res.ok) throw new Error(`API Error: ${res.status}`);

      const data = await res.json();
      setAssignments(data?.data || []);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Failed to fetch assignments.");
    } finally {
      setIsLoading(false);
    }
  }, [nurseId]);

  // Load once
  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  // 🔄 Auto-refresh every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchAssignments();
    }, 3000);

    return () => clearInterval(interval);
  }, [fetchAssignments]);

  // ==========================
  // NOTIFICATION
  // ==========================
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: "", type: "" }), 3000);
  };

  // ==========================
  // TOGGLE AVAILABILITY
  // ==========================
  const handleToggleAvailability = async () => {
    const newState = !available;
    setAvailable(newState);

    try {
      await fetch(`${API_BASE_URL}/api/nurse/availability`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nurseId, available: newState }),
      });

      showNotification(
        newState ? "You are now available" : "You are now unavailable"
      );
    } catch (err) {
      console.error(err);
      setAvailable(!newState);
      showNotification("Failed to update availability", "error");
    }
  };

  // ==========================
  // ACCEPT ASSIGNMENT
  // ==========================
  const handleAcceptAssignment = async (id) => {
    try {
      await fetch(`${API_BASE_URL}/api/nurse/assignments/${id}/accept`, {
        method: "PUT",
      });

      showNotification("Assignment Confirmed");
      fetchAssignments();
    } catch (err) {
      showNotification("Failed to confirm assignment", "error");
    }
  };

  // ==========================
  // COMPLETE ASSIGNMENT
  // ==========================
  const handleCompleteAssignment = async (id) => {
    try {
      await fetch(`${API_BASE_URL}/api/nurse/assignments/${id}/complete`, {
        method: "PUT",
      });

      showNotification("Marked Completed");
      fetchAssignments();
    } catch (err) {
      showNotification("Failed to complete assignment", "error");
    }
  };

  // ==========================
  // LOGOUT
  // ==========================
  const handleLogout = () => {
    localStorage.removeItem("nurseId");
    localStorage.removeItem("nurseName");
    window.location.href = "/login";
  };

  return (
    <div className="nurse-dashboard">
      {/* Notification */}
      {notification.message && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      {/* HEADER */}
      <header className="dashboard-header">
        <h1>👩‍⚕️ Nurse Dashboard — {nurseName}</h1>

        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </header>

      {/* CONTROLS */}
      <div className="dashboard-controls">
        <button
          className={`availability-btn ${
            available ? "available" : "unavailable"
          }`}
          onClick={handleToggleAvailability}
        >
          {available ? "✅ Available" : "🚫 Not Available"}
        </button>

        <button onClick={fetchAssignments} className="refresh-btn">
          Refresh
        </button>
      </div>

      {/* ASSIGNMENTS */}
      <main className="assignments-section">
        <h2>Assigned Appointments</h2>

        {error && <p className="error-message">{error}</p>}

        {isLoading ? (
          <div className="loading">Loading...</div>
        ) : assignments.length === 0 ? (
          <p className="no-assignments">No assignments yet.</p>
        ) : (
          <div className="assignments-list">
            {assignments.map((a) => (
              <div key={a._id} className="assignment-card">
                <div className="assignment-info">
                  <p>
                    <strong>Patient:</strong> {a.patientId?.fullName || "Unknown"}
                  </p>
                  <p>
                    <strong>Time:</strong> {a.slotTime || "N/A"}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span className={`status ${a.status?.toLowerCase()}`}>
                      {a.status}
                    </span>
                  </p>
                </div>

                <div className="assignment-actions">
                  {a.status === "Pending" && (
                    <button
                      className="accept-btn"
                      onClick={() => handleAcceptAssignment(a._id)}
                    >
                      Accept
                    </button>
                  )}

                  {a.status === "Confirmed" && (
                    <button
                      className="complete-btn"
                      onClick={() => handleCompleteAssignment(a._id)}
                    >
                      Complete
                    </button>
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
