import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PatientAppointments.css";

const PatientAppointments = () => {
  const navigate = useNavigate();
  const patient = JSON.parse(localStorage.getItem("patient"));

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [canceling, setCanceling] = useState(null); // track canceling appointment

  const handleLogout = () => {
    localStorage.removeItem("patient");
    navigate("/");
  };

  const fetchAppointments = async () => {
    if (!patient?.id && !patient?._id) {
      setError("Please login to view appointments.");
      setLoading(false);
      return;
    }

    try {
      const patientId = patient.id || patient._id;
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/appointments/patient/${patientId}`
      );
      const data = await res.json();

      if (data.success && Array.isArray(data.data)) {
        setAppointments(data.data);
      } else {
        setError("No appointments found.");
      }
    } catch (err) {
      console.error("❌ Failed to fetch appointments:", err);
      setError("Failed to load appointments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // ✅ Cancel appointment
  const handleCancel = async (appointmentId) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;

    setCanceling(appointmentId);
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/appointments/cancel/${appointmentId}`,
        { method: "PUT" }
      );
      const data = await res.json();

      if (data.success) {
        alert("Appointment cancelled successfully!");
        fetchAppointments(); // refresh list
      } else {
        alert(`Failed to cancel: ${data.message || "Unknown error"}`);
      }
    } catch (err) {
      console.error("❌ Cancel appointment error:", err);
      alert("Something went wrong. Try again.");
    } finally {
      setCanceling(null);
    }
  };

  return (
    <div className="patient-appointments">
      <div className="header">
        <h2>My Appointments</h2>
        {patient && (
          <button className="logout-btn" onClick={handleLogout}>
            🔒 Logout
          </button>
        )}
      </div>

      {!patient && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <p className="error">❌ Please login to view appointments.</p>
          <a
            href="/login/patient"
            style={{
              display: "inline-block",
              padding: "8px 18px",
              background: "#2a9d8f",
              color: "white",
              borderRadius: "6px",
              textDecoration: "none",
              marginTop: "10px",
            }}
          >
            🔐 Login as Patient
          </a>
        </div>
      )}

      {loading && <p>Loading...</p>}
      {!loading && error && patient && <p className="error">{error}</p>}
      {!loading && !error && appointments.length === 0 && patient && (
        <p>No Appointments Booked</p>
      )}

      <div className="appointment-list">
        {appointments.map((a) => (
          <div className="appointment-card" key={a._id}>
            <p><strong>Doctor:</strong> {a.doctorId?.fullName || "N/A"}</p>
            <p><strong>Speciality:</strong> {a.doctorId?.specialty || a.disease}</p>
            <p><strong>Date:</strong> {a.appointmentDate?.split("T")[0]}</p>
            <p><strong>Slot:</strong> {a.slotTime}</p>
            <p>
              <strong>Status:</strong>{" "}
              {a.status === "Cancelled" ? (
                <span className="cancelled">❌ Cancelled</span>
              ) : a.feePaid ? (
                <span className="confirmed">✅ Confirmed</span>
              ) : (
                <span className="pending">⏳ Pending</span>
              )}
            </p>

            {/* Cancel Button */}
            {a.status !== "Cancelled" && (
              <button
                className="btn btn-cancel"
                disabled={canceling === a._id}
                onClick={() => handleCancel(a._id)}
              >
                {canceling === a._id ? "Cancelling..." : "Cancel Appointment"}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientAppointments;
