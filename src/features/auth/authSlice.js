import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { authService } from '@features/auth/api';

const isAdminUser = (user) => user?.role === 'admin';

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await authService.login({ email, password });
      if (!isAdminUser(response?.user)) {
        return rejectWithValue('Only administrators can access this portal.');
      }
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const hydrateSession = createAsyncThunk(
  'auth/hydrateSession',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.me();
      if (!isAdminUser(response?.user)) {
        return rejectWithValue('Only administrators can access this portal.');
      }
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const logout = createAsyncThunk('auth/logout', async () => {
  try {
    await authService.logout();
  } catch {
    // Logout should still clear local state if the server session is already gone.
  }
  return true;
});

const slice = createSlice({
  name: 'auth',
  initialState: { status: 'idle', error: null },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Unable to sign in.';
      })
      .addCase(hydrateSession.pending, (state) => {
        state.status = 'checking';
        state.error = null;
      })
      .addCase(hydrateSession.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(hydrateSession.rejected, (state) => {
        state.status = 'idle';
      })
      .addCase(logout.fulfilled, (state) => {
        state.status = 'idle';
        state.error = null;
      }),
});

export const { clearError } = slice.actions;
export default slice.reducer;
