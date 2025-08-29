import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  TrendingUp, 
  Calendar,
  Clock,
  Target,
  Award
} from 'lucide-react';

const ProfessorDashboard = () => {
  const stats = [
    { 
      title: 'Active Classes', 
      value: '8', 
      icon: GraduationCap, 
      change: '+2 this month',
      changeType: 'positive',
      color: 'text-blue-600 dark:text-blue-400'
    },
    { 
      title: 'Total Students', 
      value: '234', 
      icon: Users, 
      change: '+12 this week',
      changeType: 'positive',
      color: 'text-purple-600 dark:text-purple-400'
    },
    { 
      title: 'Problems Assigned', 
      value: '45', 
      icon: BookOpen, 
      change: '+5 today',
      changeType: 'positive',
      color: 'text-green-600 dark:text-green-400'
    },
    { 
      title: 'Submissions Today', 
      value: '89', 
      icon: TrendingUp, 
      change: '+23%',
      changeType: 'positive',
      color: 'text-orange-600 dark:text-orange-400'
    },
  ];

  const recentActivities = [
    { action: 'New submission received', student: 'John Doe', problem: 'Array Sorting', time: '2 min ago' },
    { action: 'Problem assigned', class: 'CS101', problem: 'Binary Search', time: '15 min ago' },
    { action: 'Student joined class', student: 'Jane Smith', class: 'CS102', time: '1 hour ago' },
    { action: 'Grade submitted', student: 'Mike Johnson', problem: 'Hash Tables', time: '2 hours ago' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            View Calendar
          </Button>
          <Button size="sm">
            <BookOpen className="w-4 h-4 mr-2" />
            Create Problem
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between space-y-0 pb-2">
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div className="flex items-baseline space-x-2">
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <Badge 
                    variant={stat.changeType === 'positive' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {stat.change}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">
                    {activity.student && `${activity.student} • `}
                    {activity.class && `${activity.class} • `}
                    {activity.problem && `${activity.problem} • `}
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="ghost">
              <BookOpen className="w-4 h-4 mr-2" />
              Assign New Problem
            </Button>
            <Button className="w-full justify-start" variant="ghost">
              <Users className="w-4 h-4 mr-2" />
              View Student Progress
            </Button>
            <Button className="w-full justify-start" variant="ghost">
              <Award className="w-4 h-4 mr-2" />
              Check Leaderboard
            </Button>
            <Button className="w-full justify-start" variant="ghost">
              <GraduationCap className="w-4 h-4 mr-2" />
              Manage Classes
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfessorDashboard;