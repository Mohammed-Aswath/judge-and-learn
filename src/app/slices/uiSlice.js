// UI State Redux Slice
import { createSlice } from '@reduxjs/toolkit';

// Initial state
const initialState = {
  // Theme and appearance
  theme: 'light', // 'light', 'dark', 'auto'
  sidebarOpen: true,
  sidebarCollapsed: false,
  
  // Navigation and routing
  currentPage: '',
  breadcrumbs: [],
  
  // Dialogs and modals
  modals: {
    profile: false,
    settings: false,
    help: false,
    problemDetails: false,
    submissionDetails: false,
    createProblem: false,
    editProblem: false,
    assignProblem: false,
    classManagement: false,
    userManagement: false,
  },
  
  // Notifications and alerts
  notifications: [],
  alerts: [],
  
  // Loading states for UI components
  loadingStates: {
    globalAction: false,
    exportData: false,
    importData: false,
    saveSettings: false,
  },
  
  // Editor preferences
  editorSettings: {
    theme: 'vs-dark',
    fontSize: 14,
    wordWrap: 'on',
    minimap: true,
    lineNumbers: 'on',
    autoSave: true,
    autoSaveDelay: 1000, // ms
  },
  
  // Table and list preferences
  tableSettings: {
    itemsPerPage: 20,
    defaultSort: 'createdAt',
    defaultOrder: 'desc',
  },
  
  // Dashboard layout preferences
  dashboardLayout: {
    admin: {
      widgets: ['kpis', 'charts', 'recent-activity'],
      chartsVisible: true,
      refreshInterval: 30000, // ms
    },
    professor: {
      widgets: ['class-overview', 'recent-submissions', 'leaderboard'],
      showNotifications: true,
      refreshInterval: 10000,
    },
    student: {
      widgets: ['progress', 'recommendations', 'recent-problems'],
      showAchievements: true,
      refreshInterval: 15000,
    },
  },
  
  // Form states
  forms: {
    hasUnsavedChanges: false,
    currentForm: null,
    validationErrors: {},
  },
  
  // Search and filter states
  search: {
    query: '',
    recentSearches: [],
    filters: {},
  },
  
  // Mobile and responsive states
  isMobile: false,
  isTablet: false,
  screenSize: 'desktop', // 'mobile', 'tablet', 'desktop'
  
  // Connection status
  connectionStatus: 'connected', // 'connected', 'disconnected', 'connecting'
  lastSyncTime: null,
};

