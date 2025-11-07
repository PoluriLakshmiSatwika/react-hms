import React, { useState } from "react";
import API_BASE_URL from "../../api/apiConfig";
import "./AppointmentBooking.css";

const AppointmentBooking = () => {
  const [disease, setDisease] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [date, setDate] = useState("");
  const [patientId, setPatientId] = useState(""); // You can set this after login
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const diseases = [
    "Cardiology",
    "Orthopedics",
    "Neurology",
    "Dermatology",
    "ENT",
    "General Physician",
  ];

  const defaultSlots = ["09:00 AM", "11:00 AM", "02:00 PM", "04:00 PM", "06:00 PM"];

  // ✅ Fetch doctors
  const fetchDoctors = async (d) => {
    setDisease(d);
    setSelectedDoctor(null);
    setDoctors([]);
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/appointments/doctors/${d}`);
      const data = await res.json();
      if (data.success) {
        setDoctors(data.doctors);
      } else {
        setDoctors([]);
      }
    } catch (err) {
      console.error("Doctor fetch error", err);
    }
    setLoading(false);
  };

  // ✅ Book Appointment
  const bookAppointment = async () => {
    if (!patientId) return setMessage("❌ Enter Patient ID");
    if (!selectedDoctor || !selectedSlot || !date) {
      return setMessage("❌ Select doctor, date & slot");
    }

    setMessage("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/appointments/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId,
          doctorId: selectedDoctor._id,
          disease,
          appointmentDate: date,
          slotTime: selectedSlot,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage("✅ Appointment booked successfully!");
      } else {
        setMessage("❌ " + data.message);
      }
    } catch (err) {
      setMessage("❌ Server error");
    }
  };

  return (
    <div className="appointment-container">
      <h2>Book Appointment</h2>

      {/* Patient ID Input */}
      <input
        type="text"
        placeholder="Enter Patient ID"
        value={patientId}
        onChange={(e) => setPatientId(e.target.value)}
        className="input-box"
      />

      {/* Disease Selection */}
      <select
        value={disease}
        onChange={(e) => fetchDoctors(e.target.value)}
        className="input-box"
      >
        <option value="">Select Disease / Speciality</option>
        {diseases.map((d, i) => (
          <option key={i} value={d}>
            {d}
          </option>
        ))}
      </select>

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
          </div>
        ))}
      </div>

      {/* Date Picker */}
      {selectedDoctor && (
        <input
          type="date"
          className="input-box"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      )}

      {/* Slot Selection */}
      {selectedDoctor && (
        <>
          <h3>Available Slots</h3>
          <div className="slot-container">
            {(selectedDoctor.slots || defaultSlots).map((slot, i) => (
              <button
                key={i}
                className={selectedSlot === slot ? "slot selected-slot" : "slot"}
                onClick={() => setSelectedSlot(slot)}
              >
                {slot}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Book Button */}
      {selectedDoctor && selectedSlot && date && (
        <button className="book-btn" onClick={bookAppointment}>
          Pay & Book Appointment
        </button>
      )}

      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default AppointmentBooking;
