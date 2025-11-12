import express from "express";
import mongoose from "mongoose";
import cors from "cors";
 import doctorRoutes from "./routes/doctorRoutes.js";
import dotenv from "dotenv";
// import authRoutes from "./routes/authRoutes.js";
// import appointmentRoutes from "./routes/appointmentRoutes.js";
// import paymentRoutes from "./routes/paymentRoutes.js";
// import passwordRoutes from "./routes/passwordRoutes.js";


dotenv.config();

const app = express();
// app.use(cors());
app.use(cors({
  origin:  "http://localhost:3000",
  credentials: true,
}));

app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log("❌ DB Error:", err));

// Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/appointments", appointmentRoutes);
// app.use("/api/payments", paymentRoutes);
// app.use("/api/password", passwordRoutes);
app.use("/api/doctor", doctorRoutes);
app.get("/", (req, res) => {
  res.send("✅ HMS Backend Running Successfully 🚀");
});


// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

export default app;