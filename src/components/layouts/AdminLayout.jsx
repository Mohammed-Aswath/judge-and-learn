import React from 'react';
import { AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, Box, IconButton, Tooltip } from '@mui/material';
import { Dashboard, School, People, Assignment, Assessment, Settings, ExitToApp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../app/slices/authSlice';
import { ThemeToggle } from '../ui/theme-toggle';

const drawerWidth = 240;

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/admin/dashboard' },
    { text: 'Colleges', icon: <School />, path: '/admin/colleges' },
    { text: 'Users', icon: <People />, path: '/admin/users' },
    { text: 'Problems', icon: <Assignment />, path: '/admin/problems' },
    { text: 'Reports', icon: <Assessment />, path: '/admin/reports' },
    { text: 'Subscriptions', icon: <Settings />, path: '/admin/subscriptions' },
  ];

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
        }}
      >
        <Toolbar sx={{ gap: 2 }}>
          <Typography 
            variant="h6" 
            noWrap 
            component="div" 
            sx={{ 
              flexGrow: 1, 
              fontWeight: 600,
              background: 'linear-gradient(45deg, #ffffff, #e2e8f0)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            CodeJudge Admin Portal
          </Typography>
          <ThemeToggle />
          <Tooltip title="Logout">
            <IconButton 
              color="inherit" 
              onClick={handleLogout}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              <ExitToApp />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <List sx={{ px: 1 }}>
          {menuItems.map((item) => (
            <ListItem 
              button 
              key={item.text}
              onClick={() => navigate(item.path)}
              sx={{
                mb: 0.5,
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: (theme) => theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.08)' 
                    : 'rgba(0, 0, 0, 0.04)',
                  transform: 'translateX(4px)',
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              <ListItemIcon 
                sx={{ 
                  minWidth: 40,
                  color: (theme) => theme.palette.primary.main,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                sx={{
                  '& .MuiTypography-root': {
                    fontWeight: 500,
                  },
                }}
              />
            </ListItem>
          ))}
        </List>
      </Drawer>
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          p: 3,
          width: `calc(100% - ${drawerWidth}px)`,
          minHeight: '100vh',
          background: (theme) => theme.palette.mode === 'dark'
            ? 'radial-gradient(ellipse at top, rgba(37, 99, 235, 0.1) 0%, transparent 50%)'
            : 'radial-gradient(ellipse at top, rgba(37, 99, 235, 0.05) 0%, transparent 50%)',
        }}
      >
        <Toolbar />
        <Box sx={{ animation: 'fadeIn 0.5s ease-out' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;