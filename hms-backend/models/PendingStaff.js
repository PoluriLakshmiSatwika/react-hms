import mongoose from "mongoose";

const pendingStaffSchema = new mongoose.Schema({
  fullName: { type: String, required: true }, // ✅ use fullName instead of name
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  role: {
    type: String,
    enum: ["doctor", "nurse", "receptionist", "staff", "admin"], // ✅ include 'doctor'
    required: true,
  },
  department: { type: String, required: true },
  specialty: { type: String, required: true },
  password: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"], // ✅ include 'pending'
    default: "pending",
  },
}, { timestamps: true });

const PendingStaff = mongoose.model("PendingStaff", pendingStaffSchema);
export default PendingStaff;
