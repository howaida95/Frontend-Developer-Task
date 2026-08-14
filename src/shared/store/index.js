import { configureStore, createSlice } from '@reduxjs/toolkit';
import authReducer, { logout } from '@features/auth/authSlice';
import sessionReducer, { clearSession } from '@features/auth/sessionSlice';
import { membersReducer } from '@features/members/membersSlice';
import { summaryReducer } from '@features/dashboard/summarySlice';

const storedLanguage = localStorage.getItem('riverside_language') || 'en';

const languageSlice = createSlice({
  name: 'language',
  initialState: { value: storedLanguage },
  reducers: {
    setLanguage: (state, action) => {
      state.value = action.payload;
      localStorage.setItem('riverside_language', action.payload);
    },
  },
});

const uiSlice = createSlice({
  name: 'ui',
  initialState: { toast: null },
  reducers: {
    showToast: (state, action) => {
      state.toast = action.payload;
    },
    clearToast: (state) => {
      state.toast = null;
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export const { showToast, clearToast } = uiSlice.actions;

export const store = configureStore({
  reducer: {
    session: sessionReducer,
    language: languageSlice.reducer,
    auth: authReducer,
    members: membersReducer,
    summary: summaryReducer,
    ui: uiSlice.reducer,
  },
  devTools: import.meta.env.DEV,
});

export { logout, clearSession };
