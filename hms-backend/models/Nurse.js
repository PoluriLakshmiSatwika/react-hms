import mongoose from "mongoose";

const nurseSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  department: { type: String, required: true },
  shiftTiming: { type: String, required: true },
  password: { type: String, required: true },
});

export default mongoose.model("Nurse", nurseSchema);
