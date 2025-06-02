const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
} = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/posts
// @desc    Create a post
// @access  Private
router.post(
  '/',
  [
    protect,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('content', 'Content is required').not().isEmpty(),
    ],
  ],
  createPost
);

// @route   GET /api/posts
// @desc    Get all posts
// @access  Public
router.get('/', getPosts);

// @route   GET /api/posts/:id
// @desc    Get post by ID
// @access  Public
router.get('/:id', getPost);

// @route   PUT /api/posts/:id
// @desc    Update a post
// @access  Private
router.put('/:id', protect, updatePost);

// @route   DELETE /api/posts/:id
// @desc    Delete a post
// @access  Private
router.delete('/:id', protect, deletePost);

// @route   PUT /api/posts/like/:id
// @desc    Like a post
// @access  Private
router.put('/like/:id', protect, likePost);

// @route   PUT /api/posts/unlike/:id
// @desc    Unlike a post
// @access  Private
router.put('/unlike/:id', protect, unlikePost);

module.exports = router;