// Student Layout Component
import React from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Tooltip,
} from '@mui/material';
import {
  AccountCircle,
  LogoutOutlined,
  DashboardOutlined,
  CodeOutlined,
  HistoryOutlined,
  TrendingUpOutlined,
  EmojiEventsOutlined,
  RecommendOutlined,
  MenuOutlined,
} from '@mui/icons-material';
import { ThemeToggle } from '../ui/theme-toggle';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { logoutUser } from '../../app/slices/authSlice';
import { selectUser } from '../../app/slices/authSlice';

const StudentLayout = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(selectUser);
  
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login');
  };
  
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  const menuItems = [
    { text: 'Dashboard', icon: <DashboardOutlined />, path: '/student/dashboard' },
    { text: 'Problems', icon: <CodeOutlined />, path: '/student/problems' },
    { text: 'Submissions', icon: <HistoryOutlined />, path: '/student/submissions' },
    { text: 'Progress', icon: <TrendingUpOutlined />, path: '/student/progress' },
    { text: 'Leaderboard', icon: <EmojiEventsOutlined />, path: '/student/leaderboard' },
    { text: 'Recommendations', icon: <RecommendOutlined />, path: '/student/recommendations' },
  ];
  
  const drawer = (
    <Box>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          CodeJudge
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => navigate(item.path)}
            selected={location.pathname === item.path}
            sx={{
              mb: 0.5,
              mx: 1,
              borderRadius: 2,
              '&:hover': {
                backgroundColor: (theme) => theme.palette.mode === 'dark' 
                  ? 'rgba(255, 255, 255, 0.08)' 
                  : 'rgba(0, 0, 0, 0.04)',
                transform: 'translateX(4px)',
              },
              '&.Mui-selected': {
                backgroundColor: (theme) => theme.palette.primary.main + '20',
                '&:hover': {
                  backgroundColor: (theme) => theme.palette.primary.main + '30',
                },
              },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <ListItemIcon 
              sx={{ 
                minWidth: 40,
                color: (theme) => location.pathname === item.path 
                  ? theme.palette.primary.main 
                  : 'inherit',
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text}
              sx={{
                '& .MuiTypography-root': {
                  fontWeight: location.pathname === item.path ? 600 : 500,
                },
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
  
  return (
    <Box sx={{ display: 'flex' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: 'linear-gradient(135deg, hsl(216, 100%, 50%) 0%, hsl(291, 64%, 42%) 100%)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuOutlined />
          </IconButton>
          
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
            Student Portal
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {user?.name || 'Student'}
            </Typography>
            <ThemeToggle />
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenuOpen}
              color="inherit"
            >
              <Avatar sx={{ width: 32, height: 32 }}>
                <AccountCircle />
              </Avatar>
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={() => { navigate('/student/profile'); handleMenuClose(); }}>
                <AccountCircle sx={{ mr: 1 }} />
                Profile
              </MenuItem>
              <MenuItem onClick={() => { handleLogout(); handleMenuClose(); }}>
                <LogoutOutlined sx={{ mr: 1 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawer}
      </Drawer>
      
      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawer}
      </Drawer>
      
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 0,
          width: { sm: `calc(100% - 240px)` },
          minHeight: '100vh',
          bgcolor: 'background.default',
          background: (theme) => theme.palette.mode === 'dark'
            ? 'radial-gradient(ellipse at top, rgba(37, 99, 235, 0.1) 0%, transparent 50%)'
            : 'radial-gradient(ellipse at top, rgba(37, 99, 235, 0.05) 0%, transparent 50%)',
        }}
      >
        <Toolbar />
        <Box sx={{ animation: 'fadeIn 0.5s ease-out', p: 3 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default StudentLayout;