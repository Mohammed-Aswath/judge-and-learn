// Main Application Router
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectUserRole } from './slices/authSlice';

// Authentication Components
import Login from '../features/auth/Login';
import PrivateRoute from '../features/auth/PrivateRoute';

// Layout Components
import AdminLayout from '../components/layouts/AdminLayout';
import ProfessorLayout from '../components/layouts/ProfessorLayout';
import StudentLayout from '../components/layouts/StudentLayout';

// Admin Pages
import AdminDashboard from '../features/admin/AdminDashboard';
import CollegeManagement from '../features/admin/CollegeManagement';
import UserManagement from '../features/admin/UserManagement';
import ProblemSetManagement from '../features/admin/ProblemSetManagement';
import UsageReports from '../features/admin/UsageReports';
import SubscriptionControl from '../features/admin/SubscriptionControl';

// Professor Pages
import ProfessorDashboard from '../features/professor/ProfessorDashboard';
import ClassManagement from '../features/professor/ClassManagement';
import StudentProgress from '../features/professor/StudentProgress';
import AssignProblem from '../features/professor/AssignProblem';
import ProfessorLeaderboard from '../features/professor/ProfessorLeaderboard';
import CustomProblemCreation from '../features/professor/CustomProblemCreation';
import Communication from '../features/professor/Communication';

// Student Pages
import StudentDashboard from '../features/student/StudentDashboard';
import ProblemPage from '../features/student/ProblemPage';
import StudentSubmissions from '../features/student/StudentSubmissions';
import StudentHistory from '../features/student/StudentHistory';
import StudentRecommendations from '../features/student/StudentRecommendations';
import StudentProgressPage from '../features/student/StudentProgress';
import StudentLeaderboard from '../features/student/StudentLeaderboard';

// Shared Pages
import ProfilePage from '../pages/ProfilePage';
import NotFound from '../pages/NotFound';

const AppRouter = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userRole = useSelector(selectUserRole);
  
  // Helper function to get role-based dashboard redirect
  const getDashboardRedirect = () => {
    if (!isAuthenticated) return '/login';
    
    switch (userRole) {
      case 'admin':
        return '/admin/dashboard';
      case 'professor':
        return '/professor/dashboard';
      case 'student':
        return '/student/dashboard';
      default:
        return '/login';
    }
  };
  
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      
      {/* Root redirect */}
      <Route 
        path="/" 
        element={<Navigate to={getDashboardRedirect()} replace />} 
      />
      
      {/* Dashboard redirect */}
      <Route 
        path="/dashboard" 
        element={<Navigate to={getDashboardRedirect()} replace />} 
      />
      
      {/* Admin Routes */}
      <Route 
        path="/admin/*" 
        element={
          <PrivateRoute requiredRole="admin">
            <AdminLayout>
              <Routes>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="colleges" element={<CollegeManagement />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="problems" element={<ProblemSetManagement />} />
                <Route path="reports" element={<UsageReports />} />
                <Route path="subscriptions" element={<SubscriptionControl />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="" element={<Navigate to="dashboard" replace />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AdminLayout>
          </PrivateRoute>
        } 
      />
      
      {/* Professor Routes */}
      <Route 
        path="/professor/*" 
        element={
          <PrivateRoute requiredRole="professor">
            <ProfessorLayout>
              <Routes>
                <Route path="dashboard" element={<ProfessorDashboard />} />
                <Route path="classes" element={<ClassManagement />} />
                <Route path="students" element={<StudentProgress />} />
                <Route path="assign" element={<AssignProblem />} />
                <Route path="leaderboard" element={<ProfessorLeaderboard />} />
                <Route path="create-problem" element={<CustomProblemCreation />} />
                <Route path="communication" element={<Communication />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="" element={<Navigate to="dashboard" replace />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </ProfessorLayout>
          </PrivateRoute>
        } 
      />
      
      {/* Student Routes */}
      <Route 
        path="/student/*" 
        element={
          <PrivateRoute requiredRole="student">
            <StudentLayout>
              <Routes>
                <Route path="dashboard" element={<StudentDashboard />} />
                <Route path="problems" element={<ProblemPage />} />
                <Route path="problems/:problemId" element={<ProblemPage />} />
                <Route path="submissions" element={<StudentSubmissions />} />
                <Route path="history" element={<StudentHistory />} />
                <Route path="recommendations" element={<StudentRecommendations />} />
                <Route path="progress" element={<StudentProgressPage />} />
                <Route path="leaderboard" element={<StudentLeaderboard />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="" element={<Navigate to="dashboard" replace />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </StudentLayout>
          </PrivateRoute>
        } 
      />
      
      {/* Profile Route (accessible by all authenticated users) */}
      <Route 
        path="/profile" 
        element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        } 
      />
      
      {/* Catch-all route for 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;