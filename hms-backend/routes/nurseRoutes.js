import express from "express";
import Nurse from "../models/Nurse.js";
import PendingStaff from "../models/PendingStaff.js";

const router = express.Router();

// 🟡 Nurse Registration (goes to pending_staff)
router.post("/register", async (req, res) => {
  try {
    const { fullName, email, phone, department, shiftTiming, password } = req.body;

    const existingNurse = await PendingStaff.findOne({ email });
    if (existingNurse) {
      return res.status(400).json({ message: "Nurse already registered and pending approval" });
    }

    const newPendingNurse = new PendingStaff({
      fullName,
      email,
      phone,
      role: "nurse",
      department,
      shiftTiming,
      password,
      status: "pending",
    });

    await newPendingNurse.save();
    res.status(201).json({ message: "Nurse registration pending admin approval", nurse: newPendingNurse });
  } catch (error) {
    console.error("Error registering nurse:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
