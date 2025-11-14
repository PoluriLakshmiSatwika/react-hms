import React, { useEffect, useState } from "react";
import "./DoctorDashboard.css";

const DoctorDashboard = () => {
  const doctor = JSON.parse(localStorage.getItem("doctor")); // logged-in doctor
  const [appointments, setAppointments] = useState([]);
  const [nurses, setNurses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Fetch appointments for this doctor
  const fetchAppointments = async () => {
    if (!doctor) return;

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/appointments/doctor/${doctor._id}`
      );
      const data = await res.json();
      if (data.success) setAppointments(data.data);
    } catch (err) {
      console.error("❌ Error fetching appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch available nurses
  const fetchNurses = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/nurses`);
      const data = await res.json();
      if (Array.isArray(data)) setNurses(data);
    } catch (err) {
      console.error("❌ Error fetching nurses:", err);
    }
  };

  useEffect(() => {
    fetchAppointments();
    fetchNurses();
  }, []);

  // Assign nurse to appointment
  const handleAssignNurse = async (appointmentId, nurseId) => {
    if (!nurseId) return;

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/assign-nurses`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentId, nurseIds: [nurseId] }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage("✅ Nurse assigned successfully");
        fetchAppointments(); // refresh appointments
      } else {
        setMessage("❌ Failed to assign nurse");
      }
    } catch (err) {
      console.error("⚠ Error assigning nurse:", err);
      setMessage("⚠ Something went wrong");
    }
  };

  if (!doctor) {
    return <p>Please login as doctor to view dashboard.</p>;
  }

  return (
    <div className="doctor-dashboard">
      <h2>Welcome, Dr. {doctor.fullName}</h2>
      {message && <p className="message">{message}</p>}

      {loading ? (
        <p>Loading appointments...</p>
      ) : appointments.length === 0 ? (
        <p>No appointments booked yet.</p>
      ) : (
        appointments.map((a) => (
          <div key={a._id} className="appointment-card">
            <p><strong>Patient:</strong> {a.patientId?.fullName}</p>
            <p><strong>Disease:</strong> {a.disease}</p>
            <p><strong>Date:</strong> {new Date(a.appointmentDate).toLocaleDateString()}</p>
            <p><strong>Time:</strong> {a.slotTime}</p>
            <p><strong>Status:</strong> {a.status}</p>
            <p>
              <strong>Assigned Nurse:</strong>{" "}
              {a.assignedNurse?.nurseName || "None"}
            </p>

            <div className="nurse-assign">
              <label>Assign Nurse:</label>
              <select
                onChange={(e) => handleAssignNurse(a._id, e.target.value)}
                defaultValue=""
              >
                <option value="">Select Nurse</option>
                {nurses.map((n) => (
                  <option key={n._id} value={n._id}>
                    {n.fullName} ({n.shiftTiming})
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default DoctorDashboard;
