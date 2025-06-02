import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from './authService';
import { setLoading, clearLoading } from '../ui/uiSlice';

// Get user from localStorage
const user = JSON.parse(localStorage.getItem('user'));
const token = localStorage.getItem('token');

const initialState = {
  token: token || null,
  user: user || null,
  isAuthenticated: !!token,
  error: null,
};

// Register user
export const register = createAsyncThunk(
  'auth/register',
  async (userData, thunkAPI) => {
    try {
      thunkAPI.dispatch(setLoading('auth/register'));
      const response = await authService.register(userData);
      thunkAPI.dispatch(clearLoading('auth/register'));
      return response;
    } catch (error) {
      thunkAPI.dispatch(clearLoading('auth/register'));
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Login user
export const login = createAsyncThunk(
  'auth/login',
  async (userData, thunkAPI) => {
    try {
      thunkAPI.dispatch(setLoading('auth/login'));
      const response = await authService.login(userData);
      thunkAPI.dispatch(clearLoading('auth/login'));
      return response;
    } catch (error) {
      thunkAPI.dispatch(clearLoading('auth/login'));
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Load user
export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return thunkAPI.rejectWithValue('No token found');
      }
      
      thunkAPI.dispatch(setLoading('auth/loadUser'));
      const response = await authService.loadUser();
      thunkAPI.dispatch(clearLoading('auth/loadUser'));
      return response;
    } catch (error) {
      thunkAPI.dispatch(clearLoading('auth/loadUser'));
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update profile
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, thunkAPI) => {
    try {
      thunkAPI.dispatch(setLoading('auth/updateProfile'));
      const response = await authService.updateProfile(profileData);
      thunkAPI.dispatch(clearLoading('auth/updateProfile'));
      return response;
    } catch (error) {
      thunkAPI.dispatch(clearLoading('auth/updateProfile'));
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Logout user
export const logout = createAsyncThunk('auth/logout', async () => {
  await authService.logout();
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload.data;
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;