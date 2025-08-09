import React, { useState, useEffect, createContext, useMemo } from "react";
import api from "../api";

// --- 1. Create the Context "Backpack" ---
export const AuthContext = createContext();

// --- 2. Create the Provider Component ---
export const AuthProvider = ({ children }) => {
  // --- 3. Define the State (what's inside the backpack) ---
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken")
  );
  const [loading, setLoading] = useState(true);

  // --- 4. Synchronize with localStorage on initial load ---
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && accessToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, [accessToken]);

  // --- 5. Define Actions to modify the state ---
  const login = (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("accessToken", token);
    setUser(userData);
    setAccessToken(token);
  };

  const logout = () => {
    api.post("/auth/logout"); // Tell backend to clear its cookie
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    setUser(null);
    setAccessToken(null);
  };

  // --- 6. Memoize the context value for performance ---
  const authContextValue = useMemo(
    () => ({
      user,
      accessToken,
      isAuthenticated: !!accessToken,
      loading,
      login,
      logout,
    }),
    [user, accessToken, loading]
  );

  // --- 7. Provide the value to child components ---
  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
