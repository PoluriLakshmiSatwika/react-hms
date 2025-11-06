import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [pendingStaff, setPendingStaff] = useState([]);
  const [nurses, setNurses] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Set page title
  useEffect(() => {
    document.title = "Admin Dashboard";
  }, []);

  // ✅ Fetch all data in parallel
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pendingRes, nursesRes, doctorsRes] = await Promise.all([
          fetch("http://localhost:8000/api/admin/pending-staff"),
          fetch("http://localhost:8000/api/admin/nurses"),
          fetch("http://localhost:8000/api/admin/doctors"),
        ]);

        const pendingData = await pendingRes.json();
        const nursesData = await nursesRes.json();
        const doctorsData = await doctorsRes.json();

        setPendingStaff(Array.isArray(pendingData) ? pendingData : []);
        setNurses(Array.isArray(nursesData) ? nursesData : []);
        setDoctors(Array.isArray(doctorsData) ? doctorsData : []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setPendingStaff([]);
        setNurses([]);
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ✅ Approve/Reject handlers
  const handleApprove = async (id) => {
    try {
      const res = await fetch(`http://localhost:8000/api/admin/approve/${id}`, {
        method: "POST",
      });
      const data = await res.json();
      alert(data.message);
      setPendingStaff((prev) => prev.filter((staff) => staff._id !== id));
    } catch (err) {
      console.error("Error approving staff:", err);
    }
  };

  const handleReject = async (id) => {
    try {
      const res = await fetch(`http://localhost:8000/api/admin/reject/${id}`, {
        method: "POST",
      });
      const data = await res.json();
      alert(data.message);
      setPendingStaff((prev) => prev.filter((staff) => staff._id !== id));
    } catch (err) {
      console.error("Error rejecting staff:", err);
    }
  };

  // ✅ Logout function
  const handleLogout = () => {
    localStorage.clear(); // clear tokens/session data if any
    alert("Logged out successfully!");
    navigate("/"); // redirect to homepage
  };

  if (loading) {
    return <p style={{ textAlign: "center", marginTop: "20px" }}>Loading dashboard data...</p>;
  }

  return (
    <div className="admin-dashboard-container">
      <div className="dashboard-header">
        <h2>Admin Dashboard</h2>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      {/* ✅ Pending Staff Section */}
      <section>
        <h3>Pending Staff</h3>
        {pendingStaff.length === 0 ? (
          <p>No pending staff at the moment.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Department</th>
                <th>Shift / Specialization</th>
                <th>ID Proof</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingStaff.map((staff) => (
                <tr key={staff._id}>
                  <td>{staff.fullName}</td>
                  <td>{staff.email}</td>
                  <td>{staff.role}</td>
                  <td>{staff.department}</td>
                  <td>{staff.role === "nurse" ? staff.shiftTiming : staff.specialization}</td>
                  <td>
                    {staff.uploadId ? (
                      <a
                        href={`http://localhost:8000/${staff.uploadId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View ID
                      </a>
                    ) : (
                      "No file"
                    )}
                  </td>
                  <td>
                    <button className="approve-btn" onClick={() => handleApprove(staff._id)}>
                      Approve
                    </button>
                    <button className="reject-btn" onClick={() => handleReject(staff._id)}>
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* ✅ Approved Nurses Section */}
      <section>
        <h3>Approved Nurses</h3>
        {nurses.length === 0 ? (
          <p>No nurses found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Shift Timing</th>
              </tr>
            </thead>
            <tbody>
              {nurses.map((nurse) => (
                <tr key={nurse._id}>
                  <td>{nurse.fullName}</td>
                  <td>{nurse.email}</td>
                  <td>{nurse.department}</td>
                  <td>{nurse.shiftTiming}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

{/* ✅ Approved Doctors Section */}
<section>
  <h3>Approved Doctors</h3>
  {doctors.length === 0 ? (
    <p>No doctors found.</p>
  ) : (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Department</th>
          <th>Specialty</th>
        </tr>
      </thead>
      <tbody>
        {doctors.map((doc) => (
          <tr key={doc._id}>
            <td>{doc.fullName}</td>
            <td>{doc.email}</td>
            <td>{doc.department}</td>
            <td>{doc.specialty}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )}
</section>

    </div>
  );
};

export default AdminDashboard;
