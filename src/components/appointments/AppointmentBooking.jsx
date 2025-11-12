
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
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
  const [bookedSlotsMap, setBookedSlotsMap] = useState({});
  const navigate = useNavigate();

  const patient = window.currentPatient;
  window.currentPatient = {
    id: "6914010e12c5cc1ee2b4d45c",  // ✅ your patient ID from MongoDB
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

  // ✅ Fetch doctors based on disease
  const fetchDoctors = async (disease) => {
    setLoading(true);
    setSelectedDoctor(null);
    setSelectedSlot("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/appointments/doctors/${disease}`);
      const data = await res.json();
      if (data.success) {
        setDoctors(data.doctors);
        setBookedSlotsMap(data.bookedSlotsMap || {}); // ✅ Store booked slots map
      } else {
        setMessage("No doctors found");
      }
    } catch {
      setMessage("Error loading doctors");
    }
    setLoading(false);
  };

  // ✅ Step 1: Book appointment (Pending) → Step 2: Process Payment → Confirm
  const handlePayAndBook = async () => {
    if (!selectedDoctor || !selectedSlot || !appointmentDate) {
      alert("Please select doctor, date and slot");
      return;
    }

    setMessage(""); // Reset message

    try {
      // ✅ 1. Create appointment (Pending status)
      const appointmentRes = await fetch(`${API_BASE_URL}/api/appointments/book`, {
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
      console.log("📌 Appointment API:", appointmentData);

      if (!appointmentData.success) {
        // Show specific error message if slot is already booked
        if (appointmentRes.status === 409) {
          setMessage("❌ This slot is already booked by another patient. Please choose another slot or date.");
        } else {
          setMessage(`❌ Failed to create appointment: ${appointmentData.message || 'Unknown error'}`);
        }
        return;
      }

      // const appointmentId = appointmentData.appointmentId;
      const appointmentId = appointmentData.appointmentId || appointmentData.data._id;


      // ✅ 2. Call Payment API
      const paymentRes = await fetch(`${API_BASE_URL}/api/payments/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: patient.id,
          doctorId: selectedDoctor._id,
          appointmentId,
          amount: selectedDoctor.fee || 500,
          validityCount: 3,  // ✅ 3 valid visits per payment
          paymentMethod: "UPI",
        }),
      });

      // const paymentData = await paymentRes.json();
      // ✅ Prevent HTML error crash
      let paymentData;
      try {
        paymentData = await paymentRes.json();
      } catch (err) {
        console.error("❌ Payment API did not return JSON:", err);
        setMessage("⚠ Payment server error. Check backend logs.");
        return;
      }
      console.log("💰 Payment API:", paymentData);

      if (paymentData.success) {
        setMessage("✅ Payment Successful! Appointment Confirmed 🎉");

        // 🔄 Refresh doctors list to show updated slot availability
        setTimeout(() => {
          if (disease) {
            fetchDoctors(disease);
          }
        }, 1000);

        // Redirect to patient appointments after 2 seconds using router navigation
        setTimeout(() => {
          // Use react-router navigation to avoid full page reload
          navigate('/patientAppointment');
        }, 2000);
      } else {
        setMessage("❌ Payment Failed");
      }

    } catch (err) {
      console.error(err);
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
            <option key={i} value={d}>{d}</option>
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
        selectedDoctor.slots.map((slot, idx) => {
          // slot can be string ("10:00 AM") or object { time: "", isBooked: true }
          const slotTime = slot.time || slot;
          
          // ✅ Check if slot is booked using the booked slots map and selected date
          const slotKey = `${selectedDoctor._id}_${appointmentDate}_${slotTime}`;
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


        {/* Pay & Confirm Button */}
        {selectedDoctor && selectedSlot && appointmentDate && (
          <div className="button-container">
            <button className="btn btn-success" onClick={handlePayAndBook}>
              Pay & Confirm Appointment
            </button>
          </div>
        )}

        {/* Message */}
        {message && <p className="summary-title" style={{ marginTop: "10px" }}>{message}</p>}
        {message.includes("Successful") && (
          <div className="popup-overlay">
            <div className="popup-box">
              ✅ Appointment Booked & Paid Successfully!
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AppointmentBooking;
