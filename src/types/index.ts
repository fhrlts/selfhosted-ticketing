export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'agent' | 'user';
  avatar?: string;
  createdAt: Date;
  lastLogin?: Date;
  isActive: boolean;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  submittedBy: User;
  assignedTo?: User;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  closedAt?: Date;
  sla: {
    deadline: Date;
    timeRemaining: number;
    isBreached: boolean;
  };
  resolutionTime?: number;
  tags: string[];
  comments: TicketComment[];
  notionId?: string;
}

export interface TicketComment {
  id: string;
  ticketId: string;
  author: User;
  content: string;
  createdAt: Date;
  isInternal: boolean;
}

export interface TicketFilter {
  status?: string[];
  priority?: string[];
  category?: string[];
  assignedTo?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface DashboardMetrics {
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  resolvedTickets: number;
  closedTickets: number;
  averageResolutionTime: number;
  slaCompliance: number;
  breachedSLA: number;
  ticketsByPriority: Record<string, number>;
  ticketsByCategory: Record<string, number>;
  resolutionTrend: Array<{
    date: string;
    resolved: number;
    created: number;
  }>;
}

export interface NotionConfig {
  token: string;
  databaseId: string;
  isConnected: boolean;
}