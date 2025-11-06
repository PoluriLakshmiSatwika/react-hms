import mongoose from "mongoose";

const pendingStaffSchema = new mongoose.Schema({
  role: { type: String, required: true, enum: ["doctor", "nurse"] },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  department: { type: String },
  specialty: { type: String }, // for doctors
  shiftTiming: { type: String }, // for nurses
  uploadId: { type: String },
  password: { type: String, required: true },
  status: { type: String, default: "Pending" }, // Pending / Approved / Rejected
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("PendingStaff", pendingStaffSchema, "pendingStaffs");