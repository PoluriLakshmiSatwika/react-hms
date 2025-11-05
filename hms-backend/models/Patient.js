import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, unique: true },
  phone: { type: String },
  dob: { type: Date },
  bloodGroup: { type: String },
  medicalHistory: { type: String },
  password: { type: String, required: true },
});

export default mongoose.model("Patient", patientSchema);
