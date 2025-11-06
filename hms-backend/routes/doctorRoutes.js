import express from "express";
import bcrypt from "bcryptjs";
import multer from "multer";
import path from "path";
import fs from "fs";
import PendingStaff from "../models/PendingStaff.js"; // your pending_staff collection model
import Doctor from "../models/Doctor.js";

const router = express.Router();

// ✅ Multer configuration for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // make sure this folder exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// 🟢 Doctor Registration — stored in pending_staff until approved
router.post("/register", upload.single("uploadId"), async (req, res) => {
  try {
    const { name, email, phone, specialty, department, password } = req.body;

    // Check if doctor already pending or registered
    const existingPending = await PendingStaff.findOne({ email });
    if (existingPending) {
      return res.status(400).json({
        message: "Doctor already registered and awaiting admin approval.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save to pending_staff collection
    const newPendingDoctor = new PendingStaff({
      fullName: name,
      email,
      phone,
      role: "doctor",
      department,
      specialty,
      password: hashedPassword,
      uploadId: req.file ? req.file.path : "",
      status: "pending",
    });

    await newPendingDoctor.save();

    res.status(201).json({
      message:
        "Doctor registration submitted successfully and is pending admin approval.",
      doctor: newPendingDoctor,
    });
  } catch (error) {
    console.error("Error registering doctor:", error);
    res.status(500).json({ message: "Server error during registration." });
  }
});

// 🟢 Doctor Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password required" });

  try {
    const doctor = await Doctor.findOne({ email });
    if (!doctor || doctor.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.status(200).json({
      success: true,
      doctor: { id: doctor._id, name: doctor.fullName, email: doctor.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
