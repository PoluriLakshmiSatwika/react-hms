import React, { useState, useEffect, useCallback } from "react";
import "./DoctorDashboard.css";




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
  const [expandedAppointments, setExpandedAppointments] = useState({});

  const fetchAppointments = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}api/appointments/doctor/${doctorId}`);
      const data = await res.json();
      if (data.success) setAppointments(data.data);
    } catch {
      console.error("Failed to fetch appointments");
    }
  };

  const fetchNurses = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/nurses`);
      const data = await res.json();
      if (data.success) setNurses(data.data);
    } catch {
      console.error("Failed to fetch nurses");
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
      const res = await fetch(`${process.env.REACT_APP_API_URL}/doctor/assign-nurses`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentId, nurseIds }),
      });
      const data = await res.json();

      if (data.success) {
        setNotification("✅ Nurses Assigned Successfully!");
        fetchAppointments();
      } else {
        setNotification("❌ Failed to assign nurses");
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
