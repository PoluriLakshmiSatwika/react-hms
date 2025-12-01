import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./NurseDashboard.css";

const NurseDashboard = () => {
  const navigate = useNavigate();
  const [nurse, setNurse] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [timers, setTimers] = useState({});
  const [showPopup, setShowPopup] = useState(false);

  const formatDate = (isoDate) => {
    if (!isoDate) return "Not available";
    const d = new Date(isoDate);
    return `${String(d.getDate()).padStart(2, "0")}/${String(
      d.getMonth() + 1
    ).padStart(2, "0")}/${d.getFullYear()}`;
  };

  useEffect(() => {
    const storedNurse = JSON.parse(localStorage.getItem("nurse"));
    if (storedNurse) setNurse(storedNurse);
  }, []);

  const fetchAssignedAppointments = async (nurseId) => {
    if (!nurseId) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token"); // matches login storage
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/nurse/appointments/${nurseId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (data.success) {
        setAppointments(data.data);
        const timersObj = {};

        data.data.forEach((item) => {
          const createdAt = new Date(item.createdAt).getTime();
          const now = Date.now();

          // ⏳ FIXED HERE (300000 ms = 5 minutes)
          const diff = Math.max(0, 300000 - (now - createdAt));

          timersObj[item.appointmentId._id] = diff;
        });

        setTimers(timersObj);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (nurse?.id) {
      fetchAssignedAppointments(nurse.id);
    }
  }, [nurse]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((id) => {
          updated[id] = Math.max(0, updated[id] - 1000);
        });
        return updated;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAccept = async (appointmentId) => {
    try {
      const token = localStorage.getItem("nurseToken");
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/nurse/accept`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ appointmentId, nurseId: nurse.id }),
        }
      );

      const data = await res.json();
      if (data.success) {
        setMessage("Appointment Accepted!");
        fetchAssignedAppointments(nurse.id);
      }
    } catch (err) {
      console.error("Accept Error:", err);
    }
  };

  const handleComplete = async (appointmentId) => {
    try {
      const token = localStorage.getItem("nurseToken");
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/nurse/complete`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ appointmentId, nurseId: nurse.id }),
        }
      );

      const data = await res.json();
      if (data.success) {
        setMessage("Appointment Completed!");
        fetchAssignedAppointments(nurse.id);
      }
    } catch (err) {
      console.error("Complete Error:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("nurseToken");
    localStorage.removeItem("nurse");
    navigate("/");
  };

  if (!nurse) return <p>Please login as a nurse.</p>;

  return (
    <div className="nurse-dashboard">
      <div className="header">
        <div className="header-content">
          <h1>Nurse Dashboard</h1>
          <div className="user-section">
            <span>Welcome, {nurse.fullName}</span>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="main-content">
        {message && <div className="alert alert-success">{message}</div>}

        <div className="section-title">
          <h2>Assigned Appointments</h2>
          <span className="appointment-count">
            {appointments.length} appointment
            {appointments.length !== 1 ? "s" : ""}
          </span>
        </div>

        {loading ? (
          <div className="loading">Loading appointments...</div>
        ) : appointments.length === 0 ? (
          <div className="empty-state">No appointments assigned to you.</div>
        ) : (
          <div className="appointments-list">
            {appointments.map((item) => {
              const ap = item.appointmentId;
              const apId = ap._id;

              const nurseStatus =
                item.assignedNurses?.find((n) => n.nurseId === nurse.id)
                  ?.status || "Pending";

              const ms = timers[apId] || 0;
              const mins = Math.floor(ms / 60000);
              const secs = Math.floor((ms % 60000) / 1000);
              const countdown = `${mins}:${secs < 10 ? "0" + secs : secs}`;
              const timeExpired = ms <= 0;

              const popupKey = `popup_${apId}`;
              const alreadyShown =
                localStorage.getItem(popupKey) === "shown";

              if (
                timeExpired &&
                nurseStatus === "Pending" &&
                !alreadyShown
              ) {
                localStorage.setItem(popupKey, "shown");
                setShowPopup(true);
              }

              return (
                <div key={item._id} className="appointment-card">
                  <div className="card-header">
                    <h3>{ap?.patientId?.fullName}</h3>
                    <span className={`status ${nurseStatus.toLowerCase()}`}>
                      {nurseStatus}
                    </span>
                  </div>

                  <div className="card-body">
                    <div className="info-row">
                      <span className="label">Doctor:</span>
                      <span className="value">{ap?.doctorId?.fullName}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Disease:</span>
                      <span className="value">{ap?.disease}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Date:</span>
                      <span className="value">{formatDate(item.date)}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Time:</span>
                      <span className="value">{item.time}</span>
                    </div>

                    {item.reassigned && (
                      <div className="reassigned-notice">
                        🔄 Auto-Reassigned
                      </div>
                    )}
                  </div>

                  <div className="card-actions">
                    {!timeExpired && nurseStatus === "Pending" && (
                      <>
                        <div className="timer-warning">
                          ⏰ Accept within: <strong>{countdown}</strong>
                        </div>
                        <button
                          className="btn btn-primary"
                          onClick={() => handleAccept(apId)}
                        >
                          Accept Appointment
                        </button>
                      </>
                    )}

                    {timeExpired && nurseStatus === "Pending" && (
                      <div className="expired-notice">
                        ❌ Time expired! Will be reassigned.
                      </div>
                    )}

                    {nurseStatus === "Accepted" && (
                      <button
                        className="btn btn-success"
                        onClick={() => handleComplete(apId)}
                      >
                        Mark Completed
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showPopup && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Time Expired</h3>
            </div>
            <div className="modal-body">
              <p>
                You didn't accept the assignment in time. It will be
                reassigned to another nurse.
              </p>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-primary"
                onClick={() => {
                  setShowPopup(false);
                  fetchAssignedAppointments(nurse.id);
                }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NurseDashboard;
