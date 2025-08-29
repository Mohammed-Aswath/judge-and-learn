// Machine Learning Service
import apiClient from './apiClient';
import config from '../config/clientConfig';
import { sampleMLRecommendations } from '../utils/sampleData';

class MLService {
  // Get personalized problem recommendations for a user
  async getRecommendations({ userId, limit = 10, difficulty = null, tags = [] } = {}) {
    try {
      if (config.USE_MOCK_DATA || !config.ENABLE_ML_RECOMMENDATIONS) {
        // Mock recommendations based on user activity
        let recommendations = [...sampleMLRecommendations];
        
        // Apply filters
        if (difficulty) {
          recommendations = recommendations.filter(rec => rec.difficulty === difficulty);
        }
        
        if (tags.length > 0) {
          recommendations = recommendations.filter(rec => 
            rec.tags.some(tag => tags.includes(tag))
          );
        }
        
        // Sort by score and limit
        recommendations = recommendations
          .sort((a, b) => b.score - a.score)
          .slice(0, limit);
        
        // Add mock metadata
        return {
          recommendations,
          userId,
          generatedAt: new Date().toISOString(),
          modelVersion: 'mock-v1.0',
          confidence: 0.85,
          explanations: {
            primaryFactors: ['recent_performance', 'difficulty_progression', 'topic_affinity'],
            userProfile: {
              preferredDifficulty: 'medium',
              strongTopics: ['arrays', 'strings'],
              improvementAreas: ['dynamic_programming', 'graphs'],
            },
          },
        };
      } else {
        const params = new URLSearchParams();
        params.append('userId', userId);
        params.append('limit', limit);
        if (difficulty) params.append('difficulty', difficulty);
        if (tags.length > 0) params.append('tags', tags.join(','));
        
        const response = await apiClient.get(`/ml/recommendations?${params.toString()}`);
        return response.data;
      }
    } catch (error) {
      console.error('Get recommendations error:', error);
      throw error;
    }
  }
  
  // Get user's learning analytics and insights
  async getUserAnalytics(userId, timeRange = '30d') {
    try {
      if (config.USE_MOCK_DATA) {
        // Mock analytics data
        return {
          userId,
          timeRange,
          learningPattern: {
            mostActiveHours: [14, 15, 16, 20, 21], // 2-4 PM, 8-9 PM
            mostActiveDays: ['Monday', 'Wednesday', 'Friday'],
            averageSessionDuration: 45, // minutes
            totalSessions: 28,
          },
          performanceMetrics: {
            accuracyTrend: 'improving', // 'improving', 'stable', 'declining'
            speedTrend: 'stable',
            difficultyProgression: 'advancing',
            consistencyScore: 0.78,
          },
          topicMastery: [
            { topic: 'Arrays', mastery: 0.92, problems_solved: 15 },
            { topic: 'Strings', mastery: 0.85, problems_solved: 12 },
            { topic: 'Hash Tables', mastery: 0.73, problems_solved: 8 },
            { topic: 'Trees', mastery: 0.45, problems_solved: 5 },
            { topic: 'Dynamic Programming', mastery: 0.25, problems_solved: 2 },
          ],
          recommendations: {
            nextTopics: ['Binary Trees', 'Graph Traversal'],
            practiceAreas: ['Time Complexity Optimization'],
            studyPlan: {
              easy: 2,
              medium: 5,
              hard: 1,
            },
          },
          predictions: {
            nextDifficultyReady: 'medium-hard',
            estimatedTimeToMastery: {
              'Dynamic Programming': '2-3 weeks',
              'Graph Algorithms': '3-4 weeks',
            },
            successProbability: {
              easy: 0.95,
              medium: 0.78,
              hard: 0.32,
            },
          },
          generatedAt: new Date().toISOString(),
        };
      } else {
        const response = await apiClient.get(`/ml/analytics/${userId}?timeRange=${timeRange}`);
        return response.data;
      }
    } catch (error) {
      console.error('Get user analytics error:', error);
      throw error;
    }
  }
  
