// Authentication Service
import apiClient from './apiClient';
import config from '../config/clientConfig';
import { sampleUsers } from '../utils/sampleData';

class AuthService {
  // Login user with email and password
  async login(email, password) {
    try {
      if (config.USE_MOCK_DATA) {
        // Demo mode: use hardcoded credentials
        const credentials = Object.values(config.DEMO_CREDENTIALS).find(
          cred => cred.email === email && cred.password === password
        );
        
        if (!credentials) {
          throw new Error('Invalid email or password');
        }
        
        // Find the corresponding user in sample data
        const user = sampleUsers.find(u => u.email === email);
        if (!user) {
          throw new Error('User not found');
        }
        
        // Generate mock JWT token
        const mockToken = this.generateMockToken(user);
        const mockRefreshToken = this.generateMockRefreshToken(user);
        
        return {
          token: mockToken,
          refreshToken: mockRefreshToken,
          user: {
            ...user,
            lastLogin: new Date().toISOString(),
          },
        };
      } else {
        // Real API call
        const response = await apiClient.post('/auth/login', {
          email,
          password,
        });
        
        return response.data;
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }
  
  // Logout user
  async logout() {
    try {
      if (!config.USE_MOCK_DATA) {
        // Call real logout endpoint to invalidate server-side session
        await apiClient.post('/auth/logout');
      }
      
      // Clear local storage regardless of API call result
      localStorage.removeItem(config.TOKEN_STORAGE_KEY);
      localStorage.removeItem('codeJudgeRefreshToken');
      localStorage.removeItem(config.USER_STORAGE_KEY);
      
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local storage even if API call fails
      localStorage.removeItem(config.TOKEN_STORAGE_KEY);
      localStorage.removeItem('codeJudgeRefreshToken');
      localStorage.removeItem(config.USER_STORAGE_KEY);
      return true;
    }
  }
  
  // Refresh authentication token
  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('codeJudgeRefreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      if (config.USE_MOCK_DATA) {
        // Mock refresh token validation
        const payload = this.decodeMockToken(refreshToken);
        if (!payload || payload.type !== 'refresh') {
          throw new Error('Invalid refresh token');
        }
        
        const user = sampleUsers.find(u => u.id === payload.userId);
        if (!user) {
          throw new Error('User not found');
        }
        
        const newToken = this.generateMockToken(user);
        const newRefreshToken = this.generateMockRefreshToken(user);
        
        return {
          token: newToken,
          refreshToken: newRefreshToken,
          user,
        };
      } else {
        // Real API call
        const response = await apiClient.post('/auth/refresh', {
          refreshToken,
        });
        
        return response.data;
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }
  
  // Register new user (for future implementation)
  async register(userData) {
    try {
      if (config.USE_MOCK_DATA) {
        // Mock registration
        throw new Error('Registration not available in demo mode');
      } else {
        const response = await apiClient.post('/auth/register', userData);
        return response.data;
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }
  
  // Request password reset
  async requestPasswordReset(email) {
    try {
      if (config.USE_MOCK_DATA) {
        // Mock password reset
        const user = sampleUsers.find(u => u.email === email);
        if (!user) {
          throw new Error('User not found');
        }
        return { message: 'Password reset email sent (mock)' };
      } else {
        const response = await apiClient.post('/auth/forgot-password', { email });
        return response.data;
      }
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  }
  
  // Reset password with token
  async resetPassword(token, newPassword) {
    try {
      if (config.USE_MOCK_DATA) {
        throw new Error('Password reset not available in demo mode');
      } else {
        const response = await apiClient.post('/auth/reset-password', {
          token,
          password: newPassword,
        });
        return response.data;
      }
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  }
  
  // Verify token validity
  async verifyToken(token) {
    try {
      if (config.USE_MOCK_DATA) {
        const payload = this.decodeMockToken(token);
        return payload !== null;
      } else {
        const response = await apiClient.post('/auth/verify-token', { token });
        return response.data.valid;
      }
    } catch (error) {
      console.error('Token verification error:', error);
      return false;
    }
  }
  
  // Get current user profile
  async getCurrentUser() {
    try {
      if (config.USE_MOCK_DATA) {
        const userStr = localStorage.getItem(config.USER_STORAGE_KEY);
        if (userStr) {
          return JSON.parse(userStr);
        }
        throw new Error('No user logged in');
      } else {
        const response = await apiClient.get('/auth/me');
        return response.data;
      }
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  }
  
  // Update user profile
  async updateProfile(updates) {
    try {
      if (config.USE_MOCK_DATA) {
        const userStr = localStorage.getItem(config.USER_STORAGE_KEY);
        if (userStr) {
          const user = JSON.parse(userStr);
          const updatedUser = { ...user, ...updates };
          localStorage.setItem(config.USER_STORAGE_KEY, JSON.stringify(updatedUser));
          return updatedUser;
        }
        throw new Error('No user logged in');
      } else {
        const response = await apiClient.patch('/auth/profile', updates);
        return response.data;
      }
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }
  
  // Helper methods for mock tokens (demo mode)
  generateMockToken(user) {
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      type: 'access',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 hour
    };
    
    // In real implementation, this would be a proper JWT
    return 'mock_token_' + btoa(JSON.stringify(payload));
  }
  
  generateMockRefreshToken(user) {
    const payload = {
      userId: user.id,
      type: 'refresh',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60), // 7 days
    };
    
    return 'mock_refresh_' + btoa(JSON.stringify(payload));
  }
  
  decodeMockToken(token) {
    try {
      if (token.startsWith('mock_token_')) {
        const encoded = token.replace('mock_token_', '');
        return JSON.parse(atob(encoded));
      } else if (token.startsWith('mock_refresh_')) {
        const encoded = token.replace('mock_refresh_', '');
        return JSON.parse(atob(encoded));
      }
      return null;
    } catch (error) {
      return null;
    }
  }
  
  // Check if user has permission for action
  hasPermission(user, action, resource) {
    if (!user) return false;
    
    const permissions = {
      admin: ['*'], // Admin has all permissions
      professor: [
        'problems.create',
        'problems.edit',
        'problems.assign',
        'classes.manage',
        'students.view',
        'submissions.view',
        'leaderboard.view',
      ],
      student: [
        'problems.view',
        'problems.submit',
        'submissions.view_own',
        'leaderboard.view',
        'profile.edit',
      ],
    };
    
    const userPermissions = permissions[user.role] || [];
    return userPermissions.includes('*') || userPermissions.includes(`${resource}.${action}`);
  }
}

export const authService = new AuthService();
export default authService;