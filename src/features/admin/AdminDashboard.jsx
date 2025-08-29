import React from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import { School, People, Assignment, TrendingUp } from '@mui/icons-material';

const AdminDashboard = () => {
  const stats = [
    { title: 'Colleges Onboarded', value: '24', icon: <School />, color: 'primary' },
    { title: 'Active Professors', value: '156', icon: <People />, color: 'secondary' },
    { title: 'Active Students', value: '2,847', icon: <People />, color: 'success' },
    { title: 'Monthly Submissions', value: '18,324', icon: <Assignment />, color: 'warning' },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Box sx={{ color: `${stat.color}.main`, mr: 2 }}>
                    {stat.icon}
                  </Box>
                  <Box>
                    <Typography variant="h4" component="div">
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AdminDashboard;