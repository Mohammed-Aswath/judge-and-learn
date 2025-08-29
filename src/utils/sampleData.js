// Sample Data for Demo Purposes
export const sampleUsers = [
  {
    id: 'admin1',
    email: 'admin@test.com',
    name: 'System Administrator',
    role: 'admin',
    collegeId: null,
    avatar: '/avatars/admin.jpg',
    lastLogin: '2024-08-29T10:30:00Z',
    isActive: true
  },
  {
    id: 'prof1',
    email: 'prof@test.com',
    name: 'Dr. Jane Smith',
    role: 'professor',
    collegeId: 'college1',
    avatar: '/avatars/prof1.jpg',
    lastLogin: '2024-08-29T09:15:00Z',
    isActive: true,
    department: 'Computer Science',
    classes: ['cs101', 'cs201']
  },
  {
    id: 'student1',
    email: 'student@test.com',
    name: 'John Doe',
    role: 'student',
    collegeId: 'college1',
    avatar: '/avatars/student1.jpg',
    lastLogin: '2024-08-29T11:45:00Z',
    isActive: true,
    studentId: 'CS2021001',
    enrolledClasses: ['cs101'],
    year: 2,
    gpa: 3.7
  }
];

export const sampleColleges = [
  {
    id: 'college1',
    name: 'Tech University',
    address: '123 University Ave, Tech City, TC 12345',
    subscriptionPlan: 'premium',
    isActive: true,
    settings: {
      allowPublicSubmissions: true,
      enableMLRecommendations: true,
      maxStudentsPerClass: 50
    },
    stats: {
      totalProfessors: 25,
      totalStudents: 500,
      monthlySubmissions: 2340
    },
    createdAt: '2024-01-15T00:00:00Z'
  },
  {
    id: 'college2',
    name: 'Engineering Institute',
    address: '456 Engineering Blvd, Eng City, EC 67890',
    subscriptionPlan: 'standard',
    isActive: true,
    settings: {
      allowPublicSubmissions: false,
      enableMLRecommendations: false,
      maxStudentsPerClass: 30
    },
    stats: {
      totalProfessors: 15,
      totalStudents: 300,
      monthlySubmissions: 1200
    },
    createdAt: '2024-02-20T00:00:00Z'
  }
];

export const sampleProblems = [
  {
    id: 'prob1',
    title: 'Two Sum',
    difficulty: 'Easy',
    tags: ['Array', 'Hash Table'],
    statement: '# Two Sum\n\nGiven an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\n## Example\n```\nInput: nums = [2,7,11,15], target = 9\nOutput: [0,1]\nExplanation: Because nums[0] + nums[1] == 9, we return [0, 1].\n```',
    allowedLanguages: ['python', 'cpp', 'java'],
    testCasesPublic: [
      { id: 'tc1', input: '[2,7,11,15]\n9', expectedOutput: '[0,1]' },
      { id: 'tc2', input: '[3,2,4]\n6', expectedOutput: '[1,2]' }
    ],
    testCasesPrivate: [
      { id: 'tc3', input: '[3,3]\n6', expectedOutput: '[0,1]' },
      { id: 'tc4', input: '[1,2,3,4,5]\n8', expectedOutput: '[2,4]' }
    ],
    timeLimitMs: 2000,
    memoryLimitMb: 256,
    createdBy: 'prof1',
    createdAt: '2024-08-01T00:00:00Z',
    isPublic: true
  },
  {
    id: 'prob2',
    title: 'Binary Tree Traversal',
    difficulty: 'Medium',
    tags: ['Tree', 'Recursion'],
    statement: '# Binary Tree Traversal\n\nGiven the root of a binary tree, return the inorder traversal of its nodes\' values.\n\n## Example\n```\nInput: root = [1,null,2,3]\nOutput: [1,3,2]\n```',
    allowedLanguages: ['python', 'cpp', 'java'],
    testCasesPublic: [
      { id: 'tc1', input: '[1,null,2,3]', expectedOutput: '[1,3,2]' },
      { id: 'tc2', input: '[]', expectedOutput: '[]' }
    ],
    testCasesPrivate: [
      { id: 'tc3', input: '[1]', expectedOutput: '[1]' },
      { id: 'tc4', input: '[1,2,3,4,5]', expectedOutput: '[4,2,5,1,3]' }
    ],
    timeLimitMs: 3000,
    memoryLimitMb: 512,
    createdBy: 'prof1',
    createdAt: '2024-08-15T00:00:00Z',
    isPublic: false
  }
];

