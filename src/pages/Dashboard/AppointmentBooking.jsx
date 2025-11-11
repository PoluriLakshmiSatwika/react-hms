import React, { useState } from "react";
import "./AppointmentBooking.css";

const AppointmentBooking = () => {
  const [disease, setDisease] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ Get logged-in patient from localStorage
  const patient = JSON.parse(localStorage.getItem("patient"));

  if (!patient) {
    return (
      <div className="appointment-container">
        <h2 style={{ color: "red", textAlign: "center" }}>
          ❗ Please login as Patient to book an appointment
        </h2>
      </div>
    );
  }

  const diseases = [
    "Cardiology",
    "Orthopedics",
    "Neurology",
    "Dermatology",
    "ENT",
    "General Physician",
  ];

  // ✅ Fetch doctors based on selected speciality
 const fetchDoctors = async (specialty) => {
  setLoading(true);
  setSelectedDoctor(null);
  setSelectedSlot("");
  try {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/doctors/by-specialty/${specialty}`);
    const data = await res.json();
    if (res.ok && data.success && data.doctors?.length) {
      setDoctors(data.doctors);
      setMessage("");
    } else {
      setDoctors([]);
      setMessage(data.message || "No doctors found");
    }
  } catch (err) {
    console.error("❌ Fetch doctors error:", err);
    setMessage("Error loading doctors");
  } finally {
    setLoading(false);
  }
};


  // ✅ Book appointment only (no payment)
  const handleBookAppointment = async () => {
    if (!selectedDoctor || !selectedSlot || !appointmentDate) {
      alert("Please select doctor, date and slot");
      return;
    }

    setMessage("");

    try {
      const appointmentRes = await fetch(`${process.env.REACT_APP_API_URL}/api/appointment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: patient.id,
          doctorId: selectedDoctor._id,
          disease,
          appointmentDate,
          slotTime: selectedSlot,
        }),
      });

      const appointmentData = await appointmentRes.json();
      if (appointmentData.success) {
        setMessage("✅ Appointment booked successfully 🎉");
        setTimeout(() => {
          window.location.href = "/patient/appointments";
        }, 1500);
      } else {
        setMessage("❌ Failed to book appointment");
      }
    } catch {
      setMessage("⚠ Something went wrong");
    }
  };

  return (
    <div className="appointment-container">
      <div className="appointment-wrapper">
        <h2 className="title">Book Appointment</h2>
        <p className="subtitle">Welcome, {patient.fullName}</p>

        {/* Disease Selection */}
        <select
          className="text-input"
          value={disease}
          onChange={(e) => {
            setDisease(e.target.value);
            fetchDoctors(e.target.value);
          }}
        >
          <option value="">Select Disease / Specialty</option>
          {diseases.map((d, i) => (
            <option key={i} value={d}>
              {d}
            </option>
          ))}
        </select>

        {/* Date Selection */}
        {disease && (
          <input
            type="date"
            className="date-input"
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
          />
        )}

        {/* Doctor List */}
        {loading && <p>Loading doctors...</p>}
        <div className="doctor-list">
          {doctors.map((doc) => (
            <div
              key={doc._id}
              className={`doctor-card ${selectedDoctor?._id === doc._id ? "selected" : ""}`}
              onClick={() => setSelectedDoctor(doc)}
            >
              <div className="doctor-info">
                <div className="doctor-avatar">{doc.fullName[0]}</div>
                <div className="doctor-details">
                  <p className="doctor-name">{doc.fullName}</p>
                  <p className="doctor-specialty">{doc.department}</p>
                  <p>Fee: ₹{doc.fee || 500}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Slot Selection */}
        {selectedDoctor && (
          <>
            <h3 className="step-title">Available Slots</h3>
            <div className="time-grid">
              {selectedDoctor.slots?.length > 0 ? (
                selectedDoctor.slots.map((slot, idx) => (
                  <button
                    key={idx}
                    className={`time-slot ${selectedSlot === slot ? "selected" : ""}`}
                    onClick={() => setSelectedSlot(slot)}
                  >
                    {slot}
                  </button>
                ))
              ) : (
                <p>No Slots Available</p>
              )}
            </div>
          </>
        )}

        {/* Confirm Appointment Button */}
        {selectedDoctor && selectedSlot && appointmentDate && (
          <div className="button-container">
            <button className="btn btn-success" onClick={handleBookAppointment}>
              Confirm Appointment
            </button>
          </div>
        )}

        {/* Message */}
        {message && (
          <p className="summary-title" style={{ marginTop: "10px" }}>
            {message}
          </p>
        )}
        {message.includes("successfully") && (
          <div className="popup-overlay">
            <div className="popup-box">✅ Appointment Booked Successfully!</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentBooking;
