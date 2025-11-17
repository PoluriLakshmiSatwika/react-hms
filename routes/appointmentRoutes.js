const express = require('express');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const router = express.Router();

// Book an appointment
router.post('/book', async (req, res) => {
  try {
    const { patientId, doctorId, disease, slotDateTime, paymentId } = req.body;

    // Find the doctor to get the fee
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Check if slot is available
    const slotIndex = doctor.availableSlots.findIndex(slot => new Date(slot).getTime() === new Date(slotDateTime).getTime());
    if (slotIndex === -1) {
      return res.status(400).json({ message: 'Slot not available' });
    }

    // Remove the slot from available slots
    doctor.availableSlots.splice(slotIndex, 1);
    await doctor.save();

    // Create appointment
    const newAppointment = new Appointment({
      patientId,
      doctorId,
      disease,
      slotDateTime,
      feePaid: doctor.opFee,
      paymentId,
    });

    await newAppointment.save();
    res.status(201).json({ message: 'Appointment booked successfully', appointment: newAppointment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get appointments for a patient
router.get('/patient/:patientId', async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.params.patientId }).populate('doctorId');
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get appointments for a doctor
router.get('/doctor/:doctorId', async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctorId: req.params.doctorId }).populate('patientId');
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