  // Get difficulty prediction for a user on a specific problem
  async predictDifficulty({ userId, problemId }) {
    try {
      if (config.USE_MOCK_DATA) {
        // Mock difficulty prediction
        const baseDifficulty = Math.random();
        
        return {
          userId,
          problemId,
          predictions: {
            expectedDifficulty: baseDifficulty,
            successProbability: Math.max(0.1, 1 - baseDifficulty * 0.8),
            estimatedTime: Math.floor(baseDifficulty * 60) + 15, // minutes
            confidenceInterval: [
              Math.max(0, baseDifficulty - 0.1),
              Math.min(1, baseDifficulty + 0.1),
            ],
          },
          factors: {
            userSkillLevel: 0.7,
            problemComplexity: baseDifficulty,
            topicFamiliarity: Math.random(),
            historicalPerformance: 0.8,
          },
          modelVersion: 'difficulty-predictor-v2.1',
          generatedAt: new Date().toISOString(),
        };
      } else {
        const response = await apiClient.post('/ml/predict-difficulty', {
          userId,
          problemId,
        });
        return response.data;
      }
    } catch (error) {
      console.error('Predict difficulty error:', error);
      throw error;
    }
  }
  
  // Trigger model retraining (admin/professor feature)
  async triggerRetraining({ modelType = 'recommendations', dataRange = '30d' } = {}) {
    try {
      if (config.USE_MOCK_DATA) {
        // Mock retraining trigger
        const jobId = 'retrain_job_' + Date.now();
        
        return {
          jobId,
          status: 'queued',
          modelType,
          dataRange,
          estimatedDuration: '15-30 minutes',
          queuePosition: Math.floor(Math.random() * 3) + 1,
          startedAt: new Date().toISOString(),
        };
      } else {
        const response = await apiClient.post('/ml/trigger-retrain', {
          modelType,
          dataRange,
        });
        return response.data;
      }
    } catch (error) {
      console.error('Trigger retraining error:', error);
      throw error;
    }
  }
  
  // Get retraining job status
  async getRetrainingStatus(jobId) {
    try {
      if (config.USE_MOCK_DATA) {
        // Mock job status progression
        const statuses = ['queued', 'running', 'completed', 'failed'];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        
        const baseStatus = {
          jobId,
          status: randomStatus,
          startedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 minutes ago
        };
        
        if (randomStatus === 'running') {
          return {
            ...baseStatus,
            progress: Math.floor(Math.random() * 80) + 10, // 10-90%
            currentStep: 'training_model',
            estimatedTimeRemaining: '5-10 minutes',
          };
        } else if (randomStatus === 'completed') {
          return {
            ...baseStatus,
            completedAt: new Date().toISOString(),
            results: {
              modelAccuracy: 0.89,
              improvementOverPrevious: 0.05,
              trainingLoss: 0.12,
              validationLoss: 0.15,
              newModelVersion: 'v3.2',
            },
          };
        } else if (randomStatus === 'failed') {
          return {
            ...baseStatus,
            failedAt: new Date().toISOString(),
            error: 'Insufficient training data',
            retryable: true,
          };
        }
        
        return baseStatus;
      } else {
        const response = await apiClient.get(`/ml/retrain-status/${jobId}`);
        return response.data;
      }
    } catch (error) {
      console.error('Get retraining status error:', error);
      throw error;
    }
  }
  
