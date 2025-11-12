import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // e.g., http://localhost:8000
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // important if backend uses cookies / sessions
});

// Optional: Auto attach token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: Response interceptor (for 401 auto redirect)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized! Redirect to login.");
      // window.location.href = "/login";  // optional auto redirect
    }
    return Promise.reject(error);
  }
);

export default API;