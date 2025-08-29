import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { store } from './app/store';
import AppRouter from './app/AppRouter';

const queryClient = new QueryClient();

// Material-UI theme configuration
const theme = createTheme({
  palette: {
    primary: {
      main: 'hsl(216, 100%, 50%)',
      dark: 'hsl(216, 100%, 40%)',
      light: 'hsl(216, 100%, 70%)',
    },
    secondary: {
      main: 'hsl(291, 64%, 42%)',
    },
    success: {
      main: 'hsl(142, 72%, 29%)',
    },
    warning: {
      main: 'hsl(38, 92%, 50%)',
    },
    error: {
      main: 'hsl(0, 84%, 60%)',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
});

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
