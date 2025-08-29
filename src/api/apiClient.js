// Centralized API Client Configuration
import axios from 'axios';
import config from '../config/clientConfig';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: config.API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('codeJudgeToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and token refresh
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh token
        const refreshToken = localStorage.getItem('codeJudgeRefreshToken');
        if (refreshToken) {
          const response = await axios.post(`${config.API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });
          
          const newToken = response.data.token;
          localStorage.setItem('codeJudgeToken', newToken);
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('codeJudgeToken');
        localStorage.removeItem('codeJudgeRefreshToken');
        localStorage.removeItem('codeJudgeUser');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    // Handle network errors
    if (!error.response) {
      console.error('Network Error:', error.message);
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }
    
    // Handle other HTTP errors
    const errorMessage = error.response.data?.message || 
                        error.response.data?.error || 
                        `HTTP ${error.response.status}: ${error.response.statusText}`;
    
    return Promise.reject(new Error(errorMessage));
  }
);

// Helper function for handling file uploads
export const uploadFile = async (url, file, onProgress) => {
  const formData = new FormData();
  formData.append('file', file);
  
  return apiClient.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted);
      }
    },
  });
};

// Helper function for downloading files
export const downloadFile = async (url, filename) => {
  const response = await apiClient.get(url, {
    responseType: 'blob',
  });
  
  const blob = new Blob([response.data]);
  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(downloadUrl);
};

export default apiClient;