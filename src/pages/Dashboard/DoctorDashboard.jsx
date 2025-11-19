import React, { useEffect, useState } from "react";
import "./DoctorDashboard.css";
import { useNavigate } from "react-router-dom";

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [nurses, setNurses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Load doctor from localStorage
  useEffect(() => {
    const storedDoctor = JSON.parse(localStorage.getItem("doctor"));
    if (storedDoctor?.id) setDoctor(storedDoctor);
  }, []);

  // Fetch doctor's appointments
  const fetchAppointments = async (doctorId) => {
    if (!doctorId) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/appointments/doctor/${doctorId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      const data = await res.json();

      if (data.success) setAppointments(data.data);
      else setAppointments([]);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all nurses
  const fetchNurses = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/admin/nurses`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      const data = await res.json();

      if (Array.isArray(data)) setNurses(data);
    } catch (err) {
      console.error("Error fetching nurses:", err);
      setNurses([]);
    }
  };

  // Assign nurse
  const handleAssignNurse = async (appointment, nurse) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/assignments`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            appointmentId: appointment._id,
            nurseIds: [nurse._id],
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        setMessage(`✅ Nurse ${nurse.fullName} assigned successfully`);

        // update UI
        setAppointments((prev) =>
          prev.map((a) =>
            a._id === appointment._id
              ? { ...a, assignedNurses: data.data.assignedNurses }
              : a
          )
        );
      } else {
        setMessage("❌ Failed to assign nurse");
      }
    } catch (err) {
      console.error(err);
      setMessage("⚠ Error assigning nurse");
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("doctor");
    navigate("/");
  };

  // Load initial data
  useEffect(() => {
    if (doctor?.id) {
      fetchAppointments(doctor.id);
      fetchNurses();
    }
  }, [doctor]);

  if (!doctor) return <p>Please login as doctor to view dashboard.</p>;

  return (
    <div className="doctor-dashboard">
      <div className="dashboard-header">
        <h2>Welcome, Dr. {doctor.fullName}</h2>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {message && <p className="message">{message}</p>}

      {/* ------------ Appointments Section ------------ */}
      <div className="section">
        <h3>Appointments</h3>

        {loading ? (
          <p>Loading appointments...</p>
        ) : appointments.length === 0 ? (
          <p>No appointments available.</p>
        ) : (
          appointments.map((a) => (
            <div key={a._id} className="appointment-card">
              <p>
                <strong>Patient:</strong>{" "}
                {a.patientId?.fullName || "Unknown"}
              </p>

              <p>
                <strong>Disease:</strong> {a.appointmentId?.disease || "N/A"}
              </p>

              <p>
                <strong>Date:</strong>{" "}
                {a.appointmentId?.appointmentDate
                  ? new Date(a.appointmentId.appointmentDate).toLocaleDateString()
                  : "N/A"}
              </p>

              <p>
                <strong>Time:</strong> {a.appointmentId?.slotTime || "N/A"}
              </p>

              <p>
                <strong>Status:</strong> {a.status}
              </p>

              <p>
                <strong>Assigned Nurses:</strong>{" "}
                {a.assignedNurses?.length > 0
                  ? a.assignedNurses
                      .map((n) => n.nurseName || n.fullName)
                      .join(", ")
                  : "None"}
              </p>
            </div>
          ))
        )}
      </div>

      {/* ------------ Nurses Section ------------ */}
      <div className="section">
        <h3>Available Nurses</h3>

        {nurses.length === 0 ? (
          <p>No nurses available.</p>
        ) : (
          <table className="nurse-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Department</th>
                <th>Shift</th>
                <th>Assign</th>
              </tr>
            </thead>
            <tbody>
              {nurses.map((nurse) => (
                <tr key={nurse._id}>
                  <td>{nurse.fullName}</td>
                  <td>{nurse.email}</td>
                  <td>{nurse.phone}</td>
                  <td>{nurse.department}</td>
                  <td>{nurse.shiftTiming}</td>

                  <td>
                    <select
                      onChange={(e) => {
                        const appointment = appointments.find(
                          (x) => x._id === e.target.value
                        );
                        if (appointment) handleAssignNurse(appointment, nurse);
                      }}
                    >
                      <option value="">Select Appointment</option>

                      {appointments
                        .filter(
                          (x) =>
                            x.status !== "Completed" &&
                            x.status !== "Cancelled"
                        )
                        .map((x) => (
                          <option key={x._id} value={x._id}>
                            {x.patientId?.fullName} (
                            {new Date(
                              x.appointmentId?.appointmentDate
                            ).toLocaleDateString()}
                            )
                          </option>
                        ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
