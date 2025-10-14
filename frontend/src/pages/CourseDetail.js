import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';

export default function CourseDetail() {
  const { id } = useParams();
  const nav = useNavigate();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [selected, setSelected] = useState(null);
  const [progress, setProgress] = useState([]);
  const [enrolled, setEnrolled] = useState(false);
  const [isUpcoming, setIsUpcoming] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to access courses');
      nav('/login');
      return;
    }
    loadCourse();
  }, [id]);

  async function loadCourse() {
    try {
      const resCourse = await API.get(`/courses/${id}`);
      const courseData = resCourse.data;
      setCourse(courseData);

      // ✅ Force proper date comparison even if start_date is string
      const start = new Date(courseData.start_date);
      const now = new Date();
      setIsUpcoming(start.getTime() > now.getTime());

      // Lessons
      const resLessons = await API.get(`/lessons/${id}`);
      setLessons(resLessons.data);
      if (resLessons.data.length > 0) setSelected(resLessons.data[0]);

      // Enrollments
      const resEnroll = await API.get('/enrollments');
      const enrolledIds = resEnroll.data.map(c => c.id);
      setEnrolled(enrolledIds.includes(Number(id)));

      // Progress
      const resProgress = await API.get(`/progress/course/${id}`);
      setProgress(resProgress.data);
    } catch (e) {
      console.error('Error loading course:', e);
    }
  }

  async function enroll() {
    try {
      await API.post('/enrollments', { course_id: id });
      alert('✅ Enrolled successfully!');
      setEnrolled(true);
    } catch (e) {
      alert('Error enrolling in course');
    }
  }

  async function markDone(lessonId) {
    try {
      await API.post(`/progress/lesson/${lessonId}/complete`);
      const res = await API.get(`/progress/course/${id}`);
      setProgress(res.data);
    } catch (e) {
      console.error(e);
    }
  }

  function isUnlocked(lesson) {
    if (!lesson.release_date) return true;
    return new Date(lesson.release_date) <= new Date();
  }

  if (!course) return <p style={{ padding: 20 }}>Loading...</p>;

  return (
    <div style={{ display: 'flex', gap: 20, padding: 20 }}>
      {/* Sidebar */}
      <div style={{ width: 320 }}>
        <h2>{course.title}</h2>
        <p>{course.description}</p>

        {isUpcoming && (
          <div
            style={{
              backgroundColor: '#fff3cd',
              color: '#856404',
              padding: 10,
              borderRadius: 6,
              marginBottom: 15,
              border: '1px solid #ffeeba',
            }}
          >
            ⚠ This course starts on{' '}
            <b>{new Date(course.start_date).toLocaleDateString()}</b>. You can
            preview lessons now, but videos and PDFs are locked.
          </div>
        )}

        {!isUpcoming && !enrolled && (
          <div style={{ marginTop: 20 }}>
            <p style={{ color: 'red' }}>⚠ You must enroll to access full course materials.</p>
            <button onClick={enroll}>Enroll Now</button>
          </div>
        )}

        <h3>Lessons</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {lessons.map((l) => (
            <li
              key={l.id}
              style={{
                padding: 8,
                cursor: 'pointer',
                background: selected?.id === l.id ? '#eee' : 'transparent',
                marginBottom: 6,
              }}
              onClick={() => setSelected(l)}
            >
              {l.position}. {l.title}
              {isUpcoming && <span style={{ color: '#999' }}> 🔒 Locked</span>}
              {!isUpcoming && !isUnlocked(l) && (
                <span style={{ color: '#999' }}>
                  {' '}
                  (Locked until {new Date(l.release_date).toLocaleString()})
                </span>
              )}
              {progress.includes(l.id) && (
                <span style={{ color: 'green', marginLeft: 8 }}>✓</span>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Main content */}
      <div style={{ flex: 1 }}>
        {selected ? (
          <>
            <h3>{selected.title}</h3>

            {/* 🔒 If upcoming — show preview text only */}
            {isUpcoming ? (
              selected.content_type === 'text' ? (
                <div
                  style={{
                    background: '#fff',
                    borderRadius: 8,
                    padding: 20,
                    boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                  }}
                  dangerouslySetInnerHTML={{ __html: selected.content_url }}
                />
              ) : (
                <div
                  style={{
                    textAlign: 'center',
                    padding: 40,
                    color: '#666',
                    background: '#f9f9f9',
                    border: '1px solid #ddd',
                    borderRadius: 8,
                  }}
                >
                  <p>
                    🔒 {selected.content_type.toUpperCase()} content is locked until{' '}
                    <b>{new Date(course.start_date).toLocaleDateString()}</b>
                  </p>
                </div>
              )
            ) : (
              <>
                {selected.content_type === 'video' && (
                  <video width="100%" height="480" controls>
                    <source
                      src={
                        selected.content_url.startsWith('http')
                          ? selected.content_url
                          : `http://localhost:5001${selected.content_url}`
                      }
                      type="video/mp4"
                    />
                  </video>
                )}
                {selected.content_type === 'pdf' && (
                  <iframe
                    src={
                      selected.content_url.startsWith('http')
                        ? selected.content_url
                        : `http://localhost:5001${selected.content_url}`
                    }
                    width="100%"
                    height="600"
                    title={selected.title}
                  />
                )}
                {selected.content_type === 'text' && (
                  <div
                    style={{
                      background: '#fff',
                      borderRadius: 8,
                      padding: 20,
                      boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                    }}
                    dangerouslySetInnerHTML={{ __html: selected.content_url }}
                  />
                )}
                <div style={{ marginTop: 12 }}>
                  <button onClick={() => markDone(selected.id)}>Mark Completed</button>
                </div>
              </>
            )}
          </>
        ) : (
          <p>Select a lesson</p>
        )}
      </div>
    </div>
  );
}
