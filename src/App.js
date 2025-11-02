import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import NurseLoginPage from './components/Login/NurseLoginPage';
import PatientLoginPage from './components/Login/PatientLoginPage';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1>Welcome to the Hospital Management System</h1>
      <p>Please select a login type:</p>
      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={() => navigate('/login/nurse')}>
          👩‍⚕️ Nurse Login
        </button>
        <button style={styles.button} onClick={() => navigate('/login/patient')}>
          🧑‍⚕️ Patient Login
        </button>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home page with navigation buttons */}
        <Route path="/" element={<HomePage />} />

        {/* Login pages */}
        <Route path="/login/nurse" element={<NurseLoginPage />} />
        <Route path="/login/patient" element={<PatientLoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

const styles = {
  container: {
    textAlign: 'center',
    padding: '50px',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginTop: '30px',
  },
  button: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
  },
};

export default App;
