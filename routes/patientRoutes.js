const express = require('express');
const Patient = require('../models/Patient');
const router = express.Router();

// Register a new patient
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, dob, bloodGroup, medicalHistory, password } = req.body;

    // Check if patient already exists
    const existingPatient = await Patient.findOne({ email });
    if (existingPatient) {
      return res.status(400).json({ message: 'Patient already exists' });
    }

    const newPatient = new Patient({
      name,
      email,
      phone,
      dob,
      bloodGroup,
      medicalHistory,
      password, // In production, hash the password
    });

    await newPatient.save();
    res.status(201).json({ message: 'Patient registered successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
