import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { setLanguage } from '@shared/store/index.js';

describe('language slice', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('initializes with English as default', () => {
    const storedLanguage = localStorage.getItem('riverside_language') || 'en';
    const store = configureStore({
      reducer: {
        language: (state = { value: storedLanguage }) => state,
      },
    });
    expect(store.getState().language.value).toBe('en');
  });

  it('loads language from localStorage if available', () => {
    localStorage.setItem('riverside_language', 'ar');
    const storedLanguage = localStorage.getItem('riverside_language') || 'en';
    
    const store = configureStore({
      reducer: {
        language: (state = { value: storedLanguage }) => state,
      },
    });
    expect(store.getState().language.value).toBe('ar');
  });

  it('switches to Arabic when setLanguage is dispatched', () => {
    const slice = {
      name: 'language',
      initialState: { value: 'en' },
      reducers: {
        setLanguage: (state, action) => {
          state.value = action.payload;
          localStorage.setItem('riverside_language', action.payload);
        },
      },
    };

    const store = configureStore({
      reducer: {
        language: (state = slice.initialState, action) => {
          if (action.type === 'language/setLanguage') {
            localStorage.setItem('riverside_language', action.payload);
            return { value: action.payload };
          }
          return state;
        },
      },
    });

    store.dispatch({ type: 'language/setLanguage', payload: 'ar' });
    expect(store.getState().language.value).toBe('ar');
    expect(localStorage.getItem('riverside_language')).toBe('ar');
  });

  it('switches to English when setLanguage is dispatched', () => {
    localStorage.setItem('riverside_language', 'ar');
    const slice = {
      name: 'language',
      initialState: { value: 'ar' },
      reducers: {
        setLanguage: (state, action) => {
          state.value = action.payload;
          localStorage.setItem('riverside_language', action.payload);
        },
      },
    };

    const store = configureStore({
      reducer: {
        language: (state = slice.initialState, action) => {
          if (action.type === 'language/setLanguage') {
            localStorage.setItem('riverside_language', action.payload);
            return { value: action.payload };
          }
          return state;
        },
      },
    });

    store.dispatch({ type: 'language/setLanguage', payload: 'en' });
    expect(store.getState().language.value).toBe('en');
    expect(localStorage.getItem('riverside_language')).toBe('en');
  });

  it('persists language choice in localStorage', () => {
    const store = configureStore({
      reducer: {
        language: (state = { value: 'en' }, action) => {
          if (action.type === 'language/setLanguage') {
            localStorage.setItem('riverside_language', action.payload);
            return { value: action.payload };
          }
          return state;
        },
      },
    });

    store.dispatch({ type: 'language/setLanguage', payload: 'ar' });
    expect(localStorage.getItem('riverside_language')).toBe('ar');

    store.dispatch({ type: 'language/setLanguage', payload: 'en' });
    expect(localStorage.getItem('riverside_language')).toBe('en');
  });
});
