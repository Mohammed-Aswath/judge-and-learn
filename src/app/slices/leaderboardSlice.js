// Leaderboard Redux Slice
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { leaderboardService } from '../../api/leaderboardService';

// Async Thunks
export const fetchLeaderboard = createAsyncThunk(
  'leaderboard/fetchLeaderboard',
  async ({ type = 'global', classId, problemId, timeRange = 'all' } = {}, { rejectWithValue }) => {
    try {
      const response = await leaderboardService.getLeaderboard({ type, classId, problemId, timeRange });
      return { ...response, type, classId, problemId, timeRange };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch leaderboard');
    }
  }
);

export const fetchUserRank = createAsyncThunk(
  'leaderboard/fetchUserRank',
  async ({ userId, type = 'global', classId, problemId } = {}, { rejectWithValue }) => {
    try {
      const response = await leaderboardService.getUserRank({ userId, type, classId, problemId });
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch user rank');
    }
  }
);

export const fetchLeaderboardHistory = createAsyncThunk(
  'leaderboard/fetchLeaderboardHistory',
  async ({ userId, timeRange = '30d' } = {}, { rejectWithValue }) => {
    try {
      const response = await leaderboardService.getLeaderboardHistory({ userId, timeRange });
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch leaderboard history');
    }
  }
);

// Initial state
const initialState = {
  // Current leaderboard data
  leaderboard: [],
  userRank: null,
  
  // Leaderboard configurations
  currentType: 'global', // 'global', 'class', 'problem'
  currentClassId: null,
  currentProblemId: null,
  currentTimeRange: 'all', // 'all', '7d', '30d', '90d'
  
  // User-specific data
  userStats: null,
  rankHistory: [],
  
  // Filters and sorting
  filters: {
    search: '',
    minScore: 0,
    maxRank: null,
  },
  sortBy: 'rank', // 'rank', 'score', 'problems_solved', 'accuracy'
  sortOrder: 'asc', // 'asc', 'desc'
  
  // Loading states
  loading: {
    leaderboard: false,
    userRank: false,
    history: false,
  },
  
  // Error states
  error: null,
  
  // Real-time updates
  lastUpdated: null,
  isLive: false,
};

// Leaderboard Slice
const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    
    setLeaderboardType: (state, action) => {
      const { type, classId = null, problemId = null } = action.payload;
      state.currentType = type;
      state.currentClassId = classId;
      state.currentProblemId = problemId;
    },
    
    setTimeRange: (state, action) => {
      state.currentTimeRange = action.payload;
    },
    
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    
    setSorting: (state, action) => {
      const { sortBy, sortOrder } = action.payload;
      state.sortBy = sortBy;
      state.sortOrder = sortOrder;
    },
    
    updateLeaderboardEntry: (state, action) => {
      const updatedEntry = action.payload;
      const index = state.leaderboard.findIndex(entry => entry.userId === updatedEntry.userId);
      
      if (index !== -1) {
        state.leaderboard[index] = { ...state.leaderboard[index], ...updatedEntry };
      } else {
        // If entry doesn't exist, add it and re-sort
        state.leaderboard.push(updatedEntry);
        state.leaderboard.sort((a, b) => a.rank - b.rank);
      }
      
      state.lastUpdated = new Date().toISOString();
    },
    
    updateUserRank: (state, action) => {
      state.userRank = { ...state.userRank, ...action.payload };
      state.lastUpdated = new Date().toISOString();
    },
    
    setLiveMode: (state, action) => {
      state.isLive = action.payload;
    },
    
    addRankHistoryPoint: (state, action) => {
      state.rankHistory.push(action.payload);
      // Keep only last 100 points to prevent memory issues
      if (state.rankHistory.length > 100) {
        state.rankHistory = state.rankHistory.slice(-100);
      }
    },
  },
  
  extraReducers: (builder) => {
    builder
      // Fetch leaderboard cases
      .addCase(fetchLeaderboard.pending, (state) => {
        state.loading.leaderboard = true;
        state.error = null;
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.loading.leaderboard = false;
        state.leaderboard = action.payload.leaderboard || action.payload.data || [];
        state.currentType = action.payload.type;
        state.currentClassId = action.payload.classId;
        state.currentProblemId = action.payload.problemId;
        state.currentTimeRange = action.payload.timeRange;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchLeaderboard.rejected, (state, action) => {
        state.loading.leaderboard = false;
        state.error = action.payload;
      })
      
      // Fetch user rank cases
      .addCase(fetchUserRank.pending, (state) => {
        state.loading.userRank = true;
      })
      .addCase(fetchUserRank.fulfilled, (state, action) => {
        state.loading.userRank = false;
        state.userRank = action.payload;
      })
      .addCase(fetchUserRank.rejected, (state, action) => {
        state.loading.userRank = false;
        state.error = action.payload;
      })
      
      // Fetch leaderboard history cases
      .addCase(fetchLeaderboardHistory.pending, (state) => {
        state.loading.history = true;
      })
      .addCase(fetchLeaderboardHistory.fulfilled, (state, action) => {
        state.loading.history = false;
        state.rankHistory = action.payload.history || [];
      })
      .addCase(fetchLeaderboardHistory.rejected, (state, action) => {
        state.loading.history = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  setLeaderboardType,
  setTimeRange,
  setFilters,
  clearFilters,
  setSorting,
  updateLeaderboardEntry,
  updateUserRank,
  setLiveMode,
  addRankHistoryPoint,
} = leaderboardSlice.actions;

// Selectors
export const selectLeaderboard = (state) => state.leaderboard.leaderboard;
export const selectUserRank = (state) => state.leaderboard.userRank;
export const selectLeaderboardConfig = (state) => ({
  type: state.leaderboard.currentType,
  classId: state.leaderboard.currentClassId,
  problemId: state.leaderboard.currentProblemId,
  timeRange: state.leaderboard.currentTimeRange,
});
export const selectLeaderboardFilters = (state) => state.leaderboard.filters;
export const selectLeaderboardSorting = (state) => ({
  sortBy: state.leaderboard.sortBy,
  sortOrder: state.leaderboard.sortOrder,
});
export const selectLeaderboardLoading = (state) => state.leaderboard.loading;
export const selectLeaderboardError = (state) => state.leaderboard.error;
export const selectRankHistory = (state) => state.leaderboard.rankHistory;
export const selectIsLiveLeaderboard = (state) => state.leaderboard.isLive;
export const selectLeaderboardLastUpdated = (state) => state.leaderboard.lastUpdated;

export default leaderboardSlice.reducer;
