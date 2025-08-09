import express from "express";
import {
  startQuiz,
  getUserQuizzes,
  submitQuizResult,
} from "../controllers/quizController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/start", protect, startQuiz);
router.get("/all", protect, getUserQuizzes);
router.patch("/:id/result", protect, submitQuizResult);

export default router;
