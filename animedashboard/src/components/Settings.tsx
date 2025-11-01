import React, { useRef, useState } from 'react';
import { 
  Download, 
  Database, 
  Check,
  AlertCircle,
  Settings as SettingsIcon,
  User as UserIcon
} from 'lucide-react';
import { AnimeWithDetails } from '../hooks/useLocalAnime';
import { User } from '../hooks/useLocalAuth';

interface SettingsProps {
  anime: AnimeWithDetails[];
  user: User | null;
}

const Settings: React.FC<SettingsProps> = ({ anime, user }) => {
  const [message, setMessage] = useState<{type: 'success' | 'error'; text: string} | null>(null);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const exportData = () => {
    try {
      const dataStr = JSON.stringify({ anime }, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `anime_data_${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      showMessage('success', 'Data exported successfully!');
    } catch (error) {
      showMessage('error', 'Failed to export data');
    }
  };

  const stats = {
    totalAnime: anime.length,
    totalLinks: anime.reduce((sum, item) => sum + item.episodes.reduce((epSum, ep) => epSum + ep.links.length, 0), 0),
    completedAnime: anime.filter(item => item.status === 'completed').length,
    ongoingAnime: anime.filter(item => item.status === 'ongoing').length,
    averageRating: anime.length > 0 
      ? (anime.reduce((sum, item) => sum + item.rating, 0) / anime.length).toFixed(1)
      : '0',
    topGenres: (() => {
      const genreCounts: { [key: string]: number } = {};
      anime.forEach(item => {
        item.genres.forEach(genre => {
          genreCounts[genre] = (genreCounts[genre] || 0) + 1;
        });
      });
      return Object.entries(genreCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([genre, count]) => `${genre} (${count})`);
    })()
  };

  if (!user) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-gray-400">Please sign in to access settings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white flex items-center space-x-2">
          <SettingsIcon className="h-8 w-8 text-purple-400" />
          <span>Settings & Account</span>
        </h1>
        <p className="text-gray-400 mt-2">Manage your anime database and export/import data</p>
      </div>

      {message && (
        <div className={`
          mb-6 px-4 py-3 rounded-lg border flex items-center space-x-2
          ${message.type === 'success' 
            ? 'bg-green-500/20 border-green-500 text-green-400' 
            : 'bg-red-500/20 border-red-500 text-red-400'
          }
        `}>
          {message.type === 'success' ? (
            <Check className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Profile */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
            <UserIcon className="h-5 w-5 text-green-400" />
            <span>Account Information</span>
          </h2>
          
          <div className="space-y-4">
            <div className="bg-gray-700/50 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Email Address</p>
              <p className="text-white font-medium">{user.email}</p>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Account Created</p>
              <p className="text-white font-medium">{new Date(user.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
            <Database className="h-5 w-5 text-blue-400" />
            <span>Database Statistics</span>
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-700/50 rounded-lg p-3">
              <p className="text-2xl font-bold text-white">{stats.totalAnime}</p>
              <p className="text-sm text-gray-400">Total Anime</p>
            </div>
            
            <div className="bg-gray-700/50 rounded-lg p-3">
              <p className="text-2xl font-bold text-purple-400">{stats.totalLinks}</p>
              <p className="text-sm text-gray-400">Total Links</p>
            </div>
            
            <div className="bg-gray-700/50 rounded-lg p-3">
              <p className="text-2xl font-bold text-green-400">{stats.completedAnime}</p>
              <p className="text-sm text-gray-400">Completed</p>
            </div>
            
            <div className="bg-gray-700/50 rounded-lg p-3">
              <p className="text-2xl font-bold text-yellow-400">{stats.ongoingAnime}</p>
              <p className="text-sm text-gray-400">Ongoing</p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <div className="bg-gray-700/50 rounded-lg p-3">
              <p className="text-lg font-semibold text-white">{stats.averageRating}/10</p>
              <p className="text-sm text-gray-400">Average Rating</p>
            </div>
            
            <div className="bg-gray-700/50 rounded-lg p-3">
              <p className="text-sm font-semibold text-white mb-1">Top Genres:</p>
              <div className="space-y-1">
                {stats.topGenres.length > 0 ? (
                  stats.topGenres.map((genre, index) => (
                    <span key={index} className="inline-block text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded mr-1">
                      {genre}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-gray-500">No genres yet</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
            <Database className="h-5 w-5 text-green-400" />
            <span>Data Management</span>
          </h2>
          
          <div className="space-y-4">
            {/* Export Data */}
            <div className="bg-gray-700/50 rounded-lg p-4">
              <h3 className="font-semibold text-white mb-2">Export Data</h3>
              <p className="text-sm text-gray-400 mb-3">
                Download your anime database as a JSON file for backup or sharing.
              </p>
              <button
                onClick={exportData}
                className="w-full flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Export Database</span>
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Data Format Information */}
      <div className="mt-6 bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h2 className="text-lg font-bold text-white mb-3">Data Format Information</h2>
        <div className="bg-gray-700/50 rounded-lg p-4">
          <p className="text-sm text-gray-300 mb-2">
            Your data is securely stored in Supabase. The exported JSON file contains your anime data in this structure:
          </p>
          <pre className="text-xs text-gray-400 bg-gray-900 p-3 rounded overflow-x-auto">
{`{
  "anime": [
    {
      "id": "unique_id",
      "title": "Anime Title",
      "thumbnail": "image_url",
      "genres": ["Action", "Adventure"],
      "rating": 8.5,
      "year": 2023,
      "status": "Completed",
      "description": "Description text",
      "episodes": 24,
      "links": [
        {
          "platform": "WatchDT",
          "url": "streaming_url",
          "subtitles": [
            {
              "language": "English",
              "url": "subtitle_url",
              "format": "SRT"
            }
          ]
        }
      ]
    }
  ]
}`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default Settings;