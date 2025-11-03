import React, { useState } from "react";

const NurseDashboard = () => {
  const [activeSection, setActiveSection] = useState("wards");
  const [available, setAvailable] = useState(true);

  const [appointments, setAppointments] = useState([
    { id: 1, patient: "John Doe", time: "10:00 AM", room: "Ward A", accepted: false },
    { id: 2, patient: "Jane Smith", time: "11:30 AM", room: "Ward B", accepted: false },
    { id: 3, patient: "Michael Johnson", time: "2:00 PM", room: "ICU", accepted: false },
  ]);

  const vitals = [
    { patient: "John Doe", bp: "120/80", pulse: "76 bpm", temp: "98.6°F" },
    { patient: "Jane Smith", bp: "110/70", pulse: "80 bpm", temp: "99°F" },
  ];

  const shifts = [
    { day: "Monday", time: "8:00 AM - 4:00 PM" },
    { day: "Tuesday", time: "4:00 PM - 12:00 AM" },
    { day: "Wednesday", time: "OFF" },
  ];

  const toggleAvailability = () => setAvailable(!available);

  const handleAccept = (id) => {
    setAppointments((prev) =>
      prev.map((appt) =>
        appt.id === id ? { ...appt, accepted: true } : appt
      )
    );
  };

  const renderSection = () => {
    switch (activeSection) {
      case "wards":
        return (
          <div>
            <div style={{ marginBottom: "20px" }}>
              <p style={{ fontSize: "16px" }}>
                <strong>Status:</strong>{" "}
                <span
                  style={{
                    color: available ? "green" : "red",
                    fontWeight: "bold",
                  }}
                >
                  {available ? "Available" : "Not Available"}
                </span>
              </p>
              <button
                onClick={toggleAvailability}
                style={{
                  padding: "8px 14px",
                  backgroundColor: available ? "#dc3545" : "#198754",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                {available ? "Mark Unavailable" : "Mark Available"}
              </button>
            </div>

            <h3
              style={{
                color: "#004aad",
                fontSize: "20px",
                marginBottom: "10px",
              }}
            >
              Assigned Wards / Appointments
            </h3>

            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                border: "1px solid #ccc",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#e9f0ff" }}>
                  <th style={thStyle}>ID</th>
                  <th style={thStyle}>Patient Name</th>
                  <th style={thStyle}>Time</th>
                  <th style={thStyle}>Room</th>
                  <th style={thStyle}>Action</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt) => (
                  <tr key={appt.id} style={{ textAlign: "left" }}>
                    <td style={tdStyle}>{appt.id}</td>
                    <td style={tdStyle}>{appt.patient}</td>
                    <td style={tdStyle}>{appt.time}</td>
                    <td style={tdStyle}>{appt.room}</td>
                    <td style={tdStyle}>
                      <button
                        onClick={() => handleAccept(appt.id)}
                        disabled={appt.accepted}
                        style={{
                          padding: "6px 12px",
                          backgroundColor: appt.accepted ? "#aaa" : "#007bff",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: appt.accepted ? "not-allowed" : "pointer",
                        }}
                      >
                        {appt.accepted ? "Accepted" : "Accept"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case "vitals":
        return (
          <div>
            <h3 style={{ color: "#004aad", fontSize: "20px" }}>Patient Vitals</h3>
            <table style={tableStyle}>
              <thead>
                <tr style={{ backgroundColor: "#e9f0ff" }}>
                  <th style={thStyle}>Patient</th>
                  <th style={thStyle}>Blood Pressure</th>
                  <th style={thStyle}>Pulse</th>
                  <th style={thStyle}>Temperature</th>
                </tr>
              </thead>
              <tbody>
                {vitals.map((v, i) => (
                  <tr key={i}>
                    <td style={tdStyle}>{v.patient}</td>
                    <td style={tdStyle}>{v.bp}</td>
                    <td style={tdStyle}>{v.pulse}</td>
                    <td style={tdStyle}>{v.temp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case "schedule":
        return (
          <div>
            <h3 style={{ color: "#004aad", fontSize: "20px" }}>Shift Schedule</h3>
            <table style={tableStyle}>
              <thead>
                <tr style={{ backgroundColor: "#e9f0ff" }}>
                  <th style={thStyle}>Day</th>
                  <th style={thStyle}>Shift Timing</th>
                </tr>
              </thead>
              <tbody>
                {shifts.map((s, i) => (
                  <tr key={i}>
                    <td style={tdStyle}>{s.day}</td>
                    <td style={tdStyle}>{s.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      default:
        return null;
    }
  };

  // Inline styles (constants)
  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    border: "1px solid #ccc",
    marginTop: "10px",
  };

  const thStyle = {
    border: "1px solid #ddd",
    padding: "10px",
    textAlign: "left",
    color: "#004aad",
  };

  const tdStyle = {
    border: "1px solid #ddd",
    padding: "10px",
  };

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "40px auto",
        padding: "25px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        backgroundColor: "white",
      }}
    >
      <h2 style={{ color: "#004aad", fontSize: "28px", textAlign: "center" }}>
        Nurse Dashboard
      </h2>
      <p style={{ textAlign: "center", color: "#555" }}>
        View assigned patients, update vitals, and check your shift schedule.
      </p>

      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <button
          onClick={() => setActiveSection("wards")}
          style={{
            ...tabButtonStyle,
            backgroundColor: activeSection === "wards" ? "#004aad" : "#f0f0f0",
            color: activeSection === "wards" ? "white" : "#333",
          }}
        >
          Assigned Wards
        </button>
        <button
          onClick={() => setActiveSection("vitals")}
          style={{
            ...tabButtonStyle,
            backgroundColor: activeSection === "vitals" ? "#004aad" : "#f0f0f0",
            color: activeSection === "vitals" ? "white" : "#333",
          }}
        >
          Patient Vitals
        </button>
        <button
          onClick={() => setActiveSection("schedule")}
          style={{
            ...tabButtonStyle,
            backgroundColor: activeSection === "schedule" ? "#004aad" : "#f0f0f0",
            color: activeSection === "schedule" ? "white" : "#333",
          }}
        >
          Shift Schedule
        </button>
      </div>

      <div>{renderSection()}</div>
    </div>
  );
};

// Reusable tab button style
const tabButtonStyle = {
  border: "1px solid #ccc",
  padding: "10px 16px",
  margin: "0 6px",
  borderRadius: "6px",
  cursor: "pointer",
  transition: "0.3s",
};

export default NurseDashboard;
