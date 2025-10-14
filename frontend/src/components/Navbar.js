import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate();
    const isAuth = localStorage.getItem("token");

    function handleLogout() {
        localStorage.removeItem("token");
        navigate("/login");
    }

    return (
        <nav className="bg-orange-600 text-white p-4 flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold">EduTrack</Link>
            <div className="space-x-4">
                <Link to="/" className="hover:underline">Home</Link>
                {isAuth ? (
                    <>
                        <Link to="/dashboard" className="hover:underline">Dashboard</Link>
                        <button onClick={handleLogout} className="bg-white text-orange-600 px-3 py-1 rounded">Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="hover:underline">Login</Link>
                        <Link to="/register" className="hover:underline">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
}
