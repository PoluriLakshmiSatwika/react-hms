const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  specialty: { type: String, required: true },
  department: { type: String, required: true },
  password: { type: String, required: true },
  opFee: { type: Number, required: true, default: 1 }, // OP Fee in rupees
  availableSlots: [{ type: Date }], // Array of available date-time slots
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);
