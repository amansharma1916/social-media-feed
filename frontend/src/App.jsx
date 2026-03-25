import { useState } from 'react';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Feed from './components/Feed';
import CreatePost from './components/CreatePost';

export default function App() {
  const [page, setPage] = useState('login');
  const [refreshFeed, setRefreshFeed] = useState(false);

  const handleLogin = () => setPage('feed');
  const handleSignup = () => setPage('login');
  const handlePost = () => setRefreshFeed(r => !r);

  return (
    <div>
      {page === 'login' && <Login onLogin={handleLogin} />}
      {page === 'signup' && <Signup onSignup={handleSignup} />}
      {page === 'feed' && (
        <div>
          <CreatePost onPost={handlePost} />
          <Feed key={refreshFeed} />
        </div>
      )}
      {page !== 'feed' && (
        <div style={{ marginTop: 16 }}>
          {page === 'login' ? (
            <span>Don't have an account? <button onClick={() => setPage('signup')}>Sign Up</button></span>
          ) : (
            <span>Already have an account? <button onClick={() => setPage('login')}>Login</button></span>
          )}
        </div>
      )}
    </div>
  );
}
