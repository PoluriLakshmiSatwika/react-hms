import axios from "axios";

// Create an axios instance with a base URL
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // e.g., http://localhost:8000
});

// Optional: Automatically include token (if your app uses JWT login)
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
