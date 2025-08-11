// // import React, { useState, useEffect, useCallback } from "react";
// // import { ChevronsRight, Timer } from "lucide-react";
// // import Button from "../ui/Button";
// // import Card from "../ui/Card";

// // // --- 1. Receive quiz data and a callback function as props ---
// // const QuizPage = ({ quiz, onFinish }) => {
// //   // --- 2. State to manage the quiz flow ---
// //   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
// //   const [answers, setAnswers] = useState({});
// //   const [timeLeft, setTimeLeft] = useState(
// //     quiz.timeLimit ? quiz.timeLimit * 60 : null
// //   );

// //   // --- 3. A variable for easy access to the current question object ---
// //   const currentQuestion = quiz.questions[currentQuestionIndex];

// //   // --- 4. The function to calculate score and end the quiz ---
// //   const finishQuiz = useCallback(() => {
// //     let score = 0;
// //     quiz.questions.forEach((q, index) => {
// //       if (answers[index] === q.answer) {
// //         score++;
// //       }
// //     });
// //     const finalScore = (score / quiz.questions.length) * 100;
// //     onFinish(finalScore); // Call the parent's onFinish function
// //   }, [answers, quiz.questions, onFinish]);

// //   // --- 5. useEffect for the countdown timer ---
// //   useEffect(() => {
// //     if (timeLeft === 0) {
// //       finishQuiz();
// //     }
// //     if (timeLeft === null) return; // Don't start a timer if there's no time limit

// //     const timer = setInterval(() => {
// //       setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
// //     }, 1000);

// //     // Cleanup function: This runs when the component is unmounted
// //     return () => clearInterval(timer);
// //   }, [timeLeft, finishQuiz]);

// //   // --- 6. Handle user's answer selection ---
// //   const handleAnswer = (option) => {
// //     setAnswers({ ...answers, [currentQuestionIndex]: option });
// //   };

// //   // --- 7. Move to the next question or finish ---
// //   const nextQuestion = () => {
// //     if (currentQuestionIndex < quiz.questions.length - 1) {
// //       setCurrentQuestionIndex((prev) => prev + 1);
// //     } else {
// //       finishQuiz();
// //     }
// //   };

// //   // --- 8. Helper to format time ---
// //   const formatTime = (seconds) => {
// //     const minutes = Math.floor(seconds / 60);
// //     const secs = seconds % 60;
// //     return `${minutes.toString().padStart(2, "0")}:${secs
// //       .toString()
// //       .padStart(2, "0")}`;
// //   };

// //   // --- 9. Render the quiz UI ---
// //   return (
// //     <div className="p-4 md:p-8 flex items-center justify-center min-h-full">
// //       <Card className="w-full max-w-3xl">
// //         {/* Header with topic and timer */}
// //         <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-4">
// //           <div>
// //             <h2 className="text-xl font-bold">{quiz.topic} Quiz</h2>
// //             <p className="text-gray-400">
// //               {quiz.difficulty.charAt(0).toUpperCase() +
// //                 quiz.difficulty.slice(1)}
// //             </p>
// //           </div>
// //           {timeLeft !== null && (
// //             <div className="flex items-center gap-2 text-red-500 font-bold text-lg">
// //               <Timer size={20} />
// //               <span>{formatTime(timeLeft)}</span>
// //             </div>
// //           )}
// //         </div>

// //         {/* Question Text */}
// //         <div className="mb-6">
// //           <p className="text-gray-400 mb-4">
// //             Question {currentQuestionIndex + 1} of {quiz.questions.length}
// //           </p>
// //           <h3 className="text-2xl font-semibold">{currentQuestion.question}</h3>
// //         </div>

// //         {/* Answer Options */}
// //         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //           {currentQuestion.options.map((option) => (
// //             <button
// //               key={option}
// //               onClick={() => handleAnswer(option)}
// //               className={`p-4 rounded-lg text-left transition-all duration-200 border-2 ${
// //                 answers[currentQuestionIndex] === option
// //                   ? "bg-blue-600 border-blue-500"
// //                   : "bg-gray-800 border-gray-700 hover:bg-gray-700 hover:border-gray-600"
// //               }`}
// //             >
// //               {option}
// //             </button>
// //           ))}
// //         </div>

// //         {/* Next Button */}
// //         <div className="mt-8 text-right">
// //           <Button
// //             onClick={nextQuestion}
// //             disabled={!answers[currentQuestionIndex]}
// //           >
// //             {currentQuestionIndex < quiz.questions.length - 1
// //               ? "Next Question"
// //               : "Finish Quiz"}
// //             <ChevronsRight size={18} />
// //           </Button>
// //         </div>
// //       </Card>
// //     </div>
// //   );
// // };

// // export default QuizPage;


import React, { useState, useEffect, useCallback } from "react";
import { ChevronsRight, Timer } from "lucide-react";
import Button from "../ui/Button";
import Card from "../ui/Card";

const QuizPage = ({ quiz, onFinish }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(
    quiz.timeLimit ? quiz.timeLimit * 60 : null
  );
  const currentQuestion = quiz.questions[currentQuestionIndex];

  const finishQuiz = useCallback(() => {
    let score = 0;
    quiz.questions.forEach((q, index) => {
      if (answers[index] === q.answer) score++;
    });
    const finalScore = (score / quiz.questions.length) * 100;
    onFinish(finalScore);
  }, [answers, quiz.questions, onFinish]);

  useEffect(() => {
    if (timeLeft === 0) finishQuiz();
    if (timeLeft === null) return;
    const timer = setInterval(
      () => setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0)),
      1000
    );
    return () => clearInterval(timer);
  }, [timeLeft, finishQuiz]);

  const handleAnswer = (option) =>
    setAnswers({ ...answers, [currentQuestionIndex]: option });

  const nextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="p-4 md:p-8 flex items-center justify-center min-h-full">
      <Card className="w-full max-w-3xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 border-b border-gray-800 pb-4 gap-2">
          <div>
            <h2 className="text-lg sm:text-xl font-bold">{quiz.topic} Quiz</h2>
            <p className="text-gray-400 capitalize">{quiz.difficulty}</p>
          </div>
          {timeLeft !== null && (
            <div className="flex items-center gap-2 text-red-500 font-bold text-lg bg-gray-800/50 px-3 py-1 rounded-lg">
              <Timer size={20} />
              <span>{formatTime(timeLeft)}</span>
            </div>
          )}
        </div>

        <div className="mb-6">
          <p className="text-gray-400 mb-4">
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </p>
          <h3 className="text-xl sm:text-2xl font-semibold">
            {currentQuestion.question}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentQuestion.options.map((option) => (
            <button
              key={option}
              onClick={() => handleAnswer(option)}
              className={`p-4 rounded-lg text-left transition-all duration-200 border-2 ${
                answers[currentQuestionIndex] === option
                  ? "bg-blue-600 border-blue-500"
                  : "bg-gray-800 border-gray-700 hover:bg-gray-700 hover:border-gray-600"
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <Button
            onClick={nextQuestion}
            disabled={!answers[currentQuestionIndex]}
          >
            {currentQuestionIndex < quiz.questions.length - 1
              ? "Next"
              : "Finish"}
            <ChevronsRight size={18} />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default QuizPage;