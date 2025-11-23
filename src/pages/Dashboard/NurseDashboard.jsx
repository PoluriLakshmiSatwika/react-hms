import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NurseDashboard = () => {
  const navigate = useNavigate();
  const [nurse, setNurse] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [timers, setTimers] = useState({});
  const [showPopup, setShowPopup] = useState(false);

  // Convert ISO → dd/mm/yyyy
  const formatDate = (isoDate) => {
    if (!isoDate) return "Not available";
    const d = new Date(isoDate);
    return `${String(d.getDate()).padStart(2, "0")}/${String(
      d.getMonth() + 1
    ).padStart(2, "0")}/${d.getFullYear()}`;
  };

  // Load nurse
  useEffect(() => {
    const storedNurse = JSON.parse(localStorage.getItem("nurse"));
    if (storedNurse) setNurse(storedNurse);
  }, []);

  // Fetch appointments
  const fetchAssignedAppointments = async (nurseId) => {
    if (!nurseId) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("nurseToken");

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

          // ⏳ 30 seconds timer
          const diff = Math.max(0, 30000 - (now - createdAt));

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

  // Initial fetch
  useEffect(() => {
    if (nurse?.id) {
      fetchAssignedAppointments(nurse.id);
    }
  }, [nurse]);

  // Timer countdown
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

  // Accept
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

  // Complete
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

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("nurseToken");
    localStorage.removeItem("nurse");
    navigate("/");
  };

  if (!nurse) return <p>Please login as a nurse.</p>;

  return (
    <div className="nurse-dashboard">
      <div className="dashboard-header">
        <h2>Welcome, Nurse {nurse.fullName}</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>

      {message && <p className="message">{message}</p>}

      <h3>Your Assigned Appointments</h3>

      {loading ? (
        <p>Loading...</p>
      ) : appointments.length === 0 ? (
        <p>No appointments assigned.</p>
      ) : (
        appointments.map((item) => {
          const ap = item.appointmentId;
          const apId = ap._id;

          const nurseStatus =
            item.assignedNurses?.find((n) => n.nurseId === nurse.id)?.status ||
            "Pending";

          const ms = timers[apId] || 0;
          const mins = Math.floor(ms / 60000);
          const secs = Math.floor((ms % 60000) / 1000);

          const countdown = `${mins}:${secs < 10 ? "0" + secs : secs}`;
          const timeExpired = ms <= 0;

          const popupKey = `popup_${apId}`;
          const alreadyShown = localStorage.getItem(popupKey) === "shown";

          if (timeExpired && nurseStatus === "Pending" && !alreadyShown) {
            localStorage.setItem(popupKey, "shown");
            setShowPopup(true);
          }

          return (
            <div key={item._id} className="appointment-card">
              <p><strong>Patient:</strong> {ap?.patientId?.fullName}</p>
              <p><strong>Doctor:</strong> {ap?.doctorId?.fullName}</p>
              <p><strong>Disease:</strong> {ap?.disease}</p>
              <p><strong>Date:</strong> {formatDate(item.date)}</p>
              <p><strong>Time:</strong> {item.time}</p>

              {/* Auto-Reassigned Label */}
              {item.reassigned && (
                <p style={{ color: "purple", fontWeight: "bold" }}>
                  🔄 Auto-Reassigned
                </p>
              )}

              {/* Time Expired */}
              {timeExpired && nurseStatus === "Pending" ? (
                <p style={{ color: "red", fontWeight: "bold" }}>
                  Time expired! Assignment will be auto-reassigned.
                </p>
              ) : (
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    style={{
                      color:
                        nurseStatus === "Pending"
                          ? "orange"
                          : nurseStatus === "Accepted"
                          ? "green"
                          : "blue",
                    }}
                  >
                    {nurseStatus}
                  </span>
                </p>
              )}

              {/* Pending UI */}
              {!timeExpired && nurseStatus === "Pending" && (
                <>
                  <p style={{ color: "red", fontWeight: "bold" }}>
                    Accept within 30 seconds! Time left: {countdown}
                  </p>
                  <button
                    className="accept-btn"
                    onClick={() => handleAccept(apId)}
                  >
                    Accept
                  </button>
                </>
              )}

              {/* Accepted */}
              {nurseStatus === "Accepted" && (
                <button
                  className="complete-btn"
                  onClick={() => handleComplete(apId)}
                >
                  Mark Completed
                </button>
              )}
            </div>
          );
        })
      )}

      {/* Popup */}
      {showPopup && (
        <div style={popupOverlayStyle}>
          <div style={popupBoxStyle}>
            <h3 style={{ color: "red" }}>⏳ Time Expired!</h3>
            <p>You did not accept the assignment in time.<br/>It will be reassigned.</p>

            <button
              style={popupBtnStyle}
              onClick={() => {
                setShowPopup(false);
                fetchAssignedAppointments(nurse.id);
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Popup Styles
const popupOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
};

const popupBoxStyle = {
  background: "#fff",
  padding: "25px 30px",
  borderRadius: "12px",
  width: "310px",
  textAlign: "center",
  boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
};

const popupBtnStyle = {
  padding: "10px 18px",
  background: "#d00000",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
};

export default NurseDashboard;
