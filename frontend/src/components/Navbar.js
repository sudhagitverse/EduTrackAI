import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const isAuth = localStorage.getItem("token");

    // Check if we're on dashboard
    const isDashboard = location.pathname === "/dashboard";

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const navStyle = {
        height: "70px",
        padding: "14px 30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 1000,
        background: isDashboard
            ? "rgba(255, 255, 255, 0.85)"               // ✨ Dashboard glass look
            : "linear-gradient(90deg, #f97316, #3b82f6)", // 🟠 Home gradient
        backdropFilter: isDashboard ? "blur(16px)" : "none",
        WebkitBackdropFilter: isDashboard ? "blur(16px)" : "none",
        color: isDashboard ? "#1e293b" : "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",        // 👌 makes navbar visible
        borderBottom: isDashboard ? "1px solid rgba(0,0,0,0.08)" : "none",
        transition: "all 0.3s ease",
    };

    const linkStyle = {
        marginRight: 20,
        textDecoration: "none",
        fontWeight: "600",
        color: isDashboard ? "#1e293b" : "#fff",
        fontSize: "16px",
    };

    const buttonStyle = {
        background: isDashboard ? "#1e293b" : "#fff",
        color: isDashboard ? "#fff" : "#f97316",
        padding: "6px 14px",
        borderRadius: "6px",
        fontWeight: "600",
        border: "none",
        cursor: "pointer",
        fontSize: "15px",
    };

    return (
        <>
            <nav style={navStyle}>
                <Link
                    to="/"
                    style={{
                        ...linkStyle,
                        fontSize: "22px",
                        fontWeight: "800",
                        marginRight: 0,
                        letterSpacing: "0.5px",
                    }}
                >
                    EduTrack
                </Link>

                <div>
                    <Link to="/" style={linkStyle}>
                        Home
                    </Link>
                    <Link to="/dashboard" style={linkStyle}>
                        Dashboard
                    </Link>

                    {isAuth ? (
                        <button onClick={handleLogout} style={buttonStyle}>
                            Logout
                        </button>
                    ) : (
                        <>
                            <Link to="/login" style={linkStyle}>
                                Login
                            </Link>
                            <Link to="/register" style={linkStyle}>
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </nav>

            {/* ✅ Subtle divider for better contrast */}
            <div
                style={{
                    height: "2px",
                    background: isDashboard
                        ? "linear-gradient(90deg, #93c5fd, #a5f3fc)"
                        : "linear-gradient(90deg, #f59e0b, #3b82f6)",
                    opacity: 0.6,
                    position: "fixed",
                    top: "70px",
                    left: 0,
                    width: "100%",
                    zIndex: 999,
                }}
            ></div>
        </>
    );
}
