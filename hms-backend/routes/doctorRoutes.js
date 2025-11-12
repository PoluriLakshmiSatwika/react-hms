import express from "express";
import Assignment from "../models/Assignment.js";
import Nurse from "../models/Nurse.js";

const router = express.Router();

/* ⿡ Get all upcoming appointments (Assignments table) */
router.get("/appointments", async (req, res) => {
  try {
    const appointments = await Assignment.find();
    res.json({ success: true, data: appointments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ⿢ Get all available nurses */
router.get("/nurses", async (req, res) => {
  try {
    const nurses = await Nurse.find({ available: true });
    res.json({ success: true, data: nurses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ⿣ Assign nurses to appointment */
router.put("/assign", async (req, res) => {
  try {
    const { appointmentId, nurseIds } = req.body;

    const nurses = await Nurse.find({ nurseId: { $in: nurseIds } });

    const nurseData = nurses.map(n => ({
      nurseId: n.nurseId,
      nurseName: n.name
    }));

    let assignment = await Assignment.findOne({ appointmentId });

    if (assignment) {
      assignment.assignedNurses = nurseData;
      await assignment.save();
    } else {
      assignment = await Assignment.create({
        appointmentId,
        assignedNurses: nurseData
      });
    }

    res.json({
      success: true,
      message: "Nurses assigned successfully",
      data: assignment
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;