import { Ticket, User, DashboardMetrics } from '../types';

export const mockUsers: User[] = [
  {
    id: 'admin-1',
    email: 'admin@company.com',
    name: 'System Administrator',
    role: 'admin',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
    createdAt: new Date('2024-01-01'),
    lastLogin: new Date(),
    isActive: true
  },
  {
    id: 'agent-1',
    email: 'john.doe@company.com',
    name: 'John Doe',
    role: 'agent',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
    createdAt: new Date('2024-01-15'),
    lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    isActive: true
  },
  {
    id: 'agent-2',
    email: 'jane.smith@company.com',
    name: 'Jane Smith',
    role: 'agent',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    createdAt: new Date('2024-01-20'),
    lastLogin: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    isActive: true
  }
];

export const mockTickets: Ticket[] = [
  {
    id: 'TKT-001',
    title: 'Server Database Connection Issues',
    description: 'Production database server experiencing intermittent connection timeouts. Users reporting slow response times and occasional failures.',
    status: 'in_progress',
    priority: 'critical',
    category: 'Database',
    submittedBy: mockUsers[1],
    assignedTo: mockUsers[2],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    updatedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    sla: {
      deadline: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
      timeRemaining: 6 * 60 * 60 * 1000, // 6 hours in ms
      isBreached: false
    },
    tags: ['production', 'database', 'urgent'],
    comments: [
      {
        id: 'comment-1',
        ticketId: 'TKT-001',
        author: mockUsers[2],
        content: 'Started investigating the database connection pool settings. Initial findings suggest connection limit might be reached.',
        createdAt: new Date(Date.now() - 30 * 60 * 1000),
        isInternal: true
      }
    ]
  },
  {
    id: 'TKT-002',
    title: 'Network Latency Issues in Office Network',
    description: 'Several users reporting slow network performance, particularly when accessing shared drives and cloud services.',
    status: 'open',
    priority: 'high',
    category: 'Network',
    submittedBy: mockUsers[1],
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    sla: {
      deadline: new Date(Date.now() + 20 * 60 * 60 * 1000), // 20 hours from now
      timeRemaining: 20 * 60 * 60 * 1000,
      isBreached: false
    },
    tags: ['network', 'performance'],
    comments: []
  },
  {
    id: 'TKT-003',
    title: 'Email Server Maintenance Required',
    description: 'Monthly maintenance required for email server. Need to schedule downtime and update all users.',
    status: 'resolved',
    priority: 'medium',
    category: 'Maintenance',
    submittedBy: mockUsers[0],
    assignedTo: mockUsers[1],
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    resolvedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    sla: {
      deadline: new Date(Date.now() - 16 * 60 * 60 * 1000), // Was 8 hours ago
      timeRemaining: 0,
      isBreached: false
    },
    resolutionTime: 22 * 60 * 60 * 1000, // 22 hours
    tags: ['maintenance', 'email'],
    comments: [
      {
        id: 'comment-2',
        ticketId: 'TKT-003',
        author: mockUsers[1],
        content: 'Maintenance completed successfully. All users notified.',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isInternal: false
      }
    ]
  },
  {
    id: 'TKT-004',
    title: 'SSL Certificate Renewal',
    description: 'SSL certificate for main website expires in 2 weeks. Need to renew and update all related services.',
    status: 'open',
    priority: 'low',
    category: 'Security',
    submittedBy: mockUsers[0],
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    sla: {
      deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      timeRemaining: 5 * 24 * 60 * 60 * 1000,
      isBreached: false
    },
    tags: ['security', 'ssl', 'maintenance'],
    comments: []
  }
];

export const mockMetrics: DashboardMetrics = {
  totalTickets: 15,
  openTickets: 3,
  inProgressTickets: 2,
  resolvedTickets: 8,
  closedTickets: 2,
  averageResolutionTime: 18.5, // hours
  slaCompliance: 92.3, // percentage
  breachedSLA: 1,
  ticketsByPriority: {
    critical: 2,
    high: 4,
    medium: 6,
    low: 3
  },
  ticketsByCategory: {
    Database: 3,
    Network: 4,
    Security: 2,
    Maintenance: 3,
    Hardware: 2,
    Software: 1
  },
  resolutionTrend: [
    { date: '2024-01-01', resolved: 2, created: 3 },
    { date: '2024-01-02', resolved: 1, created: 2 },
    { date: '2024-01-03', resolved: 3, created: 1 },
    { date: '2024-01-04', resolved: 2, created: 4 },
    { date: '2024-01-05', resolved: 4, created: 2 },
    { date: '2024-01-06', resolved: 1, created: 3 },
    { date: '2024-01-07', resolved: 3, created: 1 }
  ]
};