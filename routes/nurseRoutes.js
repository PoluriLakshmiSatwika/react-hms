const express = require('express');
const Nurse = require('../models/Nurse');
const router = express.Router();

// Register a new nurse
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, department, shift, password } = req.body;

    // Check if nurse already exists
    const existingNurse = await Nurse.findOne({ email });
    if (existingNurse) {
      return res.status(400).json({ message: 'Nurse already exists' });
    }

    const newNurse = new Nurse({
      name,
      email,
      phone,
      department,
      shift,
      password, // In production, hash the password
    });

    await newNurse.save();
    res.status(201).json({ message: 'Nurse registered successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
