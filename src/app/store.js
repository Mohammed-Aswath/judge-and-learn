// Redux Store Configuration
import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import problemsSlice from './slices/problemsSlice';
import submissionsSlice from './slices/submissionsSlice';
import leaderboardSlice from './slices/leaderboardSlice';
import uiSlice from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    problems: problemsSlice,
    submissions: submissionsSlice,
    leaderboard: leaderboardSlice,
    ui: uiSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;