import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
    const sampleCourses = [
        { id: 1, title: 'React Basics', description: 'Learn the fundamentals of React.js', color: '#3b82f6' },
        { id: 2, title: 'Data Structures', description: 'Core algorithms & DS concepts', color: '#10b981' },
        { id: 3, title: 'Cloud Computing', description: 'AWS, Azure, and GCP intro', color: '#8b5cf6' },
    ];

    return (
        <div style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
            {/* Hero Section */}
            <div style={{
                background: 'linear-gradient(135deg, #f97316, #3b82f6)',
                color: '#fff',
                padding: '80px 20px',
                textAlign: 'center',
                borderRadius: '0 0 20px 20px',
            }}>
                <h1 style={{ fontSize: '3rem', marginBottom: 20 }}>Welcome to EduTrack </h1>
                <p style={{ fontSize: '1.2rem', maxWidth: 600, margin: '0 auto' }}>
                    Learn new skills, track your progress, and access courses online. Only registered users can access lessons and videos.
                </p>
                <div style={{ marginTop: 30 }}>
                    <Link to="/login" style={{
                        backgroundColor: '#fff',
                        color: '#3b82f6',
                        padding: '12px 25px',
                        borderRadius: 8,
                        fontWeight: 600,
                        marginRight: 10,
                        textDecoration: 'none',
                    }}>Login</Link>
                    <Link to="/register" style={{
                        backgroundColor: '#fff',
                        color: '#10b981',
                        padding: '12px 25px',
                        borderRadius: 8,
                        fontWeight: 600,
                        textDecoration: 'none',
                    }}>Register</Link>
                </div>
            </div>

            {/* Featured Courses */}
            <div style={{ padding: '40px 20px', maxWidth: 1000, margin: '0 auto' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: 20, color: '#111827' }}>Featured Courses</h2>
                <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
                    {sampleCourses.map(course => (
                        <div key={course.id} style={{
                            backgroundColor: course.color,
                            color: '#fff',
                            padding: 20,
                            borderRadius: 12,
                            width: 260,
                            minHeight: 140,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                        }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>{course.title}</h3>
                            <p style={{ fontSize: 14, margin: '10px 0' }}>{course.description}</p>
                            <Link to={`/course/${course.id}`} style={{
                                backgroundColor: '#fff',
                                color: course.color,
                                padding: '6px 12px',
                                borderRadius: 6,
                                fontWeight: 500,
                                textAlign: 'center',
                                textDecoration: 'none'
                            }}>View Course</Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
