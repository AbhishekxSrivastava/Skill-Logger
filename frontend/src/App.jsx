import React from "react";
import { AuthProvider } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";
import AppContent from "./components/common/AppContent";

// --- 1. Define the root App component ---
function App() {
  // --- 2. Wrap the application with the context providers ---
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
