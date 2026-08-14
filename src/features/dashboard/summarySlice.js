import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { dashboardService } from '@features/dashboard/api';
export const fetchSummary = createAsyncThunk(
  'summary/fetch',
  async (_, { rejectWithValue, signal }) => {
    try {
      return await dashboardService.getSummary({ signal });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);
const slice = createSlice({
  name: 'summary',
  initialState: { data: null, status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(fetchSummary.pending, (s) => {
        s.status = 'loading';
        s.error = null;
      })
      .addCase(fetchSummary.fulfilled, (s, a) => {
        s.status = 'succeeded';
        s.data = a.payload;
        s.error = null;
      })
      .addCase(fetchSummary.rejected, (s, a) => {
        s.status = 'failed';
        s.error = a.payload || 'Unable to load summary.';
      }),
});
export const summaryReducer = slice.reducer;
