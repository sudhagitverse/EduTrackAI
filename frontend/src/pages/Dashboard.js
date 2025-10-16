import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";

export default function Dashboard() {
  const [available, setAvailable] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [enrolled, setEnrolled] = useState([]);
  const nav = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      fetchEnrolled().then(() => fetchCourses());
    } else {
      fetchCourses();
    }
  }, [token]);

  async function fetchCourses() {
    try {
      const res = await API.get("/courses");
      const today = new Date();
      const started = res.data.filter((c) => new Date(c.start_date) <= today);
      const upcomingCourses = res.data.filter(
        (c) => new Date(c.start_date) > today
      );
      const filteredStarted = started.filter(
        (course) => !enrolled.some((e) => e.id === course.id)
      );
      setAvailable(filteredStarted);
      setUpcoming(upcomingCourses);
    } catch (e) {
      console.error(e);
    }
  }

  async function fetchEnrolled() {
    try {
      const res = await API.get("/enrollments");
      setEnrolled(res.data);
      return res.data;
    } catch (e) {
      console.error(e);
    }
  }

  async function enroll(courseId) {
    if (!token) {
      alert("Please login to enroll in a course.");
      nav("/login");
      return;
    }
    try {
      await API.post("/enrollments", { course_id: courseId });
      alert("✅ Enrolled successfully!");
      await fetchEnrolled();
      fetchCourses();
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.message || "Error");
    }
  }

  async function handleUnenroll(courseId) {
    if (!window.confirm("Are you sure you want to unenroll from this course?"))
      return;
    try {
      await API.delete(`/enrollments/${courseId}`);
      alert("❌ Unenrolled successfully!");
      await fetchEnrolled();
      fetchCourses();
    } catch (e) {
      console.error(e);
      alert("Error while unenrolling");
    }
  }

  return (
    <div
      style={{
        padding: 20,
        fontFamily: "Inter, system-ui, -apple-system, sans-serif",
        background: "linear-gradient(135deg, #f0f9ff 0%, #fffaf0 100%)",
        minHeight: "100vh",
      }}
    >
      {/* 🌟 Premium Header */}
      <h1
        style={{
          color: "#1e40af", // Elegant deep blue instead of black
          fontSize: "2.6rem",
          fontWeight: "800",
          marginBottom: 40,
          textAlign: "center",
          letterSpacing: "0.5px",
          textShadow: "0 1px 6px rgba(30,64,175,0.1)",
        }}
      >
        EduTrack 📚
      </h1>

      {token && (
        <Section title="Your Enrolled Courses">
          {enrolled.length === 0 ? (
            <EmptyState text="You haven't enrolled in any course yet." />
          ) : (
            <CourseGrid>
              {enrolled.map((c) => (
                <CourseCard
                  key={c.id}
                  title={c.title}
                  instructor={c.instructor}
                  description={c.description}
                  primaryAction={
                    <Link to={`/course/${c.id}`} style={styles.greenButton}>
                      Go to Course
                    </Link>
                  }
                  secondaryAction={
                    <button
                      onClick={() => handleUnenroll(c.id)}
                      style={styles.redButton}
                    >
                      Unenroll
                    </button>
                  }
                />
              ))}
            </CourseGrid>
          )}
        </Section>
      )}

      <Section title="Available Courses">
        {available.length === 0 ? (
          <EmptyState text="No courses have started yet." />
        ) : (
          <CourseGrid>
            {available.map((c) => (
              <CourseCard
                key={c.id}
                title={c.title}
                instructor={c.instructor}
                description={c.description}
                primaryAction={
                  <button onClick={() => enroll(c.id)} style={styles.orangeButton}>
                    Enroll
                  </button>
                }
              />
            ))}
          </CourseGrid>
        )}
      </Section>

      <Section title="Upcoming Courses">
        {upcoming.length === 0 ? (
          <EmptyState text="No upcoming courses." />
        ) : (
          <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 12 }}>
            {upcoming.map((u) => (
              <li
                key={u.id}
                style={{
                  padding: 14,
                  borderRadius: 14,
                  background: "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  border: "1px solid rgba(255,255,255,0.5)",
                }}
              >
                <span style={{ fontSize: 15, color: "#1e3a8a", fontWeight: 600 }}>
                  <strong>{u.title}</strong> (starts{" "}
                  {new Date(u.start_date).toLocaleDateString()})
                </span>
                <button
                  disabled
                  style={{
                    backgroundColor: "#94a3b8",
                    color: "#fff",
                    padding: "6px 12px",
                    borderRadius: 8,
                    border: "none",
                    opacity: 0.7,
                    cursor: "not-allowed",
                  }}
                >
                  Locked
                </button>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}

/* ✅ Section Headings */
function Section({ title, children }) {
  return (
    <section style={{ marginBottom: 50 }}>
      <h2
        style={{
          fontSize: "1.8rem",
          marginBottom: 20,
          color: "#1e40af",
          fontWeight: "700",
          textShadow: "0 1px 3px rgba(30,64,175,0.1)",
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

/* ✅ Grid */
function CourseGrid({ children }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))",
        gap: 20,
      }}
    >
      {children}
    </div>
  );
}

/* 🪄 Course Cards */
function CourseCard({ title, instructor, description, primaryAction, secondaryAction }) {
  return (
    <div
      style={{
        padding: 20,
        borderRadius: 16,
        background: "linear-gradient(145deg, #ffffff 0%, #f1f5f9 100%)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
        border: "1px solid rgba(255, 255, 255, 0.4)",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-8px) scale(1.02)";
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(30,64,175,0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0) scale(1)";
        e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.08)";
      }}
    >
      <h3
        style={{
          fontSize: "1.35rem",
          fontWeight: "700",
          color: "#1e3a8a", // Rich blue for course titles
          marginBottom: 8,
        }}
      >
        {title}
      </h3>
      <p style={{ fontSize: 13, fontWeight: 500, color: "#475569" }}>
        {instructor}
      </p>
      <p
        style={{
          marginTop: 8,
          fontSize: 14,
          color: "#334155",
          lineHeight: 1.5,
        }}
      >
        {description?.slice(0, 120)}...
      </p>
      <div
        style={{
          marginTop: 14,
          display: "flex",
          gap: 10,
          justifyContent: secondaryAction ? "space-between" : "flex-start",
        }}
      >
        {primaryAction}
        {secondaryAction}
      </div>
    </div>
  );
}

