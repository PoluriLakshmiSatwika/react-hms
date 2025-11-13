import React, { useState, useEffect, useCallback } from "react";
import API from "../services/api/apiConfig";
import "./DoctorDashboard.css";

/* =================== DUMMY DATA =================== */
const dummyAppointments = [
  { _id: "101", patientName: "Alice Johnson", slotTime: "10:00 AM", appointmentDate: "2025-11-13", assignedNurses: [] },
  { _id: "102", patientName: "Bob Williams", slotTime: "11:30 AM", appointmentDate: "2025-11-13", assignedNurses: [] },
  { _id: "103", patientName: "Charlie Brown", slotTime: "02:00 PM", appointmentDate: "2025-11-14", assignedNurses: [] },
];

const dummyNurses = [
  { _id: "N001", fullName: "Nurse Emily", shift: "Morning", available: true },
  { _id: "N002", fullName: "Nurse Daniel", shift: "Morning", available: true },
  { _id: "N003", fullName: "Nurse Sophia", shift: "Afternoon", available: true },
  { _id: "N004", fullName: "Nurse Liam", shift: "Afternoon", available: true },
  { _id: "N005", fullName: "Nurse Olivia", shift: "Morning", available: false },
];
/* ================================================== */

// 🔹 Nurse Assignment Component
const NurseAssignment = ({ appointment, nurses, onAssign }) => {
  const [selectedNurses, setSelectedNurses] = useState(appointment.assignedNurses || []);
  const [shiftFilter, setShiftFilter] = useState("All");
  const shifts = ["All", ...new Set(nurses.map(n => n.shift))];

  const toggleNurse = (nurseId) => {
    setSelectedNurses(prev =>
      prev.includes(nurseId) ? prev.filter(id => id !== nurseId) : [...prev, nurseId]
    );
  };

  return (
    <div className="assignment-box">
      <div className="assignment-controls">
        <label>Filter by Shift:</label>
        <select value={shiftFilter} onChange={(e) => setShiftFilter(e.target.value)}>
          {shifts.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div className="nurse-list-container">
        {nurses
          .filter(n => n.available && (shiftFilter === "All" || n.shift === shiftFilter))
          .map(nurse => (
            <div key={nurse._id} className="nurse-item">
              <input
                type="checkbox"
                checked={selectedNurses.includes(nurse._id)}
                onChange={() => toggleNurse(nurse._id)}
              />
              <label>{nurse.fullName} ({nurse.shift})</label>
            </div>
          ))}
      </div>

      <button
        className="save-btn"
        disabled={selectedNurses.length === 0}
        onClick={() => onAssign(appointment._id, selectedNurses)}
      >
        Assign & Notify Nurses
      </button>
    </div>
  );
};

// 🔹 Main Doctor Dashboard
const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [nurses, setNurses] = useState([]);
  const [notification, setNotification] = useState("");
  const [loading, setLoading] = useState(true);
  const [expandedAppointments, setExpandedAppointments] = useState({}); // Track which appointment panels are open

  const fetchAppointments = async () => {
    try {
      const res = await API.get("/api/doctor/appointments");
      setAppointments(res.data.success && res.data.data.length > 0 ? res.data.data : dummyAppointments);
    } catch {
      setAppointments(dummyAppointments);
    }
  };

  const fetchNurses = async () => {
    try {
      const res = await API.get("/api/doctor/nurses");
      setNurses(res.data.success && res.data.data.length > 0 ? res.data.data : dummyNurses);
    } catch {
      setNurses(dummyNurses);
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchAppointments();
      await fetchNurses();
      setLoading(false);
    };
    load();
  }, []);

  const handleNurseAssignment = async (appointmentId, nurseIds) => {
    try {
      const res = await API.put("/api/doctor/assign-nurses", { appointmentId, nurseIds });
      if (res.data.success) {
        setNotification("✅ Nurses Assigned Successfully!");
        fetchAppointments();
      }
    } catch {
      setNotification("❌ Failed to assign nurses");
    }
    setTimeout(() => setNotification(""), 3000);
  };

  const getNurseNames = useCallback((ids = []) => {
    if (!ids.length) return "None assigned";
    return ids.map(id => nurses.find(n => n._id === id)?.fullName || "Unknown").join(", ");
  }, [nurses]);

  const togglePanel = (id) => {
    setExpandedAppointments(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading) return <div className="loading-state">Loading dashboard...</div>;

  return (
    <div className="doctor-dashboard">
      <h1>Doctor Appointment Dashboard 👩‍⚕</h1>
      {notification && <div className="notification-banner">{notification}</div>}

      <h2>Upcoming Appointments</h2>
      {appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        appointments.map(app => (
          <div key={app._id} className="appointment-card">
            <div className="appointment-header" onClick={() => togglePanel(app._id)}>
              <div>
                <h3>{app.patientName}</h3>
                <p>{app.slotTime} on {new Date(app.appointmentDate).toLocaleDateString()}</p>
                <p><b>Assigned:</b> {getNurseNames(app.assignedNurses)}</p>
              </div>
              <div className="toggle-icon">{expandedAppointments[app._id] ? "▲" : "▼"}</div>
            </div>

            {expandedAppointments[app._id] && (
              <NurseAssignment
                appointment={app}
                nurses={nurses}
                onAssign={handleNurseAssignment}
              />
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default DoctorDashboard;
