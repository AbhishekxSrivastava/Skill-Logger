// import React, { useState, useContext } from "react";
// import { BookOpen, BarChart2, BrainCircuit, LogOut } from "lucide-react";
// import { AuthContext } from "../../context/AuthContext";
// import LoginPage from "../auth/LoginPage";
// import Spinner from "./Spinner";
// import Button from "../ui/Button";
// // We will create these page components in the next steps
// // For now, let's create placeholder components for them at the bottom of this file.
// import DashboardPage from "../dashboard/DashboardPage";
// import QuizSetupPage from "../quiz/QuizSetupPage";
// import QuizPage from "../quiz/QuizPage";
// import QuizResultPage from "../quiz/QuizResultPage";

// // --- 1. Define the main content component ---
// const AppContent = () => {
//   // --- 2. Access the AuthContext ---
//   const { isAuthenticated, loading, logout } = useContext(AuthContext);

//   // --- 3. Set up state for navigation and quiz flow ---
//   const [currentPage, setCurrentPage] = useState("dashboard");
//   const [quizConfig, setQuizConfig] = useState(null);
//   const [quizResult, setQuizResult] = useState(null);

//   // --- 4. Navigation and Quiz Handling Functions ---
//   const navigate = (page) => {
//     setQuizConfig(null);
//     setQuizResult(null);
//     setCurrentPage(page);
//   };

//   const handleFinishQuiz = (score) => {
//     setQuizResult({ quiz: quizConfig, score });
//     setQuizConfig(null);
//   };

//   // --- 5. Handle the initial loading state ---
//   if (loading) {
//     return (
//       <div className="bg-black min-h-screen">
//         <Spinner />
//       </div>
//     );
//   }

//   // --- 6. If not authenticated, show the LoginPage ---
//   if (!isAuthenticated) {
//     return <LoginPage />;
//   }

//   // --- 7. The main router logic ---
//   const renderPage = () => {
//     if (quizConfig) {
//       return <QuizPage quiz={quizConfig} onFinish={handleFinishQuiz} />;
//     }
//     if (quizResult) {
//       return (
//         <QuizResultPage
//           quiz={quizResult.quiz}
//           score={quizResult.score}
//           onRestart={() => navigate("quiz")}
//         />
//       );
//     }
//     switch (currentPage) {
//       case "dashboard":
//         return <DashboardPage />;
//       case "quiz":
//         return <QuizSetupPage setQuizConfig={setQuizConfig} />;
//       default:
//         return <DashboardPage />;
//     }
//   };

//   // --- 8. Render the main application layout ---
//   return (
//     <div className="bg-black text-white min-h-screen">
//       <nav className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800 p-4 flex justify-between items-center sticky top-0 z-40">
//         <div
//           className="flex items-center gap-2 cursor-pointer"
//           onClick={() => navigate("dashboard")}
//         >
//           <BrainCircuit className="text-blue-500" />
//           <h1 className="font-bold text-xl">Skill Logger</h1>
//         </div>
//         <div className="flex items-center gap-4">
//           <button
//             onClick={() => navigate("dashboard")}
//             className="flex items-center gap-2 hover:text-blue-400 transition-colors"
//           >
//             <BarChart2 size={18} />
//             Dashboard
//           </button>
//           <button
//             onClick={() => navigate("quiz")}
//             className="flex items-center gap-2 hover:text-blue-400 transition-colors"
//           >
//             <BookOpen size={18} />
//             Quiz
//           </button>
//           <Button onClick={logout} variant="secondary">
//             <LogOut size={18} />
//             Logout
//           </Button>
//         </div>
//       </nav>
//       <main className="h-[calc(100vh-68px)] overflow-y-auto">
//         {renderPage()}
//       </main>
//     </div>
//   );
// };