// UI Slice
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Theme and appearance
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    
    toggleSidebarCollapsed: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    
    setSidebarCollapsed: (state, action) => {
      state.sidebarCollapsed = action.payload;
    },
    
    // Navigation
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    
    setBreadcrumbs: (state, action) => {
      state.breadcrumbs = action.payload;
    },
    
    // Modals
    openModal: (state, action) => {
      const modalName = action.payload;
      if (modalName in state.modals) {
        state.modals[modalName] = true;
      }
    },
    
    closeModal: (state, action) => {
      const modalName = action.payload;
      if (modalName in state.modals) {
        state.modals[modalName] = false;
      }
    },
    
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach(modal => {
        state.modals[modal] = false;
      });
    },
    
    // Notifications
    addNotification: (state, action) => {
      const notification = {
        id: Date.now() + Math.random(),
        timestamp: new Date().toISOString(),
        ...action.payload,
      };
      state.notifications.unshift(notification);
      
      // Keep only last 50 notifications
      if (state.notifications.length > 50) {
        state.notifications = state.notifications.slice(0, 50);
      }
    },
    
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },
    
    clearNotifications: (state) => {
      state.notifications = [];
    },
    
    markNotificationAsRead: (state, action) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    },
    
    // Alerts
    addAlert: (state, action) => {
      const alert = {
        id: Date.now() + Math.random(),
        timestamp: new Date().toISOString(),
        ...action.payload,
      };
      state.alerts.push(alert);
    },
    
    removeAlert: (state, action) => {
      state.alerts = state.alerts.filter(alert => alert.id !== action.payload);
    },
    
    clearAlerts: (state) => {
      state.alerts = [];
    },
    
    // Loading states
    setLoadingState: (state, action) => {
      const { key, value } = action.payload;
      if (key in state.loadingStates) {
        state.loadingStates[key] = value;
      }
    },
    
    // Editor settings
    updateEditorSettings: (state, action) => {
      state.editorSettings = { ...state.editorSettings, ...action.payload };
    },
    
    // Table settings
    updateTableSettings: (state, action) => {
      state.tableSettings = { ...state.tableSettings, ...action.payload };
    },
    
    // Dashboard layout
    updateDashboardLayout: (state, action) => {
      const { role, updates } = action.payload;
      if (role in state.dashboardLayout) {
        state.dashboardLayout[role] = { ...state.dashboardLayout[role], ...updates };
      }
    },
    
    // Form states
    setFormState: (state, action) => {
      state.forms = { ...state.forms, ...action.payload };
    },
    
    clearFormState: (state) => {
      state.forms = initialState.forms;
    },
    
    // Search
    setSearchQuery: (state, action) => {
      state.search.query = action.payload;
    },
    
    addRecentSearch: (state, action) => {
      const query = action.payload;
      if (query && !state.search.recentSearches.includes(query)) {
        state.search.recentSearches.unshift(query);
        // Keep only last 10 searches
        if (state.search.recentSearches.length > 10) {
          state.search.recentSearches = state.search.recentSearches.slice(0, 10);
        }
      }
    },
    
    clearRecentSearches: (state) => {
      state.search.recentSearches = [];
    },
    
    setSearchFilters: (state, action) => {
      state.search.filters = { ...state.search.filters, ...action.payload };
    },
    
    // Responsive design
    setScreenSize: (state, action) => {
      const screenSize = action.payload;
      state.screenSize = screenSize;
      state.isMobile = screenSize === 'mobile';
      state.isTablet = screenSize === 'tablet';
      
      // Auto-collapse sidebar on mobile
      if (screenSize === 'mobile') {
        state.sidebarOpen = false;
      }
    },
    
    // Connection status
    setConnectionStatus: (state, action) => {
      state.connectionStatus = action.payload;
      if (action.payload === 'connected') {
        state.lastSyncTime = new Date().toISOString();
      }
    },
  },
});

export const {
  setTheme,
  toggleSidebar,
  setSidebarOpen,
  toggleSidebarCollapsed,
  setSidebarCollapsed,
  setCurrentPage,
  setBreadcrumbs,
  openModal,
  closeModal,
  closeAllModals,
  addNotification,
  removeNotification,
  clearNotifications,
  markNotificationAsRead,
  addAlert,
  removeAlert,
  clearAlerts,
  setLoadingState,
  updateEditorSettings,
  updateTableSettings,
  updateDashboardLayout,
  setFormState,
  clearFormState,
  setSearchQuery,
  addRecentSearch,
  clearRecentSearches,
  setSearchFilters,
  setScreenSize,
  setConnectionStatus,
} = uiSlice.actions;

// Selectors
export const selectTheme = (state) => state.ui.theme;
export const selectSidebarState = (state) => ({
  open: state.ui.sidebarOpen,
  collapsed: state.ui.sidebarCollapsed,
});
export const selectCurrentPage = (state) => state.ui.currentPage;
export const selectBreadcrumbs = (state) => state.ui.breadcrumbs;
export const selectModals = (state) => state.ui.modals;
export const selectNotifications = (state) => state.ui.notifications;
export const selectUnreadNotifications = (state) => 
  state.ui.notifications.filter(n => !n.read);
export const selectAlerts = (state) => state.ui.alerts;
export const selectLoadingStates = (state) => state.ui.loadingStates;
export const selectEditorSettings = (state) => state.ui.editorSettings;
export const selectTableSettings = (state) => state.ui.tableSettings;
export const selectDashboardLayout = (state) => state.ui.dashboardLayout;
export const selectFormState = (state) => state.ui.forms;
export const selectSearchState = (state) => state.ui.search;
export const selectResponsiveState = (state) => ({
  isMobile: state.ui.isMobile,
  isTablet: state.ui.isTablet,
  screenSize: state.ui.screenSize,
});
export const selectConnectionStatus = (state) => state.ui.connectionStatus;

export default uiSlice.reducer;
