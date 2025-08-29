// Problems Redux Slice
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { problemService } from '../../api/problemService';

// Async Thunks
export const fetchProblems = createAsyncThunk(
  'problems/fetchProblems',
  async ({ filters = {}, page = 1, limit = 20 } = {}, { rejectWithValue }) => {
    try {
      const response = await problemService.getProblems({ ...filters, page, limit });
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch problems');
    }
  }
);

export const fetchProblemById = createAsyncThunk(
  'problems/fetchProblemById',
  async (problemId, { rejectWithValue }) => {
    try {
      const response = await problemService.getProblemById(problemId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch problem');
    }
  }
);

export const createProblem = createAsyncThunk(
  'problems/createProblem',
  async (problemData, { rejectWithValue }) => {
    try {
      const response = await problemService.createProblem(problemData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create problem');
    }
  }
);

export const updateProblem = createAsyncThunk(
  'problems/updateProblem',
  async ({ problemId, updates }, { rejectWithValue }) => {
    try {
      const response = await problemService.updateProblem(problemId, updates);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update problem');
    }
  }
);

export const deleteProblem = createAsyncThunk(
  'problems/deleteProblem',
  async (problemId, { rejectWithValue }) => {
    try {
      await problemService.deleteProblem(problemId);
      return problemId;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete problem');
    }
  }
);

// Initial state
const initialState = {
  problems: [],
  currentProblem: null,
  filteredProblems: [],
  filters: {
    difficulty: '',
    tags: [],
    language: '',
    search: '',
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20,
  },
  loading: {
    problems: false,
    currentProblem: false,
    creating: false,
    updating: false,
    deleting: false,
  },
  error: null,
};

// Problems Slice
const problemsSlice = createSlice({
  name: 'problems',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.currentPage = 1; // Reset to first page when filters change
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.pagination.currentPage = 1;
    },
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    clearCurrentProblem: (state) => {
      state.currentProblem = null;
    },
    updateProblemInList: (state, action) => {
      const index = state.problems.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.problems[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch problems cases
      .addCase(fetchProblems.pending, (state) => {
        state.loading.problems = true;
        state.error = null;
      })
      .addCase(fetchProblems.fulfilled, (state, action) => {
        state.loading.problems = false;
        state.problems = action.payload.problems || action.payload;
        state.pagination = {
          ...state.pagination,
          ...action.payload.pagination,
        };
      })
      .addCase(fetchProblems.rejected, (state, action) => {
        state.loading.problems = false;
        state.error = action.payload;
      })
      
      // Fetch problem by ID cases
      .addCase(fetchProblemById.pending, (state) => {
        state.loading.currentProblem = true;
        state.error = null;
      })
      .addCase(fetchProblemById.fulfilled, (state, action) => {
        state.loading.currentProblem = false;
        state.currentProblem = action.payload;
      })
      .addCase(fetchProblemById.rejected, (state, action) => {
        state.loading.currentProblem = false;
        state.error = action.payload;
      })
      
      // Create problem cases
      .addCase(createProblem.pending, (state) => {
        state.loading.creating = true;
        state.error = null;
      })
      .addCase(createProblem.fulfilled, (state, action) => {
        state.loading.creating = false;
        state.problems.unshift(action.payload);
        state.pagination.totalItems += 1;
      })
      .addCase(createProblem.rejected, (state, action) => {
        state.loading.creating = false;
        state.error = action.payload;
      })
      
      // Update problem cases
      .addCase(updateProblem.pending, (state) => {
        state.loading.updating = true;
        state.error = null;
      })
      .addCase(updateProblem.fulfilled, (state, action) => {
        state.loading.updating = false;
        const index = state.problems.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.problems[index] = action.payload;
        }
        if (state.currentProblem?.id === action.payload.id) {
          state.currentProblem = action.payload;
        }
      })
      .addCase(updateProblem.rejected, (state, action) => {
        state.loading.updating = false;
        state.error = action.payload;
      })
      
      // Delete problem cases
      .addCase(deleteProblem.pending, (state) => {
        state.loading.deleting = true;
        state.error = null;
      })
      .addCase(deleteProblem.fulfilled, (state, action) => {
        state.loading.deleting = false;
        state.problems = state.problems.filter(p => p.id !== action.payload);
        state.pagination.totalItems = Math.max(0, state.pagination.totalItems - 1);
        if (state.currentProblem?.id === action.payload) {
          state.currentProblem = null;
        }
      })
      .addCase(deleteProblem.rejected, (state, action) => {
        state.loading.deleting = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  setFilters,
  clearFilters,
  setCurrentPage,
  clearCurrentProblem,
  updateProblemInList,
} = problemsSlice.actions;

// Selectors
export const selectProblems = (state) => state.problems.problems;
export const selectCurrentProblem = (state) => state.problems.currentProblem;
export const selectProblemsLoading = (state) => state.problems.loading;
export const selectProblemsError = (state) => state.problems.error;
export const selectProblemsFilters = (state) => state.problems.filters;
export const selectProblemsPagination = (state) => state.problems.pagination;

export default problemsSlice.reducer;