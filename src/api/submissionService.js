// Submission Management Service
import apiClient from './apiClient';
import config from '../config/clientConfig';
import { sampleSubmissions } from '../utils/sampleData';

class SubmissionService {
  // Submit code for evaluation
  async submitCode({ userId, problemId, language, sourceCode, timeLimitMs, memoryLimitMb }) {
    try {
      if (config.USE_MOCK_DATA) {
        // Mock submission creation
        const submissionId = 'sub_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        
        const submission = {
          id: submissionId,
          userId,
          problemId,
          language,
          code: sourceCode,
          status: 'queued',
          results: [],
          totalPassed: 0,
          totalTests: 0,
          score: 0,
          executionTimeMs: 0,
          memoryUsageKb: 0,
          compileOutput: '',
          createdAt: new Date().toISOString(),
        };
        
        // Add to sample data
        sampleSubmissions.unshift(submission);
        
        // Simulate async processing
        setTimeout(() => {
          this.mockProcessSubmission(submissionId, sourceCode, problemId);
        }, 2000);
        
        return submission;
      } else {
        const response = await apiClient.post('/judge/submit', {
          userId,
          problemId,
          language,
          sourceCode,
          timeLimitMs: timeLimitMs || config.DEFAULT_TIME_LIMIT,
          memoryLimitMb: memoryLimitMb || config.DEFAULT_MEMORY_LIMIT,
        });
        
        return response.data;
      }
    } catch (error) {
      console.error('Submit code error:', error);
      throw error;
    }
  }
  
