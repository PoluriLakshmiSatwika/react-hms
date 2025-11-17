const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  disease: { type: String, required: true }, // Specialty/Disease
  slotDateTime: { type: Date, required: true },
  feePaid: { type: Number, required: true },
  paymentId: { type: String, required: true }, // Simulated payment ID
  validityCount: { type: Number, default: 3 }, // 3 valid appointments per transaction
  status: { type: String, enum: ['confirmed', 'completed', 'cancelled'], default: 'confirmed' },
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
