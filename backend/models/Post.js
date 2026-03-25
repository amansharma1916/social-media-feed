import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  username: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const postSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true },
  text: { type: String },
  imageUrl: { type: String },
  likes: [{ type: String }], // store usernames of users who liked
  comments: [commentSchema],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Post', postSchema);
