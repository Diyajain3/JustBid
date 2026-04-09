import React from "react";
import { useLocation } from "react-router-dom";
import AppRoutes from "./routes";

import "./global.css";

export default function App() {
  const location = useLocation();

  return (
    <div className="bg-slate-950 min-h-screen text-slate-200 font-sans selection:bg-blue-500/30 selection:text-blue-200">
      <AppRoutes />
    </div>
  );
}
