import { createSlice } from '@reduxjs/toolkit';
import { hydrateSession, login, logout } from '@features/auth/authSlice';

const isAdminUser = (user) => user?.role === 'admin';

const slice = createSlice({
  name: 'session',
  initialState: { user: null, authenticated: false, status: 'anonymous' },
  reducers: {
    clearSession: (state) => {
      state.user = null;
      state.authenticated = false;
      state.status = 'anonymous';
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(hydrateSession.pending, (state) => {
        state.status = 'checking';
      })
      .addCase(hydrateSession.fulfilled, (state, action) => {
        if (!isAdminUser(action.payload.user)) {
          state.user = null;
          state.authenticated = false;
          state.status = 'anonymous';
          return;
        }
        state.user = action.payload.user;
        state.authenticated = true;
        state.status = 'authenticated';
      })
      .addCase(hydrateSession.rejected, (state) => {
        state.user = null;
        state.authenticated = false;
        state.status = 'anonymous';
      })
      .addCase(login.fulfilled, (state, action) => {
        if (!isAdminUser(action.payload.user)) {
          state.user = null;
          state.authenticated = false;
          state.status = 'anonymous';
          return;
        }
        state.user = action.payload.user;
        state.authenticated = true;
        state.status = 'authenticated';
      })
      .addCase(login.rejected, (state) => {
        state.user = null;
        state.authenticated = false;
        state.status = 'anonymous';
      })
      .addCase(logout.pending, (state) => {
        state.user = null;
        state.authenticated = false;
        state.status = 'anonymous';
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.authenticated = false;
        state.status = 'anonymous';
      }),
});

export const { clearSession } = slice.actions;
export default slice.reducer;
