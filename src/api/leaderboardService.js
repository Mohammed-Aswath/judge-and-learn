// Leaderboard Service
import apiClient from './apiClient';
import config from '../config/clientConfig';
import { sampleLeaderboard } from '../utils/sampleData';

class LeaderboardService {
  // Get leaderboard data
  async getLeaderboard({ type = 'global', classId = null, problemId = null, timeRange = 'all' } = {}) {
    try {
      if (config.USE_MOCK_DATA) {
        // Mock leaderboard data based on type
        let leaderboard = [...sampleLeaderboard];
        
        // Apply filters based on type
        if (type === 'class' && classId) {
          // Filter by class members (mock)
          leaderboard = leaderboard.filter(entry => 
            entry.userId.startsWith('student') // Mock class filtering
          );
        }
        
        if (type === 'problem' && problemId) {
          // Filter by problem-specific rankings (mock)
          leaderboard = leaderboard.map(entry => ({
            ...entry,
            totalScore: Math.floor(Math.random() * 100) + 50,
            problemsSolved: 1, // For problem-specific leaderboard
          }));
        }
        
        // Apply time range filter (mock)
        if (timeRange !== 'all') {
          const now = new Date();
          const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
          const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
          
          // In real implementation, this would filter based on submission dates
          leaderboard = leaderboard.filter(entry => 
            new Date(entry.lastSubmission) > cutoffDate
          );
        }
        
        // Sort by score
        leaderboard.sort((a, b) => b.totalScore - a.totalScore);
        
        // Update ranks
        leaderboard.forEach((entry, index) => {
          entry.rank = index + 1;
        });
        
        return {
          leaderboard,
          lastUpdated: new Date().toISOString(),
          totalParticipants: leaderboard.length,
        };
      } else {
        const params = new URLSearchParams();
        params.append('type', type);
        if (classId) params.append('classId', classId);
        if (problemId) params.append('problemId', problemId);
        params.append('timeRange', timeRange);
        
        const response = await apiClient.get(`/leaderboard?${params.toString()}`);
        return response.data;
      }
    } catch (error) {
      console.error('Get leaderboard error:', error);
      throw error;
    }
  }
  
  // Get user's rank and position
  async getUserRank({ userId, type = 'global', classId = null, problemId = null }) {
    try {
      if (config.USE_MOCK_DATA) {
        const leaderboard = await this.getLeaderboard({ type, classId, problemId });
        const userEntry = leaderboard.leaderboard.find(entry => entry.userId === userId);
        
        if (!userEntry) {
          return {
            rank: null,
            totalScore: 0,
            problemsSolved: 0,
            accuracy: 0,
            percentile: 0,
          };
        }
        
        const totalParticipants = leaderboard.leaderboard.length;
        const percentile = ((totalParticipants - userEntry.rank + 1) / totalParticipants) * 100;
        
        return {
          ...userEntry,
          percentile: Math.round(percentile),
          rankChange: Math.floor(Math.random() * 10) - 5, // Mock rank change
          nearbyUsers: this.getNearbyUsers(leaderboard.leaderboard, userEntry.rank),
        };
      } else {
        const params = new URLSearchParams();
        params.append('userId', userId);
        params.append('type', type);
        if (classId) params.append('classId', classId);
        if (problemId) params.append('problemId', problemId);
        
        const response = await apiClient.get(`/leaderboard/user?${params.toString()}`);
        return response.data;
      }
    } catch (error) {
      console.error('Get user rank error:', error);
      throw error;
    }
  }
  
  // Get leaderboard history for a user
  async getLeaderboardHistory({ userId, timeRange = '30d' }) {
    try {
      if (config.USE_MOCK_DATA) {
        // Generate mock historical data
        const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
        const history = [];
        
        for (let i = days; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          
          history.push({
            date: date.toISOString().split('T')[0],
            rank: Math.floor(Math.random() * 10) + 1,
            score: Math.floor(Math.random() * 100) + 700,
            problemsSolved: Math.floor(Math.random() * 3) + 10,
            accuracy: Math.floor(Math.random() * 20) + 70,
          });
        }
        
        return {
          history,
          bestRank: Math.min(...history.map(h => h.rank)),
          worstRank: Math.max(...history.map(h => h.rank)),
          averageRank: Math.round(history.reduce((sum, h) => sum + h.rank, 0) / history.length),
        };
      } else {
        const response = await apiClient.get(`/leaderboard/history/${userId}?timeRange=${timeRange}`);
        return response.data;
      }
    } catch (error) {
      console.error('Get leaderboard history error:', error);
      throw error;
    }
  }
  
  // Get top performers for a specific time period
  async getTopPerformers({ timeRange = '7d', limit = 10, type = 'global' } = {}) {
    try {
      if (config.USE_MOCK_DATA) {
        const leaderboard = await this.getLeaderboard({ type, timeRange });
        const topPerformers = leaderboard.leaderboard.slice(0, limit);
        
        return {
          performers: topPerformers,
          timeRange,
          generatedAt: new Date().toISOString(),
        };
      } else {
        const params = new URLSearchParams();
        params.append('timeRange', timeRange);
        params.append('limit', limit);
        params.append('type', type);
        
        const response = await apiClient.get(`/leaderboard/top?${params.toString()}`);
        return response.data;
      }
    } catch (error) {
      console.error('Get top performers error:', error);
      throw error;
    }
  }
  