  // Get model performance metrics
  async getModelMetrics(modelType = 'recommendations') {
    try {
      if (config.USE_MOCK_DATA) {
        // Mock model metrics
        return {
          modelType,
          currentVersion: 'v3.1',
          metrics: {
            accuracy: 0.87,
            precision: 0.84,
            recall: 0.89,
            f1Score: 0.86,
            auc: 0.92,
          },
          performanceHistory: Array.from({ length: 10 }, (_, i) => ({
            version: `v${3}.${i + 1}`,
            date: new Date(Date.now() - (9 - i) * 7 * 24 * 60 * 60 * 1000).toISOString(),
            accuracy: 0.75 + Math.random() * 0.15,
            deploymentStatus: 'deployed',
          })),
          lastUpdated: new Date().toISOString(),
          nextScheduledRetraining: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          trainingDataStats: {
            totalSamples: 50000,
            lastWeekSamples: 2500,
            dataQuality: 0.93,
          },
        };
      } else {
        const response = await apiClient.get(`/ml/model-metrics?type=${modelType}`);
        return response.data;
      }
    } catch (error) {
      console.error('Get model metrics error:', error);
      throw error;
    }
  }
  
  // Submit feedback on recommendations (for model improvement)
  async submitRecommendationFeedback({ userId, problemId, recommendationId, feedback }) {
    try {
      const feedbackData = {
        userId,
        problemId,
        recommendationId,
        feedback, // 'helpful', 'not_helpful', 'irrelevant'
        timestamp: new Date().toISOString(),
      };
      
      if (config.USE_MOCK_DATA) {
        // Mock feedback submission
        return {
          success: true,
          feedbackId: 'feedback_' + Date.now(),
          message: 'Feedback recorded successfully',
        };
      } else {
        const response = await apiClient.post('/ml/recommendation-feedback', feedbackData);
        return response.data;
      }
    } catch (error) {
      console.error('Submit recommendation feedback error:', error);
      throw error;
    }
  }
  
  // Get problem similarity analysis
  async getSimilarProblems(problemId, limit = 5) {
    try {
      if (config.USE_MOCK_DATA) {
        // Mock similar problems
        return {
          problemId,
          similarProblems: Array.from({ length: limit }, (_, i) => ({
            id: `similar_${problemId}_${i}`,
            title: `Similar Problem ${i + 1}`,
            similarity: Math.random() * 0.4 + 0.6, // 0.6-1.0
            commonTopics: ['arrays', 'two_pointers'],
            difficulty: ['Easy', 'Medium', 'Hard'][Math.floor(Math.random() * 3)],
            reason: 'Similar algorithmic approach and data structures',
          })),
          analysisMethod: 'semantic_embedding',
          generatedAt: new Date().toISOString(),
        };
      } else {
        const response = await apiClient.get(`/ml/similar-problems/${problemId}?limit=${limit}`);
        return response.data;
      }
    } catch (error) {
      console.error('Get similar problems error:', error);
      throw error;
    }
  }
  
  // Get learning path recommendations
  async getLearningPath({ userId, targetTopic, currentSkillLevel = 'beginner' }) {
    try {
      if (config.USE_MOCK_DATA) {
        // Mock learning path
        const pathSteps = [
          { step: 1, title: 'Basic Concepts', problems: ['prob1', 'prob2'], estimatedTime: '1 week' },
          { step: 2, title: 'Intermediate Techniques', problems: ['prob3', 'prob4'], estimatedTime: '2 weeks' },
          { step: 3, title: 'Advanced Applications', problems: ['prob5', 'prob6'], estimatedTime: '2 weeks' },
          { step: 4, title: 'Expert Level', problems: ['prob7', 'prob8'], estimatedTime: '3 weeks' },
        ];
        
        return {
          userId,
          targetTopic,
          currentSkillLevel,
          learningPath: pathSteps,
          totalEstimatedTime: '8 weeks',
          prerequisites: ['Basic Programming', 'Data Structures'],
          outcomes: ['Master advanced algorithms', 'Solve complex problems'],
          generatedAt: new Date().toISOString(),
        };
      } else {
        const response = await apiClient.post('/ml/learning-path', {
          userId,
          targetTopic,
          currentSkillLevel,
        });
        return response.data;
      }
    } catch (error) {
      console.error('Get learning path error:', error);
      throw error;
    }
  }
}

export const mlService = new MLService();
export default mlService;