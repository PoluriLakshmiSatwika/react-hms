import express from "express";
import multer from "multer";
import bcrypt from "bcryptjs";
import PendingStaff from "../models/PendingStaff.js";

const router = express.Router();

// ✅ Multer configuration for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // make sure this folder exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// 🟡 Nurse Registration (pending_staff) with file upload
router.post("/register", upload.single("uploadId"), async (req, res) => {
  try {
    const { fullName, email, phone, department, shiftTiming, password } = req.body;

    const existingNurse = await PendingStaff.findOne({ email });
    if (existingNurse) {
      return res.status(400).json({ message: "Nurse already registered and pending approval" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newPendingNurse = new PendingStaff({
      fullName,
      email,
      phone,
      role: "nurse",
      department,
      shiftTiming,
      password: hashedPassword,
      uploadId: req.file ? req.file.path : "",
      status: "pending",
    });

    await newPendingNurse.save(); // ✅ This line stores the document
    res.status(201).json({ message: "Nurse registration is pending for admin approval,try login to dashboard after some time", nurse: newPendingNurse });
  } catch (error) {
    console.error("Error registering nurse:", error);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
