// // // // NurseDashboard.jsx
// NurseDashboard.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./NurseDashboard.css";

const NurseDashboard = () => {
  const navigate = useNavigate();

  const nurse = JSON.parse(localStorage.getItem("nurse"));
  const nurseId = nurse?.id;

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [available, setAvailable] = useState(false);

  // ==========================
  //  FETCH PROFILE / AVAILABILITY
  // ==========================
  const fetchAvailability = useCallback(async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/nurse/profile`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await res.json();
      const me = data?.data?.find((n) => String(n._id) === String(nurseId));

      if (me) setAvailable(Boolean(me.available));
    } catch (err) {
      console.error("AVAILABILITY FETCH ERROR", err);
    }
  }, [nurseId]);

  // ==========================
  //  FETCH ASSIGNMENTS
  // ==========================
  const fetchAssignments = useCallback(async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/nurse/assignments`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await res.json();
      setAssignments(data?.data || []);
      setLoading(false);
    } catch (err) {
      console.error("ASSIGNMENTS FETCH ERROR", err);
      setLoading(false);
    }
  }, []);

  // ==========================
  //  ACCEPT ASSIGNMENT
  // ==========================
  const handleAccept = async (assignmentId) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/nurse/assignments/${assignmentId}/accept`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await res.json();
      if (data.success) {
        alert("Assignment accepted!");
        fetchAssignments(); // refresh immediately
      }
    } catch (err) {
      console.error("ACCEPT ERROR", err);
    }
  };

  // ==========================
  //  USE_EFFECTS
  // ==========================
  useEffect(() => {
    if (!nurseId) {
      navigate("/nurse/login");
      return;
    }
    fetchAvailability();
    fetchAssignments();
  }, [nurseId, fetchAvailability, fetchAssignments, navigate]);

  if (loading) return <p>Loading assignments...</p>;

  return (
    <div className="nurse-dashboard">
      <h1>Welcome Nurse {nurse?.fullName}</h1>

      <h2>Your Assignments</h2>
      {assignments.length === 0 ? (
        <p>No assignments yet.</p>
      ) : (
        assignments.map((a) => (
          <div key={a._id} className="assignment-card">
            <p>
              <strong>Patient:</strong> {a.displayPatientName}
            </p>
            <p>
              <strong>Phone:</strong> {a.displayPatientPhone}
            </p>
            <p>
              <strong>Status:</strong> {a.status}
            </p>

            {a.status !== "accepted" ? (
              <button onClick={() => handleAccept(a._id)}>Accept</button>
            ) : (
              <span className="accepted-tag">Accepted</span>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default NurseDashboard;

// // NurseDashboard.jsx
// import React, { useState, useEffect, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import "./NurseDashboard.css";

// const NurseDashboard = () => {
//   const navigate = useNavigate();

//   const nurse = JSON.parse(localStorage.getItem("nurse")) || {};
//   const nurseId = nurse._id;
//   const nurseName = nurse.fullName;

//   const [assignments, setAssignments] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [notification, setNotification] = useState({ message: "", type: "" });

//   const token = localStorage.getItem("token");

//   // Notification
//   const showNotification = (message, type = "success") => {
//     setNotification({ message, type });
//     setTimeout(() => setNotification({ message: "", type: "" }), 2500);
//   };

//   // Fetch assignments
//   const fetchAssignments = useCallback(async () => {
//     if (!token) return;
//     setIsLoading(true);
//     try {
//       const res = await fetch(`${process.env.REACT_APP_API_URL}/api/nurse/assignments`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       if (data.success) setAssignments(data.data || []);
//       else setAssignments([]);
//     } catch (err) {
//       console.error("FETCH ERROR:", err);
//       setAssignments([]);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [token]);

//   useEffect(() => {
//     if (!token) {
//       navigate("/login");
//       return;
//     }
//     fetchAssignments();
//   }, [navigate, fetchAssignments, token]);

//   // Accept assignment
//   const handleAcceptAssignment = async (id) => {
//     try {
//       const res = await fetch(
//         `${process.env.REACT_APP_API_URL}/api/nurse/assignments/${id}/accept`,
//         {
//           method: "PUT",
//           headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//         }
//       );
//       const data = await res.json();
//       if (!data.success) return showNotification(data.message || "Failed to accept", "error");
//       showNotification("👍 Appointment accepted!", "success");
//       fetchAssignments();
//     } catch (err) {
//       console.error(err);
//       showNotification("Server error while accepting", "error");
//     }
//   };

//   // Complete assignment
//   const handleCompleteAssignment = async (id) => {
//     try {
//       const res = await fetch(
//         `${process.env.REACT_APP_API_URL}/api/nurse/assignments/${id}/complete`,
//         {
//           method: "PUT",
//           headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//         }
//       );
//       const data = await res.json();
//       if (!data.success) return showNotification(data.message || "Failed to complete", "error");
//       showNotification("✔ Appointment completed", "success");
//       fetchAssignments();
//     } catch (err) {
//       console.error(err);
//       showNotification("Server error while completing", "error");
//     }
//   };

//   // Logout
//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("nurse");
//     navigate("/login");
//   };

//   return (
//     <div className="nurse-dashboard">
//       {notification.message && (
//         <div className={`notification ${notification.type}`}>{notification.message}</div>
//       )}

//       <header className="dashboard-header">
//         <h1>👩‍⚕️ Nurse Dashboard — {nurseName}</h1>
//         <button className="logout-btn" onClick={handleLogout}>Logout</button>
//       </header>

//       <div className="dashboard-controls">
//         <button className="refresh-btn" onClick={fetchAssignments}>🔄 Refresh</button>
//       </div>

//       <main className="assignments-section">
//         <h2>Assigned Appointments</h2>
//         {isLoading ? (
//           <p className="loading">Loading...</p>
//         ) : assignments.length === 0 ? (
//           <p className="no-assignments">No assignments yet.</p>
//         ) : (
//           <div className="assignments-list">
//             {assignments.map((a) => {
//               const nurseEntry = a.assignedNurses.find(n => n.nurseId === nurseId);
//               const status = nurseEntry?.status || "Pending";
//               return (
//                 <div key={a._id} className="assignment-card">
//                   <p><strong>Patient:</strong> {a.patientId?.fullName || "Unknown"}</p>
//                   <p><strong>Time:</strong> {a.time}</p>
//                   <p><strong>Status:</strong> <span className={`status ${status.toLowerCase()}`}>{status}</span></p>
//                   <div className="assignment-actions">
//                     {status === "Pending" && (
//                       <button className="accept-btn" onClick={() => handleAcceptAssignment(a._id)}>Accept</button>
//                     )}
//                     {status === "Accepted" && (
//                       <button className="complete-btn" onClick={() => handleCompleteAssignment(a._id)}>Complete</button>
//                     )}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </main>
//     </div>
//   );
// };

// export default NurseDashboard;

