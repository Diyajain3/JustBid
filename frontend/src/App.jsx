import React from "react";
import { useLocation } from "react-router-dom";
import AppRoutes from "./routes";
import { ThemeProvider } from "./context/ThemeContext";
import ThemeToggle from "./components/ThemeToggle";

import "./global.css";

export default function App() {
  const location = useLocation();

  return (
    <ThemeProvider>
      <div className="bg-white dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-200 font-sans selection:bg-purple-500/30 selection:text-purple-600 dark:selection:text-purple-200 transition-colors duration-500 ease-in-out">
        <ThemeToggle />
        <AppRoutes />
      </div>
    </ThemeProvider>
  );
}
