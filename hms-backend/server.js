import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";

import adminRoutes from "./routes/adminRoutes.js";
import staffRoutes from "./routes/staffRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import nurseRoutes from "./routes/nurseRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";

// ✅ explicitly load .env from current directory
dotenv.config({ path: './.env' });

const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
// Debug line
console.log("🔍 Loaded MONGO_URL:", process.env.MONGO_URL);

const PORT = process.env.PORT || 5000;
const MONGOURL = process.env.MONGO_URL;

mongoose.connect(MONGOURL)
  .then(() => {
    console.log("✅ Database connected successfully");
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch((error) => console.log("❌ Database connection failed:", error));
// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/staff", staffRoutes);
console.log("✅ Patient routes loaded!");

app.use("/api/patient", patientRoutes);

app.use("/api/doctors", doctorRoutes);
app.use("/api/nurses", nurseRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running!");
});
