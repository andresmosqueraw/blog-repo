import api from '../api/axiosConfig';

// Register user
const register = async (userData) => {
  const response = await api.post('/api/auth/register', userData);
  
  if (response.data) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  
  return response.data;
};

// Login user
const login = async (userData) => {
  const response = await api.post('/api/auth/login', userData);
  
  if (response.data) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  
  return response.data;
};

// Load user
const loadUser = async () => {
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  };
  
  const response = await api.get('/api/auth/me', config);
  
  return response.data;
};

// Update profile
const updateProfile = async (profileData) => {
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  };
  
  const response = await api.put('/api/users/profile', profileData, config);
  
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data.data));
  }
  
  return response.data;
};

// Logout user
const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

const authService = {
  register,
  login,
  loadUser,
  updateProfile,
  logout,
};

export default authService;