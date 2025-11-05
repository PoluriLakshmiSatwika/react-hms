import express from "express";
import Appointment from "../models/Appointment.js";
import Patient from "../models/Patient.js";
import Doctor from "../models/Doctor.js";

const router = express.Router();

/* ✅ BOOK NEW APPOINTMENT */
router.post("/book", async (req, res) => {
  try {
    const { patientId, doctorId, disease, appointmentDate, slotTime } = req.body;

    // Basic validation
    if (!patientId || !doctorId || !disease || !appointmentDate || !slotTime) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if patient exists
    const patient = await Patient.findById(patientId);
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    // Check if doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    // Create appointment
    const newAppointment = new Appointment({
      patientId,
      doctorId,
      disease,
      appointmentDate,
      slotTime,
      status: "Pending"
    });

    await newAppointment.save();

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully (Pending confirmation)",
      data: newAppointment
    });
  } catch (error) {
    console.error("❌ Booking Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

/* 🔍 FETCH PATIENT APPOINTMENTS */
router.get("/patient/:patientId", async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.params.patientId })
      .populate("doctorId", "fullName department specialty")
      .populate("assignedNurse", "fullName");

    res.json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

/* 👨‍⚕️ FETCH DOCTOR APPOINTMENTS */
router.get("/doctor/:doctorId", async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctorId: req.params.doctorId })
      .populate("patientId", "fullName email phone")
      .populate("assignedNurse", "fullName");

    res.json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

/* 🧑‍⚕️ ASSIGN NURSE */
router.put("/assign-nurse", async (req, res) => {
  try {
    const { appointmentId, nurseId } = req.body;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    appointment.assignedNurse = nurseId;
    appointment.status = "Confirmed";
    await appointment.save();

    res.json({ success: true, message: "Nurse assigned successfully", data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

export default router;
