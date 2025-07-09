import React from 'react';
import { Ticket } from '../../types';
import { formatTimeRemaining, getSLAStatus } from '../../utils/slaUtils';
import { Clock, User, MessageSquare, AlertTriangle, CheckCircle } from 'lucide-react';

interface TicketCardProps {
  ticket: Ticket;
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket }) => {
  const slaStatus = getSLAStatus(ticket);
  const timeRemaining = formatTimeRemaining(ticket.sla.timeRemaining);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSLAColor = (slaStatus: string) => {
    switch (slaStatus) {
      case 'safe': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      case 'breached': return 'text-red-800';
      default: return 'text-gray-600';
    }
  };

  const getSLAIcon = (slaStatus: string) => {
    switch (slaStatus) {
      case 'breached': return AlertTriangle;
      case 'critical': return AlertTriangle;
      case 'warning': return Clock;
      default: return CheckCircle;
    }
  };

  const SLAIcon = getSLAIcon(slaStatus);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{ticket.title}</h3>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(ticket.priority)}`}>
                {ticket.priority}
              </span>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">{ticket.description}</p>
          </div>
          <div className="text-sm text-gray-500 ml-4">
            #{ticket.id}
          </div>
        </div>

        {/* Status and Tags */}
        <div className="flex items-center space-x-2 mb-4">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
            {ticket.status.replace('_', ' ')}
          </span>
          {ticket.tags.map(tag => (
            <span key={tag} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
              {tag}
            </span>
          ))}
        </div>

        {/* SLA Status */}
        <div className="flex items-center space-x-2 mb-4 p-3 bg-gray-50 rounded-lg">
          <SLAIcon className={`w-4 h-4 ${getSLAColor(slaStatus)}`} />
          <span className="text-sm font-medium text-gray-700">SLA:</span>
          <span className={`text-sm font-medium ${getSLAColor(slaStatus)}`}>
            {timeRemaining}
          </span>
          {slaStatus === 'breached' && (
            <span className="text-xs text-red-600 font-medium">BREACHED</span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <User className="w-4 h-4 mr-1" />
              {ticket.assignedTo?.name || 'Unassigned'}
            </div>
            <div className="flex items-center">
              <MessageSquare className="w-4 h-4 mr-1" />
              {ticket.comments.length}
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {ticket.createdAt.toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketCard;