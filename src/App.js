// App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import RoleSelectionPage from './components/login/RoleSelectionPage';
import AdminLoginPage from './components/login/AdminLoginPage';
import DoctorLoginPage from './components/login/DoctorLoginPage';
import ForgotPasswordPage from './components/login/ForgotPasswordPage';
import ResetPasswordPage from './components/login/ResetPasswordPage';
import NurseLoginPage from './components/login/NurseLoginPage';
import PatientLoginPage from './components/login/PatientLoginPage';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login Routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<RoleSelectionPage />} />
        <Route path="/login/select" element={<RoleSelectionPage />} />
        <Route path="/login/admin" element={<AdminLoginPage />} />
        <Route path="/login/doctor" element={<DoctorLoginPage />} />
          <Route path="/login/nurse" element={<NurseLoginPage />} />
        <Route path="/login/patient" element={<PatientLoginPage />} />

        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        {/* <Route path="/reset-password" element={<ResetPasswordPage />} /> */}
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
    

        {/* Other routes... */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;