import React, { useEffect, useState } from "react";
import "./PatientAppointments.css";

const PatientAppointments = () => {
  // ✅ Get logged-in patient from localStorage
  const patient = JSON.parse(localStorage.getItem("patient"));

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
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

    fetchAppointments();
  }, []);

  return (
    <div className="patient-appointments">
      <h2>My Appointments</h2>

      {/* ✅ Not logged in */}
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

      {/* ✅ Loading */}
      {loading && <p>Loading...</p>}

      {/* ✅ Error */}
      {!loading && error && patient && <p className="error">{error}</p>}

      {/* ✅ No appointments */}
      {!loading && !error && appointments.length === 0 && patient && (
        <p>No Appointments Booked</p>
      )}

      {/* ✅ Appointments List */}
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientAppointments;
