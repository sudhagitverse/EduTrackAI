import axios from 'axios';

// Automatically switch between local and production API
const API = axios.create({
  baseURL: process.env.REACT_APP_API || 'http://localhost:5001/api',
});

// Automatically attach JWT token if available
API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
