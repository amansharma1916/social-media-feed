
import axios from 'axios';
import { useState } from 'react';
import '../styles/Comments.css';

export default function CommentSection({ postId, comments, onComment }) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!text) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL}/api/posts/${postId}/comment`, { text }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setText('');
      onComment();
    } catch (err) {
      setError(err.response?.data?.message || 'Comment failed');
    }
    setLoading(false);
  };

  return (
    <div className="comment-section">
      <div className="comments-list">
        {comments.map((c, i) => (
          <div className="comment" key={i}>
            <span className="comment-user">{c.username}:</span> {c.text}
          </div>
        ))}
      </div>
      <form className="comment-form" onSubmit={handleSubmit}>
        <input type="text" placeholder="Add a comment..." value={text} onChange={e => setText(e.target.value)} />
        <button type="submit" disabled={loading || !text}>{loading ? 'Posting...' : 'Post'}</button>
      </form>
      {error && <div className="error">{error}</div>}
    </div>
  );
}
