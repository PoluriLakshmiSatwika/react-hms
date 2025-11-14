// DoctorDashboard.jsx
import React, { useEffect, useState, useCallback } from "react";
import "./DoctorDashboard.css";
import API_BASE_URL from "../../api/apiConfig";

const DoctorDashboard = () => {
  const doctorId = localStorage.getItem("doctorId");
  const doctorName = localStorage.getItem("doctorName");

  const [appointments, setAppointments] = useState([]);
  const [nurses, setNurses] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedNurses, setSelectedNurses] = useState([]);
  const [shiftFilter, setShiftFilter] = useState("");
  const [loadingRefresh, setLoadingRefresh] = useState(false);
  const [assignLoading, setAssignLoading] = useState(false);
  const [toast, setToast] = useState({ msg: "", type: "" });

  /* Redirect if not logged in */
  useEffect(() => {
    if (!doctorId) window.location.href = "/login";
  }, [doctorId]);

  /* Fetch Appointments */
  const fetchAppointments = useCallback(async () => {
    if (!doctorId) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/doctor/appointments/${doctorId}`);
      const data = await res.json();

      if (data.success) setAppointments(data.data || []);
      else setAppointments([]);
    } catch (err) {
      setAppointments([]);
    }
  }, [doctorId]);

  /* Fetch Nurses */
  const fetchNurses = useCallback(async () => {
    try {
      const url = shiftFilter
        ? `${API_BASE_URL}/api/doctor/nurses?shift=${shiftFilter}`
        : `${API_BASE_URL}/api/doctor/nurses`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.success) setNurses(data.data || []);
      else setNurses([]);
    } catch {
      setNurses([]);
    }
  }, [shiftFilter]);

  useEffect(() => {
    fetchAppointments();
    fetchNurses();
  }, [fetchAppointments, fetchNurses]);

  /* Auto Refresh every 3 seconds */
  useEffect(() => {
    const interval = setInterval(() => {
      fetchAppointments();
      fetchNurses();
    }, 3000);
    return () => clearInterval(interval);
  }, [fetchAppointments, fetchNurses]);

  /* Manual Refresh */
  const handleRefresh = async () => {
    setLoadingRefresh(true);
    try {
      await Promise.all([fetchAppointments(), fetchNurses()]);
    } finally {
      setTimeout(() => setLoadingRefresh(false), 600);
    }
  };

  /* Toast */
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "" }), 3000);
  };

  /* Assign Nurse(s) */
  const handleAssignNurse = async () => {
    if (!selectedAppointment)
      return showToast("Select an appointment first", "error");

    if (selectedNurses.length === 0)
      return showToast("Select at least one nurse", "error");

    setAssignLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/doctor/assign-nurses`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentId: selectedAppointment._id,
          nurseIds: selectedNurses,
        }),
      });

      const data = await res.json();

      if (data.success) {
        showToast("Nurse(s) assigned successfully", "success");

        setSelectedAppointment(null);
        setSelectedNurses([]);

        await fetchAppointments();
        await fetchNurses();
      } else {
        showToast(data.message || "Assign failed", "error");
      }
    } catch (err) {
      showToast("Server error while assigning", "error");
    }

    setAssignLoading(false);
  };

  return (
    <div className="doctor-dashboard">
      
      {/* Header */}
      <header className="doctor-header">
        <h1>👨‍⚕️ Doctor Dashboard — {doctorName}</h1>

        <div className="header-controls">
          <button className="refresh-btn" onClick={handleRefresh}>
            {loadingRefresh ? "⏳ Refreshing..." : "🔄 Refresh"}
          </button>
          <button
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem("doctorId");
              localStorage.removeItem("doctorName");
              window.location.href = "/login";
            }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Toast */}
      {toast.msg && (
        <div className={`notification ${toast.type}`}>
          {toast.msg}
        </div>
      )}

      {/* Appointments */}
      <div className="section-container">
        <h2>Upcoming Appointments</h2>

        {appointments.length === 0 ? (
          <p className="no-data">No appointments found</p>
        ) : (
          <div className="card-container">
            {appointments.map((appt) => (
              <div
                key={appt._id}
                className={`appt-card ${
                  selectedAppointment?._id === appt._id ? "selected" : ""
                }`}
                onClick={() => setSelectedAppointment(appt)}
              >
                <p><strong>Patient:</strong> {appt.patientId?.fullName}</p>
                <p><strong>Time:</strong> {appt.slotTime}</p>

                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`status-badge ${
                      appt.status === "Confirmed"
                        ? "status-confirmed"
                        : appt.status === "Completed"
                        ? "status-completed"
                        : "status-pending"
                    }`}
                  >
                    {appt.status}
                  </span>
                </p>

                {appt.assignedNurse?.length > 0 && (
                  <div style={{ marginTop: 8 }}>
                    <strong>Nurses:</strong> {appt.assignedNurse.length}

                    <div style={{ marginTop: 4, fontSize: 13 }}>
                      {appt.assignedNurse.map((n) => (
                        <span key={n._id} style={{ marginRight: 8 }}>
                          {n.fullName}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Nurses */}
      <div className="section-container">
        <h2>Select Nurses</h2>

        <select
          className="shift-filter"
          value={shiftFilter}
          onChange={(e) => setShiftFilter(e.target.value)}
        >
          <option value="">All Shifts</option>
          <option value="Morning">Morning</option>
          <option value="Evening">Evening</option>
          <option value="Night">Night</option>
        </select>

        <div className="nurse-list">
          {nurses.length === 0 ? (
            <p className="no-data">No nurses available</p>
          ) : (
            nurses.map((n) => (
              <label key={n._id} className="nurse-item">
                <input
                  type="checkbox"
                  disabled={!n.available}
                  value={n._id}
                  checked={selectedNurses.includes(n._id)}
                  onChange={(e) => {
                    const id = e.target.value;
                    setSelectedNurses((prev) =>
                      prev.includes(id)
                        ? prev.filter((x) => x !== id)
                        : [...prev, id]
                    );
                  }}
                />

                <span>
                  {n.fullName} — {n.shiftTiming}
                  <span
                    className="availability-dot"
                    style={{ color: n.available ? "green" : "red" }}
                  >
                    ● {n.available ? "Available" : "Not Available"}
                  </span>
                </span>
              </label>
            ))
          )}
        </div>

        <button
          className="assign-btn"
          disabled={assignLoading}
          onClick={handleAssignNurse}
        >
          {assignLoading ? "Assigning..." : "Assign Nurse(s)"}
        </button>
      </div>
    </div>
  );
};

export default DoctorDashboard;
