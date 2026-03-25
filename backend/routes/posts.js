import express from 'express';
import multer from 'multer';
import auth from '../middleware/auth.js';
import Post from '../models/Post.js';
import cloudinaryModule from 'cloudinary';
cloudinaryModule.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
const cloudinary = cloudinaryModule.v2;

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { text } = req.body;
    let imageUrl = '';
    if (req.file) {
      try {
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          });
          stream.end(req.file.buffer);
        });
        imageUrl = result.secure_url;
      } catch (uploadErr) {
        console.error('Cloudinary upload error:', uploadErr);
        return res.status(500).json({ message: 'Image upload failed' });
      }
    }
    if (!text && !imageUrl) return res.status(400).json({ message: 'Text or image required' });
    const post = new Post({
      userId: req.user.userId,
      username: req.user.username,
      text,
      imageUrl,
      likes: [],
      comments: []
    });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    console.error('Post creation error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/posts?page=1&limit=10
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const total = await Post.countDocuments();
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    res.json({
      posts,
      page,
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const index = post.likes.indexOf(req.user.username);
    if (index === -1) {
      post.likes.push(req.user.username);
    } else {
      post.likes.splice(index, 1);
    }
    await post.save();
    res.json({ likes: post.likes.length, liked: index === -1 });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:id/comment', auth, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Comment required' });
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    post.comments.push({ username: req.user.username, text });
    await post.save();
    res.json(post.comments);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
