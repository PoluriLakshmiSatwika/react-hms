import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import RoleSelectionPage from "./pages/RoleSelectionPage";

import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import PatientDashboard from './pages/Dashboard/PatientDashboard';
import NurseDashboard from './pages/Dashboard/NurseDashboard';
import DoctorDashboard from './pages/Dashboard/DoctorDashboard';
import AdminRegister from "./pages/Register/AdminRegister";
import DoctorRegister from "./pages/Register/DoctorRegister";
import NurseRegister from "./pages/Register/NurseRegister";
import PatientRegister from "./pages/Register/PatientRegister";

import DoctorLogin from "./pages/Login/DoctorLogin";
import NurseLogin from "./pages/Login/NurseLogin";
import PatientLogin from "./pages/Login/PatientLogin";
import RoleLoginSelection from "./pages/Login/RoleLoginSelection";
import AdminLogin from './pages/Login/AdminLogin';
import ForgotPasswordPage from './pages/Login/ForgotPasswordPage';
function App() {
  return (
    <Router>
      
      <Routes>

        {/* Public Pages */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/patient-register" element={<PatientRegister />} />

        {/* ✅ NEW: Login Role Selection Page */}
        <Route path="/login" element={<RoleLoginSelection />} />

        {/* 4 Different Login Pages */}
        <Route path="/login/admin" element={<AdminLogin />} />
        <Route path="/login/doctor" element={<DoctorLogin />} />
        <Route path="/login/nurse" element={<NurseLogin />} />
        <Route path="/login/patient" element={<PatientLogin />} />

        {/* Registration Routes */}
        <Route path="/register" element={<RoleSelectionPage />} />
        <Route path="/register/admin" element={<AdminRegister />} />
        <Route path="/register/doctor" element={<DoctorRegister />} />
        <Route path="/register/nurse" element={<NurseRegister />} />
        <Route path="/register/patient" element={<PatientRegister />} />

        {/* Protected Dashboards */}
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/dashboard/doctor"
          element={
            <ProtectedRoute role="doctor">
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/nurse"
          element={
            <ProtectedRoute role="nurse">
              <NurseDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/patient"
          element={
            <ProtectedRoute role="patient">
              <PatientDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />  {/* Add this */}
        {/* Add other routes below */}

      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
