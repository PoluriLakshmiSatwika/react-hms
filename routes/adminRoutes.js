const express = require('express');
const Admin = require('../models/Admin');
const router = express.Router();

// Register a new admin
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, department, accessLevel, password } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const newAdmin = new Admin({
      name,
      email,
      phone,
      department,
      accessLevel,
      password, // In production, hash the password
    });

    await newAdmin.save();
    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
