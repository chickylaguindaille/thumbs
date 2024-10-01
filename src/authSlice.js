import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    user: null,
    token: null,
  },
  reducers: {
    login(state, action) {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.token = action.payload.token;
      console.log("User logged in:", state.isAuthenticated);
    },
    logout(state) {
      state.isAuthenticated = false;
      console.log("User logged out:");
      state.user = null;
      state.token = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
