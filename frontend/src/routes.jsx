import React from "react";
import { Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login"; 

export default function AppRoutes() {
  return (
    <Routes>
      
      <Route path="/" element={<Landing />} />

     
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Login />} />

     
      <Route path="*" element={<h1>404 - Page Not Found</h1>} />
    </Routes>
  );
}