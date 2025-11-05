import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import Doctor from "../models/Doctor.js";
import Nurse from "../models/Nurse.js";
import Patient from "../models/Patient.js";

const router = express.Router();

// Helper function
const getModelByRole = (role) => {
  switch (role) {
    case "admin": return Admin;
    case "doctor": return Doctor;
    case "nurse": return Nurse;
    case "patient": return Patient;
    default: return null;
  }
};

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { role, email, password } = req.body;
    const Model = getModelByRole(role);

    if (!Model) return res.status(400).json({ message: "Invalid role" });

    const user = await Model.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// POST /api/auth/register (For Sample Testing)
// ✅ Register route (fixed version)
router.post("/register", async (req, res) => {
  try {
    const { role, email, password } = req.body;

    // Validation
    if (!role || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const Model = getModelByRole(role);
    if (!Model) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // 🔍 Check if user already exists in that role's collection
    const existingUser = await Model.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: `${role} already registered` });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new Model({ email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: `${role} registered successfully` });
  } catch (error) {
    console.error("❌ Registration Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


export default router;
