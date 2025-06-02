import axios from 'axios';

// Get all posts
const getPosts = async () => {
  const response = await axios.get('/api/posts');
  return response.data;
};

// Get post by ID
const getPostById = async (id) => {
  const response = await axios.get(`/api/posts/${id}`);
  return response.data;
};

// Create new post
const createPost = async (postData) => {
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  };
  
  const response = await axios.post('/api/posts', postData, config);
  return response.data;
};

// Update post
const updatePost = async (id, postData) => {
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  };
  
  const response = await axios.put(`/api/posts/${id}`, postData, config);
  return response.data;
};

// Delete post
const deletePost = async (id) => {
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  };
  
  const response = await axios.delete(`/api/posts/${id}`, config);
  return response.data;
};

// Like post
const likePost = async (id) => {
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  };
  
  const response = await axios.put(`/api/posts/like/${id}`, {}, config);
  return response.data;
};

// Unlike post
const unlikePost = async (id) => {
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  };
  
  const response = await axios.put(`/api/posts/unlike/${id}`, {}, config);
  return response.data;
};

const postService = {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
};

export default postService;