import api from '../api/axiosConfig';

// Get all posts
const getPosts = async () => {
  const response = await api.get('/api/posts');
  return response.data;
};

// Get post by ID
const getPostById = async (id) => {
  const response = await api.get(`/api/posts/${id}`);
  return response.data;
};

// Create new post
const createPost = async (postData) => {
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  };
  
  const response = await api.post('/api/posts', postData, config);
  return response.data;
};

// Update post
const updatePost = async (id, postData) => {
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  };
  
  const response = await api.put(`/api/posts/${id}`, postData, config);
  return response.data;
};

// Delete post
const deletePost = async (id) => {
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  };
  
  const response = await api.delete(`/api/posts/${id}`, config);
  return response.data;
};

// Like post
const likePost = async (id) => {
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  };
  
  const response = await api.put(`/api/posts/like/${id}`, {}, config);
  return response.data;
};

// Unlike post
const unlikePost = async (id) => {
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  };
  
  const response = await api.put(`/api/posts/unlike/${id}`, {}, config);
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