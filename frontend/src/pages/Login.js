import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      const res = await API.post('/users/login', form);
      localStorage.setItem('token', res.data.token);
      alert('Logged in');
      nav('/dashboard');
    } catch (err) {
      alert(err?.response?.data?.message || 'Error');
    }
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f97316, #3b82f6)',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      padding: 20
    }}>
      <div style={{
        backgroundColor: '#fff',
        padding: 40,
        borderRadius: 12,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        width: 360
      }}>
        <h2 style={{ textAlign: 'center', fontSize: '2rem', color: '#111827', marginBottom: 25 }}>Login to EduTrack</h2>
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
          <input
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14 }}
            required
          />
          <input
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14 }}
            required
          />
          <button type="submit" style={{
            backgroundColor: '#3b82f6',
            color: '#fff',
            padding: '10px',
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 15,
            border: 'none',
            cursor: 'pointer',
            transition: '0.3s'
          }}
            onMouseOver={e => e.currentTarget.style.backgroundColor = '#2563eb'}
            onMouseOut={e => e.currentTarget.style.backgroundColor = '#3b82f6'}
          >
            Login
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 15, color: '#6b7280', fontSize: 13 }}>
          New user? <a href="/register" style={{ color: '#f97316', fontWeight: 500 }}>Register here</a>
        </p>
      </div>
    </div>
  );
}
