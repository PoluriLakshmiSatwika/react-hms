// ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  // ✅ If no token, redirect to login page
  if (!token) {
    console.log("No token found. Redirecting to login.");
    return <Navigate to={`/login/${role || ""}`} replace />;
  }

  // ✅ If role mismatch, redirect to login page
  if (role && userRole !== role) {
    console.log(`Role mismatch. Required: ${role}, Actual: ${userRole}`);
    return <Navigate to={`/login/${role}`} replace />;
  }

  // ✅ Authorized, render children
  return children;
};

export default ProtectedRoute;
