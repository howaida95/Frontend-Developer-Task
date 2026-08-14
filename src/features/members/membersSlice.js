import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { membersService } from '@features/members/api';
export const fetchMembers = createAsyncThunk(
  'members/fetch',
  async (query, { rejectWithValue, signal }) => {
    try {
      return await membersService.getMembers({ signal, query });
    } catch (error) {
      if (error.name === 'AbortError') return rejectWithValue({ aborted: true });
      return rejectWithValue(error.message);
    }
  },
);
const initialState = {
  data: [],
  meta: { page: 1, per_page: 25, total: 0, last_page: 1 },
  query: { page: 1, search: '', tier: '', status: '', sort: 'sessionsThisMonth', dir: 'desc' },
  status: 'idle',
  error: null,
  activeRequestId: null,
};
const slice = createSlice({
  name: 'members',
  initialState,
  reducers: {
    setQuery: (s, a) => {
      s.query = { ...s.query, ...a.payload };
    },
    clearMembersError: (s) => {
      s.error = null;
    },
  },
  extraReducers: (b) =>
    b
      .addCase(fetchMembers.pending, (s, a) => {
        s.status = 'loading';
        s.error = null;
        s.activeRequestId = a.meta.requestId;
      })
      .addCase(fetchMembers.fulfilled, (s, a) => {
        if (a.meta.requestId !== s.activeRequestId) return;
        s.status = 'succeeded';
        s.data = a.payload.data;
        s.meta = a.payload.meta;
        s.error = null;
      })
      .addCase(fetchMembers.rejected, (s, a) => {
        if (a.meta.requestId !== s.activeRequestId) return;
        if (a.payload?.aborted) return;
        s.status = 'failed';
        s.error = a.payload || 'Unable to load members.';
      }),
});
export const { setQuery, clearMembersError } = slice.actions;
export const membersReducer = slice.reducer;
