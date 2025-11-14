import React, { useEffect, useState } from "react";
import "./DoctorDashboard.css";

const DoctorDashboard = () => {
  const doctor = JSON.parse(localStorage.getItem("doctor")); // get logged-in doctor
  const [appointments, setAppointments] = useState([]);
  const [nurses, setNurses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState({});
  const [message, setMessage] = useState("");

  if (!doctor) {
    return <p>Please login as doctor to view dashboard.</p>;
  }

  // Fetch appointments for this doctor
  const fetchAppointments = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/appointments/doctor/${doctor._id}`
      );
      const data = await res.json();
      if (data.success) setAppointments(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch available nurses
  const fetchNurses = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/doctors/nurses`);
      const data = await res.json();
      if (data.success) setNurses(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAppointments();
    fetchNurses();
  }, []);

  // Assign nurse to appointment
  const handleAssignNurse = async (appointmentId, nurseId) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/assignments`, {
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
      console.error(err);
      setMessage("⚠ Error assigning nurse");
    }
  };

  return (
    <div className="doctor-dashboard">
      <h2>Welcome, Dr. {doctor.fullName}</h2>
      {message && <p>{message}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        appointments.map((a) => (
          <div key={a._id} className="appointment-card">
            <p><strong>Patient:</strong> {a.patientName}</p>
            <p><strong>Date:</strong> {a.appointmentDate}</p>
            <p><strong>Time:</strong> {a.slotTime}</p>
            <p>
              <strong>Assigned Nurses:</strong>{" "}
              {a.assignedNurses?.map((n) => n.nurseName).join(", ") || "None"}
            </p>

            <div className="nurse-assign">
              <label>Assign Nurse:</label>
              <select
                onChange={(e) =>
                  handleAssignNurse(a._id, e.target.value)
                }
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
