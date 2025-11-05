import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointment",
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  paymentMethod: {
    type: String,
    enum: ["UPI", "Card", "NetBanking", "Cash"],
    default: "UPI"
  },
  status: {
    type: String,
    enum: ["Pending", "Success", "Failed"],
    default: "Success"
  },
  transactionId: {
    type: String,
    unique: true
  },
  remainingSlots: {
    type: Number,
    default: 3
  }
});

export default mongoose.model("Payment", paymentSchema);
