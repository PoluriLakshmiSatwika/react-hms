import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // 👉 Later this will call backend API
    const dummyUser = { email, role: 'patient', token: 'abc123' };

    login(dummyUser);               // store in context
    navigate('/dashboard/patient'); // redirect
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '60px' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: '10px', margin: '10px' }}
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: '10px', margin: '10px' }}
        />
        <br />
        <button type="submit" className="btn">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
