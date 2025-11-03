import React, { useState } from "react";

const PatientDashboard = () => {
  const [activeSection, setActiveSection] = useState("book");
  const [appointments, setAppointments] = useState([
    { id: 1, doctor: "Dr. Smith", date: "2025-11-04", time: "10:30 AM" },
    { id: 2, doctor: "Dr. Johnson", date: "2025-11-06", time: "3:00 PM" },
  ]);

  const [payments] = useState([
    { id: 1, date: "2025-10-30", amount: "₹500", status: "Paid" },
    { id: 2, date: "2025-10-25", amount: "₹700", status: "Pending" },
  ]);

  const [remainingSlots] = useState(3);
  const [form, setForm] = useState({ doctor: "", date: "", time: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleBook = (e) => {
    e.preventDefault();
    if (!form.doctor || !form.date || !form.time)
      return alert("Please fill all fields!");

    const newAppt = {
      id: appointments.length + 1,
      doctor: form.doctor,
      date: form.date,
      time: form.time,
    };
    setAppointments([...appointments, newAppt]);
    setForm({ doctor: "", date: "", time: "" });
    alert("Appointment booked successfully!");
  };

  const renderSection = () => {
    switch (activeSection) {
      case "book":
        return (
          <div style={sectionContainer}>
            <h3 style={sectionTitle}>Book Appointment</h3>
            <form onSubmit={handleBook}>
              <div style={formRow}>
                <label style={labelStyle}>Doctor Name:</label>
                <input
                  type="text"
                  name="doctor"
                  value={form.doctor}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="Enter doctor name"
                />
              </div>

              <div style={formRow}>
                <label style={labelStyle}>Date:</label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              <div style={formRow}>
                <label style={labelStyle}>Time:</label>
                <input
                  type="time"
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              <button type="submit" style={buttonPrimary}>
                Book Appointment
              </button>
            </form>
          </div>
        );

      case "upcoming":
        return (
          <div style={sectionContainer}>
            <h3 style={sectionTitle}>Upcoming Appointments</h3>
            <table style={tableStyle}>
              <thead>
                <tr style={tableHeader}>
                  <th style={thStyle}>ID</th>
                  <th style={thStyle}>Doctor</th>
                  <th style={thStyle}>Date</th>
                  <th style={thStyle}>Time</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt) => (
                  <tr key={appt.id} style={tableRow}>
                    <td style={tdStyle}>{appt.id}</td>
                    <td style={tdStyle}>{appt.doctor}</td>
                    <td style={tdStyle}>{appt.date}</td>
                    <td style={tdStyle}>{appt.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case "payment":
        return (
          <div style={sectionContainer}>
            <h3 style={sectionTitle}>Payment History</h3>
            <table style={tableStyle}>
              <thead>
                <tr style={tableHeader}>
                  <th style={thStyle}>ID</th>
                  <th style={thStyle}>Date</th>
                  <th style={thStyle}>Amount</th>
                  <th style={thStyle}>Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} style={tableRow}>
                    <td style={tdStyle}>{p.id}</td>
                    <td style={tdStyle}>{p.date}</td>
                    <td style={tdStyle}>{p.amount}</td>
                    <td style={tdStyle}>{p.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case "remaining":
        return (
          <div style={sectionContainer}>
            <h3 style={sectionTitle}>Remaining Prepaid Slots</h3>
            <p style={{ fontSize: "18px", color: "#004aad", textAlign: "center" }}>
              You have <strong>{remainingSlots}</strong> prepaid slots left.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={dashboardContainer}>
      <h2 style={mainTitle}>Patient Dashboard</h2>
      <p style={{ textAlign: "center", color: "#444", marginBottom: "20px" }}>
        Manage appointments and view your medical records.
      </p>

      {/* Navigation Buttons */}
      <div style={buttonGroup}>
        <button
          onClick={() => setActiveSection("book")}
          style={{
            ...navButton,
            backgroundColor: activeSection === "book" ? "#004aad" : "#e8e8e8",
            color: activeSection === "book" ? "#fff" : "#333",
          }}
        >
          Book Appointment
        </button>
        <button
          onClick={() => setActiveSection("upcoming")}
          style={{
            ...navButton,
            backgroundColor: activeSection === "upcoming" ? "#004aad" : "#e8e8e8",
            color: activeSection === "upcoming" ? "#fff" : "#333",
          }}
        >
          Upcoming Appointments
        </button>
        <button
          onClick={() => setActiveSection("payment")}
          style={{
            ...navButton,
            backgroundColor: activeSection === "payment" ? "#004aad" : "#e8e8e8",
            color: activeSection === "payment" ? "#fff" : "#333",
          }}
        >
          Payment History
        </button>
        <button
          onClick={() => setActiveSection("remaining")}
          style={{
            ...navButton,
            backgroundColor: activeSection === "remaining" ? "#004aad" : "#e8e8e8",
            color: activeSection === "remaining" ? "#fff" : "#333",
          }}
        >
          Remaining Bookings
        </button>
      </div>

      {/* Active Section */}
      <div>{renderSection()}</div>
    </div>
  );
};

/* ------------------------ 💅 STYLES ------------------------ */
const dashboardContainer = {
  maxWidth: "900px",
  margin: "40px auto",
  padding: "25px",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  backgroundColor: "white",
};

const mainTitle = {
  textAlign: "center",
  color: "#004aad",
  fontSize: "28px",
  marginBottom: "10px",
};

const buttonGroup = {
  textAlign: "center",
  marginBottom: "25px",
};

const navButton = {
  border: "none",
  padding: "10px 18px",
  margin: "0 6px",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "500",
  transition: "0.3s",
};

const sectionContainer = {
  padding: "15px",
  border: "1px solid #ddd",
  borderRadius: "10px",
  backgroundColor: "#f9f9ff",
};

const sectionTitle = {
  color: "#004aad",
  fontSize: "20px",
  textAlign: "center",
  marginBottom: "15px",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "10px",
};

const thStyle = {
  border: "1px solid #ccc",
  padding: "10px",
  textAlign: "left",
  backgroundColor: "#e9f0ff",
  color: "#004aad",
};

const tdStyle = {
  border: "1px solid #ccc",
  padding: "10px",
  textAlign: "left",
};

const tableHeader = {
  backgroundColor: "#e9f0ff",
};

const tableRow = {
  backgroundColor: "#fff",
};

const labelStyle = {
  display: "block",
  fontWeight: "bold",
  marginBottom: "6px",
};

const inputStyle = {
  width: "100%",
  padding: "8px",
  marginBottom: "12px",
  borderRadius: "6px",
  border: "1px solid #ccc",
};

const formRow = {
  marginBottom: "12px",
};

const buttonPrimary = {
  backgroundColor: "#004aad",
  color: "white",
  padding: "10px 16px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  marginTop: "5px",
};

export default PatientDashboard;