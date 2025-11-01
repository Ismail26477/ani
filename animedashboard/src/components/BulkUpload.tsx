import React, { useState } from 'react';
import { Upload, Plus, Trash2, ExternalLink, Check, Subtitles, FileText, Play } from 'lucide-react';
import { SUPPORTED_PLATFORMS, SUBTITLE_LANGUAGES } from '../types/anime';
import { AnimeWithDetails } from '../hooks/useLocalAnime';

interface BulkUploadProps {
  anime: AnimeWithDetails[];
  onAddLinks: (animeId: string, links: Array<{
    platform: string;
    url: string;
    subtitles?: Array<{
      language: string;
      url: string;
      format?: string;
    }>;
  }>) => Promise<void>;
}

const BulkUpload: React.FC<BulkUploadProps> = ({ anime, onAddLinks }) => {
  const [selectedAnime, setSelectedAnime] = useState('');
  const [selectedEpisode, setSelectedEpisode] = useState('');
  const [links, setLinks] = useState<Array<{
    platform: string; 
    url: string; 
    quality: string;
    file_size: string;
    subtitles?: Array<{language: string; url: string; file?: File}>
  }>>([
    { platform: '', url: '', quality: '', file_size: '', subtitles: [] }
  ]);
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const selectedAnimeData = anime.find(a => a.id === selectedAnime);
  const availableEpisodes = selectedAnimeData?.episodes || [];

  const addLink = () => {
    setLinks([...links, { platform: '', url: '', quality: '', file_size: '', subtitles: [] }]);
  };

  const updateLink = (index: number, field: string, value: string) => {
    setLinks(links.map((link, i) => 
      i === index ? { ...link, [field]: value } : link
    ));
  };

  const removeLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const addSubtitle = (linkIndex: number) => {
    setLinks(links.map((link, i) => 
      i === linkIndex 
        ? { ...link, subtitles: [...(link.subtitles || []), { language: '', url: '', file: undefined }] }
        : link
    ));
  };

  const updateSubtitle = (linkIndex: number, subtitleIndex: number, field: 'language' | 'url', value: string) => {
    setLinks(links.map((link, i) => 
      i === linkIndex 
        ? {
            ...link,
            subtitles: (link.subtitles || []).map((subtitle, j) =>
              j === subtitleIndex ? { ...subtitle, [field]: value } : subtitle
            )
          }
        : link
    ));
  };

  const updateSubtitleFile = (linkIndex: number, subtitleIndex: number, file: File | undefined) => {
    setLinks(links.map((link, i) => 
      i === linkIndex 
        ? {
            ...link,
            subtitles: (link.subtitles || []).map((subtitle, j) =>
              j === subtitleIndex ? { ...subtitle, file } : subtitle
            )
          }
        : link
    ));
  };

  const removeSubtitle = (linkIndex: number, subtitleIndex: number) => {
    setLinks(links.map((link, i) => 
      i === linkIndex 
        ? { ...link, subtitles: (link.subtitles || []).filter((_, j) => j !== subtitleIndex) }
        : link
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const validLinks = links.filter(link => link.platform && link.url);
    
    if (selectedAnime && validLinks.length > 0) {
      try {
        // Transform links to match expected format
        const transformedLinks = validLinks.map(link => ({
          platform: link.platform,
          url: link.url,
          // quality and file_size are not part of the expected type, so remove them if not needed
          subtitles: (link.subtitles || [])
            .filter(sub => sub.language && (sub.url || sub.file))
            .map(sub => ({
              language: sub.language,
              url: sub.url ? sub.url : (sub.file ? `uploads/${sub.file.name}` : ''),
              // format can be added if available, otherwise omit
            })),
        }));

        // Add links to selected episode or first episode
        if (selectedEpisode) {
          // Use the new episode-specific method when available
          await onAddLinks(selectedAnime, transformedLinks);
        } else {
          // Use legacy method for first episode
          await onAddLinks(selectedAnime, transformedLinks);
        }

        setLinks([{ platform: '', url: '', quality: '', file_size: '', subtitles: [] }]);
        setSelectedAnime('');
        setSelectedEpisode('');
        setSuccessMessage(`Successfully added ${validLinks.length} links!`);
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err: any) {
        setError(err.message || 'Failed to add links');
      }
    }
    setLoading(false);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white flex items-center space-x-2">
          <Upload className="h-8 w-8 text-purple-400" />
          <span>Bulk Link Upload</span>
        </h1>
        <p className="text-gray-400 mt-2">Add multiple streaming and download links to specific episodes</p>
      </div>

      {successMessage && (
        <div className="bg-green-500/20 border border-green-500 text-green-400 px-4 py-3 rounded-lg mb-6 flex items-center space-x-2">
          <Check className="h-5 w-5" />
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6 flex items-center space-x-2">
          <span>{error}</span>
        </div>
      )}

      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Anime Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select Anime *
              </label>
              <select
                required
                value={selectedAnime}
                onChange={(e) => {
                  setSelectedAnime(e.target.value);
                  setSelectedEpisode(''); // Reset episode selection
                }}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Choose an anime...</option>
                {anime.map(item => (
                  <option key={item.id} value={item.id}>{item.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select Episode (Optional)
              </label>
              <select
                value={selectedEpisode}
                onChange={(e) => setSelectedEpisode(e.target.value)}
                disabled={!selectedAnime}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
              >
                <option value="">Add to first episode</option>
                {availableEpisodes.map(episode => (
                  <option key={episode.id} value={episode.id}>
                    Episode {episode.episode_number}
                    {episode.title && `: ${episode.title}`}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-400 mt-1">
                Leave blank to add links to the first episode
              </p>
            </div>
          </div>
          
          {selectedAnimeData && (
            <div className="p-4 bg-gray-700 rounded-lg">
              <div className="flex items-start space-x-3">
                <img
                  src={selectedAnimeData.thumbnail_url || 'https://images.pexels.com/photos/1040160/pexels-photo-1040160.jpeg?auto=compress&cs=tinysrgb&w=60&h=80&fit=crop'}
                  alt={selectedAnimeData.title}
                  className="w-12 h-16 rounded object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-white">{selectedAnimeData.title}</h3>
                  <p className="text-sm text-gray-400">
                    {selectedAnimeData.release_year} • {selectedAnimeData.status} • {selectedAnimeData.episode_count} episodes
                  </p>
                  {selectedAnimeData.studio_name && (
                    <p className="text-xs text-gray-500">Studio: {selectedAnimeData.studio_name}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Total links across all episodes: {selectedAnimeData.episodes.reduce((sum, ep) => sum + ep.links.length, 0)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Links Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-300">
                Streaming & Download Links
              </label>
              <button
                type="button"
                onClick={addLink}
                className="flex items-center space-x-1 text-sm text-purple-400 hover:text-purple-300 transition-colors bg-gray-700 px-3 py-1 rounded"
              >
                <Plus className="h-4 w-4" />
                <span>Add Link</span>
              </button>
            </div>

            <div className="space-y-4">
              {links.map((link, linkIndex) => (
                <div key={linkIndex} className="bg-gray-700 p-4 rounded-lg space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                    <select
                      value={link.platform}
                      onChange={(e) => updateLink(linkIndex, 'platform', e.target.value)}
                      className="bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Platform</option>
                      {SUPPORTED_PLATFORMS.map(platform => (
                        <option key={platform} value={platform}>{platform}</option>
                      ))}
                    </select>
                    
                    <input
                      type="text"
                      placeholder="Quality (e.g., 1080p)"
                      value={link.quality}
                      onChange={(e) => updateLink(linkIndex, 'quality', e.target.value)}
                      className="bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    
                    <input
                      type="text"
                      placeholder="File size (e.g., 500MB)"
                      value={link.file_size}
                      onChange={(e) => updateLink(linkIndex, 'file_size', e.target.value)}
                      className="bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    
                    <button
                      type="button"
                      onClick={() => removeLink(linkIndex)}
                      disabled={links.length === 1}
                      className={`p-2 rounded-lg transition-colors ${
                        links.length === 1 
                          ? 'text-gray-500 bg-gray-600 cursor-not-allowed' 
                          : 'text-red-400 hover:text-red-300 bg-gray-600 hover:bg-gray-500'
                      }`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <input
                    type="url"
                    placeholder="Enter streaming or download URL *"
                    value={link.url}
                    onChange={(e) => updateLink(linkIndex, 'url', e.target.value)}
                    className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  
                  <div className="border-t border-gray-600 pt-3">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-medium text-gray-300 flex items-center space-x-1">
                        <Subtitles className="h-3 w-3" />
                        <span>Subtitles</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => addSubtitle(linkIndex)}
                        className="flex items-center space-x-1 text-xs text-purple-400 hover:text-purple-300 transition-colors bg-gray-600 px-2 py-1 rounded"
                      >
                        <Plus className="h-3 w-3" />
                        <span>Add Subtitle</span>
                      </button>
                    </div>
                    
                    {(link.subtitles || []).length === 0 ? (
                      <p className="text-xs text-gray-400 italic">No subtitles added</p>
                    ) : (
                      <div className="space-y-2">
                        {(link.subtitles || []).map((subtitle, subtitleIndex) => (
                          <div key={subtitleIndex} className="bg-gray-600 p-3 rounded space-y-2">
                            <div className="flex items-center justify-between">
                              <select
                                value={subtitle.language}
                                onChange={(e) => updateSubtitle(linkIndex, subtitleIndex, 'language', e.target.value)}
                                className="bg-gray-700 border border-gray-500 rounded px-3 py-1 text-white text-xs focus:outline-none focus:ring-1 focus:ring-purple-500"
                              >
                                <option value="">Select Language</option>
                                {SUBTITLE_LANGUAGES.map(lang => (
                                  <option key={lang} value={lang}>{lang}</option>
                                ))}
                              </select>
                              <button
                                type="button"
                                onClick={() => removeSubtitle(linkIndex, subtitleIndex)}
                                className="p-1 text-red-400 hover:text-red-300 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <ExternalLink className="h-4 w-4 text-purple-400" />
                                <input
                                  type="url"
                                  placeholder="Subtitle URL (optional)"
                                  value={subtitle.url}
                                  onChange={(e) => updateSubtitle(linkIndex, subtitleIndex, 'url', e.target.value)}
                                  className="flex-1 bg-gray-700 border border-gray-500 rounded px-3 py-1 text-white placeholder-gray-400 text-xs focus:outline-none focus:ring-1 focus:ring-purple-500"
                                />
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <FileText className="h-4 w-4 text-blue-400" />
                                <div className="flex-1">
                                  <input
                                    type="file"
                                    accept=".srt,.vtt,.ass,.ssa,.sub"
                                    onChange={(e) => updateSubtitleFile(linkIndex, subtitleIndex, e.target.files?.[0])}
                                    className="w-full text-xs text-gray-300 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                                  />
                                  {subtitle.file && (
                                    <p className="text-xs text-green-400 mt-1">
                                      File: {subtitle.file.name}
                                    </p>
                                  )}
                                </div>
                              </div>
                              
                              <p className="text-xs text-gray-400 italic">
                                Provide either a URL or upload a file
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-gray-700/50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-300 mb-2">Supported Platforms:</h4>
              <div className="flex flex-wrap gap-2">
                {SUPPORTED_PLATFORMS.map(platform => (
                  <span key={platform} className="px-2 py-1 text-xs bg-purple-500/20 text-purple-300 rounded">
                    {platform}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Preview Section */}
          {selectedAnimeData && links.some(link => link.platform && link.url) && (
            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-3">Preview</h3>
              <div className="bg-gray-700/50 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-2">
                  Links to be added to "{selectedAnimeData.title}"
                  {selectedEpisode && availableEpisodes.find(ep => ep.id === selectedEpisode) && 
                    ` - Episode ${availableEpisodes.find(ep => ep.id === selectedEpisode)?.episode_number}`
                  }:
                </p>
                <div className="space-y-2">
                  {links
                    .filter(link => link.platform && link.url)
                    .map((link, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex items-center space-x-2 text-sm">
                          <ExternalLink className="h-3 w-3 text-purple-400" />
                          <span className="text-purple-300">{link.platform}</span>
                          {link.quality && <span className="text-gray-400">({link.quality})</span>}
                          {link.file_size && <span className="text-gray-400">- {link.file_size}</span>}
                          <span className="text-gray-400">→</span>
                          <span className="text-gray-300 truncate">{link.url}</span>
                        </div>
                        {(link.subtitles || []).filter(sub => sub.language && (sub.url || sub.file)).length > 0 && (
                          <div className="ml-6 text-xs text-gray-400">
                            <Subtitles className="h-3 w-3 inline mr-1" />
                            Subtitles: {(link.subtitles || []).filter(sub => sub.language && (sub.url || sub.file)).map(sub => `${sub.language}${sub.file ? ' (File)' : ' (URL)'}`).join(', ')}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4 border-t border-gray-700">
            <button
              type="submit"
              disabled={loading || !selectedAnime || !links.some(link => link.platform && link.url)}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Upload className="h-4 w-4" />
              <span>{loading ? 'Uploading...' : 'Upload Links'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Instructions */}
      <div className="mt-6 bg-gray-800/50 border border-gray-700 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-300 mb-2">💡 Multi-Episode Link Management:</h3>
        <ul className="text-xs text-gray-400 space-y-1 list-disc list-inside">
          <li>Select the anime and optionally choose a specific episode</li>
          <li>If no episode is selected, links will be added to the first episode</li>
          <li>Each link can have quality info (1080p, 720p) and file size details</li>
          <li>Add subtitle files or URLs for each streaming/download link</li>
          <li>Supported subtitle formats: SRT, VTT, ASS, SSA, SUB</li>
          <li>Links are organized by episode for better management</li>
        </ul>
      </div>
    </div>
  );
};

export default BulkUpload;