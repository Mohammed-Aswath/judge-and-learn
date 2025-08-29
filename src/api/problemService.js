// Problem Management Service
import apiClient from './apiClient';
import config from '../config/clientConfig';
import { sampleProblems } from '../utils/sampleData';

class ProblemService {
  // Get all problems with filtering and pagination
  async getProblems({ 
    page = 1, 
    limit = 20, 
    difficulty = '', 
    tags = [], 
    search = '', 
    language = '',
    createdBy = '',
    isPublic = null 
  } = {}) {
    try {
      if (config.USE_MOCK_DATA) {
        // Mock data filtering
        let filteredProblems = [...sampleProblems];
        
        // Apply filters
        if (difficulty) {
          filteredProblems = filteredProblems.filter(p => p.difficulty === difficulty);
        }
        
        if (tags.length > 0) {
          filteredProblems = filteredProblems.filter(p => 
            tags.some(tag => p.tags.includes(tag))
          );
        }
        
        if (search) {
          const searchLower = search.toLowerCase();
          filteredProblems = filteredProblems.filter(p => 
            p.title.toLowerCase().includes(searchLower) ||
            p.statement.toLowerCase().includes(searchLower)
          );
        }
        
        if (language) {
          filteredProblems = filteredProblems.filter(p => 
            p.allowedLanguages.includes(language)
          );
        }
        
        if (createdBy) {
          filteredProblems = filteredProblems.filter(p => p.createdBy === createdBy);
        }
        
        if (isPublic !== null) {
          filteredProblems = filteredProblems.filter(p => p.isPublic === isPublic);
        }
        
        // Apply pagination
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedProblems = filteredProblems.slice(startIndex, endIndex);
        
        return {
          problems: paginatedProblems,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(filteredProblems.length / limit),
            totalItems: filteredProblems.length,
            itemsPerPage: limit,
          },
        };
      } else {
        // Real API call
        const params = new URLSearchParams();
        if (page) params.append('page', page);
        if (limit) params.append('limit', limit);
        if (difficulty) params.append('difficulty', difficulty);
        if (tags.length > 0) params.append('tags', tags.join(','));
        if (search) params.append('search', search);
        if (language) params.append('language', language);
        if (createdBy) params.append('createdBy', createdBy);
        if (isPublic !== null) params.append('isPublic', isPublic);
        
        const response = await apiClient.get(`/problems?${params.toString()}`);
        return response.data;
      }
    } catch (error) {
      console.error('Get problems error:', error);
      throw error;
    }
  }
  
  // Get a specific problem by ID
  async getProblemById(problemId) {
    try {
      if (config.USE_MOCK_DATA) {
        const problem = sampleProblems.find(p => p.id === problemId);
        if (!problem) {
          throw new Error('Problem not found');
        }
        return problem;
      } else {
        const response = await apiClient.get(`/problems/${problemId}`);
        return response.data;
      }
    } catch (error) {
      console.error('Get problem by ID error:', error);
      throw error;
    }
  }
  
  // Create a new problem
  async createProblem(problemData) {
    try {
      if (config.USE_MOCK_DATA) {
        const newProblem = {
          id: 'prob_' + Date.now(),
          ...problemData,
          createdAt: new Date().toISOString(),
          createdBy: JSON.parse(localStorage.getItem(config.USER_STORAGE_KEY) || '{}').id,
        };
        
        // In real app, this would be handled by the backend
        sampleProblems.unshift(newProblem);
        return newProblem;
      } else {
        const response = await apiClient.post('/problems', problemData);
        return response.data;
      }
    } catch (error) {
      console.error('Create problem error:', error);
      throw error;
    }
  }
  
  // Update an existing problem
  async updateProblem(problemId, updates) {
    try {
      if (config.USE_MOCK_DATA) {
        const problemIndex = sampleProblems.findIndex(p => p.id === problemId);
        if (problemIndex === -1) {
          throw new Error('Problem not found');
        }
        
        const updatedProblem = {
          ...sampleProblems[problemIndex],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        
        sampleProblems[problemIndex] = updatedProblem;
        return updatedProblem;
      } else {
        const response = await apiClient.patch(`/problems/${problemId}`, updates);
        return response.data;
      }
    } catch (error) {
      console.error('Update problem error:', error);
      throw error;
    }
  }
  
  // Delete a problem
  async deleteProblem(problemId) {
    try {
      if (config.USE_MOCK_DATA) {
        const problemIndex = sampleProblems.findIndex(p => p.id === problemId);
        if (problemIndex === -1) {
          throw new Error('Problem not found');
        }
        
        sampleProblems.splice(problemIndex, 1);
        return { success: true };
      } else {
        const response = await apiClient.delete(`/problems/${problemId}`);
        return response.data;
      }
    } catch (error) {
      console.error('Delete problem error:', error);
      throw error;
    }
  }
  
  // Get problem statistics
  async getProblemStats(problemId) {
    try {
      if (config.USE_MOCK_DATA) {
        // Mock statistics
        return {
          totalSubmissions: 156,
          successfulSubmissions: 89,
          averageTime: 1250, // ms
          averageMemory: 512, // KB
          difficultyRating: 3.7,
          topSubmissions: [
            { userId: 'student1', time: 850, memory: 400 },
            { userId: 'student2', time: 920, memory: 450 },
          ],
          languageDistribution: {
            python: 60,
            cpp: 30,
            java: 10,
          },
        };
      } else {
        const response = await apiClient.get(`/problems/${problemId}/stats`);
        return response.data;
      }
    } catch (error) {
      console.error('Get problem stats error:', error);
      throw error;
    }
  }
  
  // Test a problem with sample input
  async testProblem(problemId, language, code) {
    try {
      if (config.USE_MOCK_DATA) {
        // Mock test execution
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
        
        const problem = sampleProblems.find(p => p.id === problemId);
        if (!problem) {
          throw new Error('Problem not found');
        }
        
        // Mock test results based on public test cases
        const results = problem.testCasesPublic.map((testCase, index) => ({
          testCaseId: testCase.id,
          passed: Math.random() > 0.3, // 70% pass rate for demo
          stdout: testCase.expectedOutput,
          stderr: '',
          timeMs: Math.floor(Math.random() * 100) + 50,
          memoryKb: Math.floor(Math.random() * 100) + 400,
        }));
        
        const totalPassed = results.filter(r => r.passed).length;
        
        return {
          results,
          totalPassed,
          totalTests: results.length,
          compileOutput: 'Compilation successful',
          executionTimeMs: Math.max(...results.map(r => r.timeMs)),
          memoryUsageKb: Math.max(...results.map(r => r.memoryKb)),
        };
      } else {
        const response = await apiClient.post(`/problems/${problemId}/test`, {
          language,
          code,
        });
        return response.data;
      }
    } catch (error) {
      console.error('Test problem error:', error);
      throw error;
    }
  }
  
  // Get popular tags
  async getPopularTags() {
    try {
      if (config.USE_MOCK_DATA) {
        const allTags = sampleProblems.flatMap(p => p.tags);
        const tagCounts = allTags.reduce((acc, tag) => {
          acc[tag] = (acc[tag] || 0) + 1;
          return acc;
        }, {});
        
        return Object.entries(tagCounts)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 20)
          .map(([tag, count]) => ({ tag, count }));
      } else {
        const response = await apiClient.get('/problems/tags');
        return response.data;
      }
    } catch (error) {
      console.error('Get popular tags error:', error);
      throw error;
    }
  }
  
  // Clone a problem (create a copy)
  async cloneProblem(problemId, newTitle) {
    try {
      if (config.USE_MOCK_DATA) {
        const originalProblem = sampleProblems.find(p => p.id === problemId);
        if (!originalProblem) {
          throw new Error('Problem not found');
        }
        
        const clonedProblem = {
          ...originalProblem,
          id: 'prob_clone_' + Date.now(),
          title: newTitle || `${originalProblem.title} (Copy)`,
          createdAt: new Date().toISOString(),
          createdBy: JSON.parse(localStorage.getItem(config.USER_STORAGE_KEY) || '{}').id,
          isPublic: false, // Cloned problems start as private
        };
        
        sampleProblems.unshift(clonedProblem);
        return clonedProblem;
      } else {
        const response = await apiClient.post(`/problems/${problemId}/clone`, {
          title: newTitle,
        });
        return response.data;
      }
    } catch (error) {
      console.error('Clone problem error:', error);
      throw error;
    }
  }
  
  // Export problems to CSV/JSON
  async exportProblems(format = 'json', filters = {}) {
    try {
      if (config.USE_MOCK_DATA) {
        const problems = await this.getProblems(filters);
        
        if (format === 'csv') {
          // Convert to CSV format
          const headers = ['ID', 'Title', 'Difficulty', 'Tags', 'Created At', 'Created By'];
          const rows = problems.problems.map(p => [
            p.id,
            p.title,
            p.difficulty,
            p.tags.join(';'),
            p.createdAt,
            p.createdBy,
          ]);
          
          const csvContent = [headers, ...rows]
            .map(row => row.map(field => `"${field}"`).join(','))
            .join('\n');
          
          return { data: csvContent, filename: 'problems.csv' };
        } else {
          return { data: JSON.stringify(problems.problems, null, 2), filename: 'problems.json' };
        }
      } else {
        const params = new URLSearchParams();
        params.append('format', format);
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== null && value !== undefined && value !== '') {
            params.append(key, value);
          }
        });
        
        const response = await apiClient.get(`/problems/export?${params.toString()}`);
        return response.data;
      }
    } catch (error) {
      console.error('Export problems error:', error);
      throw error;
    }
  }
}

export const problemService = new ProblemService();
export default problemService;