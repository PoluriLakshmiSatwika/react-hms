import React, { useEffect, useState } from "react";
import "./DoctorDashboard.css";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [nurses, setNurses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedNurse, setSelectedNurse] = useState(null);
  const [assignLoading, setAssignLoading] = useState(false);

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
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      const data = await res.json();
      if (data.success) setAppointments(data.data);
      else setAppointments([]);
    } catch {
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchNurses = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/admin/nurses`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      const data = await res.json();
      if (Array.isArray(data)) setNurses(data);
    } catch {
      setNurses([]);
    }
  };

  const handleAssignNurse = async () => {
    if (!selectedAppointment || !selectedNurse) return;
    setAssignLoading(true);

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/assignments`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          appointmentId: selectedAppointment._id,
          nurseIds: [selectedNurse._id],
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage(`Nurse ${selectedNurse.fullName} assigned successfully`);

        setAppointments((prev) =>
          prev.map((a) =>
            a._id === selectedAppointment._id
              ? { ...a, assignedNurses: data.data.assignedNurses }
              : a
          )
        );
      } else setMessage("Failed to assign nurse");
    } finally {
      setAssignLoading(false);
      setSelectedAppointment(null);
      setSelectedNurse(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("doctor");
    navigate("/");
  };

  useEffect(() => {
    if (doctor?.id) {
      fetchAppointments(doctor.id);
      fetchNurses();
    }
  }, [doctor]);

  if (!doctor) return <p>Please login as doctor to view dashboard.</p>;

  return (
    <div className="doctor-dashboard p-6 space-y-6">
      <div className="dashboard-header flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Welcome, Dr. {doctor.fullName}</h2>
        <Button variant="destructive" onClick={handleLogout}>Logout</Button>
      </div>

      {message && <p className="text-green-600 font-medium">{message}</p>}

      {/* Appointments */}
      <motion.div
        className="section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-xl font-semibold mb-4">Appointments</h3>

        {loading ? (
          <p>Loading appointments...</p>
        ) : appointments.length === 0 ? (
          <p>No appointments booked.</p>
        ) : (
          appointments.map((a) => (
            <motion.div
              key={a._id}
              className="appointment-card p-4 bg-white rounded-2xl shadow mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p><strong>Patient:</strong> {a.patientId?.fullName}</p>
              <p><strong>Disease:</strong> {a.disease}</p>
              <p><strong>Date:</strong> {new Date(a.appointmentDate).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {a.slotTime}</p>
              <p><strong>Status:</strong> {a.status}</p>
              <p><strong>Assigned Nurses:</strong> {a.assignedNurses?.length > 0 ? a.assignedNurses.map(n => n.nurseName).join(", ") : "None"}</p>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Nurses Table */}
      <div className="section">
        <h3 className="text-xl font-semibold mb-4">Available Nurses</h3>

        {nurses.length === 0 ? (
          <p>No nurses available.</p>
        ) : (
          <table className="nurse-table w-full bg-white shadow rounded-xl overflow-hidden">
            <thead className="bg-gray-100">
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
                      className="border p-2 rounded"
                      onChange={(e) => {
                        const appointment = appointments.find(a => a._id === e.target.value);
                        setSelectedAppointment(appointment);
                        setSelectedNurse(nurse);
                      }}
                    >
                      <option value="">Select Appointment</option>
                      {appointments.map((a) => (
                        <option key={a._id} value={a._id}>
                          {a.patientId?.fullName} ({new Date(a.appointmentDate).toLocaleDateString()})
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

      {/* Confirmation Modal */}
      {selectedAppointment && selectedNurse && (
        <Dialog open={true}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Assignment</DialogTitle>
            </DialogHeader>
            <p>
              Assign <strong>{selectedNurse.fullName}</strong> to patient
              <strong> {selectedAppointment.patientId?.fullName}</strong>?
            </p>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedAppointment(null);
                  setSelectedNurse(null);
                }}
              >
                Cancel
              </Button>

              <Button onClick={handleAssignNurse} disabled={assignLoading}>
                {assignLoading ? "Assigning..." : "Confirm"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default DoctorDashboard;
