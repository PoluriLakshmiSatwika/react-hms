import express from "express";
import PendingStaff from "../models/PendingStaff.js";

const router = express.Router();

// Doctor Registration Route
router.post("/register", async (req, res) => {
  try {
    const { fullName, email, phone, specialty, department, password } = req.body;

    const existingDoctor = await PendingStaff.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({ message: "Doctor already registered and pending approval" });
    }

    const newPendingDoctor = new PendingStaff({
      fullName,
      email,
      phone,
      role: "doctor",
      department,
      specialty,
      password,
      status: "pending",
    });

    await newPendingDoctor.save();
    res.status(201).json({
      message: "Doctor registration pending admin approval",
      doctor: newPendingDoctor,
    });
  } catch (error) {
    console.error("Error registering doctor:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Test route to verify doctorRoutes is loaded
router.get("/test", (req, res) => {
  res.send("Doctor routes working!");
});
// ✅ Get all pending doctors
router.get("/pending", async (req, res) => {
  try {
    const pendingDoctors = await PendingStaff.find({ role: "doctor", status: "pending" });
    res.status(200).json(pendingDoctors);
  } catch (error) {
    console.error("Error fetching pending doctors:", error);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
