const Post = require('../models/postModel');
const { validationResult } = require('express-validator');

// @desc    Create new post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, content, image, tags } = req.body;

    const newPost = new Post({
      title,
      content,
      image,
      tags,
      author: req.user.id,
    });

    const post = await newPost.save();

    res.status(201).json({
      success: true,
      data: post,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('author', 'name email avatar');

    res.json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Public
const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      'author',
      'name email avatar'
    );

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json({
      success: true,
      data: post,
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
const updatePost = async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user is the post author
    if (post.author.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    const { title, content, image, tags } = req.body;

    post = await Post.findByIdAndUpdate(
      req.params.id,
      { title, content, image, tags },
      { new: true }
    );

    res.json({
      success: true,
      data: post,
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user is the post author
    if (post.author.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await post.deleteOne();

    res.json({
      success: true,
      message: 'Post removed',
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Like a post
// @route   PUT /api/posts/like/:id
// @access  Private
const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if the post has already been liked by this user
    if (post.likes.some((like) => like.toString() === req.user.id)) {
      return res.status(400).json({ message: 'Post already liked' });
    }

    post.likes.unshift(req.user.id);

    await post.save();

    res.json({
      success: true,
      data: post.likes,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Unlike a post
// @route   PUT /api/posts/unlike/:id
// @access  Private
const unlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if the post has been liked by this user
    if (!post.likes.some((like) => like.toString() === req.user.id)) {
      return res.status(400).json({ message: 'Post has not yet been liked' });
    }

    // Remove the like
    post.likes = post.likes.filter(
      (like) => like.toString() !== req.user.id
    );

    await post.save();

    res.json({
      success: true,
      data: post.likes,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
};