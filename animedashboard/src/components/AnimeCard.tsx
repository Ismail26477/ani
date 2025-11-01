import React, { useState } from 'react';
import { 
  Star, 
  Calendar, 
  Play, 
  Edit, 
  Trash2, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Eye,
  Subtitles,
  Building2,
  Clock
} from 'lucide-react';
import EditAnimeModal from './EditAnimeModal';
import { AnimeWithDetails } from '../hooks/useLocalAnime';

interface AnimeCardProps {
  anime: AnimeWithDetails;
  onUpdate: (id: string, anime: Partial<AnimeWithDetails>) => void;
  onDelete: (id: string) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
  viewMode: 'grid' | 'list';
}

const AnimeCard: React.FC<AnimeCardProps> = ({ 
  anime, 
  onUpdate, 
  onDelete, 
  isExpanded, 
  onToggleExpand,
  viewMode 
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [expandedEpisodes, setExpandedEpisodes] = useState<Set<string>>(new Set());

  const handleDelete = () => {
    if (showDeleteConfirm) {
      onDelete(anime.id);
      setShowDeleteConfirm(false);
    } else {
      setShowDeleteConfirm(true);
      setTimeout(() => setShowDeleteConfirm(false), 3000);
    }
  };

  const toggleEpisodeExpanded = (episodeId: string) => {
    setExpandedEpisodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(episodeId)) {
        newSet.delete(episodeId);
      } else {
        newSet.add(episodeId);
      }
      return newSet;
    });
  };

  const StatusBadge = () => (
    <span className={`
      px-2 py-1 text-xs font-semibold rounded-full
      ${anime.status === 'completed' 
        ? 'bg-green-500/20 text-green-400' 
        : anime.status === 'ongoing'
        ? 'bg-yellow-500/20 text-yellow-400'
        : 'bg-blue-500/20 text-blue-400'
      }
    `}>
      {anime.status.charAt(0).toUpperCase() + anime.status.slice(1)}
    </span>
  );

  if (viewMode === 'list') {
    return (
      <div className="bg-gray-800 rounded-lg border border-gray-700 hover:border-purple-500 transition-all duration-300">
        <div className="p-4">
          <div className="flex items-start space-x-4">
            <img
              src={anime.thumbnail_url || 'https://images.pexels.com/photos/1040160/pexels-photo-1040160.jpeg?auto=compress&cs=tinysrgb&w=120&h=160&fit=crop'}
              alt={anime.title}
              className="w-20 h-28 rounded-lg object-cover flex-shrink-0"
            />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1 truncate">{anime.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-400 mb-2">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>{anime.rating}/10</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{anime.release_year}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Play className="h-4 w-4" />
                      <span>{anime.episodes.length}/{anime.episode_count} eps</span>
                    </div>
                    {anime.studio_name && (
                      <div className="flex items-center space-x-1">
                        <Building2 className="h-4 w-4" />
                        <span>{anime.studio_name}</span>
                      </div>
                    )}
                  </div>
                  <StatusBadge />
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={onToggleExpand}
                    className="p-2 text-gray-400 hover:text-purple-400 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleDelete}
                    className={`p-2 transition-colors ${
                      showDeleteConfirm 
                        ? 'text-red-400 bg-red-500/20 rounded' 
                        : 'text-gray-400 hover:text-red-400'
                    }`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1 mt-2">
                {anime.genres.slice(0, 3).map(genre => (
                  <span key={genre} className="px-2 py-1 text-xs bg-purple-500/20 text-purple-300 rounded">
                    {genre}
                  </span>
                ))}
                {anime.genres.length > 3 && (
                  <span className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded">
                    +{anime.genres.length - 3}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {isExpanded && (
            <div className="mt-4 pt-4 border-t border-gray-700 space-y-4">
              <div>
                <p className="text-gray-300 text-sm leading-relaxed mb-2">{anime.description}</p>
                {anime.synopsis && anime.synopsis !== anime.description && (
                  <div className="bg-gray-700/50 p-3 rounded">
                    <h4 className="text-xs font-semibold text-gray-300 mb-1">Synopsis:</h4>
                    <p className="text-gray-400 text-xs leading-relaxed">{anime.synopsis}</p>
                  </div>
                )}
              </div>
              
              {anime.episodes.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-white mb-3">Episodes ({anime.episodes.length})</h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {anime.episodes.slice(0, 5).map((episode) => {
                      const isEpisodeExpanded = expandedEpisodes.has(episode.id);
                      
                      return (
                        <div key={episode.id} className="bg-gray-700 rounded border border-gray-600">
                          <div 
                            className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-600/50 transition-colors"
                            onClick={() => toggleEpisodeExpanded(episode.id)}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center justify-center w-6 h-6 bg-purple-600 rounded-full text-white text-xs font-medium">
                                {episode.episode_number}
                              </div>
                              <div>
                                <h5 className="text-white text-sm font-medium">
                                  Episode {episode.episode_number}
                                  {episode.title && `: ${episode.title}`}
                                </h5>
                                <p className="text-xs text-gray-400">
                                  {episode.links.length} link{episode.links.length !== 1 ? 's' : ''}
                                  {episode.duration && (
                                    <>
                                      <Clock className="h-3 w-3 inline mx-1" />
                                      {episode.duration}
                                    </>
                                  )}
                                </p>
                              </div>
                            </div>
                            {isEpisodeExpanded ? (
                              <ChevronUp className="h-4 w-4 text-gray-400" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-gray-400" />
                            )}
                          </div>

                          {isEpisodeExpanded && (
                            <div className="border-t border-gray-600 p-3 space-y-2">
                              {episode.description && (
                                <p className="text-xs text-gray-300">{episode.description}</p>
                              )}
                              
                              {episode.links.length > 0 ? (
                                <div className="space-y-1">
                                  {episode.links.map((link) => (
                                    <div key={link.id} className="bg-gray-600 p-2 rounded">
                                      <a
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center space-x-2 hover:text-purple-300 transition-colors text-xs"
                                      >
                                        <ExternalLink className="h-3 w-3 text-purple-400" />
                                        <span className="text-white">{link.platform}</span>
                                        {link.quality && (
                                          <span className="text-gray-400">({link.quality})</span>
                                        )}
                                        {link.file_size && (
                                          <span className="text-gray-400">- {link.file_size}</span>
                                        )}
                                      </a>
                                      {link.subtitles.length > 0 && (
                                        <div className="ml-5 mt-1 space-y-1">
                                          {link.subtitles.map((subtitle) => (
                                            <div key={subtitle.id} className="flex items-center space-x-2 text-xs text-gray-400">
                                              <Subtitles className="h-3 w-3" />
                                              <span>{subtitle.language}</span>
                                              {subtitle.url ? (
                                                <a href={subtitle.url} target="_blank" rel="noopener noreferrer" className="hover:text-purple-300">
                                                  (URL)
                                                </a>
                                              ) : (
                                                <span>(File: {subtitle.file_name})</span>
                                              )}
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-xs text-gray-500 italic">No links added for this episode</p>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                    {anime.episodes.length > 5 && (
                      <p className="text-xs text-gray-400 text-center py-2">
                        +{anime.episodes.length - 5} more episodes
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-purple-500 transition-all duration-300 group">
      <div className="relative">
        <img
          src={anime.thumbnail_url || 'https://images.pexels.com/photos/1040160/pexels-photo-1040160.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop'}
          alt={anime.title}
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-2 right-2">
          <StatusBadge />
        </div>
        <div className="absolute bottom-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={onToggleExpand}
            className="p-2 bg-gray-900/80 rounded text-white hover:bg-purple-600 transition-colors"
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="p-2 bg-gray-900/80 rounded text-white hover:bg-blue-600 transition-colors"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={handleDelete}
            className={`p-2 rounded transition-colors ${
              showDeleteConfirm 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-900/80 text-white hover:bg-red-600'
            }`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-white mb-2 truncate">{anime.title}</h3>
        
        <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-500" />
            <span>{anime.rating}/10</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{anime.release_year}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Play className="h-4 w-4" />
            <span>{anime.episodes.length}/{anime.episode_count} eps</span>
          </div>
        </div>

        {anime.studio_name && (
          <div className="flex items-center space-x-1 text-xs text-gray-400 mb-2">
            <Building2 className="h-3 w-3" />
            <span>{anime.studio_name}</span>
          </div>
        )}

        <div className="flex flex-wrap gap-1 mb-3">
          {anime.genres.slice(0, 2).map(genre => (
            <span key={genre} className="px-2 py-1 text-xs bg-purple-500/20 text-purple-300 rounded">
              {genre}
            </span>
          ))}
          {anime.genres.length > 2 && (
            <span className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded">
              +{anime.genres.length - 2}
            </span>
          )}
        </div>

        {isExpanded && (
          <div className="border-t border-gray-700 pt-3 space-y-3">
            <div>
              <p className="text-gray-300 text-sm leading-relaxed mb-2">{anime.description}</p>
              {anime.synopsis && anime.synopsis !== anime.description && (
                <div className="bg-gray-700/50 p-2 rounded">
                  <h4 className="text-xs font-semibold text-gray-300 mb-1">Synopsis:</h4>
                  <p className="text-gray-400 text-xs leading-relaxed">{anime.synopsis}</p>
                </div>
              )}
            </div>
            
            {anime.episodes.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-white mb-2">Episodes ({anime.episodes.length})</h4>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {anime.episodes.slice(0, 3).map((episode) => {
                    const isEpisodeExpanded = expandedEpisodes.has(episode.id);
                    
                    return (
                      <div key={episode.id} className="bg-gray-700 rounded">
                        <div 
                          className="flex items-center justify-between p-2 cursor-pointer hover:bg-gray-600/50 transition-colors"
                          onClick={() => toggleEpisodeExpanded(episode.id)}
                        >
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center justify-center w-5 h-5 bg-purple-600 rounded-full text-white text-xs font-medium">
                              {episode.episode_number}
                            </div>
                            <div>
                              <h5 className="text-white text-xs font-medium">
                                {episode.title || `Episode ${episode.episode_number}`}
                              </h5>
                              <p className="text-xs text-gray-400">
                                {episode.links.length} link{episode.links.length !== 1 ? 's' : ''}
                              </p>
                            </div>
                          </div>
                          {isEpisodeExpanded ? (
                            <ChevronUp className="h-3 w-3 text-gray-400" />
                          ) : (
                            <ChevronDown className="h-3 w-3 text-gray-400" />
                          )}
                        </div>

                        {isEpisodeExpanded && (
                          <div className="border-t border-gray-600 p-2 space-y-1">
                            {episode.description && (
                              <p className="text-xs text-gray-300 mb-2">{episode.description}</p>
                            )}
                            
                            {episode.links.length > 0 ? (
                              episode.links.map((link) => (
                                <div key={link.id} className="bg-gray-600 p-2 rounded">
                                  <a
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center space-x-2 hover:text-purple-300 transition-colors text-xs"
                                  >
                                    <ExternalLink className="h-3 w-3 text-purple-400" />
                                    <span className="text-white">{link.platform}</span>
                                    {link.quality && (
                                      <span className="text-gray-400">({link.quality})</span>
                                    )}
                                  </a>
                                  {link.subtitles.length > 0 && (
                                    <div className="ml-5 mt-1 space-y-1">
                                      {link.subtitles.slice(0, 2).map((subtitle) => (
                                        <div key={subtitle.id} className="flex items-center space-x-1 text-xs text-gray-400">
                                          <Subtitles className="h-3 w-3" />
                                          <span>{subtitle.language}</span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))
                            ) : (
                              <p className="text-xs text-gray-500 italic">No links for this episode</p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {anime.episodes.length > 3 && (
                    <p className="text-xs text-gray-400 text-center py-1">
                      +{anime.episodes.length - 3} more episodes
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {isEditModalOpen && (
        <EditAnimeModal
          anime={anime}
          onUpdate={onUpdate}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </div>
  );
};

export default AnimeCard;