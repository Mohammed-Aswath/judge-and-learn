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
    <Box sx={{ p: 0 }}>
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{ 
          fontWeight: 700, 
          mb: 4,
          background: 'linear-gradient(45deg, #2563eb, #7c3aed)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        Professor Dashboard
      </Typography>
      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
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
                  background: `linear-gradient(90deg, ${
                    stat.color === 'primary' ? '#2563eb, #60a5fa' :
                    stat.color === 'secondary' ? '#7c3aed, #a78bfa' :
                    stat.color === 'success' ? '#059669, #34d399' :
                    '#d97706, #fbbf24'
                  })`,
                },
              }}
            >
              <CardContent sx={{ pb: 2 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography 
                      variant="h3" 
                      component="div" 
                      sx={{ 
                        fontWeight: 700, 
                        mb: 1,
                        color: `${stat.color}.main`,
                      }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ fontWeight: 500 }}
                    >
                      {stat.title}
                    </Typography>
                  </Box>
                  <Box 
                    sx={{ 
                      color: `${stat.color}.main`, 
                      opacity: 0.8,
                      transform: 'scale(1.5)',
                    }}
                  >
                    {stat.icon}
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