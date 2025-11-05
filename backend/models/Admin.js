import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  department: { type: String },
  accessLevel: { type: String },
  password: { type: String, required: true }
});

export default mongoose.model("Admin", adminSchema, "admins");
