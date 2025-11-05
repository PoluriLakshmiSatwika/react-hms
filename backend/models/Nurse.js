import mongoose from "mongoose";
const nurseSchema = new mongoose.Schema({
  email: String,
  password: String,
  shift: String
});
export default mongoose.model("Nurse", nurseSchema, "nurses");
