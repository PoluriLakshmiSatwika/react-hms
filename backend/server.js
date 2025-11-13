import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import passwordRoutes from "./routes/passwordRoutes.js";
import nurseRoutes from "./routes/nurseRoutes.js";
  // ⭐ ADDED

dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

app.use(express.json());

// MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log("❌ DB Error:", err));

// ⭐ REGISTER ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/password", passwordRoutes);
app.use("/api/nurse", nurseRoutes);    // ⭐ IMPORTANT

// Root
app.get("/", (req, res) => {
  res.send("✅ HMS Backend Running Successfully 🚀");
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);

export default app;
