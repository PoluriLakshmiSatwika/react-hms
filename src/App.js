import React from 'react';
// ...existing code...
import About from './pages/About';
import Contact from './pages/Contact';

export default function App() {
  return (
    <div>
      <h1>Welcome to MyApp</h1>
      <About />
      <Contact />
    </div>
  );
}