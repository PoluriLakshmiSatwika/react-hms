import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom"; // ✅ import navigate
import "./NurseDashboard.css";

const NurseDashboard = () => {
  const navigate = useNavigate(); // ✅ initialize navigate
  const [available, setAvailable] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ message: "", type: "" });

  // Fetch assignments (placeholder for API)
  const fetchAssignments = useCallback(async () => {
    try {
      setIsLoading(true);
      // Mock data — replace with actual API call
      const mockAssignments = [
        { id: "1", patientName: "John Doe", time: "09:00 AM", room: "101", status: "pending" },
        { id: "2", patientName: "Jane Smith", time: "10:30 AM", room: "203", status: "pending" },
      ];
      setAssignments(mockAssignments);
      setError(null);
    } catch (err) {
      setError("Failed to fetch assignments");
      showNotification("Failed to fetch assignments", "error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  // Toggle nurse availability
  const handleToggleAvailability = () => {
    setAvailable(prev => !prev);
    showNotification(
      `You are now ${!available ? "available" : "unavailable"} for assignments`,
      "success"
    );
  };

  // Accept an assignment
  const handleAcceptAssignment = (id) => {
    setAssignments(prev =>
      prev.map(assignment =>
        assignment.id === id ? { ...assignment, status: "accepted" } : assignment
      )
    );
    showNotification("Assignment accepted successfully", "success");
  };

  // Show notifications
  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: "", type: "" }), 3000);
  };

  // ✅ Logout function
  const handleLogout = () => {
    localStorage.removeItem("nurseId");
    localStorage.removeItem("role");
    navigate("/"); // Redirect to home/login without full reload
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
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </header>

      <div className="dashboard-controls">
        <button
          className={`availability-btn ${available ? "available" : "unavailable"}`}
          onClick={handleToggleAvailability}
          disabled={isLoading}
        >
          {available ? "✅ Available" : "🚫 Not Available"}
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
            {assignments.map(assignment => (
              <div key={assignment.id} className="assignment-card">
                <div className="assignment-info">
                  <p><strong>Patient:</strong> {assignment.patientName}</p>
                  <p><strong>Time:</strong> {assignment.time}</p>
                  <p><strong>Room:</strong> {assignment.room}</p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span className={`status ${assignment.status}`}>
                      {assignment.status}
                    </span>
                  </p>
                </div>

                {assignment.status === "pending" && (
                  <button
                    className="accept-btn"
                    onClick={() => handleAcceptAssignment(assignment.id)}
                    disabled={isLoading}
                  >
                    {isLoading ? "Accepting..." : "Accept"}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default NurseDashboard;
