import express from "express";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { sendResetEmail } from "./emailService.js"; // ✅ Import reusable email sender
import Admin from "../models/Admin.js";
import Doctor from "../models/Doctor.js";
import Nurse from "../models/Nurse.js";
import Patient from "../models/Patient.js";

dotenv.config();
const router = express.Router();

/* 🧠 Helper to get model by role */
const getModelByRole = (role) => {
  switch (role.toLowerCase()) {
    case "admin":
      return Admin;
    case "doctor":
      return Doctor;
    case "nurse":
      return Nurse;
    case "patient":
      return Patient;
    default:
      return null;
  }
};

/* 🧩 Reset Token Schema */
const resetTokenSchema = new mongoose.Schema({
  email: String,
  role: String,
  token: String,
  expiresAt: Date,
});

const ResetToken = mongoose.model("ResetToken", resetTokenSchema);

/* ✅ 1️⃣ Forgot Password — Send Email */
router.post("/forgot-password", async (req, res) => {
  try {
    const { email, role } = req.body;

    if (!email || !role) {
      return res.status(400).json({ message: "Email and role are required" });
    }

    const Model = getModelByRole(role);
    if (!Model) return res.status(400).json({ message: "Invalid role provided" });

    const user = await Model.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found with that email" });

    // Delete any existing token
    await ResetToken.deleteMany({ email });

    // Create new reset token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 min expiry

    await ResetToken.create({ email, role, token, expiresAt });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    // ✅ Use centralized email service
    await sendResetEmail(email, user.fullName || "User", resetLink);

    res.json({
      success: true,
      message: "Password reset email sent successfully",
    });
  } catch (error) {
    console.error("❌ Forgot Password Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during password reset request",
      error: error.message,
    });
  }
});

/* ✅ 2️⃣ Reset Password — Verify Token & Update Password */
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ message: "New password is required" });
    }

    const tokenData = await ResetToken.findOne({ token });
    if (!tokenData) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    if (tokenData.expiresAt < new Date()) {
      await ResetToken.deleteOne({ token });
      return res.status(400).json({ message: "Token has expired" });
    }

    const { email, role } = tokenData;
    const Model = getModelByRole(role);
    const user = await Model.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash and save new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    // Delete the token after successful reset
    await ResetToken.deleteOne({ token });

    res.json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("❌ Reset Password Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during password reset",
      error: error.message,
    });
  }
});

export default router;
