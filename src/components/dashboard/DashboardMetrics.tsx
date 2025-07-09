import React from 'react';
import { DashboardMetrics } from '../../types';
import { 
  Ticket, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  Target
} from 'lucide-react';

interface DashboardMetricsProps {
  metrics: DashboardMetrics;
}

const DashboardMetrics: React.FC<DashboardMetricsProps> = ({ metrics }) => {
  const metricCards = [
    {
      title: 'Total Tickets',
      value: metrics.totalTickets,
      icon: Ticket,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Open Tickets',
      value: metrics.openTickets,
      icon: Clock,
      color: 'bg-orange-500',
      change: '-5%'
    },
    {
      title: 'Resolved Today',
      value: metrics.resolvedTickets,
      icon: CheckCircle,
      color: 'bg-green-500',
      change: '+8%'
    },
    {
      title: 'SLA Breached',
      value: metrics.breachedSLA,
      icon: AlertTriangle,
      color: 'bg-red-500',
      change: '-2%'
    },
    {
      title: 'Avg Resolution Time',
      value: `${metrics.averageResolutionTime}h`,
      icon: TrendingUp,
      color: 'bg-purple-500',
      change: '-15%'
    },
    {
      title: 'SLA Compliance',
      value: `${metrics.slaCompliance}%`,
      icon: Target,
      color: 'bg-indigo-500',
      change: '+3%'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {metricCards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{card.value}</p>
              </div>
              <div className={`${card.color} rounded-lg p-3`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className={`text-sm font-medium ${
                card.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
              }`}>
                {card.change}
              </span>
              <span className="text-sm text-gray-500 ml-2">from last week</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardMetrics;