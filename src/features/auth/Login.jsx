// Login Component
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Container,
  Card,
  CardContent,
  Divider,
  Chip,
  Stack
} from '@mui/material';
import { LoginOutlined, PersonOutline, SchoolOutlined, AdminPanelSettingsOutlined } from '@mui/icons-material';
import { loginUser, clearError, selectAuth } from '../../app/slices/authSlice';
import config from '../../config/clientConfig';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, error, isAuthenticated } = useSelector(selectAuth);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [selectedRole, setSelectedRole] = useState('student');
  
  // Demo credentials for easy access
  const demoCredentials = [
    {
      role: 'admin',
      email: 'admin@test.com',
      password: 'admin123',
      icon: <AdminPanelSettingsOutlined />,
      title: 'System Administrator',
      description: 'Full platform management access'
    },
    {
      role: 'professor',
      email: 'prof@test.com',
      password: 'prof123',
      icon: <SchoolOutlined />,
      title: 'Professor',
      description: 'Class and student management'
    },
    {
      role: 'student',
      email: 'student@test.com',
      password: 'student123',
      icon: <PersonOutline />,
      title: 'Student',
      description: 'Practice and track progress'
    }
  ];
  
  useEffect(() => {
    // Clear any previous errors when component mounts
    dispatch(clearError());
  }, [dispatch]);
  
  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location.state]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      return;
    }
    
    try {
      await dispatch(loginUser({
        email: formData.email.trim(),
        password: formData.password
      })).unwrap();
      
      // Navigation will be handled by the useEffect above
    } catch (err) {
      // Error is handled by Redux state
      console.error('Login failed:', err);
    }
  };
  
  const handleDemoLogin = (credentials) => {
    setFormData({
      email: credentials.email,
      password: credentials.password
    });
    
    // Auto-submit after setting credentials
    setTimeout(() => {
      dispatch(loginUser({
        email: credentials.email,
        password: credentials.password
      }));
    }, 100);
  };
  
  const handleRoleChange = (role) => {
    setSelectedRole(role);
    const credentials = demoCredentials.find(cred => cred.role === role);
    if (credentials) {
      setFormData({
        email: credentials.email,
        password: credentials.password
      });
    }
  };
  
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, hsl(216, 100%, 50%) 0%, hsl(291, 64%, 42%) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h2"
            component="h1"
            sx={{
              color: 'white',
              fontWeight: 'bold',
              mb: 2,
              textShadow: '0 2px 10px rgba(0,0,0,0.3)',
            }}
          >
            CodeJudge Platform
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: 'white',
              opacity: 0.9,
              mb: 4,
            }}
          >
            Practice, Learn, and Excel in Programming
          </Typography>
        </Box>
        
        <Paper
          elevation={24}
          sx={{
            p: 4,
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            maxWidth: 500,
            margin: '0 auto',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <LoginOutlined sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" component="h2" gutterBottom>
              Sign In
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Use demo credentials below or enter your own
            </Typography>
          </Box>
          
          {/* Demo Credentials Section */}
          <Card sx={{ mb: 3, border: '2px solid', borderColor: 'primary.light' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary.main">
                Demo Accounts
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Click any role to auto-fill credentials:
              </Typography>
              
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {demoCredentials.map((cred) => (
                  <Chip
                    key={cred.role}
                    icon={cred.icon}
                    label={cred.title}
                    onClick={() => handleRoleChange(cred.role)}
                    color={selectedRole === cred.role ? 'primary' : 'default'}
                    variant={selectedRole === cred.role ? 'filled' : 'outlined'}
                    sx={{ 
                      mb: 1,
                      '&:hover': { 
                        transform: 'translateY(-2px)',
                        boxShadow: 2,
                      },
                      transition: 'all 0.2s ease',
                    }}
                  />
                ))}
              </Stack>
              
              {selectedRole && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    {demoCredentials.find(c => c.role === selectedRole)?.description}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
          
          <Divider sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary">
              OR ENTER MANUALLY
            </Typography>
          </Divider>
          
          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              margin="normal"
              required
              autoComplete="email"
              variant="outlined"
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              margin="normal"
              required
              autoComplete="current-password"
              variant="outlined"
              sx={{ mb: 3 }}
            />
            
            {error && (
              <Alert 
                severity="error" 
                sx={{ mb: 2 }}
                onClose={() => dispatch(clearError())}
              >
                {error}
              </Alert>
            )}
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading || !formData.email || !formData.password}
              sx={{
                py: 1.5,
                mb: 2,
                background: 'linear-gradient(135deg, hsl(216, 100%, 50%), hsl(216, 100%, 40%))',
                '&:hover': {
                  background: 'linear-gradient(135deg, hsl(216, 100%, 40%), hsl(216, 100%, 30%))',
                  transform: 'translateY(-2px)',
                  boxShadow: 4,
                },
                transition: 'all 0.2s ease',
              }}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
          
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Demo Mode - Production ready authentication can be integrated
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;