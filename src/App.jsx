import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { store } from './app/store';
import AppRouter from './app/AppRouter';
import { ThemeProvider } from './components/ThemeProvider';

const queryClient = new QueryClient();

// Enhanced Material-UI theme configuration
const getTheme = (isDark) => createTheme({
  palette: {
    mode: isDark ? 'dark' : 'light',
    primary: {
      main: '#2563eb',
      dark: '#1d4ed8',
      light: '#60a5fa',
    },
    secondary: {
      main: '#7c3aed',
      dark: '#6d28d9',
      light: '#a78bfa',
    },
    success: {
      main: '#059669',
      dark: '#047857',
      light: '#34d399',
    },
    warning: {
      main: '#d97706',
      dark: '#b45309',
      light: '#fbbf24',
    },
    error: {
      main: '#dc2626',
      dark: '#b91c1c',
      light: '#f87171',
    },
    background: {
      default: isDark ? '#0f172a' : '#ffffff',
      paper: isDark ? '#1e293b' : '#ffffff',
    },
    text: {
      primary: isDark ? '#f8fafc' : '#334155',
      secondary: isDark ? '#cbd5e1' : '#64748b',
    },
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: { fontWeight: 700 },
    h2: { fontWeight: 600 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 500 },
    h6: { fontWeight: 500 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: isDark 
            ? '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)' 
            : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.05)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: isDark 
              ? '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)' 
              : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: isDark 
            ? 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)' 
            : 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: isDark ? '#1e293b' : '#ffffff',
          borderRight: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.05)',
          boxShadow: isDark 
            ? '4px 0 6px -1px rgba(0, 0, 0, 0.3)' 
            : '4px 0 6px -1px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          margin: '4px 8px',
          borderRadius: '8px',
          '&:hover': {
            background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: '8px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-1px)',
          },
        },
      },
    },
  },
});

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        {({ isDark }) => (
          <MuiThemeProvider theme={getTheme(isDark)}>
            <CssBaseline />
            <BrowserRouter>
              <AppRouter />
            </BrowserRouter>
          </MuiThemeProvider>
        )}
      </ThemeProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
