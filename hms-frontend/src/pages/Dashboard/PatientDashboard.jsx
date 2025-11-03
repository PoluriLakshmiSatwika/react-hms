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

export default PatientDashboard;
