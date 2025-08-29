// Client Configuration - Environment-based settings
export const config = {
  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  WS_URL: import.meta.env.VITE_WS_URL || 'ws://localhost:5000',
  
  // Judge API Configuration
  JUDGE_API_URL: import.meta.env.VITE_JUDGE_API_URL || 'http://localhost:5000/api/judge',
  
  // ML Service Configuration
  ML_API_URL: import.meta.env.VITE_ML_API_URL || 'http://localhost:5000/api/ml',
  HUGGINGFACE_MODEL_URL: import.meta.env.VITE_HUGGINGFACE_MODEL_URL || '',
  
  // Feature Flags
  USE_MOCK_DATA: import.meta.env.VITE_USE_MOCK_DATA !== 'false',
  ENABLE_WEBSOCKETS: import.meta.env.VITE_ENABLE_WEBSOCKETS !== 'false',
  ENABLE_ML_RECOMMENDATIONS: import.meta.env.VITE_ENABLE_ML_RECOMMENDATIONS !== 'false',
  
  // Application Settings
  APP_NAME: 'CodeJudge Platform',
  APP_VERSION: '1.0.0',
  
  // Code Editor Settings
  EDITOR_THEMES: {
    light: 'vs',
    dark: 'vs-dark'
  },
  SUPPORTED_LANGUAGES: [
    { value: 'python', label: 'Python', extension: '.py' },
    { value: 'cpp', label: 'C++', extension: '.cpp' },
    { value: 'java', label: 'Java', extension: '.java' },
    { value: 'javascript', label: 'JavaScript', extension: '.js' },
    { value: 'c', label: 'C', extension: '.c' }
  ],
  
  // Submission Limits
  MAX_CODE_LENGTH: 50000,
  DEFAULT_TIME_LIMIT: 2000, // ms
  DEFAULT_MEMORY_LIMIT: 256, // MB
  
  // UI Settings
  ITEMS_PER_PAGE: 20,
  MAX_CHART_POINTS: 100,
  
  // Authentication
  TOKEN_STORAGE_KEY: 'codeJudgeToken',
  USER_STORAGE_KEY: 'codeJudgeUser',
  TOKEN_REFRESH_THRESHOLD: 5 * 60 * 1000, // 5 minutes
  
  // Demo Credentials
  DEMO_CREDENTIALS: {
    admin: { email: 'admin@test.com', password: 'admin123' },
    professor: { email: 'prof@test.com', password: 'prof123' },
    student: { email: 'student@test.com', password: 'student123' }
  }
};

export default config;