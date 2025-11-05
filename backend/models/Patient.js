import mongoose from "mongoose";
const patientSchema = new mongoose.Schema({
  email: String,
  password: String,
  medicalHistory: String
});
export default mongoose.model("Patient", patientSchema, "patients");
