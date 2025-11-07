import React from 'react';
// ...existing code...
import About from './pages/About';
import Contact from './pages/Contact';
import Appointment from './Appointment/Appointment Booking.jsx'
//import Appointment from './Appointment/Appointment Booking.css';

export default function App() {
  return (
    <div>
      <h1>Welcome to MyApp</h1>
      <About />
      <Contact />
      <Appointment />
    </div>
  );
}
// ...existing code...