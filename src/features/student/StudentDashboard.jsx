import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../app/slices/authSlice';
import { sampleAnalytics, sampleMLRecommendations } from '../../utils/sampleData';
import { Code, TrendingUp, Trophy, Calendar, Target, BookOpen } from 'lucide-react';

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

  const StatCard = ({ icon: Icon, title, value, subtitle, gradient, iconColor }) => (
    <div className="bg-card rounded-xl border shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className={`h-1 rounded-t-xl ${gradient}`} />
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
            <div className="text-3xl font-bold text-foreground">{value}</div>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
          <div className={`p-3 rounded-lg ${iconColor} opacity-80 group-hover:opacity-100 transition-opacity`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </div>
    </div>
  );

  const ProblemCard = ({ problem, isRecommendation = false }) => (
    <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
      <div className={`p-2 rounded-lg ${isRecommendation ? 'bg-primary/10 text-primary' : 'bg-accent text-accent-foreground'}`}>
        <Code className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-foreground truncate">{problem.title}</h4>
        <p className="text-sm text-muted-foreground truncate">
          {isRecommendation ? problem.reason : `Attempted: ${new Date(problem.attempted).toLocaleDateString()}`}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
          problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
        }`}>
          {problem.difficulty}
        </span>
        {problem.score && (
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            problem.score === 100 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
          }`}>
            {problem.score}%
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Welcome back, {user?.name || 'Student'}! 👋
          </h1>
          <p className="text-lg text-muted-foreground">
            Ready to tackle some coding challenges today?
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            icon={Code}
            title="Problems Solved"
            value={studentData.problemsSolved}
            subtitle="+3 this week"
            gradient="bg-gradient-to-r from-blue-500 to-blue-600"
            iconColor="text-blue-600"
          />
          <StatCard 
            icon={TrendingUp}
            title="Accuracy"
            value={`${studentData.accuracy}%`}
            subtitle="+5% improvement"
            gradient="bg-gradient-to-r from-green-500 to-green-600"
            iconColor="text-green-600"
          />
          <StatCard 
            icon={Trophy}
            title="Current Streak"
            value={studentData.currentStreak}
            subtitle="days in a row"
            gradient="bg-gradient-to-r from-yellow-500 to-yellow-600"
            iconColor="text-yellow-600"
          />
          <StatCard 
            icon={Target}
            title="Rank"
            value={`#${studentData.ranking}`}
            subtitle="in class leaderboard"
            gradient="bg-gradient-to-r from-purple-500 to-purple-600"
            iconColor="text-purple-600"
          />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Deadlines */}
          <div className="bg-card rounded-xl border shadow-sm">
            <div className="p-6 border-b">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-red-600" />
                <h2 className="text-xl font-semibold text-foreground">Upcoming Deadlines</h2>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {upcomingDeadlines.map((deadline) => (
                <div key={deadline.id} className="flex items-center gap-4 p-4 rounded-lg bg-red-50 dark:bg-red-950/20">
                  <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{deadline.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {deadline.course} • Due: {new Date(deadline.due).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ML Recommendations */}
          <div className="bg-card rounded-xl border shadow-sm">
            <div className="p-6 border-b">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">Recommended for You</h2>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {sampleMLRecommendations.slice(0, 3).map((rec) => (
                <ProblemCard key={rec.problemId} problem={rec} isRecommendation={true} />
              ))}
              <button className="w-full mt-4 px-4 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary/10 transition-colors">
                View All Recommendations
              </button>
            </div>
          </div>
        </div>

        {/* Recent Problems */}
        <div className="bg-card rounded-xl border shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-foreground">Recent Problems</h2>
          </div>
          <div className="p-6 space-y-4">
            {recentProblems.map((problem) => (
              <ProblemCard key={problem.id} problem={problem} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;