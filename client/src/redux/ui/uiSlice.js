import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: {},
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading[action.payload] = true;
    },
    clearLoading: (state, action) => {
      state.loading[action.payload] = false;
    },
  },
});

export const { setLoading, clearLoading } = uiSlice.actions;
export default uiSlice.reducer;