import express from "express";
import multer from "multer";
import bcrypt from "bcryptjs";
import PendingStaff from "../models/PendingStaff.js";
import Nurse from "../models/Nurse.js";
import Appointment from "../models/Appointment.js";

const router = express.Router();

/* =====================================================
   FILE UPLOAD
===================================================== */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + Math.round(Math.random() * 1e9) + "-" + file.originalname)
});
const upload = multer({ storage });

/* =====================================================
   1️⃣ REGISTER NURSE (PENDING)
===================================================== */
router.post("/register", upload.single("uploadId"), async (req, res) => {
  try {
    const { fullName, email, phone, department, shiftTiming, password } = req.body;

    const exists = await PendingStaff.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Nurse already registered and pending approval" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const pendingNurse = new PendingStaff({
      fullName,
      email,
      phone,
      role: "nurse",
      department,
      shiftTiming,
      password: hashed,
      uploadId: req.file ? req.file.path : "",
      status: "pending",
    });

    await pendingNurse.save();
    res.status(201).json({
      message: "Nurse registration pending admin approval."
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================================================
   2️⃣ NURSE LOGIN
===================================================== */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const nurse = await Nurse.findOne({ email });

    if (!nurse) {
      const pending = await PendingStaff.findOne({ email, role: "nurse" });
      if (pending)
        return res.status(403).json({ message: "Your account is pending admin approval." });

      return res.status(404).json({ message: "No nurse found" });
    }

    const isMatch = await bcrypt.compare(password, nurse.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    res.json({
      success: true,
      message: "Nurse login successful",
      nurse: {
        id: nurse._id,
        name: nurse.fullName,
        email: nurse.email,
        department: nurse.department,
      }
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================================================
   3️⃣ FETCH ASSIGNED APPOINTMENTS
===================================================== */
router.get("/assignments", async (req, res) => {
  try {
    const nurseId = req.query.nurseId;

    if (!nurseId)
      return res.status(400).json({ message: "nurseId required" });

    const appointments = await Appointment.find({
      assignedNurse: { $in: [nurseId] }
    })
      .populate("patientId", "fullName email phone")
      .populate("doctorId", "fullName")
      .sort({ appointmentDate: 1 });

    return res.json({ success: true, data: appointments });

  } catch (error) {
    return res.status(500).json({ message: "Server error fetching assignments" });
  }
});

/* =====================================================
   4️⃣ UPDATE AVAILABILITY
===================================================== */
router.put("/availability", async (req, res) => {
  try {
    const { nurseId, available } = req.body;

    if (!nurseId)
      return res.status(400).json({ message: "nurseId required" });

    await Nurse.findByIdAndUpdate(nurseId, { available });

    return res.json({ success: true, message: "Availability updated" });

  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

/* =====================================================
   5️⃣ ACCEPT ASSIGNMENT (OFFLINE BLOCK ADDED)
===================================================== */
router.put("/assignments/:id/accept", async (req, res) => {
  try {
    const { nurseId } = req.body;
    const { id: appointmentId } = req.params;

    if (!nurseId)
      return res.status(400).json({ message: "nurseId required" });

    const nurse = await Nurse.findById(nurseId);

    // 🔥 BLOCK OFFLINE NURSES
    if (!nurse.available) {
      return res.status(400).json({
        success: false,
        message: "You are offline. Go online to accept appointments."
      });
    }

    const appt = await Appointment.findById(appointmentId);

    if (!appt)
      return res.status(404).json({ message: "Appointment not found" });

    // 🔥 Block if already accepted by someone else
    if (appt.status === "Accepted" && !appt.assignedNurse.includes(nurseId)) {
      return res.status(400).json({
        message: "Another nurse has already accepted this appointment."
      });
    }

    const assignedIds = appt.assignedNurse.map(x => String(x));

    if (!assignedIds.includes(String(nurseId))) {
      return res.status(403).json({
        message: "You are not assigned to this appointment",
      });
    }

    if (appt.status !== "Pending") {
      return res.status(400).json({
        message: "This appointment is no longer in Pending state",
      });
    }

    appt.status = "Accepted";
    await appt.save();

    res.json({ success: true, data: appt });

  } catch (error) {
    console.error("ACCEPT ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================================================
   6️⃣ COMPLETE APPOINTMENT
===================================================== */
router.put("/assignments/:id/complete", async (req, res) => {
  try {
    const { nurseId } = req.body;
    const { id: appointmentId } = req.params;

    if (!nurseId)
      return res.status(400).json({ message: "nurseId required" });

    const appt = await Appointment.findById(appointmentId);

    if (!appt)
      return res.status(404).json({ message: "Appointment not found" });

    const assignedIds = appt.assignedNurse.map(x => String(x));

    if (!assignedIds.includes(String(nurseId))) {
      return res.status(403).json({ message: "You are not assigned to this appointment" });
    }

    if (appt.status !== "Accepted") {
      return res.status(400).json({
        message: "You must accept the appointment before completing it"
      });
    }

    appt.status = "Completed";
    await appt.save();

    res.json({ success: true, data: appt });

  } catch (error) {
    console.error("COMPLETE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
