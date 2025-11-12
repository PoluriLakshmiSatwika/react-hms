import mongoose from "mongoose";

const NurseSchema = new mongoose.Schema({
  nurseId: { type: String, unique: true },
  name: String,
  shift: { type: String, enum: ["Morning", "Afternoon", "Night"] },
  available: { type: Boolean, default: true }
});

export default mongoose.model("Nurse", NurseSchema);
