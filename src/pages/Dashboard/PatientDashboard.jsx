import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PatientDashboard = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const patient = JSON.parse(localStorage.getItem("patient"));
  const patientId = patient?.id;

  const formatDate = (isoDate) => {
    if (!isoDate) return "N/A";
    const d = new Date(isoDate);
    return `${String(d.getDate()).padStart(2, "0")}/${String(
      d.getMonth() + 1
    ).padStart(2, "0")}/${d.getFullYear()}`;
  };

  const fetchAppointments = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/appointments/patient/${patientId}`
      );
      const data = await res.json();

      if (data.success) {
        const updated = data.data.map((a) => ({
          ...a,
          nextAppointmentDate: a.nextAppointmentDate
            ? new Date(a.nextAppointmentDate)
            : null,
        }));
        setAppointments(updated);
      }
    } catch (err) {
      console.error("Fetch patient appointments error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (patientId) fetchAppointments();
  }, [patientId]);

  const handleLogout = () => {
    localStorage.removeItem("patient");
    localStorage.removeItem("token");
    navigate("/");
  };

  if (!patient)
    return (
      <h2 style={{ color: "red", textAlign: "center" }}>
        Please login as Patient
      </h2>
    );

  return (
    <div className="patient-dashboard" style={{ padding: "20px" }}>
      
      {/* ================= HEADER ================= */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>
          Welcome Back,{" "}
          <span style={{ color: "#0077b6" }}>{patient.fullName}</span>
        </h1>

        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "#dc3545",
            color: "#fff",
            border: "none",
            padding: "8px 14px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

     <div style={{ marginBottom: "20px", marginTop: "10px" }}>
  <button
    onClick={() => navigate("/dashboard/appointment")}
    style={{
      backgroundColor: "#007bff",
      color: "#fff",
      border: "none",
      padding: "10px 20px",
      borderRadius: "6px",
      cursor: "pointer",
      marginRight: "10px"
    }}
  >
    Book Appointment
  </button>

  <button
    onClick={() => navigate("/patient/appointment")}
    style={{
      backgroundColor: "#17a2b8",
      color: "#fff",
      border: "none",
      padding: "10px 20px",
      borderRadius: "6px",
      cursor: "pointer"
    }}
  >
    View Appointments
  </button>
</div>


      <h2 style={{ marginTop: "25px" }}>Your Appointments</h2>

      {/* ================= APPOINTMENT LIST ================= */}
      {loading ? (
        <p>Loading...</p>
      ) : appointments.length === 0 ? (
        <p>No appointments found...</p>
      ) : (
        <div className="appointment-list">
          {appointments.map((a) => (
            <div key={a._id} className="appointment-card">
              <p><strong>Doctor:</strong> {a.doctorId?.fullName}</p>
              <p><strong>Disease:</strong> {a.disease}</p>
              <p><strong>Date:</strong> {formatDate(a.appointmentDate)}</p>
              <p><strong>Time:</strong> {a.slotTime}</p>

              {a.nextAppointmentDate && (
                <p
                  style={{
                    marginTop: "10px",
                    padding: "6px 10px",
                    background: "#d4edda",
                    color: "#155724",
                    borderRadius: "6px",
                    fontWeight: "bold",
                  }}
                >
                  Next OP: {formatDate(a.nextAppointmentDate)}
                </p>
              )}

              <p
                style={{
                  marginTop: "8px",
                  fontWeight: "bold",
                  color:
                    a.status === "Confirmed"
                      ? "green"
                      : a.status === "Cancelled"
                      ? "red"
                      : a.status === "Completed"
                      ? "blue"
                      : "orange",
                }}
              >
                Status: {a.status}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
