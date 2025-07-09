import React, { useState, useEffect } from 'react';
import { useAuth, AuthProvider } from './context/AuthContext';
import { Ticket, User, DashboardMetrics } from './types';
import { mockTickets, mockUsers, mockMetrics } from './data/mockData';
import { updateSLAStatus } from './utils/slaUtils';

// Components
import LoginForm from './components/auth/LoginForm';
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import MetricsDisplay from './components/dashboard/DashboardMetrics';
import RecentTickets from './components/dashboard/RecentTickets';
import TicketList from './components/tickets/TicketList';
import CreateTicketForm from './components/tickets/CreateTicketForm';
import UserManagement from './components/admin/UserManagement';
import NotionIntegration from './components/admin/NotionIntegration';
import AnalyticsDashboard from './components/analytics/AnalyticsDashboard';

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [metrics, setMetrics] = useState<DashboardMetrics>(mockMetrics);
  const [showCreateTicket, setShowCreateTicket] = useState(false);

  // Update SLA status periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setTickets(prevTickets => 
        prevTickets.map(ticket => updateSLAStatus(ticket))
      );
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const handleCreateTicket = (ticketData: any) => {
    const newTicket: Ticket = {
      id: `TKT-${String(tickets.length + 1).padStart(3, '0')}`,
      title: ticketData.title,
      description: ticketData.description,
      status: 'open',
      priority: ticketData.priority,
      category: ticketData.category,
      submittedBy: ticketData.submittedBy,
      createdAt: new Date(),
      updatedAt: new Date(),
      sla: {
        deadline: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
        timeRemaining: 24 * 60 * 60 * 1000,
        isBreached: false
      },
      tags: ticketData.tags,
      comments: []
    };

    setTickets(prev => [newTicket, ...prev]);
    setMetrics(prev => ({
      ...prev,
      totalTickets: prev.totalTickets + 1,
      openTickets: prev.openTickets + 1
    }));
  };

  const handleCreateUser = (userData: Partial<User>) => {
    const newUser: User = {
      id: `user-${users.length + 1}`,
      name: userData.name!,
      email: userData.email!,
      role: userData.role!,
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
      createdAt: userData.createdAt || new Date(),
      isActive: userData.isActive || true
    };

    setUsers(prev => [...prev, newUser]);
  };

  const handleUpdateUser = (userId: string, userData: Partial<User>) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, ...userData } : user
    ));
  };

  if (!user) {
    return <LoginForm />;
  }

  const recentTickets = tickets.slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 p-6">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-600">Welcome back, {user.name}!</p>
              </div>
              <MetricsDisplay metrics={metrics} />
              <RecentTickets tickets={recentTickets} />
            </div>
          )}

          {activeTab === 'tickets' && (
            <TicketList 
              tickets={tickets} 
              onCreateTicket={() => setShowCreateTicket(true)}
            />
          )}

          {activeTab === 'create-ticket' && (
            <div className="max-w-2xl mx-auto">
              <CreateTicketForm
                onClose={() => setActiveTab('tickets')}
                onSubmit={handleCreateTicket}
              />
            </div>
          )}

          {activeTab === 'users' && user.role === 'admin' && (
            <UserManagement 
              users={users}
              onCreateUser={handleCreateUser}
              onUpdateUser={handleUpdateUser}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsDashboard metrics={metrics} />
          )}

          {activeTab === 'notion' && (
            <NotionIntegration />
          )}

          {activeTab === 'settings' && (
            <div className="max-w-2xl">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">System Configuration</h2>
                <p className="text-gray-600">Settings panel coming soon...</p>
              </div>
            </div>
          )}
        </main>
      </div>

      {showCreateTicket && (
        <CreateTicketForm
          onClose={() => setShowCreateTicket(false)}
          onSubmit={handleCreateTicket}
        />
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;