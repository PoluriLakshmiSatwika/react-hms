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

  // 🔐 Temporary Patient ID (Later take from login session)
  const patientId = "690b006c0301e8640732a726";

  const diseases = [
    "Cardiology",
    "Orthopedics",
    "Neurology",
    "Dermatology",
    "ENT",
    "General Physician",
  ];

  // ✅ Fetch doctors based on disease
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

  // ✅ Book Appointment API
  const bookAppointment = async () => {
    if (!selectedDoctor || !selectedSlot || !appointmentDate) {
      alert("Please select date, doctor and slot");
      return;
    }

    const payload = {
      patientId,
      doctorId: selectedDoctor._id,
      disease,
      appointmentDate,
      slotTime: selectedSlot,
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
      <h2>Book Appointment</h2>

      {/* Select Disease */}
      <select
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

      {/* Date Picker */}
      {disease && (
        <input
          type="date"
          value={appointmentDate}
          onChange={(e) => setAppointmentDate(e.target.value)}
          min={new Date().toISOString().split("T")[0]}
        />
      )}

      {/* Doctors List */}
      {loading && <p>Loading doctors...</p>}
      <div className="doctor-list">
        {doctors.map((doc) => (
          <div
            key={doc._id}
            className={`doctor-card ${selectedDoctor?._id === doc._id ? "selected" : ""}`}
            onClick={() => setSelectedDoctor(doc)}
          >
            <h3>{doc.fullName}</h3>
            <p>{doc.specialty}</p>
            <p>Department: {doc.department}</p>
            <p>Fee: ₹{doc.fee || 300} (3 visits valid)</p>
          </div>
        ))}
      </div>

      {/* Slot Selection */}
      {selectedDoctor && (
        <>
          <h3>Available Slots</h3>
          <div className="slot-container">
            {selectedDoctor.slots?.length > 0 ? (
              selectedDoctor.slots.map((slot, i) => (
                <button
                  key={i}
                  className={selectedSlot === slot ? "slot selected-slot" : "slot"}
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

      {/* Book Appointment Button */}
      {selectedDoctor && selectedSlot && appointmentDate && (
        <button className="book-btn" onClick={bookAppointment}>
          Book Appointment
        </button>
      )}

      {/* Message */}
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default AppointmentBooking;
