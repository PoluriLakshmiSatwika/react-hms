// NurseDashboard.jsx
import React, { useState, useEffect, useCallback } from "react";
import "./NurseDashboard.css";
import API_BASE_URL from "../../api/apiConfig";

const NurseDashboard = () => {
  const nurseId = localStorage.getItem("nurseId");
  const nurseName = localStorage.getItem("nurseName");

  const [available, setAvailable] = useState(true);
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });

  /* ============================================================
      SHOW NOTIFICATION
  ============================================================ */
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: "", type: "" }), 2500);
  };

  /* ============================================================
      FETCH ASSIGNMENTS
  ============================================================ */
  const fetchAssignments = useCallback(async () => {
    if (!nurseId) return;

    setIsLoading(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/nurse/assignments?nurseId=${nurseId}`
      );
      const data = await res.json();

      if (data.success) setAssignments(data.data || []);
      else setAssignments([]);
    } catch (err) {
      console.error("FETCH ERROR:", err);
      setAssignments([]);
    } finally {
      setIsLoading(false);
    }
  }, [nurseId]);

  /* ============================================================
      FETCH OWN AVAILABILITY
  ============================================================ */
  const fetchOwnAvailability = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/doctor/nurses`);
      const data = await res.json();

      const me = data?.data?.find((n) => String(n._id) === String(nurseId));
      if (me) setAvailable(Boolean(me.available));
    } catch (err) {
      console.error("AVAILABILITY FETCH ERROR");
    }
  }, [nurseId]);

  useEffect(() => {
    fetchAssignments();
    fetchOwnAvailability();
  }, [fetchAssignments, fetchOwnAvailability]);

  // Auto Refresh every 3 sec
  useEffect(() => {
    const interval = setInterval(() => {
      fetchAssignments();
      fetchOwnAvailability();
    }, 3000);

    return () => clearInterval(interval);
  }, [fetchAssignments, fetchOwnAvailability]);

  /* ============================================================
      TOGGLE AVAILABILITY
  ============================================================ */
  const handleToggleAvailability = async () => {
    const newState = !available;
    setAvailable(newState);

    try {
      const res = await fetch(`${API_BASE_URL}/api/nurse/availability`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nurseId, available: newState }),
      });

      const data = await res.json();

      if (!data.success) {
        setAvailable(!newState);
        showNotification("Failed to update availability", "error");
      } else {
        showNotification(
          newState ? "You are now online" : "You are now offline",
          newState ? "success" : "error"
        );
      }
    } catch (err) {
      setAvailable(!newState);
      showNotification("Server error", "error");
    }
  };

  /* ============================================================
      ACCEPT ASSIGNMENT
  ============================================================ */
  const handleAcceptAssignment = async (id) => {
    if (!available) {
      return showNotification(
        "❌ You are offline. Go online to accept appointments.",
        "error"
      );
    }

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/nurse/assignments/${id}/accept`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nurseId }),
        }
      );

      const data = await res.json();

      if (data.success) {
        showNotification("👍 Appointment accepted!", "success");
        fetchAssignments();
      } else {
        showNotification(data.message, "error");
      }
    } catch (err) {
      showNotification("Server error", "error");
    }
  };

  /* ============================================================
      COMPLETE ASSIGNMENT
  ============================================================ */
  const handleCompleteAssignment = async (id) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/nurse/assignments/${id}/complete`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nurseId }),
        }
      );

      const data = await res.json();

      if (data.success) {
        showNotification("✔ Appointment completed", "success");
        fetchAssignments();
      } else {
        showNotification(data.message, "error");
      }
    } catch (err) {
      showNotification("Server error", "error");
    }
  };

  /* ============================================================
      LOGOUT
  ============================================================ */
  const handleLogout = () => {
    localStorage.removeItem("nurseId");
    localStorage.removeItem("nurseName");
    window.location.href = "/login";
  };

  /* ============================================================
      UI
  ============================================================ */
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
        <button
          className={`availability-btn ${
            available ? "available" : "unavailable"
          }`}
          onClick={handleToggleAvailability}
        >
          {available ? "✅ Online" : "🚫 Offline"}
        </button>

        <button className="refresh-btn" onClick={fetchAssignments}>
          🔄 Refresh
        </button>
      </div>

      {/* MAIN */}
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
                <p><strong>Patient:</strong> {a.patientId?.fullName}</p>
                <p><strong>Time:</strong> {a.slotTime}</p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span className={`status ${a.status.toLowerCase()}`}>
                    {a.status}
                  </span>
                </p>

                <div className="assignment-actions">
                  {a.status === "Pending" && (
                    <button
                      className={`accept-btn ${
                        !available ? "disabled-accept" : ""
                      }`}
                      onClick={() => handleAcceptAssignment(a._id)}
                      disabled={!available}
                    >
                      Accept
                    </button>
                  )}

                  {a.status === "Accepted" && (
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
