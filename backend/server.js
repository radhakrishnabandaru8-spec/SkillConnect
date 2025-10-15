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

const allowedOrigins = [
  "http://localhost:5173", // local dev
  "https://radhakrishnabandaru8-spec.github.io/skillconnect" // production frontend
];

// Middleware
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // Postman or curl
    if (!allowedOrigins.includes(origin)) {
      return callback(new Error(`CORS policy: Origin ${origin} not allowed`), false);
    }
    return callback(null, true);
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));
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
app.use(express.static(path.join(__dirname, 'frontend' ,'dist')));

// All other routes should return the React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {console.log(`🚀Server running on port ${PORT}`);});
