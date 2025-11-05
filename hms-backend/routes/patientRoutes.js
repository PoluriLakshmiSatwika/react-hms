import express from "express";
import Patient from "../models/Patient.js";

const router = express.Router();

// ✅ Register patient route
router.post("/register", async (req, res) => {
  try {
    const { fullName, email, phone, dob, bloodGroup, medicalHistory, password } = req.body;

    const patient = new Patient({
      fullName,
      email,
      phone,
      dob,
      bloodGroup,
      medicalHistory,
      password
    });

    await patient.save();
    res.status(201).json({ message: "Patient registered successfully" });
  } catch (error) {
    console.error("❌ Error registering patient:", error);
    res.status(500).json({ message: "Error registering patient", error });
  }
});

export default router;
