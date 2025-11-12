import React, { useEffect, useState } from "react";
import API_BASE_URL from "../../../api/apiConfig";
import "./PatientAppointments.css";

const PatientAppointments = () => {
  const patient = window.currentPatient; // ⛔ If not logged in, will be undefined

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("🔍 PatientAppointments mounted, window.currentPatient:", window.currentPatient);

    const fetchAppointments = async () => {
      try {
        // ✅ If no patient found
        if (!patient?.id) {
          console.error("❌ No patient ID found:", patient);
          setError("Please login to view appointments.");
          setLoading(false);
          return;
        }

        console.log("✅ Fetching appointments for patient ID:", patient.id);

        const res = await fetch(`${API_BASE_URL}/api/appointments/patient/${patient.id}`);
        const data = await res.json();

        console.log("📦 Appointments API response:", data);

        if (data.success) {
          setAppointments(data.data);
        } else {
          setError("No appointments found.");
        }
      } catch (err) {
        console.error("❌ Failed to fetch appointments", err);
        setError("Failed to load appointments.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [patient]);

  return (
    <div className="patient-appointments">
      <h2>My Appointments</h2>

      {/* ✅ If no patient logged in, show login button */}
      {!patient?.id && (
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

      {/* ✅ Error message */}
      {!loading && error && patient?.id && <p className="error">{error}</p>}

      {/* ✅ No appointments */}
      {!loading && !error && appointments.length === 0 && patient?.id && (
        <p>No Appointments Booked</p>
      )}

      {/* ✅ Show appointment list */}
      <div className="appointment-list">
        {appointments.map((a) => (
          <div className="appointment-card" key={a._id}>
            <p><strong>Doctor:</strong> {a.doctorId?.fullName || "N/A"}</p>
            <p><strong>Speciality:</strong> {a.disease}</p>
            <p><strong>Date:</strong> {a.appointmentDate?.split("T")[0]}</p>
            <p><strong>Slot:</strong> {a.slotTime}</p>
            <p>
              <strong>Status:</strong>{" "}
              {a.feePaid ? (
                <span className="confirmed">✅ Confirmed</span>
              ) : (
                <span className="pending">⏳ Pending Payment</span>
              )}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientAppointments;
