import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CourseDetail from "./pages/CourseDetail";

function AppContent() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const nav = useNavigate();

  // 🧹 Clear token each time app loads
  useEffect(() => {
    localStorage.removeItem("token");
    setToken(null);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    alert("Logged out successfully!");
    nav("/login");
  };

  return (
    <div>
      <nav
        style={{
          padding: 12,
          backgroundColor: "#ff6f00",
          color: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <Link
            to="/"
            style={{
              marginRight: 15,
              color: "#fff",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Home
          </Link>
          <Link
            to="/dashboard"
            style={{
              marginRight: 15,
              color: "#fff",
              textDecoration: "none",
            }}
          >
            Dashboard
          </Link>
        </div>

        <div>
          {token ? (
            <button
              onClick={handleLogout}
              style={{
                background: "#fff",
                color: "#ff6f00",
                border: "none",
                borderRadius: 5,
                padding: "6px 12px",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                style={{
                  marginRight: 10,
                  color: "#fff",
                  textDecoration: "none",
                }}
              >
                Login
              </Link>
              <Link
                to="/register"
                style={{
                  color: "#fff",
                  textDecoration: "none",
                }}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/course/:id" element={<CourseDetail />} />
      </Routes>
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
