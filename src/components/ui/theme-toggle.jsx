import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { LightMode, DarkMode } from '@mui/icons-material';
import { useTheme } from '../ThemeProvider';

export const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <Tooltip title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
      <IconButton 
        onClick={toggleTheme} 
        color="inherit"
        sx={{
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'rotate(180deg)',
          },
        }}
      >
        {isDark ? <LightMode /> : <DarkMode />}
      </IconButton>
    </Tooltip>
  );
};