// // --- TEMPORARY PLACEHOLDER COMPONENTS ---
// // We will replace these with the real files in the next steps.
// // This allows our AppContent component to work without errors for now.
// const Placeholder = ({ name, children }) => (
//   <div className="p-8">
//     <h1 className="text-2xl font-bold">{name}</h1>
//     {children}
//   </div>
// );
// // const DashboardPage = () => <Placeholder name="Dashboard Page" />;
// // const QuizSetupPage = ({ setQuizConfig }) => <Placeholder name="Quiz Setup Page"><button onClick={() => setQuizConfig({topic: 'Test'})}>Start Test Quiz</button></Placeholder>;
// // const QuizPage = ({ quiz, onFinish }) => <Placeholder name="Quiz Page"><p>Topic: {quiz.topic}</p><button onClick={() => onFinish(85)}>Finish Quiz</button></Placeholder>;
// // const QuizResultPage = ({ score, onRestart }) => <Placeholder name="Quiz Result Page"><p>Score: {score}%</p><button onClick={onRestart}>Restart</button></Placeholder>;

// export default AppContent;



import React, { useState, useContext } from "react";
import {
  BookOpen,
  BarChart2,
  BrainCircuit,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import LoginPage from "../auth/LoginPage";
import Spinner from "./Spinner";
import Button from "../ui/Button";
import DashboardPage from "../dashboard/DashboardPage";
import QuizSetupPage from "../quiz/QuizSetupPage";
import QuizPage from "../quiz/QuizPage";
import QuizResultPage from "../quiz/QuizResultPage";

const AppContent = () => {
  const { isAuthenticated, loading, logout } = useContext(AuthContext);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [quizConfig, setQuizConfig] = useState(null);
  const [quizResult, setQuizResult] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = (page) => {
    setQuizConfig(null);
    setQuizResult(null);
    setCurrentPage(page);
    setIsMenuOpen(false); // Close mobile menu on navigation
  };

  const handleFinishQuiz = (score) => {
    setQuizResult({ quiz: quizConfig, score });
    setQuizConfig(null);
  };

  if (loading)
    return (
      <div className="bg-black min-h-screen">
        <Spinner />
      </div>
    );
  if (!isAuthenticated) return <LoginPage />;

  const renderPage = () => {
    if (quizConfig)
      return <QuizPage quiz={quizConfig} onFinish={handleFinishQuiz} />;
    if (quizResult)
      return (
        <QuizResultPage
          quiz={quizResult.quiz}
          score={quizResult.score}
          onRestart={() => navigate("quiz")}
        />
      );
    switch (currentPage) {
      case "dashboard":
        return <DashboardPage />;
      case "quiz":
        return <QuizSetupPage setQuizConfig={setQuizConfig} />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <nav className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800 p-4 flex justify-between items-center sticky top-0 z-40">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("dashboard")}
        >
          <BrainCircuit className="text-blue-500" />
          <h1 className="font-bold text-xl">Skill Logger</h1>
        </div>
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={() => navigate("dashboard")}
            className="flex items-center gap-2 hover:text-blue-400 transition-colors"
          >
            <BarChart2 size={18} />
            Dashboard
          </button>
          <button
            onClick={() => navigate("quiz")}
            className="flex items-center gap-2 hover:text-blue-400 transition-colors"
          >
            <BookOpen size={18} />
            Quiz
          </button>
          <Button onClick={logout} variant="secondary">
            <LogOut size={18} />
            Logout
          </Button>
        </div>
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-900 border-b border-gray-800 p-4 flex flex-col gap-4">
          <button
            onClick={() => navigate("dashboard")}
            className="flex items-center gap-2 hover:text-blue-400 transition-colors w-full text-left p-2 rounded-md"
          >
            <BarChart2 size={18} />
            Dashboard
          </button>
          <button
            onClick={() => navigate("quiz")}
            className="flex items-center gap-2 hover:text-blue-400 transition-colors w-full text-left p-2 rounded-md"
          >
            <BookOpen size={18} />
            Quiz
          </button>
          <Button onClick={logout} variant="secondary" className="w-full">
            <LogOut size={18} />
            Logout
          </Button>
        </div>
      )}

      <main className="h-[calc(100vh-68px)] overflow-y-auto">
        {renderPage()}
      </main>
    </div>
  );
};

export default AppContent;