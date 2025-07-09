import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User, Settings } from 'lucide-react';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="bg-indigo-600 rounded-lg p-2">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <h1 className="ml-3 text-xl font-semibold text-gray-900">
              Infrastructure Ticketing
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <img
                src={user?.avatar || 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400'}
                alt={user?.name}
                className="w-8 h-8 rounded-full"
              />
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
            </div>
            
            <button
              onClick={logout}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Sign out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;