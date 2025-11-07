import express from "express";
import Appointment from "../models/Appointment.js";
import Patient from "../models/Patient.js";
import Doctor from "../models/Doctor.js";

const router = express.Router();

/* ✅ FETCH DOCTORS BY DISEASE/SPECIALITY */
router.get("/doctors/:disease", async (req, res) => {
  try {
    const disease = req.params.disease;

    const doctors = await Doctor.find({ specialty: disease }).select(
      "fullName specialty department fee slots"
    );

    if (!doctors.length) {
      return res.status(404).json({ success: false, message: "No doctors found", doctors: [] });
    }

    res.json({ success: true, count: doctors.length, doctors });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

// ✅ Get doctors by specialty (used in dropdown)
router.get("/doctors/:specialty", async (req, res) => {
  try {
    const doctors = await Doctor.find({ specialty: req.params.specialty });

    if (!doctors.length) {
      return res.status(404).json({ success: false, message: "No doctors found" });
    }

    res.json({ success: true, doctors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


/* ✅ BOOK NEW APPOINTMENT */
router.post("/book", async (req, res) => {
  try {
    const { patientId, doctorId, disease, appointmentDate, slotTime } = req.body;

    if (!patientId || !doctorId || !disease || !appointmentDate || !slotTime) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const patient = await Patient.findById(patientId);
    if (!patient) return res.status(404).json({ success: false, message: "Patient not found" });

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ success: false, message: "Doctor not found" });

    const newAppointment = new Appointment({
      patientId,
      doctorId,
      disease,
      appointmentDate,
      slotTime,
      status: "Pending",
      feePaid: false,
      validityCount: 3
    });

    await newAppointment.save();

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully (Pending payment)",
      data: newAppointment
    });
  } catch (error) {
    console.error("❌ Booking Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

/* ✅ FETCH PATIENT APPOINTMENTS */
router.get("/patient/:patientId", async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.params.patientId })
      .populate("doctorId", "fullName department specialty")
      .populate("assignedNurse", "fullName");

    res.json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/* ✅ FETCH DOCTOR APPOINTMENTS */
router.get("/doctor/:doctorId", async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctorId: req.params.doctorId })
      .populate("patientId", "fullName email phone")
      .populate("assignedNurse", "fullName");

    res.json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/* ✅ ASSIGN NURSE & CONFIRM APPOINTMENT */
router.put("/assign-nurse", async (req, res) => {
  try {
    const { appointmentId, nurseId } = req.body;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) return res.status(404).json({ success: false, message: "Appointment not found" });

    appointment.assignedNurse = nurseId;
    appointment.status = "Confirmed";
    await appointment.save();

    res.json({ success: true, message: "Nurse assigned & appointment confirmed", data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
