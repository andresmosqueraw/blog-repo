import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import postService from './postService';
import { setLoading, clearLoading } from '../ui/uiSlice';

const initialState = {
  posts: [],
  post: null,
  userPosts: [],
  error: null,
};

// Get all posts
export const getPosts = createAsyncThunk(
  'posts/getAll',
  async (_, thunkAPI) => {
    try {
      thunkAPI.dispatch(setLoading('posts/getAll'));
      const response = await postService.getPosts();
      thunkAPI.dispatch(clearLoading('posts/getAll'));
      return response;
    } catch (error) {
      thunkAPI.dispatch(clearLoading('posts/getAll'));
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get post by ID
export const getPostById = createAsyncThunk(
  'posts/getById',
  async (id, thunkAPI) => {
    try {
      thunkAPI.dispatch(setLoading('posts/getById'));
      const response = await postService.getPostById(id);
      thunkAPI.dispatch(clearLoading('posts/getById'));
      return response;
    } catch (error) {
      thunkAPI.dispatch(clearLoading('posts/getById'));
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create new post
export const createPost = createAsyncThunk(
  'posts/create',
  async (postData, thunkAPI) => {
    try {
      thunkAPI.dispatch(setLoading('posts/create'));
      const response = await postService.createPost(postData);
      thunkAPI.dispatch(clearLoading('posts/create'));
      return response;
    } catch (error) {
      thunkAPI.dispatch(clearLoading('posts/create'));
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update post
export const updatePost = createAsyncThunk(
  'posts/update',
  async ({ id, postData }, thunkAPI) => {
    try {
      thunkAPI.dispatch(setLoading('posts/update'));
      const response = await postService.updatePost(id, postData);
      thunkAPI.dispatch(clearLoading('posts/update'));
      return response;
    } catch (error) {
      thunkAPI.dispatch(clearLoading('posts/update'));
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete post
export const deletePost = createAsyncThunk(
  'posts/delete',
  async (id, thunkAPI) => {
    try {
      thunkAPI.dispatch(setLoading('posts/delete'));
      await postService.deletePost(id);
      thunkAPI.dispatch(clearLoading('posts/delete'));
      return { id };
    } catch (error) {
      thunkAPI.dispatch(clearLoading('posts/delete'));
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Like post
export const likePost = createAsyncThunk(
  'posts/like',
  async (id, thunkAPI) => {
    try {
      const response = await postService.likePost(id);
      return { id, likes: response.data };
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Unlike post
export const unlikePost = createAsyncThunk(
  'posts/unlike',
  async (id, thunkAPI) => {
    try {
      const response = await postService.unlikePost(id);
      return { id, likes: response.data };
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    reset: (state) => {
      state.error = null;
    },
    clearPost: (state) => {
      state.post = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPosts.fulfilled, (state, action) => {
        state.posts = action.payload.data;
        state.error = null;
      })
      .addCase(getPosts.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(getPostById.fulfilled, (state, action) => {
        state.post = action.payload.data;
        state.error = null;
      })
      .addCase(getPostById.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload.data);
        state.error = null;
      })
      .addCase(createPost.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.posts = state.posts.map((post) =>
          post._id === action.payload.data._id ? action.payload.data : post
        );
        state.post = action.payload.data;
        state.error = null;
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((post) => post._id !== action.payload.id);
        if (state.post && state.post._id === action.payload.id) {
          state.post = null;
        }
        state.error = null;
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(likePost.fulfilled, (state, action) => {
        state.posts = state.posts.map((post) =>
          post._id === action.payload.id
            ? { ...post, likes: action.payload.likes }
            : post
        );
        if (state.post && state.post._id === action.payload.id) {
          state.post = { ...state.post, likes: action.payload.likes };
        }
      })
      .addCase(likePost.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(unlikePost.fulfilled, (state, action) => {
        state.posts = state.posts.map((post) =>
          post._id === action.payload.id
            ? { ...post, likes: action.payload.likes }
            : post
        );
        if (state.post && state.post._id === action.payload.id) {
          state.post = { ...state.post, likes: action.payload.likes };
        }
      })
      .addCase(unlikePost.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { reset, clearPost } = postSlice.actions;
export default postSlice.reducer;