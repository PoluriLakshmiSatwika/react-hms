import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

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
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);


app.get("/", (req, res) => {
  res.send("Backend is running!");
});
