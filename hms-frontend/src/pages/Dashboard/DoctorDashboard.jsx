import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [nurses, setNurses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNurses, setSelectedNurses] = useState({}); // { appointmentId: [nurseIds] }

  // Fetch appointments and nurses
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appointmentsRes, nursesRes] = await Promise.all([
          fetch(`${process.env.REACT_APP_API_URL}/api/doctor/appointments`),
          fetch(`${process.env.REACT_APP_API_URL}/api/admin/nurses`),
        ]);

        const appointmentsData = await appointmentsRes.json();
        const nursesData = await nursesRes.json();

        setAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);
        setNurses(Array.isArray(nursesData) ? nursesData : []);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle nurse selection
  const handleNurseSelect = (appointmentId, nurseId) => {
    setSelectedNurses((prev) => {
      const current = prev[appointmentId] || [];
      if (current.includes(nurseId)) {
        return { ...prev, [appointmentId]: current.filter((id) => id !== nurseId) };
      } else {
        return { ...prev, [appointmentId]: [...current, nurseId] };
      }
    });
  };

  // Assign nurses to appointment
  const handleAssignNurses = async (appointmentId) => {
    const nurseIds = selectedNurses[appointmentId] || [];
    if (nurseIds.length === 0) {
      alert("Select at least one nurse.");
      return;
    }

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/doctor/assign-nurses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentId, nurseIds }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Nurses assigned successfully!");
      } else {
        alert(data.message || "Error assigning nurses.");
      }
    } catch (err) {
      console.error(err);
      alert("Server error. Try again.");
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("doctorToken");
    localStorage.removeItem("doctorName");
    navigate("/");
  };

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div className="doctor-dashboard-container">
      <div className="dashboard-header">
        <h2>Doctor Dashboard</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <section>
        <h3>Upcoming Appointments</h3>
        {appointments.length === 0 ? (
          <p>No upcoming appointments.</p>
        ) : (
          appointments.map((appt) => (
            <div key={appt._id} className="appointment-card">
              <p>
                <strong>Patient:</strong> {appt.patientName} <br />
                <strong>Date:</strong> {new Date(appt.date).toLocaleString()}
              </p>

              <div>
                <p><strong>Assign Nurses:</strong></p>
                {nurses.map((nurse) => (
                  <label key={nurse._id} style={{ marginRight: "10px" }}>
                    <input
                      type="checkbox"
                      checked={(selectedNurses[appt._id] || []).includes(nurse._id)}
                      onChange={() => handleNurseSelect(appt._id, nurse._id)}
                    />
                    {nurse.fullName}
                  </label>
                ))}
                <button onClick={() => handleAssignNurses(appt._id)}>Assign</button>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default DoctorDashboard;
