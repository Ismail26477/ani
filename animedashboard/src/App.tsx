import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import AnimeList from './components/AnimeList';
import AddAnime from './components/AddAnime';
import BulkUpload from './components/BulkUpload';
import Settings from './components/Settings';
import AuthForm from './components/AuthForm';
import { useAuth } from './hooks/useLocalAuth';
import { useAnime } from './hooks/useLocalAnime';
import { LogOut } from 'lucide-react';

function App() {
  const { user, loading: authLoading, signOut } = useAuth();
  const { anime, loading: animeLoading, addAnime, updateAnime, deleteAnime, addLinksToAnime } = useAnime();
  const [currentPage, setCurrentPage] = useState('anime-list');
  const [selectedAnime, setSelectedAnime] = useState<string | null>(null);

  // Debug authentication state
  console.log('App render - Auth state:', { user: user?.email || 'null', authLoading });

  const handleSignOut = async () => {
    // Disabled sign out in direct access mode
    console.log('Sign out is disabled in direct access mode');
  };

  // Removed authentication check to directly show dashboard

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'anime-list':
        return (
          <AnimeList
            anime={anime}
            onUpdateAnime={updateAnime}
            onDeleteAnime={deleteAnime}
            selectedAnime={selectedAnime}
            setSelectedAnime={setSelectedAnime}
            loading={animeLoading}
          />
        );
      case 'add-anime':
        return (
          <AddAnime
            onAddAnime={addAnime}
            onSuccess={() => setCurrentPage('anime-list')}
          />
        );
      case 'bulk-upload':
        return (
          <BulkUpload
            anime={anime}
            onAddLinks={addLinksToAnime}
          />
        );
      case 'settings':
        return (
          <Settings
            anime={anime}
            user={user}
          />
        );
      default:
        return <AnimeList anime={anime} onUpdateAnime={updateAnime} onDeleteAnime={deleteAnime} selectedAnime={selectedAnime} setSelectedAnime={setSelectedAnime} loading={animeLoading} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header with user info and sign out */}
      <header className="fixed top-0 right-0 z-40 p-4">
        <div className="flex items-center space-x-4 bg-gray-800 rounded-lg px-4 py-2 border border-gray-700">
          <div className="text-sm">
            <p className="text-gray-300">Welcome back</p>
            <p className="text-white font-medium">{user?.email || 'Default User'}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="p-2 text-gray-400 hover:text-red-400 transition-colors"
            title="Sign Out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      <div className="flex">
        <Sidebar
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          animeCount={anime.length}
        />
        <main className="flex-1 ml-64 pt-16">
          {renderCurrentPage()}
        </main>
      </div>
    </div>
  );
}

export default App;