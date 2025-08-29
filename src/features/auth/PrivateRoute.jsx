// Private Route Component - Protects routes that require authentication
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { selectIsAuthenticated, selectUserRole } from '../../app/slices/authSlice';
import { Box, CircularProgress, Typography } from '@mui/material';

const PrivateRoute = ({ children, requiredRole = null, requiredPermissions = [] }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userRole = useSelector(selectUserRole);
  const location = useLocation();
  
  // Show loading state if authentication status is being determined
  if (isAuthenticated === null) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: 2,
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          Verifying authentication...
        </Typography>
      </Box>
    );
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <Navigate 
        to="/login" 
        state={{ from: location }} 
        replace 
      />
    );
  }
  
  // Check role-based access if required
  if (requiredRole && userRole !== requiredRole) {
    // If user doesn't have the required role, redirect to their appropriate dashboard
    const redirectPath = getRoleBasedRedirect(userRole);
    return (
      <Navigate 
        to={redirectPath} 
        replace 
      />
    );
  }
  
  // Check permission-based access if required
  if (requiredPermissions.length > 0 && !hasRequiredPermissions(userRole, requiredPermissions)) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '50vh',
          gap: 2,
          p: 4,
        }}
      >
        <Typography variant="h4" color="error" gutterBottom>
          Access Denied
        </Typography>
        <Typography variant="body1" color="text.secondary" textAlign="center">
          You don't have permission to access this resource.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Required permissions: {requiredPermissions.join(', ')}
        </Typography>
      </Box>
    );
  }
  
  // Render the protected component
  return children;
};

// Helper function to get role-based redirect path
const getRoleBasedRedirect = (role) => {
  switch (role) {
    case 'admin':
      return '/admin/dashboard';
    case 'professor':
      return '/professor/dashboard';
    case 'student':
      return '/student/dashboard';
    default:
      return '/dashboard';
  }
};

// Helper function to check permissions
const hasRequiredPermissions = (userRole, requiredPermissions) => {
  // Define role-based permissions
  const rolePermissions = {
    admin: [
      'admin.all',
      'colleges.manage',
      'users.manage',
      'problems.manage',
      'reports.view',
      'system.configure',
    ],
    professor: [
      'classes.manage',
      'students.view',
      'problems.create',
      'problems.assign',
      'submissions.view',
      'leaderboard.view',
      'assignments.manage',
    ],
    student: [
      'problems.view',
      'problems.submit',
      'submissions.view_own',
      'leaderboard.view',
      'profile.edit',
      'progress.view',
    ],
  };
  
  const userPermissions = rolePermissions[userRole] || [];
  
  // Admin has all permissions
  if (userPermissions.includes('admin.all')) {
    return true;
  }
  
  // Check if user has at least one of the required permissions
  return requiredPermissions.some(permission => 
    userPermissions.includes(permission)
  );
};

// HOC for role-based route protection
export const withRoleGuard = (Component, requiredRole) => {
  return (props) => (
    <PrivateRoute requiredRole={requiredRole}>
      <Component {...props} />
    </PrivateRoute>
  );
};

// HOC for permission-based route protection
export const withPermissionGuard = (Component, requiredPermissions) => {
  return (props) => (
    <PrivateRoute requiredPermissions={requiredPermissions}>
      <Component {...props} />
    </PrivateRoute>
  );
};

export default PrivateRoute;