import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@features/auth/authSlice';
import sessionReducer from '@features/auth/sessionSlice';
import { membersReducer } from '@features/members/membersSlice';
import { summaryReducer } from '@features/dashboard/summarySlice';

const languageSlice = {
  name: 'language',
  reducer: (state = { value: 'en' }) => state,
};

const uiSlice = {
  name: 'ui',
  reducer: (state = { toast: null }) => state,
};

export function renderWithProviders(
  ui,
  {
    preloadedState = {},
    store = configureStore({
      reducer: {
        auth: authReducer,
        session: sessionReducer,
        members: membersReducer,
        summary: summaryReducer,
        language: languageSlice.reducer,
        ui: uiSlice.reducer,
      },
      preloadedState,
    }),
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return React.createElement(Provider, { store }, children);
  }

  const renderResult = render(ui, { wrapper: Wrapper, ...renderOptions });
  return { ...renderResult, store };
}

export * from '@testing-library/react';
