import React, { useState } from 'react';
import { X, Plus, Trash2, Subtitles, Link, Upload, ChevronDown, ChevronUp, Play } from 'lucide-react';
import { ANIME_GENRES, SUPPORTED_PLATFORMS, SUBTITLE_LANGUAGES } from '../types/anime';
import { AnimeWithDetails } from '../hooks/useLocalAnime';

interface EditAnimeModalProps {
  anime: AnimeWithDetails;
  onUpdate: (id: string, anime: Partial<AnimeWithDetails>) => void;
  onClose: () => void;
}

const EditAnimeModal: React.FC<EditAnimeModalProps> = ({ anime, onUpdate, onClose }) => {
  const [formData, setFormData] = useState({
    title: anime.title,
    description: anime.description,
    synopsis: anime.synopsis,
    thumbnail_url: anime.thumbnail_url || '',
    genres: anime.genres,
    rating: anime.rating,
    release_year: anime.release_year,
    status: anime.status,
    episode_count: anime.episode_count,
    studio_name: anime.studio_name || '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await onUpdate(anime.id, formData);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update anime');
    } finally {
      setLoading(false);
    }
  };

  const handleGenreToggle = (genre: string) => {
    setFormData(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre]
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Edit Anime</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-400 mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({...prev, title: e.target.value}))}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Studio Name
              </label>
              <input
                type="text"
                value={formData.studio_name}
                onChange={(e) => setFormData(prev => ({...prev, studio_name: e.target.value}))}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Thumbnail URL
              </label>
              <input
                type="url"
                value={formData.thumbnail_url}
                onChange={(e) => setFormData(prev => ({...prev, thumbnail_url: e.target.value}))}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Rating (0-10) *
              </label>
              <input
                type="number"
                min="0"
                max="10"
                step="0.1"
                required
                value={formData.rating}
                onChange={(e) => setFormData(prev => ({...prev, rating: parseFloat(e.target.value)}))}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Release Year *
              </label>
              <input
                type="number"
                min="1900"
                max={new Date().getFullYear() + 5}
                required
                value={formData.release_year}
                onChange={(e) => setFormData(prev => ({...prev, release_year: parseInt(e.target.value)}))}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Status *
              </label>
              <select
                required
                value={formData.status}
                onChange={(e) => setFormData(prev => ({...prev, status: e.target.value as 'ongoing' | 'completed' | 'upcoming'}))}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Brief description..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Synopsis
            </label>
            <textarea
              rows={4}
              value={formData.synopsis}
              onChange={(e) => setFormData(prev => ({...prev, synopsis: e.target.value}))}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Detailed plot summary..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Genres (select multiple)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-32 overflow-y-auto bg-gray-700 p-3 rounded-lg">
              {ANIME_GENRES.map(genre => (
                <label key={genre} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-600 p-1 rounded">
                  <input
                    type="checkbox"
                    checked={formData.genres.includes(genre)}
                    onChange={() => handleGenreToggle(genre)}
                    className="text-purple-500 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-300">{genre}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-400 mb-2">📝 Note about Episodes & Links:</h3>
            <p className="text-xs text-blue-300">
              Episode-specific details and links are managed separately. This form only updates the basic anime information. 
              To add or modify episode links, use the "Bulk Upload" feature or contact support for advanced episode management.
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAnimeModal;