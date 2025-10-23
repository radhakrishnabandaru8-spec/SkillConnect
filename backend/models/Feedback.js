import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  feedback: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Feedback", FeedbackSchema);
