import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
  disease: { type: String },
  slot: { type: String },
  assignedNurseIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Nurse" }],
  feePaid: { type: Number },
  validityCount: { type: Number, default: 1 },
});

export default mongoose.model("Appointment", appointmentSchema);
