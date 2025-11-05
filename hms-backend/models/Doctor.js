import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  specialty: { type: String, required: true },
  department: { type: String, required: true },
  password: { type: String, required: true },
});

export default mongoose.model("Doctor", doctorSchema);
