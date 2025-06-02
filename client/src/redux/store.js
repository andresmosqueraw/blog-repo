import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import postReducer from './posts/postSlice';
import uiReducer from './ui/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postReducer,
    ui: uiReducer,
  },
  devTools: import.meta.env.DEV,
});