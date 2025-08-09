import mongoose from "mongoose";

const quizSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    topic: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },
    questionCount: { type: Number, required: true },
    timeLimit: { type: Number, default: null }, // in minutes
    questions: [
      {
        question: { type: String, required: true },
        options: { type: [String], required: true }, // Array of 4 strings
        answer: { type: String, required: true }, // The correct option
      },
    ],
    score: { type: Number },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Quiz", quizSchema);
