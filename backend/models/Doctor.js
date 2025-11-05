import mongoose from "mongoose";
const doctorSchema = new mongoose.Schema({
  email: String,
  password: String,
  department: String
});
export default mongoose.model("Doctor", doctorSchema, "doctors");
