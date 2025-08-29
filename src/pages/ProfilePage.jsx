// Basic Profile Page for all user roles
import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  TextField,
  Grid,
  Chip,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { selectUser } from '../app/slices/authSlice';
import { AccountCircle, EditOutlined } from '@mui/icons-material';

const ProfilePage = () => {
  const user = useSelector(selectUser);
  
  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'error';
      case 'professor':
        return 'warning';
      case 'student':
        return 'success';
      default:
        return 'default';
    }
  };
  
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>
      
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar sx={{ width: 80, height: 80, mr: 3 }}>
              <AccountCircle sx={{ fontSize: 60 }} />
            </Avatar>
            <Box>
              <Typography variant="h5" gutterBottom>
                {user?.name || 'User'}
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                {user?.email}
              </Typography>
              <Chip
                label={user?.role?.toUpperCase()}
                color={getRoleColor(user?.role)}
                size="small"
              />
            </Box>
          </Box>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Full Name"
                value={user?.name || ''}
                margin="normal"
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                value={user?.email || ''}
                margin="normal"
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Role"
                value={user?.role?.toUpperCase() || ''}
                margin="normal"
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Last Login"
                value={user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'N/A'}
                margin="normal"
                InputProps={{ readOnly: true }}
              />
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<EditOutlined />}
              disabled
            >
              Edit Profile (Demo)
            </Button>
            <Button variant="outlined" disabled>
              Change Password (Demo)
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProfilePage;