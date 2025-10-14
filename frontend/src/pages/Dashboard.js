import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";

export default function Dashboard() {
  const [available, setAvailable] = useState([]); // started courses
  const [upcoming, setUpcoming] = useState([]); // future courses
  const [enrolled, setEnrolled] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    fetchCourses();
    if (localStorage.getItem("token")) fetchEnrolled();
  }, []);

  async function fetchCourses() {
    try {
      const res = await API.get("/courses");
      const today = new Date();
      const started = res.data.filter((c) => new Date(c.start_date) <= today);
      const upcomingCourses = res.data.filter(
        (c) => new Date(c.start_date) > today
      );

      setAvailable(started);
      setUpcoming(upcomingCourses);
    } catch (e) {
      console.error(e);
    }
  }

  async function fetchEnrolled() {
    try {
      const res = await API.get("/enrollments");
      setEnrolled(res.data);
    } catch (e) {
      console.error(e);
    }
  }

  // 🟢 Enroll only if logged in
  async function enroll(courseId) {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to enroll in a course.");
      nav("/login");
      return;
    }

    try {
      await API.post("/enrollments", { course_id: courseId });
      alert("✅ Enrolled successfully!");
      fetchEnrolled();
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.message || "Error");
    }
  }

  // 🔴 New: Unenroll function
  async function handleUnenroll(courseId) {
    if (!window.confirm("Are you sure you want to unenroll from this course?")) return;
    try {
      await API.delete(`/enrollments/${courseId}`);
      alert("❌ Unenrolled successfully!");
      fetchEnrolled();
    } catch (e) {
      console.error(e);
      alert("Error while unenrolling");
    }
  }

  function isEnrolled(courseId) {
    return enrolled.some((c) => c.id === courseId);
  }

  const token = localStorage.getItem("token");

  return (
    <div
      style={{
        padding: 20,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: "#f9fafb",
        minHeight: "100vh",
      }}
    >
      <h1
        style={{
          color: "#ff6f00",
          fontSize: "2.5rem",
          fontWeight: "bold",
          marginBottom: 30,
          textAlign: "center",
        }}
      >
        EduTrack
      </h1>

      {/* 🟢 Enrolled Courses */}
      {token && (
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: "1.8rem", marginBottom: 15 }}>
            Your Enrolled Courses
          </h2>
          {enrolled.length === 0 ? (
            <p style={{ color: "#6b7280" }}>
              You haven't enrolled in any course yet.
            </p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))",
                gap: 20,
              }}
            >
              {enrolled.map((c) => (
                <div
                  key={c.id}
                  style={{
                    padding: 16,
                    borderRadius: 10,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    backgroundColor: "#fff",
                  }}
                >
                  <h3 style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                    <Link
                      to={`/course/${c.id}`}
                      style={{ textDecoration: "none", color: "#111827" }}
                    >
                      {c.title}
                    </Link>
                  </h3>
                  <p
                    style={{ fontSize: 13, fontWeight: 500, color: "#374151" }}
                  >
                    {c.instructor}
                  </p>
                  <p
                    style={{ marginTop: 5, fontSize: 13, color: "#4b5563" }}
                  >
                    {c.description?.slice(0, 120)}...
                  </p>

                  {/* ✅ Go to Course & Unenroll Buttons */}
                  <div
                    style={{
                      marginTop: 10,
                      display: "flex",
                      gap: 10,
                      justifyContent: "space-between",
                    }}
                  >
                    <Link
                      to={`/course/${c.id}`}
                      style={{
                        flex: 1,
                        textAlign: "center",
                        backgroundColor: "#10b981",
                        color: "#fff",
                        padding: "6px 12px",
                        borderRadius: 6,
                        textDecoration: "none",
                      }}
                    >
                      Go to Course
                    </Link>
                    <button
                      onClick={() => handleUnenroll(c.id)}
                      style={{
                        flex: 1,
                        backgroundColor: "#ef4444",
                        color: "#fff",
                        padding: "6px 12px",
                        borderRadius: 6,
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      Unenroll
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* 🟢 All Available Courses */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: "1.8rem", marginBottom: 15 }}>
          Available Courses
        </h2>
        {available.length === 0 ? (
          <p style={{ color: "#6b7280" }}>No courses have started yet.</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))",
              gap: 20,
            }}
          >
            {available.map((c) => (
              <div
                key={c.id}
                style={{
                  padding: 16,
                  borderRadius: 10,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  backgroundColor: "#fff",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                    color: "#111827",
                  }}
                >
                  {c.title}
                </h3>
                <p
                  style={{ fontSize: 13, fontWeight: 500, color: "#374151" }}
                >
                  {c.instructor}
                </p>
                <p
                  style={{ marginTop: 5, fontSize: 13, color: "#4b5563" }}
                >
                  {c.description?.slice(0, 120)}...
                </p>
                <div style={{ marginTop: 10 }}>
                  {isEnrolled(c.id) ? (
                    <Link
                      to={`/course/${c.id}`}
                      style={{
                        backgroundColor: "#10b981",
                        color: "#fff",
                        padding: "6px 12px",
                        borderRadius: 6,
                        textDecoration: "none",
                      }}
                    >
                      Go to Course
                    </Link>
                  ) : token ? (
                    <button
                      onClick={() => enroll(c.id)}
                      style={{
                        backgroundColor: "#f97316",
                        color: "#fff",
                        padding: "6px 12px",
                        borderRadius: 6,
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      Enroll
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        alert("Please login to view or enroll in courses.");
                        nav("/login");
                      }}
                      style={{
                        backgroundColor: "#9ca3af",
                        color: "#fff",
                        padding: "6px 12px",
                        borderRadius: 6,
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      Login to Enroll
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 🟢 Upcoming */}
      <section>
        <h2 style={{ fontSize: "1.8rem", marginBottom: 15 }}>
          Upcoming Courses
        </h2>
        {upcoming.length === 0 ? (
          <p style={{ color: "#6b7280" }}>No upcoming courses.</p>
        ) : (
          <ul
            style={{ listStyle: "none", padding: 0, display: "grid", gap: 12 }}
          >
            {upcoming.map((u) => (
              <li
                key={u.id}
                style={{
                  padding: 12,
                  borderRadius: 8,
                  backgroundColor: "#fff",
                  boxShadow: "0 1px 6px rgba(0,0,0,0.1)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>
                  {u.title} (starts{" "}
                  {new Date(u.start_date).toLocaleDateString()})
                </span>
                <button
                  disabled
                  style={{
                    backgroundColor: "#9ca3af",
                    color: "#fff",
                    padding: "6px 12px",
                    borderRadius: 6,
                    border: "none",
                    opacity: 0.6,
                    cursor: "not-allowed",
                  }}
                >
                  Locked
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
