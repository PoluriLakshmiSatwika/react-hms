import React, { useEffect, useState } from "react";

const PatientDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Replace with your actual logged-in patient ID
  const patientId = "6520f1a2b3c4d5e67890abce";

  // Fetch doctors from backend
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/admin/doctors"); // your doctors API
        if (!res.ok) throw new Error("Failed to fetch doctors");
        const data = await res.json();
        setDoctors(data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Handle booking appointment
  const handleBookAppointment = async (doctor) => {
    try {
      const res = await fetch("http://localhost:8000/api/appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorId: doctor._id,
          patientId: patientId,
          date: new Date().toISOString(), // You can let patient choose date/time
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(`Appointment booked successfully with Dr. ${doctor.fullName}`);
      } else {
        setMessage(data.message || "Failed to book appointment. Try again.");
      }
    } catch (error) {
      console.error("Booking error:", error);
      setMessage("Error booking appointment.");
    }
  };

  if (loading) return <p>Loading doctors...</p>;

  return (
    <div className="patient-dashboard" style={{ padding: "20px" }}>
      <h1>Patient Dashboard</h1>

      {message && <p style={{ color: "green", fontWeight: "bold" }}>{message}</p>}

      <table
        border="1"
        cellPadding="10"
        style={{ marginTop: "20px", width: "100%", borderCollapse: "collapse" }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f0f0f0" }}>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {doctors.length > 0 ? (
            doctors.map((doctor) => (
              <tr key={doctor._id}>
                <td>{doctor.fullName}</td>
                <td>{doctor.email}</td>
                <td>{doctor.department}</td>
                <td>
                  <button
                    onClick={() => handleBookAppointment(doctor)}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "#007bff",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Book Appointment
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No doctors available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PatientDashboard;
