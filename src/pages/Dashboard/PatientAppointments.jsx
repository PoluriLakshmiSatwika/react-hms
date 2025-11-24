import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PatientAppointments.css";

const PatientAppointments = () => {
  const navigate = useNavigate();
  const patient = JSON.parse(localStorage.getItem("patient"));

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [canceling, setCanceling] = useState(null);

  const [menuOpen, setMenuOpen] = useState(false); // ⭐ TOGGLE

  const handleLogout = () => {
    localStorage.removeItem("patient");
    navigate("/");
  };

  const handleBook = () => {
    navigate("/dashboard/appointment");
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
      setError("Failed to load appointments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancel = async (appointmentId) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?"))
      return;

    setCanceling(appointmentId);

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/appointments/cancel/${appointmentId}`,
        { method: "PUT" }
      );

      const data = await res.json();

      if (data.success) {
        alert("Appointment cancelled successfully!");
        fetchAppointments();
      } else {
        alert(data.message || "Failed to cancel.");
      }
    } catch (err) {
      alert("Something went wrong.");
    } finally {
      setCanceling(null);
    }
  };

  return (
    <div className="patient-appointments">
      {/* HEADER */}
      <div className="pa-header">
        <h2>Hi {patient?.fullName}, Your Appointments</h2>

        {/* ⭐ Desktop Buttons */}
        <div className="pa-buttons">
          <button className="btn-book" onClick={handleBook}>
            ➕ Book Appointment
          </button>

          <button
            onClick={() => navigate("/dashboard/patient")}
            className="btn-back"
          >
            ← Back to Dashboard
          </button>

          <button className="btn-logout" onClick={handleLogout}>
            🔒 Logout
          </button>
        </div>

        {/* ⭐ Mobile Toggle Button */}
        <button className="toggle-btn" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
      </div>

      {/* ⭐ Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu">
          <button className="btn-book" onClick={handleBook}>
            ➕ Book Appointment
          </button>

          <button
            className="btn-back"
            onClick={() => navigate("/dashboard/patient")}
          >
            ← Back to Dashboard
          </button>

          <button className="btn-logout" onClick={handleLogout}>
            🔒 Logout
          </button>
        </div>
      )}

      {loading && <p>Loading...</p>}
      {!loading && error && <p className="error">{error}</p>}
      {!loading && appointments.length === 0 && <p>No appointments found</p>}

      <div className="appointment-list">
        {appointments.map((a) => (
          <div className="appointment-card" key={a._id}>
            <p><strong>Doctor:</strong> {a.doctorId?.fullName}</p>
            <p><strong>Speciality:</strong> {a.doctorId?.specialty}</p>
            <p><strong>Date:</strong> {a.appointmentDate?.split("T")[0]}</p>
            <p><strong>Time:</strong> {a.slotTime}</p>

            {a.nextAppointmentDate && (
              <p className="next-op">
                Next OP: {a.nextAppointmentDate.split("T")[0]}
              </p>
            )}

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

            {a.status !== "Cancelled" && (
              <button
                className="btn-cancel"
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
