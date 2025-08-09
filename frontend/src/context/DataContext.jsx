import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useMemo,
} from "react";
import api from "../api";
import { AuthContext } from "./AuthContext";

// --- 1. Create the Data Context "Backpack" ---
export const DataContext = createContext();

// --- 2. Create the Data Provider Component ---
export const DataProvider = ({ children }) => {
  // --- 3. Define the State for our application data ---
  const [skills, setSkills] = useState([]);
  const [stats, setStats] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- 4. Access another context ---
  const { isAuthenticated } = useContext(AuthContext);

  // --- 5. The data fetching function ---
  const fetchData = async () => {
    if (isAuthenticated) {
      setLoading(true);
      try {
        // Fetch all data in parallel for efficiency
        const [skillsRes, statsRes, quizzesRes] = await Promise.all([
          api.get("/skills"),
          api.get("/skills/stats"),
          api.get("/quiz/all"),
        ]);
        setSkills(skillsRes.data);
        setStats(statsRes.data);
        setQuizzes(quizzesRes.data.quizzes);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    }
  };

  // --- 6. Trigger the fetch when the user logs in ---
  useEffect(() => {
    fetchData();
  }, [isAuthenticated]);

  // --- 7. Memoize the value and provide it ---
  const dataContextValue = useMemo(
    () => ({
      skills,
      stats,
      quizzes,
      loading,
      fetchData, // We also provide the function itself!
    }),
    [skills, stats, quizzes, loading]
  );

  return (
    <DataContext.Provider value={dataContextValue}>
      {children}
    </DataContext.Provider>
  );
};
