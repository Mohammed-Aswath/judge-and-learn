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
    <Box sx={{ p: 3 }}>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome back, {user?.name || 'Student'}! 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Ready to tackle some coding challenges today?
        </Typography>
      </Box>
      
      {/* Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CodeOutlined color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Problems Solved</Typography>
              </Box>
              <Typography variant="h3" color="primary">
                {studentData.problemsSolved}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                +3 this week
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TrendingUpOutlined color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">Accuracy</Typography>
              </Box>
              <Typography variant="h3" color="success.main">
                {studentData.accuracy}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                +5% improvement
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <EmojiEventsOutlined color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6">Current Streak</Typography>
              </Box>
              <Typography variant="h3" color="warning.main">
                {studentData.currentStreak}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                days in a row
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <EmojiEventsOutlined color="info" sx={{ mr: 1 }} />
                <Typography variant="h6">Rank</Typography>
              </Box>
              <Typography variant="h3" color="info.main">
                #{studentData.ranking}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                in class leaderboard
              </Typography>
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