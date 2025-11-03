// src/components/DoctorDashboard.jsx
import React, { useState } from "react";
import "./DoctorDashboard.css";

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      patient: "Rajesh Kumar",
      date: "2025-11-05",
      time: "10:00 AM",
      assignedNurses: [],
    },
    {
      id: 2,
      patient: "Sita Devi",
      date: "2025-11-06",
      time: "2:00 PM",
      assignedNurses: [],
    },
  ]);

  const [nurses] = useState([
    { id: 101, name: "Nurse Anjali", shift: "Morning" },
    { id: 102, name: "Nurse Meena", shift: "Evening" },
    { id: 103, name: "Nurse Ravi", shift: "Morning" },
  ]);

  const [selectedShift, setSelectedShift] = useState("Morning");

  const handleAssign = (appointmentId, nurseId) => {
    setAppointments((prev) =>
      prev.map((appt) =>
        appt.id === appointmentId
          ? {
              ...appt,
              assignedNurses: appt.assignedNurses.includes(nurseId)
                ? appt.assignedNurses
                : [...appt.assignedNurses, nurseId],
            }
          : appt
      )
    );
    alert("✅ Nurse assigned and notified via dashboard/email.");
  };

  // ✅ Logout function
  const handleLogout = () => {
    alert("You have been logged out successfully.");
    window.location.href = "/login"; // Redirect to doctor login page
  };

  const filteredNurses = nurses.filter((n) => n.shift === selectedShift);

  return (
    <div className="doctor-dashboard">
      {/* ✅ Header with Logout */}
      <header className="dashboard-header">
        <h2>👨‍⚕ Doctor Dashboard - Assign Nurses</h2>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </header>

      <div className="filter-section">
        <label>Filter Nurses by Shift:</label>
        <select
          value={selectedShift}
          onChange={(e) => setSelectedShift(e.target.value)}
        >
          <option value="Morning">Morning</option>
          <option value="Evening">Evening</option>
        </select>
      </div>

      <div className="appointments-section">
        {appointments.map((appt) => (
          <div className="appointment-card" key={appt.id}>
            <h3>{appt.patient}</h3>
            <p>
              📅 {appt.date} | ⏰ {appt.time}
            </p>
            <p>
              Assigned Nurses:{" "}
              {appt.assignedNurses.length > 0
                ? appt.assignedNurses
                    .map(
                      (nid) =>
                        nurses.find((n) => n.id === nid)?.name || "Unknown"
                    )
                    .join(", ")
                : "None"}
            </p>

            <div className="nurse-list">
              {filteredNurses.map((nurse) => (
                <button
                  key={nurse.id}
                  className="assign-btn"
                  onClick={() => handleAssign(appt.id, nurse.id)}
                >
                  Assign {nurse.name}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorDashboard;
