import React from 'react';
import { 
  Library, 
  Plus, 
  Upload, 
  Settings as SettingsIcon,
  Play,
  TrendingUp
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  animeCount: number;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage, animeCount }) => {
  const menuItems = [
    {
      id: 'anime-list',
      label: 'Anime List',
      icon: Library,
      description: `${animeCount} anime`
    },
    {
      id: 'add-anime',
      label: 'Add Anime',
      icon: Plus,
      description: 'Create new entry'
    },
    {
      id: 'bulk-upload',
      label: 'Bulk Upload',
      icon: Upload,
      description: 'Upload links'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: SettingsIcon,
      description: 'Preferences & data'
    }
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gray-800 border-r border-gray-700 overflow-y-auto">
      <div className="p-6">
        {/* Logo */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg">
            <Play className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">AnimeDB</h1>
            <p className="text-sm text-gray-400">Dashboard</p>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg p-4 mb-6 border border-purple-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-white">{animeCount}</p>
              <p className="text-sm text-gray-400">Total Anime</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-400" />
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                  ${isActive 
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }
                `}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                <div className="flex-1 text-left">
                  <p className="font-medium">{item.label}</p>
                  <p className={`text-xs ${isActive ? 'text-purple-100' : 'text-gray-500'}`}>
                    {item.description}
                  </p>
                </div>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;