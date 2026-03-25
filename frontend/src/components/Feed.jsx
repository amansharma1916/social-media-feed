
import axios from 'axios';
import { useEffect, useState } from 'react';
import CommentSection from './CommentSection';
import '../styles/Feed.css';

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showComments, setShowComments] = useState({});
  const [refresh, setRefresh] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 5;

  const fetchPosts = async (pageNum = page) => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL}/api/posts?page=${pageNum}&limit=${limit}`);
      setPosts(res.data.posts);
      setTotalPages(res.data.totalPages);
      setTotal(res.data.total);
    } catch (err) {
      setPosts([]);
      setTotalPages(1);
      setTotal(0);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts(page);
    // eslint-disable-next-line
  }, [refresh, page]);

  const handleLike = async (postId) => {
    const token = localStorage.getItem('token');
    await axios.post(`${import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL}/api/posts/${postId}/like`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setRefresh(r => !r);
  };

  const handleComment = () => setRefresh(r => !r);

  const handlePrev = () => setPage(p => Math.max(1, p - 1));
  const handleNext = () => setPage(p => Math.min(totalPages, p + 1));

  return (
    <div className="feed">
      {loading ? <div>Loading...</div> : (
        posts.length === 0 ? <div>No posts yet</div> : (
          <>
            {posts.map(post => {
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
            })}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 24 }}>
              <button onClick={handlePrev} disabled={page === 1}>Prev</button>
              <span>Page {page} of {totalPages} ({total} posts)</span>
              <button onClick={handleNext} disabled={page === totalPages}>Next</button>
            </div>
          </>
        )
      )}
    </div>
  );
}
