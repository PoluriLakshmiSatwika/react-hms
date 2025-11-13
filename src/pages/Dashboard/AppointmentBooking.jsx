import React, { useState } from "react";
import "./AppointmentBooking.css";
import { useNavigate } from "react-router-dom"; 

const AppointmentBooking = () => {
  const navigate = useNavigate();
  const [disease, setDisease] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [bookedSlotsMap, setBookedSlotsMap] = useState({}); // ✅ added
  

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

  // ✅ Fetch doctors based on selected specialty
  const fetchDoctors = async (specialty) => {
    setLoading(true);
    setSelectedDoctor(null);
    setSelectedSlot("");

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/appointments/doctors/${specialty}`);
      const data = await res.json();

      if (data.success && Array.isArray(data.doctors)) {
        setDoctors(data.doctors);
        setBookedSlotsMap(data.bookedSlotsMap || {}); // ✅ store booked slots info
        setMessage("");
      } else {
        setDoctors([]);
        setMessage("No doctors found for this specialty");
      }
    } catch (err) {
      console.error("❌ Fetch doctors error:", err);
      setMessage("Error loading doctors");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Book appointment
  const handleBookAppointment = async () => {
    if (!selectedDoctor || !selectedSlot || !appointmentDate) {
      alert("Please select doctor, date, and slot");
      return;
    }

    setMessage("");

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/appointments/book`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            patientId: patient.id,
            doctorId: selectedDoctor._id,
            disease,
            appointmentDate,
            slotTime: selectedSlot,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setMessage("✅ Appointment booked successfully 🎉");
        setTimeout(() => {
          navigate('/patient/appointment');
        }, 1500);
      } else {
        setMessage(`❌ ${data.message || "Failed to book appointment"}`);
      }
    } catch (err) {
      console.error("⚠ Appointment booking error:", err);
      setMessage("⚠ Something went wrong. Please try again.");
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
              className={`doctor-card ${
                selectedDoctor?._id === doc._id ? "selected" : ""
              }`}
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

        {/* ✅ Slot Selection with Booked Slot Logic */}
        {selectedDoctor && (
          <>
            <h3 className="step-title">Available Slots</h3>

            <div className="time-grid">
              {selectedDoctor.slots?.length > 0 ? (
                selectedDoctor.slots.map((slot, idx) => {
                  const slotTime = slot.time || slot;
                  const slotKey = `${selectedDoctor._id}_${new Date(
                    appointmentDate
                  ).toISOString().split("T")[0]}_${slotTime}`;
                  const isBooked = bookedSlotsMap[slotKey] || false;

                  return (
                    <button
                      key={idx}
                      disabled={isBooked}
                      className={`time-slot ${
                        selectedSlot === slotTime ? "selected" : ""
                      } ${isBooked ? "booked" : ""}`}
                      onClick={() => !isBooked && setSelectedSlot(slotTime)}
                    >
                      {isBooked ? `${slotTime} ❌` : slotTime}
                    </button>
                  );
                })
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
