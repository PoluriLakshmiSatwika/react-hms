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
  const [bookedSlotsMap, setBookedSlotsMap] = useState({});

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

  // ✅ Map display names to DB values
  const diseases = [
    { label: "Cardiology", value: "cardiology" },
    { label: "Orthopedics", value: "Orthopedics" },
    { label: "Neurology", value: "Neurology" },
    { label: "Dermatology", value: "Dermatology" },
    { label: "ENT", value: "ent" },
    { label: "General Physician", value: "General Physician" },
  ];

  // ✅ Fetch doctors based on selected specialty
  const fetchDoctors = async (specialty) => {
    if (!specialty) return;

    setLoading(true);
    setSelectedDoctor(null);
    setSelectedSlot("");

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/appointments/doctors/${specialty}`
      );
      const data = await res.json();

      if (data.success && Array.isArray(data.doctors)) {
        setDoctors(data.doctors);
        setBookedSlotsMap(data.bookedSlotsMap || {});
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

  const handlePaymentAndBooking = async () => {
  if (!selectedDoctor || !selectedSlot || !appointmentDate) {
    alert("Please select doctor, date, and slot");
    return;
  }

  const amount = (selectedDoctor.fee || 500) * 100; // Razorpay works in paise

  try {
    // 1️⃣ Create Razorpay Order
    const orderRes = await fetch(
      `${process.env.REACT_APP_API_URL}/api/payments/create-order`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      }
    );

    const orderData = await orderRes.json();
    if (!orderData.success) {
      return alert("Failed to create order.");
    }

    // 2️⃣ Open Razorpay Popup
    const options = {
      key: orderData.key,
      amount: orderData.amount,
      currency: "INR",
      name: "Hospital Management System",
      description: "Appointment Fee Payment",
      order_id: orderData.order_id,
      handler: async function (response) {
        // 3️⃣ Verify Payment
        const verifyRes = await fetch(
          `${process.env.REACT_APP_API_URL}/api/payments/verify-payment`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          }
        );

        const verifyData = await verifyRes.json();
        if (!verifyData.success) {
          return alert("Payment failed! Try again.");
        }

        const paymentId = verifyData.payment_id;

        // 4️⃣ Finalize appointment
        const finalRes = await fetch(
          `${process.env.REACT_APP_API_URL}/api/appointments/finalize`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              patientId: patient.id,
              doctorId: selectedDoctor._id,
              disease,
              appointmentDate,
              slotTime: selectedSlot,
              paymentId,
            }),
          }
        );

        const finalData = await finalRes.json();
        if (finalData.success) {
          alert("Appointment Confirmed Successfully!");
          navigate("/patient/appointment");
        } else {
          alert(finalData.message || "Failed to save appointment");
        }
      },

      theme: { color: "#04AA6D" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (err) {
    console.error("❌ Payment Error:", err);
    alert("Something went wrong.");
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
            fetchDoctors(e.target.value); // send DB-friendly value
          }}
        >
          <option value="">Select Disease / Specialty</option>
          {diseases.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
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
                  <p className="doctor-specialty">{doc.specialty}</p>
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
                  const slotTime = slot.time || slot;
                  const slotKey = `${selectedDoctor._id}_${new Date(
                    appointmentDate
                  ).toISOString().split("T")[0]}_${slotTime}`;
                  const isBooked = bookedSlotsMap[slotKey] || false;

                  return (
                    <button
                      key={idx}
                      disabled={isBooked}
                      className={`time-slot ${selectedSlot === slotTime ? "selected" : ""} ${isBooked ? "booked" : ""}`}
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

        {/* Confirm Appointment */}
        {selectedDoctor && selectedSlot && appointmentDate && (
          <div className="button-container">
            <button className="btn btn-success" onClick={handlePaymentAndBooking}>
  Pay & Confirm Appointment
</button>

          </div>
        )}

        {/* Message */}
        {message && <p className="summary-title" style={{ marginTop: "10px" }}>{message}</p>}
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
