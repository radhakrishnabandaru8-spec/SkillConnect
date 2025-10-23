import express from "express";
import Feedback from "../models/Feedback.js";

const router = express.Router();

// POST feedback
router.post("/", async (req, res) => {
  try {
    const { name, email, feedback } = req.body;
    const newFeedback = new Feedback({ name, email, feedback });
    await newFeedback.save();
    res.status(201).json({ message: "Feedback received!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
