import Quiz from "../models/Quiz.js";
import Skill from "../models/Skill.js";
import { generateQuizWithGemini } from "../utils/generateQuiz.js";

// @desc    Start a new quiz
// @route   POST /api/quiz/start
export const startQuiz = async (req, res) => {
  try {
    const userId = req.user.id;
    let { topic, difficulty, questionCount, timeLimit } = req.body;

    // --- Random Quiz Generation Logic ---
    // If any of the main parameters are missing, generate a random quiz.
    if (!topic || !difficulty || !questionCount) {
      const userLogs = await Skill.find({ user: userId });
      const allTopics = [...new Set(userLogs.map((log) => log.title))];

      if (allTopics.length === 0) {
        return res
          .status(400)
          .json({ error: "Log some skills first to generate a random quiz." });
      }

      topic = allTopics[Math.floor(Math.random() * allTopics.length)];
      difficulty = ["easy", "medium", "hard"][Math.floor(Math.random() * 3)];
      questionCount = Math.floor(Math.random() * 6) + 5; // Randomly 5 to 10 questions

      // Randomly decide if there's a time limit
      const hasTimeLimit = Math.random() > 0.5;
      if (hasTimeLimit) {
        timeLimit = questionCount; // 1 minute per question
      } else {
        timeLimit = null; // No time limit
      }
    }

    const questions = await generateQuizWithGemini({
      topic,
      difficulty,
      questionCount,
    });

    const newQuiz = await Quiz.create({
      user: userId,
      topic,
      difficulty,
      questionCount,
      timeLimit,
      questions,
    });

    res.status(201).json({ quiz: newQuiz });
  } catch (error) {
    console.error("Quiz Generation Error:", error);
    res.status(500).json({ error: "Failed to generate quiz" });
  }
};

// @desc    Get all quizzes for a user
// @route   GET /api/quiz/all
export const getUserQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.status(200).json({ quizzes });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch quizzes" });
  }
};

// @desc    Submit the result for a quiz
// @route   PATCH /api/quiz/:id/result
export const submitQuizResult = async (req, res) => {
  try {
    const { id } = req.params;
    const { score } = req.body;
    const updated = await Quiz.findByIdAndUpdate(id, { score }, { new: true });
    res.status(200).json({ updated });
  } catch (error) {
    res.status(500).json({ error: "Failed to submit score" });
  }
};
