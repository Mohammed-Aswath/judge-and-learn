// Authentication Redux Slice
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../api/authService';
import config from '../../config/clientConfig';

// Async Thunks
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await authService.login(email, password);
      
      // Store tokens in localStorage
      localStorage.setItem(config.TOKEN_STORAGE_KEY, response.token);
      localStorage.setItem(config.USER_STORAGE_KEY, JSON.stringify(response.user));
      
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { dispatch }) => {
    try {
      await authService.logout();
      
      // Clear localStorage
      localStorage.removeItem(config.TOKEN_STORAGE_KEY);
      localStorage.removeItem(config.USER_STORAGE_KEY);
      
      return null;
    } catch (error) {
      // Even if logout fails on server, clear local storage
      localStorage.removeItem(config.TOKEN_STORAGE_KEY);
      localStorage.removeItem(config.USER_STORAGE_KEY);
      return null;
    }
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.refreshToken();
      localStorage.setItem(config.TOKEN_STORAGE_KEY, response.token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Token refresh failed');
    }
  }
);

// Initial state
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  lastLoginTime: null,
};

// Load from localStorage on startup
const loadStateFromStorage = () => {
  try {
    const token = localStorage.getItem(config.TOKEN_STORAGE_KEY);
    const userStr = localStorage.getItem(config.USER_STORAGE_KEY);
    
    if (token && userStr) {
      const user = JSON.parse(userStr);
      return {
        ...initialState,
        user,
        token,
        isAuthenticated: true,
        lastLoginTime: user.lastLogin,
      };
    }
  } catch (error) {
    console.error('Error loading auth state from storage:', error);
  }
  
  return initialState;
};

// Auth Slice
const authSlice = createSlice({
  name: 'auth',
  initialState: loadStateFromStorage(),
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateUserProfile: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem(config.USER_STORAGE_KEY, JSON.stringify(state.user));
      }
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.lastLoginTime = new Date().toISOString();
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload;
      })
      
      // Logout cases
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = null;
        state.lastLoginTime = null;
      })
      
      // Token refresh cases
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.token = action.payload.token;
        if (action.payload.user) {
          state.user = action.payload.user;
        }
      })
      .addCase(refreshToken.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        localStorage.removeItem(config.TOKEN_STORAGE_KEY);
        localStorage.removeItem(config.USER_STORAGE_KEY);
      });
  },
});

export const { clearError, updateUserProfile, setLoading } = authSlice.actions;

// Selectors
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUserRole = (state) => state.auth.user?.role;
export const selectAuthLoading = (state) => state.auth.isLoading;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;