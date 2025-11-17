const express = require('express');
const Doctor = require('../models/Doctor');
const router = express.Router();

// Register a new doctor
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, specialty, department, password, opFee, availableSlots } = req.body;

    // Check if doctor already exists
    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({ message: 'Doctor already exists' });
    }

    const newDoctor = new Doctor({
      name,
      email,
      phone,
      specialty,
      department,
      password, // In production, hash the password
      opFee,
      availableSlots,
    });

    await newDoctor.save();
    res.status(201).json({ message: 'Doctor registered successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all specialties
router.get('/specialties', async (req, res) => {
  try {
    const specialties = await Doctor.distinct('specialty');
    res.json(specialties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get doctors by specialty
router.get('/by-specialty/:specialty', async (req, res) => {
  try {
    const doctors = await Doctor.find({ specialty: req.params.specialty });
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get available slots for a doctor
router.get('/:id/slots', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json({ availableSlots: doctor.availableSlots, opFee: doctor.opFee });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all doctors (for testing)
router.get('/', async (req, res) => {
  try {
    const doctors = await Doctor.find({});
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
