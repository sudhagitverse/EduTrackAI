import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CourseDetail from "./pages/CourseDetail";
import Navbar from "./components/Navbar";

function AppContent() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const nav = useNavigate();

  useEffect(() => {
    localStorage.removeItem("token");
    setToken(null);
  }, []);

  return (
    <div>
      <Navbar />
      {/* 👇 This ensures your page content is pushed below navbar */}
      <div style={{ paddingTop: "90px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/course/:id" element={<CourseDetail />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
