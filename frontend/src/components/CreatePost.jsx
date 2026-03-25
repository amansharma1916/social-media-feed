
import { useState } from 'react';
import axios from 'axios';
import '../styles/CreatePost.css';


export default function CreatePost({ onPost }) {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!text && !image) {
      setError('Text or image required');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      if (text) formData.append('text', text);
      if (image) formData.append('image', image);
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL}/api/posts`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setText('');
      setImage(null);
      onPost();
    } catch (err) {
      setError(err.response?.data?.message || 'Post failed');
    }
    setLoading(false);
  };

  return (
    <form className="create-post" onSubmit={handleSubmit}>
      <textarea placeholder="What's on your mind?" value={text} onChange={e => setText(e.target.value)} disabled={loading} />
      <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} disabled={loading} />
      <button type="submit" disabled={loading}>{loading ? 'Posting...' : 'Post'}</button>
      {loading && <div className="loading-spinner" style={{marginTop:8}}>Loading...</div>}
      {error && <div className="error">{error}</div>}
    </form>
  );
}
