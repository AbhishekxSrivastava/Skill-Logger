import React, { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import api from "../../api";
import Button from "../ui/Button";
import Card from "../ui/Card";

// --- 1. Receive quiz, score, and a restart function as props ---
const QuizResultPage = ({ quiz, score, onRestart }) => {
  // --- 2. Determine the result message and color based on the score ---
  const resultMessage =
    score >= 80
      ? "Excellent Work!"
      : score >= 60
      ? "Good Job!"
      : "Keep Practicing!";
  const messageColor =
    score >= 80
      ? "text-green-500"
      : score >= 60
      ? "text-yellow-500"
      : "text-red-500";

  // --- 3. useEffect to send the score to the backend ---
  useEffect(() => {
    api
      .patch(`/quiz/${quiz._id}/result`, { score })
      .catch((err) => console.error("Failed to submit score", err));
  }, [quiz._id, score]); // Run this effect only once when the component loads

  // --- 4. Render the results UI ---
  return (
    <div className="p-4 md:p-8 flex items-center justify-center min-h-full">
      <Card className="w-full max-w-lg text-center">
        <h1 className="text-3xl font-bold mb-2">Quiz Complete!</h1>
        <p className={`text-2xl font-bold mb-4 ${messageColor}`}>
          {resultMessage}
        </p>
        <div className="text-7xl font-bold my-8">
          {Math.round(score)}
          <span className="text-3xl text-gray-400">%</span>
        </div>
        <p className="text-gray-400">
          You answered {Math.round((score / 100) * quiz.questions.length)} out
          of {quiz.questions.length} questions correctly.
        </p>
        <Button onClick={onRestart} className="mt-8 mx-auto">
          <ArrowLeft size={18} /> Take Another Quiz
        </Button>
      </Card>
    </div>
  );
};

export default QuizResultPage;
