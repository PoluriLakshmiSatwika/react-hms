import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [pendingStaff, setPendingStaff] = useState([]);
  const [nurses, setNurses] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Admin Dashboard";
  }, []);

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          pendingRes,
          nursesRes,
          doctorsRes,
          patientsRes,
          appointmentsRes
        ] = await Promise.all([
          fetch(`${process.env.REACT_APP_API_URL}/api/admin/pending-staff`),
          fetch(`${process.env.REACT_APP_API_URL}/api/admin/nurses`),
          fetch(`${process.env.REACT_APP_API_URL}/api/admin/doctors`),
          fetch(`${process.env.REACT_APP_API_URL}/api/admin/patients`),
          fetch(`${process.env.REACT_APP_API_URL}/api/admin/appointments`)
        ]);

        const pendingData = await pendingRes.json();
        const nursesData = await nursesRes.json();
        const doctorsData = await doctorsRes.json();
        const patientsData = await patientsRes.json();
        const appointmentsData = await appointmentsRes.json();

        setPendingStaff(Array.isArray(pendingData) ? pendingData : []);
        setNurses(Array.isArray(nursesData) ? nursesData : []);
        setDoctors(Array.isArray(doctorsData) ? doctorsData : []);
        setPatients(Array.isArray(patientsData) ? patientsData : []);
        setAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);

      } catch (error) {
        console.error("Error fetching data:", error);
        setPendingStaff([]);
        setNurses([]);
        setDoctors([]);
        setPatients([]);
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Approve/Reject Staff
  const handleApprove = async (id) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/approve/${id}`, {
        method: "POST",
      });
      const data = await res.json();
      alert(data.message);
      setPendingStaff(prev => prev.filter(staff => staff._id !== id));
    } catch (err) {
      console.error("Error approving staff:", err);
    }
  };

  const handleReject = async (id) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/reject/${id}`, {
        method: "POST",
      });
      const data = await res.json();
      alert(data.message);
      setPendingStaff(prev => prev.filter(staff => staff._id !== id));
    } catch (err) {
      console.error("Error rejecting staff:", err);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.clear();
    alert("Logged out successfully!");
    navigate("/");
  };

  if (loading) {
    return <p style={{ textAlign: "center", marginTop: "20px" }}>Loading...</p>;
  }

  return (
    <div className="admin-dashboard-container">
      <div className="dashboard-header">
        <h2>Admin Dashboard</h2>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      {/* Pending Staff */}
      <section>
        <h3>Pending Staff</h3>
        {pendingStaff.length === 0 ? (
          <p>No pending staff.</p>
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
                      <a href={`${process.env.REACT_APP_API_URL}/${staff.uploadId}`} target="_blank">
                        View ID
                      </a>
                    ) : "No file"}
                  </td>
                  <td>
                    <button className="approve-btn" onClick={() => handleApprove(staff._id)}>Approve</button>
                    <button className="reject-btn" onClick={() => handleReject(staff._id)}>Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Nurses */}
      <section>
        <h3>Approved Nurses</h3>
        {nurses.length === 0 ? (
          <p>No nurses.</p>
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

{/* ---------------------- Patients ---------------------- */}
<h2>All Patients</h2>
<table border="1" cellPadding="8">
  <thead>
    <tr>
      <th>Name</th>
      <th>Email</th>
      <th>Phone</th>
      <th>Date of Birth</th>
      <th>Blood Group</th>
      <th>Medical History</th>
    </tr>
  </thead>
  <tbody>
    {patients.map((p) => (
      <tr key={p._id}>
        <td>{p.fullName}</td>
        <td>{p.email}</td>
        <td>{p.phone}</td>
        <td>{p.dateOfBirth}</td>
        <td>{p.bloodGroup ? p.bloodGroup.toUpperCase() : "N/A"}</td>
        <td>{p.medicalHistory || "None"}</td>
      </tr>
    ))}
  </tbody>
</table>


      {/* Doctors */}
      <section>
        <h3>Approved Doctors</h3>
        {doctors.length === 0 ? (
          <p>No doctors.</p>
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

      {/* Appointments */}
      <section>
        <h3>All Appointments</h3>
        {appointments.length === 0 ? (
          <p>No appointments.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Disease</th>
                <th>Date</th>
                <th>Slot</th>
                <th>Fee Paid</th>
                <th>Validity</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => {
                const patient = patients.find(p => p._id === appt.patientId);
                const doctor = doctors.find(d => d._id === appt.doctorId);

                return (
                  <tr key={appt._id}>
                    <td>{patient?.fullName || "Unknown"}</td>
                    <td>{doctor?.fullName || "Unknown"}</td>
                    <td>{appt.disease}</td>
                    <td>{new Date(appt.appointmentDate).toLocaleDateString()}</td>
                    <td>{appt.slotTime}</td>
                    <td>{appt.feePaid ? "Yes" : "No"}</td>
                    <td>{appt.validityCount}</td>
                    <td>{appt.status}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>

    </div>
  );
};

export default AdminDashboard;
