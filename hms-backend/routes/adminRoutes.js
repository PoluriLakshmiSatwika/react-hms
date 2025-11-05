import express from "express";
import Admin from "../models/Admin.js";
import PendingStaff from "../models/PendingStaff.js";
import Doctor from "../models/Doctor.js";
import Nurse from "../models/Nurse.js";

const router = express.Router();

// ✅ Admin Registration
router.post("/register", async (req, res) => {
  try {
    const { fullName, email, phone, department, accessLevel, password } = req.body;
    const admin = new Admin({ fullName, email, phone, department, accessLevel, password });
    await admin.save();
    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error registering admin", error });
  }
});

// ✅ View all pending staff
router.get("/pending-staff", async (req, res) => {
  try {
    const pending = await PendingStaff.find();
    res.json(pending);
  } catch (error) {
    res.status(500).json({ message: "Error fetching pending staff", error });
  }
});

// ✅ Approve staff (move from pending to staff collection)
router.post("/approve/:id", async (req, res) => {
  try {
    const pendingStaff = await PendingStaff.findById(req.params.id);
    if (!pendingStaff) return res.status(404).json({ message: "Staff not found" });

    if (pendingStaff.role === "doctor") {
      const doctor = new Doctor({
        fullName: pendingStaff.name,
        email: pendingStaff.email,
        phone: pendingStaff.phone,
        department: pendingStaff.department,
        specialty: pendingStaff.specialty,
        password: pendingStaff.password,
      });
      await doctor.save();
    } else if (pendingStaff.role === "nurse") {
      const nurse = new Nurse({
        fullName: pendingStaff.name,
        email: pendingStaff.email,
        phone: pendingStaff.phone,
        department: pendingStaff.department,
        shiftTiming: pendingStaff.shiftTiming,
        password: pendingStaff.password,
      });
      await nurse.save();
    }

    await PendingStaff.findByIdAndDelete(req.params.id);
    res.json({ message: "Staff approved and moved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error approving staff", error });
  }
});

export default router;
