import React, { useState } from "react";
import API_BASE_URL from "../../api/apiConfig";
import "./AppointmentBooking.css";


const AppointmentBooking = () => {

   const [disease, setDisease] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const patient = window.currentPatient; // ✅ Logged in patient
  window.currentPatient = {
  id: "690b3860e29dd0f7e76d6e1d",  // ✅ your patient ID from MongoDB
  fullName: "Test Patient",
  phone: "9999999999",
  age: 22,
  gender: "Male"
};


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

  // ✅ Fetch Doctors by disease
  const fetchDoctors = async (disease) => {
    setLoading(true);
    setDoctors([]);
    setSelectedDoctor(null);
    setSelectedSlot("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/appointments/doctors/${disease}`);
      const data = await res.json();
      if (data.success) {
        setDoctors(data.doctors);
      } else {
        setMessage("No doctors found");
      }
    } catch (err) {
      console.error("❌ Doctor fetch error", err);
      setMessage("Failed to load doctors");
    }
    setLoading(false);
  };

  // ✅ Book Appointment
  const bookAppointment = async () => {
    if (!selectedDoctor || !selectedSlot || !appointmentDate) {
      alert("Please select date, doctor, and slot");
      return;
    }

    const payload = {
      patientId: patient.id, // ✅ From login
      doctorId: selectedDoctor._id,
      disease,
      appointmentDate,
      slotTime: selectedSlot,
      contactNumber: patient.phone,      // optional if you store in login
      patientName: patient.fullName,    // optional
      age: patient.age,                 // optional
      gender: patient.gender            // optional
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/appointments/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setMessage("✅ Appointment booked successfully!");
      } else {
        setMessage("❌ Booking Failed: " + data.message);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Server error while booking");
    }
  };

  return (
    <div className="appointment-container">
      <div className="appointment-wrapper">
        <div className="header">
          <h2 className="title">Book Appointment</h2>
          <p className="subtitle">Welcome, {patient.fullName}</p>
        </div>

        {/* Select Disease */}
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
            <option key={i} value={d}>{d}</option>
          ))}
        </select>

        {/* Select Date */}
        {disease && (
          <input
            className="date-input"
            type="date"
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
          />
        )}

        {/* Doctors List */}
        {loading && <p className="label">Loading doctors...</p>}
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
                selectedDoctor.slots.map((slot, i) => (
                  <button
                    key={i}
                    className={`time-slot ${selectedSlot === slot ? "selected" : ""}`}
                    onClick={() => setSelectedSlot(slot)}
                  >
                    {slot}
                  </button>
                ))
              ) : (
                <p>No slots available</p>
              )}
            </div>
          </>
        )}

        {/* Book Button */}
        {selectedDoctor && selectedSlot && appointmentDate && (
          <div className="button-container">
            <button className="btn btn-success" onClick={bookAppointment}>
              Book Appointment
            </button>
          </div>
        )}

        {/* Message */}
        {message && <p className="summary-title" style={{ marginTop: "10px" }}>{message}</p>}
      </div>
    </div>
  );
};

export default AppointmentBooking;
