
import axios from 'axios';
import { useEffect, useState } from 'react';
import CommentSection from './CommentSection';
import '../styles/Feed.css';

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showComments, setShowComments] = useState({});
  const [refresh, setRefresh] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL}/api/posts`);
      setPosts(res.data);
    } catch (err) {
      setPosts([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, [refresh]);

  const handleLike = async (postId) => {
    const token = localStorage.getItem('token');
    await axios.post(`${import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL}/api/posts/${postId}/like`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setRefresh(r => !r);
  };

  const handleComment = () => setRefresh(r => !r);

  return (
    <div className="feed">
      {loading ? <div>Loading...</div> : (
        posts.length === 0 ? <div>No posts yet</div> : (
          posts.map(post => {
            const liked = post.likes.includes(localStorage.getItem('username'));
            return (
              <div className="post-card" key={post._id}>
                <div className="post-header">{post.username}</div>
                {post.text && <div className="post-text">{post.text}</div>}
                {post.imageUrl && <img className="post-img" src={post.imageUrl} alt="post" />}
                <div className="post-meta">
                  <button className={liked ? 'liked' : ''} onClick={() => handleLike(post._id)}>
                    {liked ? 'Unlike' : 'Like'} ({post.likes.length})
                  </button>
                  <button onClick={() => setShowComments(s => ({ ...s, [post._id]: !s[post._id] }))}>
                    Comments ({post.comments.length})
                  </button>
                </div>
                {showComments[post._id] && (
                  <CommentSection postId={post._id} comments={post.comments} onComment={handleComment} />
                )}
              </div>
            );
          })
        )
      )}
    </div>
  );
}
