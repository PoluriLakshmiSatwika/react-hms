import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  department: { type: String },
  accessLevel: { type: String, enum: ["Super Admin", "Staff Admin"], default: "Staff Admin" },
  password: { type: String, required: true },
});

export default mongoose.model("Admin", adminSchema);