  // Get leaderboard comparison between two users
  async compareUsers(userId1, userId2, timeRange = '30d') {
    try {
      if (config.USE_MOCK_DATA) {
        const user1Rank = await this.getUserRank({ userId: userId1 });
        const user2Rank = await this.getUserRank({ userId: userId2 });
        
        return {
          user1: user1Rank,
          user2: user2Rank,
          comparison: {
            scoreDifference: user1Rank.totalScore - user2Rank.totalScore,
            rankDifference: user2Rank.rank - user1Rank.rank, // Lower rank is better
            problemsDifference: user1Rank.problemsSolved - user2Rank.problemsSolved,
            accuracyDifference: user1Rank.accuracy - user2Rank.accuracy,
          },
          timeRange,
        };
      } else {
        const response = await apiClient.get(`/leaderboard/compare/${userId1}/${userId2}?timeRange=${timeRange}`);
        return response.data;
      }
    } catch (error) {
      console.error('Compare users error:', error);
      throw error;
    }
  }
  
  // Get leaderboard statistics and insights
  async getLeaderboardStats({ type = 'global', classId = null, problemId = null }) {
    try {
      if (config.USE_MOCK_DATA) {
        const leaderboard = await this.getLeaderboard({ type, classId, problemId });
        const scores = leaderboard.leaderboard.map(entry => entry.totalScore);
        const accuracies = leaderboard.leaderboard.map(entry => entry.accuracy);
        
        return {
          totalParticipants: leaderboard.leaderboard.length,
          averageScore: scores.reduce((sum, score) => sum + score, 0) / scores.length,
          medianScore: this.calculateMedian(scores),
          highestScore: Math.max(...scores),
          lowestScore: Math.min(...scores),
          averageAccuracy: accuracies.reduce((sum, acc) => sum + acc, 0) / accuracies.length,
          scoreDistribution: this.calculateScoreDistribution(scores),
          activeUsers24h: Math.floor(leaderboard.leaderboard.length * 0.3),
          activeUsers7d: Math.floor(leaderboard.leaderboard.length * 0.7),
        };
      } else {
        const params = new URLSearchParams();
        params.append('type', type);
        if (classId) params.append('classId', classId);
        if (problemId) params.append('problemId', problemId);
        
        const response = await apiClient.get(`/leaderboard/stats?${params.toString()}`);
        return response.data;
      }
    } catch (error) {
      console.error('Get leaderboard stats error:', error);
      throw error;
    }
  }
  
  // Subscribe to real-time leaderboard updates
  subscribeToUpdates(callback, { type = 'global', classId = null, problemId = null } = {}) {
    if (!config.ENABLE_WEBSOCKETS) {
      console.warn('WebSocket updates disabled');
      return () => {}; // Return empty unsubscribe function
    }
    
    // In real implementation, this would use WebSocket
    const interval = setInterval(() => {
      if (config.USE_MOCK_DATA && Math.random() < 0.3) { // 30% chance of update
        // Simulate leaderboard update
        const mockUpdate = {
          userId: 'student' + Math.floor(Math.random() * 5 + 1),
          newScore: Math.floor(Math.random() * 100) + 800,
          newRank: Math.floor(Math.random() * 10) + 1,
          change: Math.floor(Math.random() * 6) - 3, // -3 to +3
          timestamp: new Date().toISOString(),
        };
        
        callback(mockUpdate);
      }
    }, 5000); // Check every 5 seconds
    
    // Return unsubscribe function
    return () => clearInterval(interval);
  }
  
  // Helper methods
  getNearbyUsers(leaderboard, userRank, range = 3) {
    const startIndex = Math.max(0, userRank - range - 1);
    const endIndex = Math.min(leaderboard.length, userRank + range);
    
    return leaderboard.slice(startIndex, endIndex).map(user => ({
      ...user,
      isCurrentUser: user.rank === userRank,
    }));
  }
  
  calculateMedian(numbers) {
    const sorted = [...numbers].sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    
    if (sorted.length % 2 === 0) {
      return (sorted[middle - 1] + sorted[middle]) / 2;
    } else {
      return sorted[middle];
    }
  }
  
  calculateScoreDistribution(scores) {
    const ranges = [
      { min: 0, max: 20, label: '0-20' },
      { min: 21, max: 40, label: '21-40' },
      { min: 41, max: 60, label: '41-60' },
      { min: 61, max: 80, label: '61-80' },
      { min: 81, max: 100, label: '81-100' },
    ];
    
    return ranges.map(range => ({
      ...range,
      count: scores.filter(score => score >= range.min && score <= range.max).length,
    }));
  }
}

export const leaderboardService = new LeaderboardService();
export default leaderboardService;