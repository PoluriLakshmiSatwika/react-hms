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

  const [nextOpSelection, setNextOpSelection] = useState({});

  useEffect(() => {
    const storedDoctor = JSON.parse(localStorage.getItem("doctor"));
    if (storedDoctor?.id) setDoctor(storedDoctor);
  }, []);

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
    } catch (err) {
      console.error("Error fetching appointments:", err);
    } finally {
      setLoading(false);
    }
  };

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
    }
  };

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
        setMessage(`Nurse ${nurse.fullName} Assigned Successfully`);
        fetchAppointments(doctor.id);
      }
    } catch (err) {
      console.error("Assign nurse error:", err);
    }
  };

  const handleSaveNextOP = async (appointmentId) => {
    const chosen = nextOpSelection[appointmentId];
    if (!chosen) {
      alert("Please choose next OP date (15 or 30 days)");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/appointments/next-op`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            appointmentId,
            nextOpDays: chosen,
          }),
        }
      );

      const data = await res.json();
      if (data.success) {
        setMessage("Next OP Date Updated Successfully");
        fetchAppointments(doctor.id);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Next OP update error:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("doctor");
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    if (doctor?.id) {
      fetchAppointments(doctor.id);
      fetchNurses();
    }
  }, [doctor]);

  if (!doctor) return <p>Please login</p>;

  return (
    <div className="doctor-dashboard">
      <div className="dashboard-header">
        <h2>Welcome, Dr. {doctor.fullName}</h2>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {message && <p className="message">{message}</p>}

      {/* ==================== APPOINTMENTS SECTION ==================== */}
      <div className="section">
        <h3>Appointments</h3>

        {loading ? (
          <p>Loading...</p>
        ) : appointments.length === 0 ? (
          <p>No appointments found</p>
        ) : (
          appointments.map((a) => (
            <div key={a._id} className="appointment-card">
              <p>
                <strong>Patient:</strong> {a.patientId?.fullName}
              </p>
              <p>
                <strong>Disease:</strong> {a.disease}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(a.appointmentDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Time:</strong> {a.slotTime}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {a.status === "Confirmed" && (
                  <span style={{ color: "green" }}>✔ Confirmed</span>
                )}
                {a.status === "Pending" && (
                  <span style={{ color: "#e67e22" }}>⏳ Pending</span>
                )}
                {a.status === "Cancelled" && (
                  <span style={{ color: "red" }}>❌ Cancelled</span>
                )}
                {a.status === "Completed" && (
                  <span style={{ color: "blue" }}>✔ Completed</span>
                )}
              </p>

              {a.nextAppointmentDate && (
                <p style={{ color: "green", fontWeight: "bold" }}>
                  Next OP:{" "}
                  {new Date(a.nextAppointmentDate).toLocaleDateString()}
                </p>
              )}

              <select
                onChange={(e) =>
                  setNextOpSelection({
                    ...nextOpSelection,
                    [a._id]: e.target.value,
                  })
                }
              >
                <option value="">Choose Next OP</option>
                <option value="15">Next OP after 15 days</option>
                <option value="30">Next OP after 30 days</option>
              </select>

              <button
                className="save-next-op-btn"
                onClick={() => handleSaveNextOP(a._id)}
              >
                Save Next OP
              </button>

              <p>
                <strong>Assigned Nurses:</strong>{" "}
                {a.assignedNurses?.length
                  ? a.assignedNurses.map((n) => n.nurseName).join(", ")
                  : "None"}
              </p>
            </div>
          ))
        )}
      </div>

      {/* ======================= NURSES SECTION ======================= */}
<div className="section">
  <h3>Available Nurses</h3>

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
                const ap = appointments.find(
                  (ap) => ap._id === e.target.value
                );
                if (ap) handleAssignNurse(ap, nurse);
              }}
            >
              <option value="">Select Appointment</option>

              {appointments
                .filter(
                  (a) =>
                    a.status !== "Completed" &&
                    a.status !== "Cancelled"
                )
                .map((a) => (
                  <option value={a._id} key={a._id}>
                    {a.patientId.fullName} (
                    {new Date(a.appointmentDate).toLocaleDateString()})
                  </option>
                ))}
            </select>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
    </div>
  );
};

export default DoctorDashboard;
