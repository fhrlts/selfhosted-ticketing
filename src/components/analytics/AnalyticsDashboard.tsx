import React from 'react';
import { DashboardMetrics } from '../../types';
import { BarChart3, TrendingUp, Clock, Target, AlertTriangle } from 'lucide-react';

interface AnalyticsDashboardProps {
  metrics: DashboardMetrics;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ metrics }) => {
  const chartData = metrics.resolutionTrend.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    resolved: item.resolved,
    created: item.created
  }));

  const maxValue = Math.max(...chartData.map(d => Math.max(d.resolved, d.created)));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-sm text-gray-600">Performance metrics and trends</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Resolution Time</p>
              <p className="text-2xl font-semibold text-gray-900">{metrics.averageResolutionTime}h</p>
            </div>
            <div className="bg-blue-100 rounded-lg p-3">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-green-600 font-medium">↓ 15%</span>
            <span className="text-sm text-gray-500 ml-2">from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">SLA Compliance</p>
              <p className="text-2xl font-semibold text-gray-900">{metrics.slaCompliance}%</p>
            </div>
            <div className="bg-green-100 rounded-lg p-3">
              <Target className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-green-600 font-medium">↑ 3%</span>
            <span className="text-sm text-gray-500 ml-2">from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">SLA Breaches</p>
              <p className="text-2xl font-semibold text-gray-900">{metrics.breachedSLA}</p>
            </div>
            <div className="bg-red-100 rounded-lg p-3">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-red-600 font-medium">↑ 2</span>
            <span className="text-sm text-gray-500 ml-2">from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tickets</p>
              <p className="text-2xl font-semibold text-gray-900">{metrics.totalTickets}</p>
            </div>
            <div className="bg-purple-100 rounded-lg p-3">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-green-600 font-medium">↑ 12%</span>
            <span className="text-sm text-gray-500 ml-2">from last month</span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resolution Trend */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Resolution Trend</h3>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {chartData.map((item, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-12 text-sm text-gray-600">{item.date}</div>
                <div className="flex-1 flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${(item.resolved / maxValue) * 100}%` }}
                    />
                  </div>
                  <div className="w-8 text-sm text-gray-600">{item.resolved}</div>
                </div>
                <div className="flex-1 flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(item.created / maxValue) * 100}%` }}
                    />
                  </div>
                  <div className="w-8 text-sm text-gray-600">{item.created}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center space-x-6 mt-6">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2" />
              <span className="text-sm text-gray-600">Resolved</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2" />
              <span className="text-sm text-gray-600">Created</span>
            </div>
          </div>
        </div>

        {/* Priority Distribution */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Tickets by Priority</h3>
          <div className="space-y-4">
            {Object.entries(metrics.ticketsByPriority).map(([priority, count]) => {
              const percentage = (count / metrics.totalTickets) * 100;
              const colors = {
                critical: 'bg-red-500',
                high: 'bg-orange-500',
                medium: 'bg-blue-500',
                low: 'bg-green-500'
              };
              
              return (
                <div key={priority} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${colors[priority as keyof typeof colors]}`} />
                    <span className="text-sm font-medium text-gray-700 capitalize">{priority}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${colors[priority as keyof typeof colors]}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-8">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Category Distribution */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Tickets by Category</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(metrics.ticketsByCategory).map(([category, count]) => {
            const percentage = (count / metrics.totalTickets) * 100;
            
            return (
              <div key={category} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{category}</span>
                  <span className="text-sm text-gray-600">{count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-indigo-500 h-2 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">{percentage.toFixed(1)}%</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;