/* 🌿 Empty State */
function EmptyState({ text }) {
  return (
    <p
      style={{
        color: "#64748b",
        fontStyle: "italic",
        fontSize: 15,
        textAlign: "center",
      }}
    >
      {text}
    </p>
  );
}

/* ✨ Buttons */
const styles = {
  orangeButton: {
    background: "linear-gradient(90deg, #f97316, #ea580c)",
    color: "#fff",
    padding: "8px 14px",
    borderRadius: 8,
    border: "none",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 2px 6px rgba(234, 88, 12, 0.4)",
    transition: "all 0.2s",
  },
  greenButton: {
    background: "linear-gradient(90deg, #10b981, #059669)",
    color: "#fff",
    padding: "8px 14px",
    borderRadius: 8,
    border: "none",
    fontWeight: "600",
    textDecoration: "none",
    textAlign: "center",
    display: "inline-block",
    boxShadow: "0 2px 6px rgba(5, 150, 105, 0.4)",
    transition: "all 0.2s",
  },
  redButton: {
    background: "linear-gradient(90deg, #dc2626, #991b1b)",
    color: "#fff",
    padding: "8px 14px",
    borderRadius: 8,
    border: "none",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 2px 6px rgba(185, 28, 28, 0.4)",
    transition: "all 0.2s",
  },
};
