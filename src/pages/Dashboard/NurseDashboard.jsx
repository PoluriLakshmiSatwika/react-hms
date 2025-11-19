// NurseDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./NurseDashboard.css";

const NurseDashboard = () => {
  const navigate = useNavigate();
  const [nurse, setNurse] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Load nurse from localStorage
  useEffect(() => {
    const storedNurse = JSON.parse(localStorage.getItem("nurse"));
    if (storedNurse?.id) setNurse(storedNurse);
  }, []);

// Fetch appointments assigned to this nurse
const fetchAssignedAppointments = async (nurseId) => {
  if (!nurseId) return;
  setLoading(true);

  try {
    const token = localStorage.getItem("nurseToken",loginResponse.token);  // ✅ FIXED

    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/api/nurse/appointments/${nurseId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",  // ✅ Add this
          Authorization: `Bearer ${token}`,    // ✅ FIXED
        },
      }
    );

    const data = await res.json();

    if (data.success) {
      setAppointments(data.data);
    } else {
      setAppointments([]);
    }
  } catch (err) {
    console.error("Error fetching appointments:", err);
    setAppointments([]);
  } finally {
    setLoading(false);
  }
};


  // Accept Appointment
  const handleAccept = async (appointmentId) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/appointments/update-status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ appointmentId, status: "Accepted" }),
        }
      );

      const data = await res.json();

      if (data.success) {
        setMessage("Appointment accepted successfully");
        setAppointments((prev) =>
          prev.map((a) =>
            a._id === appointmentId ? { ...a, status: "Accepted" } : a
          )
        );
      }
    } catch (err) {
      console.error("Accept error:", err);
    }
  };

  // Mark as Completed
  const handleComplete = async (appointmentId) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/appointments/update-status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ appointmentId, status: "Completed" }),
        }
      );

      const data = await res.json();

      if (data.success) {
        setMessage("Appointment marked as Completed!");
        setAppointments((prev) =>
          prev.map((a) =>
            a._id === appointmentId ? { ...a, status: "Completed" } : a
          )
        );
      }
    } catch (err) {
      console.error("Completion error:", err);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("nurse");
    setNurse(null);
    navigate("/");
  };

  useEffect(() => {
    if (nurse?.id) fetchAssignedAppointments(nurse.id);
  }, [nurse]);

  if (!nurse) return <p>Please login as nurse to view dashboard.</p>;

  return (
    <div className="nurse-dashboard">
      <div className="dashboard-header">
        <h2>Welcome, Nurse {nurse.fullName}</h2>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {message && <p className="message">{message}</p>}

      <div className="section">
        <h3>Your Assigned Appointments</h3>

        {loading ? (
          <p>Loading appointments...</p>
        ) : appointments.length === 0 ? (
          <p>No appointments assigned yet.</p>
        ) : (
          appointments.map((a) => (
            <div key={a._id} className="appointment-card">
              <p><strong>Patient:</strong> {a.patientId?.fullName || "N/A"}</p>
              <p><strong>Doctor:</strong> {a.doctorId?.fullName || "N/A"}</p>
              <p><strong>Disease:</strong> {a.disease}</p>
              <p><strong>Date:</strong> {new Date(a.appointmentDate).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {a.slotTime}</p>
              <p><strong>Status:</strong> {a.status}</p>

              {a.status === "Pending" && (
                <button className="accept-btn" onClick={() => handleAccept(a._id)}>
                  Accept
                </button>
              )}

              {a.status === "Accepted" && (
                <button className="complete-btn" onClick={() => handleComplete(a._id)}>
                  Mark as Completed
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NurseDashboard;
