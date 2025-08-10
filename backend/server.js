import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser"; // Make sure this is installed and used
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";

dotenv.config();
const app = express();

const allowedOrigin = "http://localhost:5173";

// --- CORS Configuration (THE FIX IS HERE) ---
const corsOptions = {
  origin: allowedOrigin, // 1. Allow only your frontend origin
  credentials: true, // 2. Allow cookies and authorization headers
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], // Optional: Specify allowed methods
};

app.use(cors(corsOptions)); // 3. Use the specific options
app.use(express.json());
app.use(cookieParser()); // Ensure cookie-parser is used for refresh tokens

connectDB();

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/quiz", quizRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("SkillLogger API is running...");
});

const PORT = process.env.PORT || 5111;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