export const sampleSubmissions = [
  {
    id: 'sub1',
    userId: 'student1',
    problemId: 'prob1',
    language: 'python',
    code: 'def two_sum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []',
    status: 'completed',
    results: [
      { testCaseId: 'tc1', passed: true, stdout: '[0,1]', stderr: '', timeMs: 45, memoryKb: 512 },
      { testCaseId: 'tc2', passed: true, stdout: '[1,2]', stderr: '', timeMs: 52, memoryKb: 498 },
      { testCaseId: 'tc3', passed: true, stdout: '[0,1]', stderr: '', timeMs: 48, memoryKb: 510 },
      { testCaseId: 'tc4', passed: false, stdout: '[2,4]', stderr: '', timeMs: 55, memoryKb: 520 }
    ],
    totalPassed: 3,
    totalTests: 4,
    score: 75,
    executionTimeMs: 55,
    memoryUsageKb: 520,
    createdAt: '2024-08-29T10:15:00Z'
  },
  {
    id: 'sub2',
    userId: 'student1',
    problemId: 'prob2',
    language: 'python',
    code: 'def inorder_traversal(root):\n    result = []\n    def traverse(node):\n        if node:\n            traverse(node.left)\n            result.append(node.val)\n            traverse(node.right)\n    traverse(root)\n    return result',
    status: 'completed',
    results: [
      { testCaseId: 'tc1', passed: true, stdout: '[1,3,2]', stderr: '', timeMs: 32, memoryKb: 448 },
      { testCaseId: 'tc2', passed: true, stdout: '[]', stderr: '', timeMs: 12, memoryKb: 256 }
    ],
    totalPassed: 2,
    totalTests: 2,
    score: 100,
    executionTimeMs: 32,
    memoryUsageKb: 448,
    createdAt: '2024-08-29T11:30:00Z'
  }
];

export const sampleClasses = [
  {
    id: 'cs101',
    name: 'Introduction to Programming',
    code: 'CS 101',
    professorId: 'prof1',
    collegeId: 'college1',
    description: 'Fundamental programming concepts using Python',
    semester: 'Fall 2024',
    students: ['student1'],
    assignments: [
      {
        id: 'assign1',
        problemId: 'prob1',
        title: 'Array Problems - Week 1',
        dueDate: '2024-09-15T23:59:59Z',
        isVisible: true,
        autoGrade: true
      }
    ],
    schedule: 'MWF 10:00-11:00 AM',
    createdAt: '2024-08-01T00:00:00Z'
  }
];

export const sampleLeaderboard = [
  {
    userId: 'student1',
    name: 'John Doe',
    avatar: '/avatars/student1.jpg',
    totalScore: 875,
    problemsSolved: 15,
    accuracy: 87.5,
    rank: 1,
    streak: 7,
    lastSubmission: '2024-08-29T11:30:00Z'
  },
  {
    userId: 'student2',
    name: 'Alice Johnson',
    avatar: '/avatars/student2.jpg',
    totalScore: 820,
    problemsSolved: 12,
    accuracy: 91.7,
    rank: 2,
    streak: 4,
    lastSubmission: '2024-08-29T09:45:00Z'
  }
];

export const sampleMLRecommendations = [
  {
    problemId: 'prob1',
    title: 'Two Sum',
    difficulty: 'Easy',
    score: 0.95,
    reason: 'Based on your recent array problem performance',
    tags: ['Array', 'Hash Table']
  },
  {
    problemId: 'prob2',
    title: 'Binary Tree Traversal',
    difficulty: 'Medium',
    score: 0.78,
    reason: 'Next logical step in data structures',
    tags: ['Tree', 'Recursion']
  }
];

export const sampleAnalytics = {
  admin: {
    collegesOnboarded: 45,
    activeProfessors: 234,
    activeStudents: 5672,
    monthlySubmissions: 15420,
    systemLoad: 78,
    chartData: {
      submissions: [
        { date: '2024-08-01', submissions: 1200 },
        { date: '2024-08-08', submissions: 1450 },
        { date: '2024-08-15', submissions: 1680 },
        { date: '2024-08-22', submissions: 1820 },
        { date: '2024-08-29', submissions: 1950 }
      ],
      userGrowth: [
        { month: 'Jan', professors: 180, students: 4200 },
        { month: 'Feb', professors: 195, students: 4580 },
        { month: 'Mar', professors: 210, students: 4920 },
        { month: 'Apr', professors: 225, students: 5340 },
        { month: 'May', professors: 234, students: 5672 }
      ]
    }
  },
  professor: {
    totalStudents: 45,
    activeAssignments: 3,
    pendingGrading: 12,
    averageScore: 82.4,
    chartData: {
      classProgress: [
        { week: 'Week 1', completed: 42, total: 45 },
        { week: 'Week 2', completed: 38, total: 45 },
        { week: 'Week 3', completed: 35, total: 45 },
        { week: 'Week 4', completed: 40, total: 45 }
      ],
      submissionTrends: [
        { date: '2024-08-22', submissions: 25 },
        { date: '2024-08-23', submissions: 32 },
        { date: '2024-08-24', submissions: 28 },
        { date: '2024-08-25', submissions: 35 },
        { date: '2024-08-26', submissions: 42 }
      ]
    }
  },
  student: {
    problemsSolved: 15,
    accuracy: 87.5,
    currentStreak: 7,
    ranking: 1,
    chartData: {
      accuracyTrend: [
        { date: '2024-08-01', accuracy: 65 },
        { date: '2024-08-08', accuracy: 72 },
        { date: '2024-08-15', accuracy: 78 },
        { date: '2024-08-22', accuracy: 83 },
        { date: '2024-08-29', accuracy: 87.5 }
      ],
      timeDistribution: [
        { difficulty: 'Easy', avgTime: 15 },
        { difficulty: 'Medium', avgTime: 45 },
        { difficulty: 'Hard', avgTime: 120 }
      ]
    }
  }
};