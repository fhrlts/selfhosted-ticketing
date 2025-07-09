import React, { useState, useEffect } from 'react';
import { useAuth, AuthProvider } from './context/AuthContext';
import { apiService } from './services/api';
import { Ticket, User, DashboardMetrics } from './types';
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
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [showCreateTicket, setShowCreateTicket] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [ticketsData, usersData, metricsData] = await Promise.all([
        apiService.getTickets(),
        user?.role === 'admin' ? apiService.getUsers() : Promise.resolve([]),
        apiService.getDashboardMetrics()
      ]);
      
      setTickets(ticketsData);
      setUsers(usersData);
      setMetrics(metricsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update SLA status periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setTickets(prevTickets => 
        prevTickets.map(ticket => updateSLAStatus(ticket))
      );
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const handleCreateTicket = async (ticketData: any) => {
    try {
      const newTicket = await apiService.createTicket(ticketData);
      setTickets(prev => [newTicket, ...prev]);
      
      // Refresh metrics
      const updatedMetrics = await apiService.getDashboardMetrics();
      setMetrics(updatedMetrics);
    } catch (error) {
      console.error('Error creating ticket:', error);
    }
  };

  const handleCreateUser = async (userData: Partial<User>) => {
    try {
      const newUser = await apiService.createUser(userData);
      setUsers(prev => [...prev, newUser]);
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleUpdateUser = async (userId: string, userData: Partial<User>) => {
    try {
      const updatedUser = await apiService.updateUser(userId, userData);
      setUsers(prev => prev.map(user => 
        user.id === userId ? updatedUser : user
      ));
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  if (!user) {
    return <LoginForm />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
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
              {metrics && <MetricsDisplay metrics={metrics} />}
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
            metrics && <AnalyticsDashboard metrics={metrics} />
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