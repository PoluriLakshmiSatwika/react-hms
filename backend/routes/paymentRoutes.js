import express from "express";
import Payment from "../models/Payment.js";
import Appointment from "../models/Appointment.js";
import mongoose from "mongoose";

const router = express.Router();

/* ✅ CREATE PAYMENT (Duplicate Prevention + Auto Link) */
router.post("/create", async (req, res) => {
  try {
    const { patientId, doctorId, appointmentId, amount, paymentMethod } = req.body;

    // Basic validation
    if (!patientId || !doctorId || !appointmentId || !amount) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Step 1️⃣ — Check if appointment exists
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Step 2️⃣ — Prevent duplicate payment
    if (appointment.feePaid) {
      return res.status(400).json({ message: "Payment already made for this appointment" });
    }

    // Step 3️⃣ — Generate a unique transaction ID
    const transactionId = "TXN" + new mongoose.Types.ObjectId().toString().slice(-6);

    // Step 4️⃣ — Create payment record
    const payment = new Payment({
      patientId,
      doctorId,
      appointmentId,
      amount,
      paymentMethod,
      transactionId,
      status: "Success"
    });

    await payment.save();

    // Step 5️⃣ — Update appointment: mark paid + link paymentId
    appointment.feePaid = true;
    appointment.paymentId = payment._id;
    await appointment.save();

    res.status(201).json({
      success: true,
      message: "Payment completed successfully",
      data: {
        transactionId: payment.transactionId,
        amount: payment.amount,
        patientId: payment.patientId,
        doctorId: payment.doctorId,
        appointmentId: payment.appointmentId
      }
    });

  } catch (error) {
    console.error("❌ Payment Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during payment",
      error: error.message
    });
  }
});

/* 🔍 GET ALL PAYMENTS (Admin/Doctor) */
router.get("/", async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("patientId", "fullName email")
      .populate("doctorId", "fullName department")
      .populate("appointmentId", "disease appointmentDate slotTime");

    res.json({ success: true, count: payments.length, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

/* 🧾 GET PAYMENT HISTORY (BY PATIENT) */
router.get("/patient/:id", async (req, res) => {
  try {
    const payments = await Payment.find({ patientId: req.params.id })
      .populate("doctorId", "fullName department")
      .populate("appointmentId", "appointmentDate slotTime");

    res.json({ success: true, count: payments.length, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

export default router;
