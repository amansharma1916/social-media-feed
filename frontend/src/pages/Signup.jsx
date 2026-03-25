
import { useState } from 'react';
import axios from 'axios';
import '../styles/Auth.css';

export default function Signup({ onSignup }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL}/api/auth/signup`, { username, email, password });
      onSignup();
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required disabled={loading} />
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required disabled={loading} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required disabled={loading} />
        <button type="submit" disabled={loading}>{loading ? 'Signing up...' : 'Sign Up'}</button>
        {loading && <div className="loading-spinner" style={{marginTop:8}}>Loading...</div>}
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
}
