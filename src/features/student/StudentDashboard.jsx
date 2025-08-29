// Student Dashboard
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  LinearProgress,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
} from '@mui/material';
import {
  CodeOutlined,
  TrendingUpOutlined,
  EmojiEventsOutlined,
  AssignmentOutlined,
  RecommendOutlined,
  ScheduleOutlined,
} from '@mui/icons-material';
import { selectUser } from '../../app/slices/authSlice';
import { sampleAnalytics, sampleMLRecommendations } from '../../utils/sampleData';

const StudentDashboard = () => {
  const user = useSelector(selectUser);
  const studentData = sampleAnalytics.student;
  
  const upcomingDeadlines = [
    { id: 1, title: 'Array Problems - Week 1', due: '2024-09-15T23:59:59Z', course: 'CS 101' },
    { id: 2, title: 'Tree Traversal Assignment', due: '2024-09-20T23:59:59Z', course: 'CS 201' },
  ];
  
  const recentProblems = [
    { id: 'prob1', title: 'Two Sum', difficulty: 'Easy', score: 100, attempted: '2024-08-29' },
    { id: 'prob2', title: 'Binary Tree Traversal', difficulty: 'Medium', score: 75, attempted: '2024-08-28' },
  ];
  
  return (
    <Box>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          gutterBottom
          sx={{ 
            fontWeight: 700, 
            background: 'linear-gradient(45deg, #2563eb, #7c3aed)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Welcome back, {user?.name || 'Student'}! 👋
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem', fontWeight: 500 }}>
          Ready to tackle some coding challenges today?
        </Typography>
      </Box>
      
      {/* Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{
              height: '100%',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '4px',
                background: 'linear-gradient(90deg, #2563eb, #60a5fa)',
              },
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    Problems Solved
                  </Typography>
                  <Typography variant="h3" color="primary" sx={{ fontWeight: 700 }}>
                    {studentData.problemsSolved}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    +3 this week
                  </Typography>
                </Box>
                <Box sx={{ color: 'primary.main', opacity: 0.8, transform: 'scale(1.5)' }}>
                  <CodeOutlined />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{
              height: '100%',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '4px',
                background: 'linear-gradient(90deg, #059669, #34d399)',
              },
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    Accuracy
                  </Typography>
                  <Typography variant="h3" color="success.main" sx={{ fontWeight: 700 }}>
                    {studentData.accuracy}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    +5% improvement
                  </Typography>
                </Box>
                <Box sx={{ color: 'success.main', opacity: 0.8, transform: 'scale(1.5)' }}>
                  <TrendingUpOutlined />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{
              height: '100%',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '4px',
                background: 'linear-gradient(90deg, #d97706, #fbbf24)',
              },
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    Current Streak
                  </Typography>
                  <Typography variant="h3" color="warning.main" sx={{ fontWeight: 700 }}>
                    {studentData.currentStreak}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    days in a row
                  </Typography>
                </Box>
                <Box sx={{ color: 'warning.main', opacity: 0.8, transform: 'scale(1.5)' }}>
                  <EmojiEventsOutlined />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{
              height: '100%',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '4px',
                background: 'linear-gradient(90deg, #2563eb, #7c3aed)',
              },
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    Rank
                  </Typography>
                  <Typography variant="h3" color="info.main" sx={{ fontWeight: 700 }}>
                    #{studentData.ranking}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    in class leaderboard
                  </Typography>
                </Box>
                <Box sx={{ color: 'info.main', opacity: 0.8, transform: 'scale(1.5)' }}>
                  <EmojiEventsOutlined />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Grid container spacing={3}>
        {/* Upcoming Deadlines */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ScheduleOutlined color="error" sx={{ mr: 1 }} />
                <Typography variant="h6">Upcoming Deadlines</Typography>
              </Box>
              <List>
                {upcomingDeadlines.map((deadline) => (
                  <ListItem key={deadline.id} sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'error.main' }}>
                        <AssignmentOutlined />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={deadline.title}
                      secondary={`${deadline.course} • Due: ${new Date(deadline.due).toLocaleDateString()}`}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        {/* ML Recommendations */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <RecommendOutlined color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Recommended for You</Typography>
              </Box>
              <List>
                {sampleMLRecommendations.slice(0, 3).map((rec) => (
                  <ListItem key={rec.problemId} sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <CodeOutlined />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={rec.title}
                      secondary={rec.reason}
                    />
                    <Chip
                      label={rec.difficulty}
                      size="small"
                      color={rec.difficulty === 'Easy' ? 'success' : 'primary'}
                    />
                  </ListItem>
                ))}
              </List>
              <Button variant="outlined" fullWidth sx={{ mt: 2 }}>
                View All Recommendations
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Recent Problems */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Problems
              </Typography>
              <List>
                {recentProblems.map((problem) => (
                  <ListItem key={problem.id}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: problem.score === 100 ? 'success.main' : 'warning.main' }}>
                        <CodeOutlined />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={problem.title}
                      secondary={`Attempted: ${new Date(problem.attempted).toLocaleDateString()}`}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        label={problem.difficulty}
                        size="small"
                        color={problem.difficulty === 'Easy' ? 'success' : 'primary'}
                      />
                      <Chip
                        label={`${problem.score}%`}
                        size="small"
                        color={problem.score === 100 ? 'success' : 'warning'}
                      />
                    </Box>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudentDashboard;