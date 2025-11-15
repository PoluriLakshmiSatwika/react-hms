// NurseDashboard.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./NurseDashboard.css";


const NurseDashboard = () => {
  const navigate = useNavigate();

  // ✅ Load nurse info from localStorage
  const nurse = JSON.parse(localStorage.getItem("nurse")) || {};
  const nurseId = nurse.id;
  const nurseName = nurse.fullName;

  const [available, setAvailable] = useState(true);
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

  // ====================== Fetch Nurse Availability ======================
// ====================== Fetch Nurse Availability ======================
const fetchAvailability = useCallback(async () => {
  const token = localStorage.getItem("token"); // ✅ get token here
  if (!token) {
    console.warn("No token found, cannot fetch nurse profile");
    return;
  }

  try {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/nurse/profile`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // ✅ send token
      },
    });

    const data = await res.json();
    console.log("Profile data:", data);

    if (data.success) {
      setAvailable(Boolean(data.nurse?.available));
    } else {
      console.warn("Failed to fetch nurse profile:", data.message);
    }
  } catch (err) {
    console.error("AVAILABILITY FETCH ERROR:", err);
  }
}, []);


  // ====================== Auto Fetch on Mount ======================
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchAssignments();
    fetchAvailability();

    const interval = setInterval(() => {
      fetchAssignments();
      fetchAvailability();
    }, 3000);

    return () => clearInterval(interval);
  }, [fetchAssignments, fetchAvailability, navigate, token]);

  // ====================== Toggle Availability ======================
  const handleToggleAvailability = async () => {
    const newState = !available;
    setAvailable(newState);

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/nurse/availability`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ available: newState }),
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

  // ====================== Accept Assignment ======================
  const handleAcceptAssignment = async (id) => {
    if (!available) {
      return showNotification(
        "❌ You are offline. Go online to accept appointments.",
        "error"
      );
    }

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
        <button
          className={`availability-btn ${available ? "available" : "unavailable"}`}
          onClick={handleToggleAvailability}
        >
          {available ? "✅ Online" : "🚫 Offline"}
        </button>
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
                  <strong>Patient:</strong> {a.patientId?.fullName}
                </p>
                <p>
                  <strong>Time:</strong> {a.slotTime}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span className={`status ${a.status.toLowerCase()}`}>
                    {a.status}
                  </span>
                </p>
                <div className="assignment-actions">
                  {a.status === "Pending" && (
                    <button
                      className={`accept-btn ${!available ? "disabled-accept" : ""}`}
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
