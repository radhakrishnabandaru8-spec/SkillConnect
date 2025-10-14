import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.js"; // your auth routes
import feedbackRoutes from "./routes/feedback.js"; // your feedback routes
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/feedback", feedbackRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));
  
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

// Serve static files from frontend/build
app.use(express.static(path.join(__dirname, "../frontend/skill/dist")));

// All other routes should return the React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/skill/dist", "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {console.log(`🚀Server running on port ${PORT}`);});
