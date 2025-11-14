import express from "express";
import Appointment from "../models/Appointment.js";
import Nurse from "../models/Nurse.js";

const router = express.Router();

/* =====================================================
   1️⃣ FETCH APPOINTMENTS FOR DOCTOR
===================================================== */
router.get("/appointments/:doctorId", async (req, res) => {
  try {
    const { doctorId } = req.params;

    const appointments = await Appointment.find({
      doctorId,
      status: { $in: ["Pending", "Accepted", "Confirmed"] }
    })
      .populate("patientId", "fullName age gender")
      .populate("assignedNurse", "fullName shiftTiming available")
      .sort({ appointmentDate: 1 });

    res.json({ success: true, data: appointments });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* =====================================================
   2️⃣ GET NURSES (WITH OPTIONAL SHIFT FILTER)
===================================================== */
router.get("/nurses", async (req, res) => {
  try {
    const { shift } = req.query;

    let filter = {};
    if (shift) filter.shiftTiming = shift;

    const nurses = await Nurse.find(filter).select(
      "fullName email phone department shiftTiming available"
    );

    res.json({ success: true, data: nurses });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* =====================================================
   3️⃣ ASSIGN NURSES (FULL VALIDATION + FINAL FIXED)
===================================================== */
router.put("/assign-nurses", async (req, res) => {
  try {
    const { appointmentId, nurseIds } = req.body;

    if (!appointmentId || !Array.isArray(nurseIds) || nurseIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "appointmentId & nurseIds required",
      });
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Ensure assignedNurse array exists
    if (!Array.isArray(appointment.assignedNurse)) {
      appointment.assignedNurse = [];
    }

    /* -------------------------------------------------
       🔥 A. PREVENT ASSIGNING SAME NURSE AGAIN
    -------------------------------------------------- */
    const alreadyAssigned = appointment.assignedNurse.map(id => String(id));

    const duplicate = nurseIds.find(id =>
      alreadyAssigned.includes(String(id))
    );

    if (duplicate) {
      return res.status(400).json({
        success: false,
        message: "This nurse is already assigned. Choose another nurse."
      });
    }

    /* -------------------------------------------------
       🔥 B. VALIDATE NURSE IDs EXIST
    -------------------------------------------------- */
    const nurses = await Nurse.find({ _id: { $in: nurseIds } });

    if (nurses.length !== nurseIds.length) {
      return res.status(400).json({
        success: false,
        message: "One or more nurseIds are invalid",
      });
    }

    /* -------------------------------------------------
       🔥 C. CHECK IF ANY NURSE IS OFFLINE
    -------------------------------------------------- */
    const offline = nurses.filter(n => !n.available);

    if (offline.length > 0) {
      return res.status(400).json({
        success: false,
        message: `These nurses are offline: ${offline
          .map(u => u.fullName)
          .join(", ")}`
      });
    }

    /* -------------------------------------------------
       🔥 D. FINAL ASSIGNMENT
    -------------------------------------------------- */
    const uniqueNurses = [
      ...new Set([...appointment.assignedNurse, ...nurseIds])
    ];

    appointment.assignedNurse = uniqueNurses;

    // 🔥 IMPORTANT: new enum supports Accepted, Confirmed
    appointment.status = "Pending";

    await appointment.save();

    res.json({
      success: true,
      message: "Nurse(s) assigned successfully",
      data: appointment,
    });

  } catch (err) {
    console.error("ASSIGN ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error while assigning nurses",
    });
  }
});

/* =====================================================
   4️⃣ MARK APPOINTMENT AS COMPLETED
===================================================== */
router.put("/complete/:appointmentId", async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const updated = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status: "Completed" },
      { new: true }
    );

    res.json({ success: true, data: updated });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
