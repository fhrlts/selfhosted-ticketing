import React, { useState } from 'react';
import { Database, Check, X, AlertCircle, ExternalLink } from 'lucide-react';

const NotionIntegration: React.FC = () => {
  const [config, setConfig] = useState({
    token: '',
    databaseId: '',
    isConnected: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConnect = async () => {
    setIsLoading(true);
    setError('');

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    if (config.token && config.databaseId) {
      setConfig(prev => ({ ...prev, isConnected: true }));
    } else {
      setError('Please provide both token and database ID');
    }

    setIsLoading(false);
  };

  const handleDisconnect = () => {
    setConfig(prev => ({ ...prev, isConnected: false }));
  };

  const handleTestConnection = async () => {
    setIsLoading(true);
    // Simulate test
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    alert('Connection test successful!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Notion Integration</h1>
        <p className="text-sm text-gray-600">
          Connect your ticketing system to Notion for seamless collaboration
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="bg-gray-100 rounded-lg p-3">
                <Database className="w-6 h-6 text-gray-600" />
              </div>
              <div className="ml-4">
                <h2 className="text-lg font-semibold text-gray-900">Notion Database</h2>
                <p className="text-sm text-gray-600">
                  Status: {config.isConnected ? (
                    <span className="text-green-600 font-medium">Connected</span>
                  ) : (
                    <span className="text-red-600 font-medium">Not Connected</span>
                  )}
                </p>
              </div>
            </div>
            {config.isConnected && (
              <div className="flex items-center text-green-600">
                <Check className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Active</span>
              </div>
            )}
          </div>

          {!config.isConnected ? (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-900 mb-1">Setup Instructions:</p>
                    <ol className="text-blue-700 space-y-1 list-decimal list-inside">
                      <li>Create a new integration in your Notion workspace</li>
                      <li>Copy the integration token</li>
                      <li>Create a database in Notion or use an existing one</li>
                      <li>Share the database with your integration</li>
                      <li>Copy the database ID from the URL</li>
                    </ol>
                    <a
                      href="https://developers.notion.com/docs/getting-started"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 mt-2"
                    >
                      View Notion documentation
                      <ExternalLink className="w-4 h-4 ml-1" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Integration Token
                  </label>
                  <input
                    type="password"
                    value={config.token}
                    onChange={(e) => setConfig(prev => ({ ...prev, token: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="secret_..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Database ID
                  </label>
                  <input
                    type="text"
                    value={config.databaseId}
                    onChange={(e) => setConfig(prev => ({ ...prev, databaseId: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="32-character database ID"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center">
                    <X className="w-5 h-5 text-red-600 mr-2" />
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  onClick={handleConnect}
                  disabled={isLoading || !config.token || !config.databaseId}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? 'Connecting...' : 'Connect to Notion'}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-2" />
                  <p className="text-green-700 text-sm">
                    Successfully connected to Notion database. Tickets will now be synced automatically.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Sync Settings</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Check className="w-4 h-4 text-green-600 mr-2" />
                      New tickets → Notion
                    </div>
                    <div className="flex items-center">
                      <Check className="w-4 h-4 text-green-600 mr-2" />
                      Status updates → Notion
                    </div>
                    <div className="flex items-center">
                      <Check className="w-4 h-4 text-green-600 mr-2" />
                      Comments → Notion
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Database Info</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>Database ID: {config.databaseId.slice(0, 8)}...</p>
                    <p>Last sync: Just now</p>
                    <p>Tickets synced: 15</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={handleTestConnection}
                  disabled={isLoading}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  {isLoading ? 'Testing...' : 'Test Connection'}
                </button>
                <button
                  onClick={handleDisconnect}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Disconnect
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotionIntegration;