// import React, { useState } from "react";
// import { ChevronsRight } from "lucide-react";
// import api from "../../api";
// import Button from "../ui/Button";
// import Input from "../ui/Input";
// import Card from "../ui/Card";

// // --- 1. Define the component, receiving a function as a prop ---
// const QuizSetupPage = ({ setQuizConfig }) => {
//   // --- 2. State for the form inputs ---
//   const [config, setConfig] = useState({
//     topic: "",
//     difficulty: "medium",
//     questionCount: null,
//     timeLimit: null,
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   // --- 3. Standard input handler ---
//   const handleChange = (e) => {
//     setConfig({ ...config, [e.target.name]: e.target.value });
//   };

//   // --- 4. Function to start the quiz ---
//   const startQuiz = async (isRandom = false) => {
//     setLoading(true);
//     setError("");
//     try {
//       // If random, send an empty object; otherwise, send the config state
//       const payload = isRandom ? {} : config;
//       const res = await api.post("/quiz/start", payload);
//       // --- 5. Lift the state up ---
//       setQuizConfig(res.data.quiz);
//     } catch (err) {
//       setError(err.response?.data?.error || "Failed to start quiz.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- 6. Render the setup form UI ---
//   return (
//     <div className="p-4 md:p-8 flex items-center justify-center min-h-full">
//       <Card className="w-full max-w-lg">
//         <h1 className="text-3xl font-bold text-center mb-2">
//           Test Your Knowledge
//         </h1>
//         <p className="text-gray-400 text-center mb-6">
//           Configure your quiz or start a random one based on your logs.
//         </p>
//         {error && (
//           <p className="bg-red-500/20 text-red-400 border border-red-500/30 p-3 rounded-lg mb-4 text-center">
//             {error}
//           </p>
//         )}

//         <div className="space-y-4 mb-6">
//           <Input
//             name="topic"
//             placeholder="Enter a topic (e.g., React Hooks)"
//             value={config.topic}
//             onChange={handleChange}
//           />
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <label className="text-sm font-bold text-gray-400 block mb-2">
//                 Difficulty
//               </label>
//               <select
//                 name="difficulty"
//                 value={config.difficulty}
//                 onChange={handleChange}
//                 className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 <option value="easy">Easy</option>
//                 <option value="medium">Medium</option>
//                 <option value="hard">Hard</option>
//               </select>
//             </div>
//             <Input
//               name="questionCount"
//               type="number"
//               placeholder="Questions"
//               value={config.questionCount}
//               onChange={handleChange}
//             />
//             <Input
//               name="timeLimit"
//               type="number"
//               placeholder="Time (mins)"
//               value={config.timeLimit}
//               onChange={handleChange}
//             />
//           </div>
//         </div>

//         <div className="flex flex-col md:flex-row gap-4">
//           <Button
//             onClick={() => startQuiz(false)}
//             className="w-full"
//             disabled={loading}
//           >
//             {loading ? "Generating..." : "Start Custom Quiz"}{" "}
//             <ChevronsRight size={18} />
//           </Button>
//           <Button
//             onClick={() => startQuiz(true)}
//             variant="secondary"
//             className="w-full"
//             disabled={loading}
//           >
//             {loading ? "Generating..." : "Start Random Quiz"}{" "}
//             <ChevronsRight size={18} />
//           </Button>
//         </div>
//       </Card>
//     </div>
//   );
// };

// export default QuizSetupPage;



import React, { useState } from "react";
import { ChevronsRight } from "lucide-react";
import api from "../../api";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Card from "../ui/Card";

const QuizSetupPage = ({ setQuizConfig }) => {
  const [config, setConfig] = useState({
    topic: "",
    difficulty: "medium",
    questionCount: null,
    timeLimit: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setConfig({ ...config, [e.target.name]: e.target.value });

  const startQuiz = async (isRandom = false) => {
    setLoading(true);
    setError("");
    try {
      const payload = isRandom ? { timeLimit: config.timeLimit } : config;

      const res = await api.post("/quiz/start", payload);
      setQuizConfig(res.data.quiz);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to start quiz.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 flex items-center justify-center min-h-full">
      <Card className="w-full max-w-lg">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2">
          Test Your Knowledge
        </h1>
        <p className="text-gray-400 text-center mb-6">
          Configure your Quiz or Start a random one based upon Skills Logs with no time limit.
        </p>
        {error && (
          <p className="bg-red-500/20 text-red-400 border border-red-500/30 p-3 rounded-lg mb-4 text-center">
            {error}
          </p>
        )}

        <div className="space-y-4 mb-6">
          <Input
            name="topic"
            placeholder="Enter a topic (e.g., React Hooks)"
            value={config.topic}
            onChange={handleChange}
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-bold text-gray-400 block mb-2">
                Difficulty
              </label>
              <select
                name="difficulty"
                value={config.difficulty}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="easy">Easy</option>

                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-bold text-gray-400 block mb-2">
                Questions
              </label>
              <Input
                name="questionCount"
                type="number"
                value={config.questionCount}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-400 block mb-2">
                Time (mins)
              </label>
              <Input
                name="timeLimit"
                type="number"
                value={config.timeLimit}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={() => startQuiz(false)}
            className="w-full"
            disabled={loading}
          >
            {loading ? "Generating..." : "Start Custom Quiz"}{" "}
            <ChevronsRight size={18} />
          </Button>
          <Button
            onClick={() => startQuiz(true)}
            variant="secondary"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Generating..." : "Start Random Quiz"}{" "}
            <ChevronsRight size={18} />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default QuizSetupPage;