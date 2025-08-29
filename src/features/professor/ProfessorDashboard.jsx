import React from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import { Class, People, Assignment, TrendingUp } from '@mui/icons-material';

const ProfessorDashboard = () => {
  const stats = [
    { title: 'Active Classes', value: '8', icon: <Class />, color: 'primary' },
    { title: 'Total Students', value: '234', icon: <People />, color: 'secondary' },
    { title: 'Problems Assigned', value: '45', icon: <Assignment />, color: 'success' },
    { title: 'Submissions Today', value: '89', icon: <TrendingUp />, color: 'warning' },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Professor Dashboard
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

export default ProfessorDashboard;