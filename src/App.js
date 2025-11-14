
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import RoleSelectionPage from "./pages/RoleSelectionPage";
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import PatientDashboard from './pages/Dashboard/PatientDashboard';
import NurseDashboard from './pages/Dashboard/NurseDashboard';
import DoctorDashboard from './pages/Dashboard/DoctorDashboard';
import AdminRegister from "./pages/Register/AdminRegister";
import DoctorRegister from "./pages/Register/DoctorRegister";
import NurseRegister from "./pages/Register/NurseRegister";
import PatientRegister from "./pages/Register/PatientRegister";
import ForgotPasswordPage from "./pages/Login/ForgotPasswordPage";
import ResetPasswordPage from "./pages/Login/ResetPasswordPage";
import DoctorLogin from "./pages/Login/DoctorLogin";
import NurseLogin from "./pages/Login/NurseLogin";
import PatientLogin from "./pages/Login/PatientLogin";
import RoleLoginSelection from "./pages/Login/RoleLoginSelection";
import AdminLogin from './pages/Login/AdminLogin';
import AppointmentBooking from './pages/Dashboard/AppointmentBooking';
import PatientAppointments from './pages/Dashboard/PatientAppointments';


function App() {
  return (
    <>
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<HomePage />} />

        {/* Login Role Selection Page */}
        <Route path="/login" element={<RoleLoginSelection />} />

        {/* Login Pages */}
        <Route path="/login/admin" element={<AdminLogin />} />
        <Route path="/login/doctor" element={<DoctorLogin />} />
        <Route path="/login/nurse" element={<NurseLogin />} />
        <Route path="/login/patient" element={<PatientLogin />} />

        {/* Registration Pages */}
        <Route path="/register" element={<RoleSelectionPage />} />
        <Route path="/register/admin" element={<AdminRegister />} />
        <Route path="/register/doctor" element={<DoctorRegister />} />
        <Route path="/register/nurse" element={<NurseRegister />} />
        <Route path="/register/patient" element={<PatientRegister />} />

        {/* Dashboards */}
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
        <Route path="/dashboard/doctor" element={<DoctorDashboard />} />
        <Route path="/dashboard/nurse" element={<NurseDashboard />} />
        <Route path="/dashboard/patient" element={<PatientDashboard />} />
        <Route path="/dashboard/appointment" element={<AppointmentBooking />} />
        <Route path="/patient/Appointment" element={<PatientAppointments />} />
       


        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        
      </Routes>

      <Footer />
    </>

  );
}

export default App;