  // Get submissions with filtering and pagination
  async getSubmissions({ 
    userId = '', 
    problemId = '', 
    language = '', 
    status = '', 
    page = 1, 
    limit = 20,
    dateFrom = null,
    dateTo = null 
  } = {}) {
    try {
      if (config.USE_MOCK_DATA) {
        let filteredSubmissions = [...sampleSubmissions];
        
        // Apply filters
        if (userId) {
          filteredSubmissions = filteredSubmissions.filter(s => s.userId === userId);
        }
        
        if (problemId) {
          filteredSubmissions = filteredSubmissions.filter(s => s.problemId === problemId);
        }
        
        if (language) {
          filteredSubmissions = filteredSubmissions.filter(s => s.language === language);
        }
        
        if (status) {
          filteredSubmissions = filteredSubmissions.filter(s => s.status === status);
        }
        
        if (dateFrom) {
          filteredSubmissions = filteredSubmissions.filter(s => 
            new Date(s.createdAt) >= new Date(dateFrom)
          );
        }
        
        if (dateTo) {
          filteredSubmissions = filteredSubmissions.filter(s => 
            new Date(s.createdAt) <= new Date(dateTo)
          );
        }
        
        // Sort by creation date (newest first)
        filteredSubmissions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        // Apply pagination
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedSubmissions = filteredSubmissions.slice(startIndex, endIndex);
        
        return {
          submissions: paginatedSubmissions,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(filteredSubmissions.length / limit),
            totalItems: filteredSubmissions.length,
            itemsPerPage: limit,
          },
        };
      } else {
        const params = new URLSearchParams();
        if (userId) params.append('userId', userId);
        if (problemId) params.append('problemId', problemId);
        if (language) params.append('language', language);
        if (status) params.append('status', status);
        if (page) params.append('page', page);
        if (limit) params.append('limit', limit);
        if (dateFrom) params.append('dateFrom', dateFrom);
        if (dateTo) params.append('dateTo', dateTo);
        
        const response = await apiClient.get(`/submissions?${params.toString()}`);
        return response.data;
      }
    } catch (error) {
      console.error('Get submissions error:', error);
      throw error;
    }
  }
  
  // Get a specific submission by ID
  async getSubmissionById(submissionId) {
    try {
      if (config.USE_MOCK_DATA) {
        const submission = sampleSubmissions.find(s => s.id === submissionId);
        if (!submission) {
          throw new Error('Submission not found');
        }
        return submission;
      } else {
        const response = await apiClient.get(`/submissions/${submissionId}`);
        return response.data;
      }
    } catch (error) {
      console.error('Get submission by ID error:', error);
      throw error;
    }
  }
  
  // Get submission status (for polling)
  async getSubmissionStatus(submissionId) {
    try {
      if (config.USE_MOCK_DATA) {
        const submission = sampleSubmissions.find(s => s.id === submissionId);
        if (!submission) {
          throw new Error('Submission not found');
        }
        return {
          id: submission.id,
          status: submission.status,
          results: submission.results,
          totalPassed: submission.totalPassed,
          totalTests: submission.totalTests,
          score: submission.score,
          executionTimeMs: submission.executionTimeMs,
          memoryUsageKb: submission.memoryUsageKb,
          compileOutput: submission.compileOutput,
        };
      } else {
        const response = await apiClient.get(`/submissions/${submissionId}/status`);
        return response.data;
      }
    } catch (error) {
      console.error('Get submission status error:', error);
      throw error;
    }
  }
  
  // Resubmit a previous submission
  async resubmitSubmission(submissionId) {
    try {
      if (config.USE_MOCK_DATA) {
        const originalSubmission = sampleSubmissions.find(s => s.id === submissionId);
        if (!originalSubmission) {
          throw new Error('Original submission not found');
        }
        
        return this.submitCode({
          userId: originalSubmission.userId,
          problemId: originalSubmission.problemId,
          language: originalSubmission.language,
          sourceCode: originalSubmission.code,
        });
      } else {
        const response = await apiClient.post(`/submissions/${submissionId}/resubmit`);
        return response.data;
      }
    } catch (error) {
      console.error('Resubmit submission error:', error);
      throw error;
    }
  }
  
  // Get submission statistics for a user
  async getUserSubmissionStats(userId, timeRange = '30d') {
    try {
      if (config.USE_MOCK_DATA) {
        const userSubmissions = sampleSubmissions.filter(s => s.userId === userId);
        
        // Calculate statistics
        const totalSubmissions = userSubmissions.length;
        const successfulSubmissions = userSubmissions.filter(s => s.score === 100).length;
        const accuracy = totalSubmissions > 0 ? (successfulSubmissions / totalSubmissions) * 100 : 0;
        const averageScore = totalSubmissions > 0 ? 
          userSubmissions.reduce((sum, s) => sum + s.score, 0) / totalSubmissions : 0;
        
        // Language distribution
        const languageStats = userSubmissions.reduce((acc, s) => {
          acc[s.language] = (acc[s.language] || 0) + 1;
          return acc;
        }, {});
        
        // Time-based statistics (mock data)
        const timeStats = {
          daily: Array.from({ length: 7 }, (_, i) => ({
            date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            submissions: Math.floor(Math.random() * 5),
            accuracy: Math.floor(Math.random() * 40) + 60,
          })).reverse(),
        };
        
        return {
          totalSubmissions,
          successfulSubmissions,
          accuracy,
          averageScore,
          languageStats,
          timeStats,
          problemsSolved: new Set(userSubmissions.filter(s => s.score === 100).map(s => s.problemId)).size,
          currentStreak: 7, // Mock streak
        };
      } else {
        const response = await apiClient.get(`/submissions/stats/user/${userId}?timeRange=${timeRange}`);
        return response.data;
      }
    } catch (error) {
      console.error('Get user submission stats error:', error);
      throw error;
    }
  }
  
  // Get submission statistics for a problem
  async getProblemSubmissionStats(problemId) {
    try {
      if (config.USE_MOCK_DATA) {
        const problemSubmissions = sampleSubmissions.filter(s => s.problemId === problemId);
        
        const totalSubmissions = problemSubmissions.length;
        const successfulSubmissions = problemSubmissions.filter(s => s.score === 100).length;
        const averageScore = totalSubmissions > 0 ? 
          problemSubmissions.reduce((sum, s) => sum + s.score, 0) / totalSubmissions : 0;
        
        const languageStats = problemSubmissions.reduce((acc, s) => {
          acc[s.language] = (acc[s.language] || 0) + 1;
          return acc;
        }, {});
        
        return {
          totalSubmissions,
          successfulSubmissions,
          averageScore,
          languageStats,
          uniqueUsers: new Set(problemSubmissions.map(s => s.userId)).size,
          averageTime: totalSubmissions > 0 ? 
            problemSubmissions.reduce((sum, s) => sum + s.executionTimeMs, 0) / totalSubmissions : 0,
        };
      } else {
        const response = await apiClient.get(`/submissions/stats/problem/${problemId}`);
        return response.data;
      }
    } catch (error) {
      console.error('Get problem submission stats error:', error);
      throw error;
    }
  }
  
  // Export submissions data
  async exportSubmissions({ userId, problemId, format = 'csv', dateFrom, dateTo }) {
    try {
      if (config.USE_MOCK_DATA) {
        const submissions = await this.getSubmissions({ userId, problemId, dateFrom, dateTo, limit: 1000 });
        
        if (format === 'csv') {
          const headers = ['ID', 'User ID', 'Problem ID', 'Language', 'Score', 'Status', 'Time (ms)', 'Memory (KB)', 'Created At'];
          const rows = submissions.submissions.map(s => [
            s.id,
            s.userId,
            s.problemId,
            s.language,
            s.score,
            s.status,
            s.executionTimeMs,
            s.memoryUsageKb,
            s.createdAt,
          ]);
          
          const csvContent = [headers, ...rows]
            .map(row => row.map(field => `"${field}"`).join(','))
            .join('\n');
          
          return { data: csvContent, filename: 'submissions.csv' };
        } else {
          return { data: JSON.stringify(submissions.submissions, null, 2), filename: 'submissions.json' };
        }
      } else {
        const params = new URLSearchParams();
        if (userId) params.append('userId', userId);
        if (problemId) params.append('problemId', problemId);
        if (format) params.append('format', format);
        if (dateFrom) params.append('dateFrom', dateFrom);
        if (dateTo) params.append('dateTo', dateTo);
        
        const response = await apiClient.get(`/submissions/export?${params.toString()}`);
        return response.data;
      }
    } catch (error) {
      console.error('Export submissions error:', error);
      throw error;
    }
  }
  
  // Mock function to simulate submission processing (demo mode only)
  mockProcessSubmission(submissionId, code, problemId) {
    if (!config.USE_MOCK_DATA) return;
    
    const submissionIndex = sampleSubmissions.findIndex(s => s.id === submissionId);
    if (submissionIndex === -1) return;
    
    // Update status to running
    sampleSubmissions[submissionIndex].status = 'running';
    
    setTimeout(() => {
      // Simulate completion
      const hasCompileError = Math.random() < 0.1; // 10% chance of compile error
      const passRate = hasCompileError ? 0 : Math.random(); // Random pass rate
      
      if (hasCompileError) {
        sampleSubmissions[submissionIndex] = {
          ...sampleSubmissions[submissionIndex],
          status: 'completed',
          compileOutput: 'Error: syntax error on line 5',
          results: [],
          totalPassed: 0,
          totalTests: 0,
          score: 0,
        };
      } else {
        // Mock test case results
        const numTests = 4;
        const numPassed = Math.floor(passRate * numTests);
        
        const results = Array.from({ length: numTests }, (_, i) => ({
          testCaseId: `tc${i + 1}`,
          passed: i < numPassed,
          stdout: i < numPassed ? 'Expected output' : 'Wrong output',
          stderr: '',
          timeMs: Math.floor(Math.random() * 100) + 50,
          memoryKb: Math.floor(Math.random() * 100) + 400,
        }));
        
        sampleSubmissions[submissionIndex] = {
          ...sampleSubmissions[submissionIndex],
          status: 'completed',
          results,
          totalPassed: numPassed,
          totalTests: numTests,
          score: Math.floor((numPassed / numTests) * 100),
          executionTimeMs: Math.max(...results.map(r => r.timeMs)),
          memoryUsageKb: Math.max(...results.map(r => r.memoryKb)),
          compileOutput: 'Compilation successful',
        };
      }
      
      // Dispatch update event for real-time updates
      window.dispatchEvent(new CustomEvent('submissionUpdate', {
        detail: sampleSubmissions[submissionIndex]
      }));
    }, 3000);
  }
}

export const submissionService = new SubmissionService();
export default submissionService;