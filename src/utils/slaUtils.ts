import { Ticket } from '../types';

export const calculateSLADeadline = (priority: string, createdAt: Date): Date => {
  const slaHours = {
    critical: 8, // 8 hours
    high: 24, // 24 hours
    medium: 72, // 72 hours (3 days)
    low: 120 // 120 hours (5 days)
  };

  const deadline = new Date(createdAt);
  deadline.setHours(deadline.getHours() + slaHours[priority as keyof typeof slaHours]);
  return deadline;
};

export const calculateTimeRemaining = (deadline: any): number => {
  // Ensure deadline is a Date object
  const deadlineDate = (deadline instanceof Date) ? deadline : new Date(deadline);
  const now = new Date();
  const remaining = deadlineDate.getTime() - now.getTime();
  return Math.max(0, remaining);
};




export const formatTimeRemaining = (ms: number): string => {
  if (ms === 0) return 'Expired';
  
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 24) {
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return `${days}d ${remainingHours}h`;
  }
  
  return `${hours}h ${minutes}m`;
};

export const getSLAStatus = (ticket: Ticket): 'safe' | 'warning' | 'critical' | 'breached' => {
  const timeRemaining = calculateTimeRemaining(ticket.sla.deadline);
  const totalSLATime = getSLADuration(ticket.priority);
  const percentageRemaining = (timeRemaining / totalSLATime) * 100;

  if (timeRemaining === 0) return 'breached';
  if (percentageRemaining <= 10) return 'critical';
  if (percentageRemaining <= 25) return 'warning';
  return 'safe';
};

export const getSLADuration = (priority: string): number => {
  const slaHours = {
    critical: 8,
    high: 24,
    medium: 72,
    low: 120
  };
  
  return slaHours[priority as keyof typeof slaHours] * 60 * 60 * 1000; // Convert to milliseconds
};

export const updateSLAStatus = (ticket: Ticket): Ticket => {
  const timeRemaining = calculateTimeRemaining(ticket.sla.deadline);
  return {
    ...ticket,
    sla: {
      ...ticket.sla,
      timeRemaining,
      isBreached: timeRemaining === 0
    }
  };
};