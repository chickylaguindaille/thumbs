import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    user: null,
    token: null,
  },
  reducers: {
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
  },
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

export const { updateUser, login, logout } = authSlice.actions;
export default authSlice.reducer;
