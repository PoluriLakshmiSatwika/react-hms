import React, { useEffect, useState } from "react";
import "./DoctorDashboard.css";

const DoctorDashboard = () => {
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [nurses, setNurses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // ✅ Load doctor from localStorage
  useEffect(() => {
    const storedDoctor = JSON.parse(localStorage.getItem("doctor"));
    if (storedDoctor?.id) setDoctor(storedDoctor);
  }, []);

  // ✅ Fetch appointments for this doctor
  const fetchAppointments = async (doctorId) => {
    if (!doctorId) return;
    setLoading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/appointments/doctor/${doctorId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      if (data.success) setAppointments(data.data);
      else setAppointments([]);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch available nurses
  const fetchNurses = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/nurses`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) setNurses(data);
    } catch (err) {
      console.error("Error fetching nurses:", err);
      setNurses([]);
    }
  };

  // ✅ Assign nurse to appointment
  const handleAssignNurse = async (appointment, nurse) => {
    if (!nurse) return;

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/assignments`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          appointmentId: appointment._id,
          nurseIds: [nurse._id], // Send IDs only for backend logic
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage(`✅ Nurse ${nurse.fullName} assigned successfully`);

        // Update appointments state locally to show assignment immediately
        setAppointments((prev) =>
          prev.map((a) =>
            a._id === appointment._id
              ? { ...a, assignedNurses: data.data.assignedNurses }
              : a
          )
        );
      } else {
        setMessage(`❌ Failed to assign nurse: ${data.message || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Error assigning nurse:", err);
      setMessage("⚠ Error assigning nurse");
    }
  };

  // ✅ Fetch data once doctor is loaded
  useEffect(() => {
    if (doctor?.id) {
      fetchAppointments(doctor.id);
      fetchNurses();
    }
  }, [doctor]);

  if (!doctor) return <p>Please login as doctor to view dashboard.</p>;

  return (
    <div className="doctor-dashboard">
      <h2>Welcome, Dr. {doctor.fullName}</h2>
      {message && <p className="message">{message}</p>}

      {loading ? (
        <p>Loading appointments...</p>
      ) : appointments.length === 0 ? (
        <p>No appointments booked.</p>
      ) : (
        appointments.map((a) => (
          <div key={a._id} className="appointment-card">
            <p><strong>Patient:</strong> {a.patientId?.fullName || "N/A"}</p>
            <p><strong>Disease:</strong> {a.disease}</p>
            <p><strong>Date:</strong> {new Date(a.appointmentDate).toLocaleDateString()}</p>
            <p><strong>Time:</strong> {a.slotTime}</p>
            <p>
              <strong>Status:</strong>{" "}
              {a.status === "Cancelled" ? "❌ Cancelled" : a.feePaid ? "✅ Confirmed" : "⏳ Pending"}
            </p>
            <p>
              <strong>Assigned Nurses:</strong>{" "}
              {a.assignedNurses?.length > 0
                ? a.assignedNurses.map((n) => n.nurseName).join(", ")
                : "None"}
            </p>

            {/* Assign Nurse */}
            <div className="nurse-assign">
              <label>Assign Nurse:</label>
              <select
                onChange={(e) => {
                  const selected = nurses.find((n) => n._id === e.target.value);
                  handleAssignNurse(a, selected);
                }}
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
