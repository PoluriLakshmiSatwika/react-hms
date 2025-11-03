import React, { useState } from "react";
import "./PatientDashboard.css";

const PatientDashboard = () => {
  const [activeTab, setActiveTab] = useState("book");
  const [appointments] = useState([]);
  const [payments] = useState([]);
  const [remainingBookings] = useState(0);

  const handleBookAppointment = () => {
    alert("Appointment booking feature coming soon!");
  };

  return (
    <div className="patient-dashboard">
      <header className="dashboard-header">
        <h1>Patient Dashboard</h1>
        <button
          onClick={() => (window.location.href = "/login")}
          className="logout-btn"
        >
          Logout
        </button>
      </header>

      <nav className="dashboard-nav">
        <button
          className={activeTab === "book" ? "active" : ""}
          onClick={() => setActiveTab("book")}
        >
          Book Appointment
        </button>
        <button
          className={activeTab === "upcoming" ? "active" : ""}
          onClick={() => setActiveTab("upcoming")}
        >
          Upcoming Appointments
        </button>
        <button
          className={activeTab === "payments" ? "active" : ""}
          onClick={() => setActiveTab("payments")}
        >
          Payment History
        </button>
        <button
          className={activeTab === "remaining" ? "active" : ""}
          onClick={() => setActiveTab("remaining")}
        >
          Remaining Bookings
        </button>
      </nav>

      <main className="dashboard-content">
        {activeTab === "book" && (
          <section className="tab-section">
            <h2>Book Appointment</h2>
            <button onClick={handleBookAppointment} className="action-btn">
              + Book New Appointment
            </button>
          </section>
        )}

        {activeTab === "upcoming" && (
          <section className="tab-section">
            <h2>Upcoming Appointments</h2>
            {appointments.length === 0 ? (
              <p>No upcoming appointments yet.</p>
            ) : (
              <ul>
                {appointments.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            )}
          </section>
        )}

        {activeTab === "payments" && (
          <section className="tab-section">
            <h2>Payment History</h2>
            {payments.length === 0 ? (
              <p>No payment history available.</p>
            ) : (
              <ul>
                {payments.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            )}
          </section>
        )}

        {activeTab === "remaining" && (
          <section className="tab-section">
            <h2>Remaining Valid Bookings</h2>
            <p>
              You have <strong>{remainingBookings}</strong> prepaid slot
              {remainingBookings === 1 ? "" : "s"} remaining.
            </p>
          </section>
        )}
      </main>
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