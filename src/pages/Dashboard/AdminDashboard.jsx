import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [pendingStaff, setPendingStaff] = useState([]);
  const [nurses, setNurses] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeSection, setActiveSection] = useState("pending"); // ⭐ NEW

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Admin Dashboard";
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          pendingRes,
          nursesRes,
          doctorsRes,
          patientsRes,
          appointmentsRes,
          assignmentsRes
        ] = await Promise.all([
          fetch(`${process.env.REACT_APP_API_URL}/api/admin/pending-staff`),
          fetch(`${process.env.REACT_APP_API_URL}/api/admin/nurses`),
          fetch(`${process.env.REACT_APP_API_URL}/api/admin/doctors`),
          fetch(`${process.env.REACT_APP_API_URL}/api/admin/patients`),
          fetch(`${process.env.REACT_APP_API_URL}/api/admin/appointments`),
          fetch(`${process.env.REACT_APP_API_URL}/api/admin/assignments`)
        ]);

        setPendingStaff(await pendingRes.json());
        setNurses(await nursesRes.json());
        setDoctors(await doctorsRes.json());
        setPatients(await patientsRes.json());
        setAppointments(await appointmentsRes.json());
        setAssignments(await assignmentsRes.json());


      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleApprove = async (id) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/approve/${id}`, {
        method: "POST",
      });
      const data = await res.json();
      alert(data.message);
      setPendingStaff(prev => prev.filter(staff => staff._id !== id));
    } catch (err) {
      console.error(err);
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
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="admin-layout">

      {/* ⭐ LEFT SIDEBAR */}
      <aside className="sidebar">
        <h2>Admin Panel</h2>

        <ul>
          <li onClick={() => setActiveSection("pending")}
              className={activeSection === "pending" ? "active" : ""}>
            Pending Staff
          </li>

          <li onClick={() => setActiveSection("nurses")}
              className={activeSection === "nurses" ? "active" : ""}>
            Nurses
          </li>

          <li onClick={() => setActiveSection("patients")}
              className={activeSection === "patients" ? "active" : ""}>
            Patients
          </li>

          <li onClick={() => setActiveSection("doctors")}
              className={activeSection === "doctors" ? "active" : ""}>
            Doctors
          </li>

          <li onClick={() => setActiveSection("appointments")}
              className={activeSection === "appointments" ? "active" : ""}>
            Appointments
          </li>
          <li onClick={() => setActiveSection("assignments")}>Assignments</li>

          <li className="logout" onClick={handleLogout}>Logout</li>
        </ul>
      </aside>

      {/* ⭐ RIGHT MAIN CONTENT */}
      <main className="content">

        {/* ---------------- Pending Staff ---------------- */}
        {activeSection === "pending" && (
          <section>
            <h3>Pending Staff</h3>
            {pendingStaff.length === 0 ? (
              <p>No pending staff.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Name</th><th>Email</th><th>Role</th>
                    <th>Department</th><th>Shift/Specialization</th>
                    <th>ID</th><th>Actions</th>
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
                          <a href={`${process.env.REACT_APP_API_URL}/${staff.uploadId}`} target="_blank">View</a>
                        ) : "None"}
                      </td>
                      <td>
                        <button onClick={() => handleApprove(staff._id)}>Approve</button>
                        <button onClick={() => handleReject(staff._id)}>Reject</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        )}

        {/* ---------------- Nurses ---------------- */}
        {activeSection === "nurses" && (
          <section>
            <h3>Approved Nurses</h3>
            <table>
              <thead>
                <tr><th>Name</th><th>Email</th><th>Department</th><th>Shift</th></tr>
              </thead>
              <tbody>
                {nurses.map((n) => (
                  <tr key={n._id}>
                    <td>{n.fullName}</td>
                    <td>{n.email}</td>
                    <td>{n.department}</td>
                    <td>{n.shiftTiming}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* ---------------- Patients ---------------- */}
        {activeSection === "patients" && (
          <section>
            <h3>All Patients</h3>
            <table>
              <thead>
                <tr>
                  <th>Name</th><th>Email</th><th>Phone</th>
                  <th>DOB</th><th>Blood Group</th><th>History</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((p) => (
                  <tr key={p._id}>
                    <td>{p.fullName}</td>
                    <td>{p.email}</td>
                    <td>{p.phone}</td>
                    <td>{p.dateOfBirth}</td>
                    <td>{p.bloodGroup?.toUpperCase()}</td>
                    <td>{p.medicalHistory || "None"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* ---------------- Doctors ---------------- */}
        {activeSection === "doctors" && (
          <section>
            <h3>Approved Doctors</h3>
            <table>
              <thead>
                <tr><th>Name</th><th>Email</th><th>Department</th><th>Specialty</th></tr>
              </thead>
              <tbody>
                {doctors.map((d) => (
                  <tr key={d._id}>
                    <td>{d.fullName}</td>
                    <td>{d.email}</td>
                    <td>{d.department}</td>
                    <td>{d.specialty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
        {/* assignments */}
        {activeSection === "assignments" && (
  <section>
    <h3>Assignments</h3>
    <table>
      <thead>
        <tr>
          <th>Doctor</th>
          <th>Patient</th>
          <th>Nurse</th>
          <th>Date</th>
          <th>Time</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {assignments.map((a) => (
          <tr key={a._id}>
            <td>{a.appointmentId?.doctorId?.fullName || "Unknown"}</td>
            <td>{a.patientId?.fullName || "Unknown"}</td>
            <td>{a.assignedNurses?.[0]?.nurseId?.fullName || a.assignedNurses?.[0]?.nurseName}</td>
            <td>{new Date(a.date).toLocaleDateString()}</td>
            <td>{a.time}</td>
            <td>{a.assignedNurses?.[0]?.status || a.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </section>
)}


        {/* ---------------- Appointments ---------------- */}
        {activeSection === "appointments" && (
          <section>
            <h3>All Appointments</h3>
            <table>
              <thead>
                <tr>
                  <th>Patient</th><th>Doctor</th><th>Disease</th>
                  <th>Date</th><th>Slot</th><th>Fee</th><th>Validity</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((a) => (
                  <tr key={a._id}>
                    <td>{a.patientId?.fullName}</td>
                    <td>{a.doctorId?.fullName}</td>
                    <td>{a.disease}</td>
                    <td>{new Date(a.appointmentDate).toLocaleDateString()}</td>
                    <td>{a.slotTime}</td>
                    <td>{a.feePaid ? "Yes" : "No"}</td>
                    <td>{a.validityCount}</td>
                    <td>{a.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

      </main>
    </div>
  );
};

export default AdminDashboard;
