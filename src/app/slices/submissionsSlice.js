// Submissions Redux Slice
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { submissionService } from '../../api/submissionService';

// Async Thunks
export const submitCode = createAsyncThunk(
  'submissions/submitCode',
  async (submissionData, { rejectWithValue }) => {
    try {
      const response = await submissionService.submitCode(submissionData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Submission failed');
    }
  }
);

export const fetchSubmissions = createAsyncThunk(
  'submissions/fetchSubmissions',
  async ({ userId, problemId, page = 1, limit = 20 } = {}, { rejectWithValue }) => {
    try {
      const response = await submissionService.getSubmissions({ userId, problemId, page, limit });
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch submissions');
    }
  }
);

export const fetchSubmissionById = createAsyncThunk(
  'submissions/fetchSubmissionById',
  async (submissionId, { rejectWithValue }) => {
    try {
      const response = await submissionService.getSubmissionById(submissionId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch submission');
    }
  }
);

export const pollSubmissionStatus = createAsyncThunk(
  'submissions/pollSubmissionStatus',
  async (submissionId, { rejectWithValue }) => {
    try {
      const response = await submissionService.getSubmissionStatus(submissionId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to check submission status');
    }
  }
);

// Initial state
const initialState = {
  submissions: [],
  currentSubmission: null,
  activeSubmission: null, // Currently running submission
  submissionHistory: {},
  filters: {
    problemId: '',
    language: '',
    status: '',
    dateRange: null,
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20,
  },
  loading: {
    submitting: false,
    fetching: false,
    polling: false,
  },
  error: null,
  submissionQueue: [], // Track queued submissions
};

// Submissions Slice
const submissionsSlice = createSlice({
  name: 'submissions',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.currentPage = 1;
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.pagination.currentPage = 1;
    },
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    clearCurrentSubmission: (state) => {
      state.currentSubmission = null;
    },
    updateSubmissionStatus: (state, action) => {
      const { submissionId, status, results } = action.payload;
      
      // Update in submissions list
      const submissionIndex = state.submissions.findIndex(s => s.id === submissionId);
      if (submissionIndex !== -1) {
        state.submissions[submissionIndex] = {
          ...state.submissions[submissionIndex],
          status,
          ...(results && { results }),
        };
      }
      
      // Update current submission if it matches
      if (state.currentSubmission?.id === submissionId) {
        state.currentSubmission = {
          ...state.currentSubmission,
          status,
          ...(results && { results }),
        };
      }
      
      // Update active submission if it matches
      if (state.activeSubmission?.id === submissionId) {
        state.activeSubmission = {
          ...state.activeSubmission,
          status,
          ...(results && { results }),
        };
        
        // Clear active submission if completed
        if (status === 'completed' || status === 'failed') {
          state.activeSubmission = null;
        }
      }
    },
    addToSubmissionQueue: (state, action) => {
      state.submissionQueue.push(action.payload);
    },
    removeFromSubmissionQueue: (state, action) => {
      state.submissionQueue = state.submissionQueue.filter(
        s => s.id !== action.payload
      );
    },
    clearSubmissionQueue: (state) => {
      state.submissionQueue = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Submit code cases
      .addCase(submitCode.pending, (state, action) => {
        state.loading.submitting = true;
        state.error = null;
      })
      .addCase(submitCode.fulfilled, (state, action) => {
        state.loading.submitting = false;
        const submission = action.payload;
        
        // Add to submissions list
        state.submissions.unshift(submission);
        
        // Set as active submission if still processing
        if (submission.status === 'queued' || submission.status === 'running') {
          state.activeSubmission = submission;
        }
        
        // Update pagination
        state.pagination.totalItems += 1;
      })
      .addCase(submitCode.rejected, (state, action) => {
        state.loading.submitting = false;
        state.error = action.payload;
      })
      
      // Fetch submissions cases
      .addCase(fetchSubmissions.pending, (state) => {
        state.loading.fetching = true;
        state.error = null;
      })
      .addCase(fetchSubmissions.fulfilled, (state, action) => {
        state.loading.fetching = false;
        state.submissions = action.payload.submissions || action.payload;
        state.pagination = {
          ...state.pagination,
          ...action.payload.pagination,
        };
      })
      .addCase(fetchSubmissions.rejected, (state, action) => {
        state.loading.fetching = false;
        state.error = action.payload;
      })
      
      // Fetch submission by ID cases
      .addCase(fetchSubmissionById.fulfilled, (state, action) => {
        state.currentSubmission = action.payload;
      })
      
      // Poll submission status cases
      .addCase(pollSubmissionStatus.pending, (state) => {
        state.loading.polling = true;
      })
      .addCase(pollSubmissionStatus.fulfilled, (state, action) => {
        state.loading.polling = false;
        const submission = action.payload;
        
        // Update the submission in the list
        const index = state.submissions.findIndex(s => s.id === submission.id);
        if (index !== -1) {
          state.submissions[index] = submission;
        }
        
        // Update current submission if it matches
        if (state.currentSubmission?.id === submission.id) {
          state.currentSubmission = submission;
        }
        
        // Update or clear active submission
        if (state.activeSubmission?.id === submission.id) {
          if (submission.status === 'completed' || submission.status === 'failed') {
            state.activeSubmission = null;
          } else {
            state.activeSubmission = submission;
          }
        }
      })
      .addCase(pollSubmissionStatus.rejected, (state, action) => {
        state.loading.polling = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  setFilters,
  clearFilters,
  setCurrentPage,
  clearCurrentSubmission,
  updateSubmissionStatus,
  addToSubmissionQueue,
  removeFromSubmissionQueue,
  clearSubmissionQueue,
} = submissionsSlice.actions;

// Selectors
export const selectSubmissions = (state) => state.submissions.submissions;
export const selectCurrentSubmission = (state) => state.submissions.currentSubmission;
export const selectActiveSubmission = (state) => state.submissions.activeSubmission;
export const selectSubmissionsLoading = (state) => state.submissions.loading;
export const selectSubmissionsError = (state) => state.submissions.error;
export const selectSubmissionsFilters = (state) => state.submissions.filters;
export const selectSubmissionsPagination = (state) => state.submissions.pagination;
export const selectSubmissionQueue = (state) => state.submissions.submissionQueue;

export default submissionsSlice.reducer;