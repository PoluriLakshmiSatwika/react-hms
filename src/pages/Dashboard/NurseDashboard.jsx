import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NurseDashboard = () => {
  const navigate = useNavigate();
  const [nurse, setNurse] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Load nurse details from localStorage
  useEffect(() => {
    const storedNurse = JSON.parse(localStorage.getItem("nurse"));
    if (storedNurse) setNurse(storedNurse);
  }, []);

  // Fetch assigned appointments
  const fetchAssignedAppointments = async (nurseId) => {
    if (!nurseId) return;
    setLoading(true);

    try {
      const token = localStorage.getItem("nurseToken");

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/nurse/appointments/${nurseId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      console.log("Assigned Appointments:", data);

      if (data.success) {
        setAppointments(data.data);
      } else {
        setAppointments([]);
      }
    } catch (err) {
      console.error("Error fetching nurse appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  // Accept appointment
  const handleAccept = async (appointmentId) => {
    try {
      const token = localStorage.getItem("nurseToken");

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/nurse/accept`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            appointmentId,
            nurseId: nurse.id,
          }),
        }
      );

      const data = await res.json();
      if (data.success) {
        setMessage("Appointment Accepted!");
        fetchAssignedAppointments(nurse.id);
      }
    } catch (err) {
      console.error("Accept Error:", err);
    }
  };

  // Mark completed
  const handleComplete = async (appointmentId) => {
    try {
      const token = localStorage.getItem("nurseToken");

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/nurse/complete`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            appointmentId,
            nurseId: nurse.id,
          }),
        }
      );

      const data = await res.json();
      if (data.success) {
        setMessage("Appointment marked Completed!");
        fetchAssignedAppointments(nurse.id);
      }
    } catch (err) {
      console.error("Completion Error:", err);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("nurseToken");
    localStorage.removeItem("nurse");
    navigate("/");
  };

  // On load
  useEffect(() => {
    if (nurse?.id) fetchAssignedAppointments(nurse.id);
  }, [nurse]);

  if (!nurse) return <p>Please login as a nurse.</p>;

  return (
    <div className="nurse-dashboard">
      <div className="dashboard-header">
        <h2>Welcome, Nurse {nurse.fullName}</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>

      {message && <p className="message">{message}</p>}

      <h3>Your Assigned Appointments</h3>

      {loading ? (
        <p>Loading...</p>
      ) : appointments.length === 0 ? (
        <p>No appointments assigned yet.</p>
      ) : (
        appointments.map((item) => {
          const ap = item.appointmentId; // ✔ shortcut

          // nurse status inside assignment table
          const nurseStatus =
            item.assignedNurses?.find((n) => n.nurseId === nurse.id)?.status ||
            "Pending";

          return (
            <div key={item._id} className="appointment-card">
              <p><strong>Patient:</strong> {ap?.patientId?.fullName || "N/A"}</p>
              <p><strong>Doctor:</strong> {ap?.doctorId?.fullName || "N/A"}</p>
              <p><strong>Disease:</strong> {ap?.disease || "N/A"}</p>

              <p>
                <strong>Date:</strong>{" "}
                {ap?.appointmentDate
                  ? new Date(ap.appointmentDate).toLocaleDateString()
                  : "N/A"}
              </p>

              <p><strong>Time:</strong> {ap?.slotTime || "N/A"}</p>

              <p><strong>Status:</strong> {nurseStatus}</p>

              {nurseStatus === "Pending" && (
                <button onClick={() => handleAccept(ap._id)}>Accept</button>
              )}

              {nurseStatus === "Accepted" && (
                <button onClick={() => handleComplete(ap._id)}>
                  Mark Completed
                </button>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default NurseDashboard;
