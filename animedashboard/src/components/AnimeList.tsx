import React, { useState } from 'react';
import { Search, Filter, Grid, List, Loader } from 'lucide-react';
import AnimeCard from './AnimeCard';
import { AnimeWithDetails } from '../hooks/useLocalAnime';

interface AnimeListProps {
  anime: AnimeWithDetails[];
  onUpdateAnime: (id: string, anime: Partial<AnimeWithDetails>) => void;
  onDeleteAnime: (id: string) => void;
  selectedAnime: string | null;
  setSelectedAnime: (id: string | null) => void;
  loading: boolean;
}

const AnimeList: React.FC<AnimeListProps> = ({ 
  anime, 
  onUpdateAnime, 
  onDeleteAnime, 
  selectedAnime, 
  setSelectedAnime,
  loading
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredAnime = anime.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = !selectedGenre || item.genres.includes(selectedGenre);
    const matchesStatus = !selectedStatus || item.status === selectedStatus;
    const matchesRating = !selectedRating || (item.rating || 0) >= parseInt(selectedRating);
    
    return matchesSearch && matchesGenre && matchesStatus && matchesRating;
  });

  const genres = [...new Set(anime.flatMap(item => item.genres))];

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-white">Anime Collection</h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search anime..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">All Genres</option>
            {genres.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">All Status</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="upcoming">Upcoming</option>
          </select>

          <select
            value={selectedRating}
            onChange={(e) => setSelectedRating(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">All Ratings</option>
            <option value="8">8+ Rating</option>
            <option value="7">7+ Rating</option>
            <option value="6">6+ Rating</option>
            <option value="5">5+ Rating</option>
          </select>

          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Filter className="h-4 w-4" />
            <span>{filteredAnime.length} results</span>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-2 text-purple-400">
            <Loader className="h-6 w-6 animate-spin" />
            <span>Loading anime...</span>
          </div>
        </div>
      )}

      {/* Anime Grid */}
      {!loading && filteredAnime.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-800 rounded-lg p-8 max-w-md mx-auto">
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No anime found</h3>
            <p className="text-gray-500">Try adjusting your search criteria or add some anime to get started!</p>
          </div>
        </div>
      ) : (
        !loading && <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {filteredAnime.map(anime => (
            <AnimeCard
              key={anime.id}
              anime={anime}
              onUpdate={onUpdateAnime}
              onDelete={onDeleteAnime}
              isExpanded={selectedAnime === anime.id}
              onToggleExpand={() => setSelectedAnime(selectedAnime === anime.id ? null : anime.id)}
              viewMode={viewMode}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AnimeList;