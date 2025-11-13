import express from "express";
import multer from "multer";
import bcrypt from "bcryptjs";
import PendingStaff from "../models/PendingStaff.js";
import Nurse from "../models/Nurse.js";
import Appointment from "../models/Appointment.js";

const router = express.Router();

// ======================
//  FILE UPLOAD SETUP
// ======================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// ======================
//  REGISTER NURSE
// ======================
router.post("/register", upload.single("uploadId"), async (req, res) => {
  try {
    const { fullName, email, phone, department, shiftTiming, password } = req.body;

    const existingNurse = await PendingStaff.findOne({ email });
    if (existingNurse) {
      return res.status(400).json({ message: "Nurse already registered and pending approval" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newPendingNurse = new PendingStaff({
      fullName,
      email,
      phone,
      role: "nurse",
      department,
      shiftTiming,
      password: hashedPassword,
      uploadId: req.file ? req.file.path : "",
      status: "pending",
    });

    await newPendingNurse.save();
    res.status(201).json({
      message: "Nurse registration pending admin approval.",
      nurse: newPendingNurse,
    });
  } catch (error) {
    console.error("Error registering nurse:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ======================
//  NURSE LOGIN
// ======================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const nurse = await Nurse.findOne({ email });

    if (!nurse) {
      const pending = await PendingStaff.findOne({ email, role: "nurse" });

      if (pending) {
        return res.status(403).json({ message: "Your account is pending admin approval." });
      }

      return res.status(404).json({ message: "No nurse found with this email" });
    }

    const isMatch = await bcrypt.compare(password, nurse.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    res.status(200).json({
      success: true,
      message: "Nurse login successful",
      nurse: {
        id: nurse._id,
        name: nurse.fullName,
        email: nurse.email,
        department: nurse.department,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ======================
//  FETCH ASSIGNED APPOINTMENTS
// ======================
router.get("/assignments", async (req, res) => {
  try {
    const nurseId = req.query.nurseId;

    if (!nurseId || nurseId === "null") {
      return res.status(400).json({ message: "Valid nurseId required" });
    }

    const appointments = await Appointment.find({ assignedNurse: nurseId })
      .populate("patientId", "fullName email phone")
      .sort({ appointmentDate: 1 });

    res.json({ success: true, data: appointments });
  } catch (error) {
    console.error("Error fetching assignments:", error);
    res.status(500).json({ message: "Server error fetching appointments" });
  }
});

// ======================
//  UPDATE AVAILABILITY
// ======================
router.put("/availability", async (req, res) => {
  try {
    const { nurseId, available } = req.body;

    if (!nurseId || nurseId === "null") {
      return res.status(400).json({ message: "nurseId is required" });
    }

    await Nurse.findByIdAndUpdate(nurseId, { available });

    res.json({ success: true, message: "Availability updated" });
  } catch (error) {
    console.error("Availability update error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ======================
//  ACCEPT ASSIGNMENT
// ======================
router.put("/assignments/:id/accept", async (req, res) => {
  try {
    const updated = await Appointment.findByIdAndUpdate(
      req.params.id,
    //   { status: "Accepted" },
    { status: "Confirmed" },

      { new: true }
    );
    res.json({ success: true, data: updated });
  } catch (error) {
    console.error("Accept error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ======================
//  MARK COMPLETED
// ======================
router.put("/assignments/:id/complete", async (req, res) => {
  try {
    const updated = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: "Completed" },
      { new: true }
    );
    res.json({ success: true, data: updated });
  } catch (error) {
    console.error("Complete error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
