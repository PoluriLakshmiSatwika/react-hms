import React, { useState } from "react";
import "./PatientDashboard.css";

const PatientDashboard = () => {
  const [activeTab, setActiveTab] = useState("book");

  // Mock Data (replace with backend later)
  const [appointments] = useState([
    { date: "2025-11-10", time: "10:00 AM", doctor: "Dr. Smith" },
  ]);

  const [payments] = useState([
    { date: "2025-11-01", amount: "₹500", method: "UPI" },
  ]);

  const [remainingBookings] = useState(2);

  const [doctors] = useState([
    { name: "Dr. Ramesh Rao", specialization: "Cardiologist", shift: "9:00 AM - 1:00 PM", fee: "₹600" },
    { name: "Dr. Neha Sharma", specialization: "Dermatologist", shift: "2:00 PM - 6:00 PM", fee: "₹400" },
    { name: "Dr. Arjun Patel", specialization: "Orthopedic", shift: "10:00 AM - 2:00 PM", fee: "₹550" },
    { name: "Dr. Priya Menon", specialization: "Gynecologist", shift: "4:00 PM - 8:00 PM", fee: "₹700" },
  ]);

  const handleBookAppointment = (doctor) => {
    alert(`Booking appointment with ${doctor.name}...`);
  };

  return (
    <div className="patient-dashboard">
      {/* ===== Header ===== */}
      <header className="dashboard-header">
        <h1>Patient Dashboard</h1>
        <button
          onClick={() => (window.location.href = "/login")}
          className="logout-btn"
        >
          Logout
        </button>
      </header>

      {/* ===== Navigation ===== */}
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

      {/* ===== Dashboard Content ===== */}
      <main className="dashboard-content">
        {/* === Book Appointment Tab === */}
        {activeTab === "book" && (
          <section className="tab-section">
            <h2>Book Appointment</h2>
            <p>Select a doctor to book your appointment.</p>

            <table>
              <thead>
                <tr>
                  <th>Doctor</th>
                  <th>Specialization</th>
                  <th>Shift</th>
                  <th>OP Fee</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((doc, i) => (
                  <tr key={i}>
                    <td>{doc.name}</td>
                    <td>{doc.specialization}</td>
                    <td>{doc.shift}</td>
                    <td>{doc.fee}</td>
                    <td>
                      <button
                        className="action-btn"
                        onClick={() => handleBookAppointment(doc)}
                      >
                        Book Now
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* === Upcoming Appointments === */}
        {activeTab === "upcoming" && (
          <section className="tab-section">
            <h2>Upcoming Appointments</h2>
            {appointments.length === 0 ? (
              <p>No upcoming appointments yet.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Doctor</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((a, i) => (
                    <tr key={i}>
                      <td>{a.date}</td>
                      <td>{a.time}</td>
                      <td>{a.doctor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        )}

        {/* === Payment History === */}
        {activeTab === "payments" && (
          <section className="tab-section">
            <h2>Payment History</h2>
            {payments.length === 0 ? (
              <p>No payment history available.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Method</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p, i) => (
                    <tr key={i}>
                      <td>{p.date}</td>
                      <td>{p.amount}</td>
                      <td>{p.method}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        )}

        {/* === Remaining Bookings === */}
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
