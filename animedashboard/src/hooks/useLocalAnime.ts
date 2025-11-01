import { useState, useEffect } from 'react';
import { useAuth } from './useLocalAuth';

export interface Episode {
  id: string;
  anime_id: string;
  episode_number: number;
  title: string | null;
  description: string | null;
  duration: string | null;
  thumbnail_url: string | null;
  created_at: string;
  updated_at: string;
  links: Array<{
    id: string;
    platform: string;
    url: string;
    quality: string | null;
    file_size: string | null;
    subtitles: Array<{
      id: string;
      language: string;
      url: string | null;
      file_path: string | null;
      file_name: string | null;
    }>;
  }>;
}

export interface AnimeWithDetails {
  id: string;
  title: string;
  description: string;
  synopsis: string;
  release_year: number;
  episode_count: number;
  studio_id: string | null;
  studio_name: string | null;
  rating: number;
  status: 'ongoing' | 'completed' | 'upcoming';
  thumbnail_url: string | null;
  created_at: string;
  updated_at: string;
  added_by: string | null;
  is_archived: boolean;
  genres: string[];
  episodes: Episode[];
}

// Sample data for demonstration
const SAMPLE_ANIME: AnimeWithDetails[] = [
  {
    id: '1',
    title: 'Attack on Titan',
    description: 'Humanity fights for survival against giant humanoid Titans',
    synopsis: 'Humanity fights for survival against giant humanoid Titans in a post-apocalyptic world. Eren Yeager and his friends join the military to fight back against these mysterious creatures.',
    release_year: 2013,
    episode_count: 3,
    studio_id: null,
    studio_name: 'Mappa',
    rating: 9.2,
    status: 'completed',
    thumbnail_url: 'https://images.pexels.com/photos/1040160/pexels-photo-1040160.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    added_by: null,
    is_archived: false,
    genres: ['Action', 'Drama', 'Fantasy'],
    episodes: [
      {
        id: '1-1',
        anime_id: '1',
        episode_number: 1,
        title: 'To You, in 2000 Years',
        description: 'The first episode of Attack on Titan',
        duration: '24:00',
        thumbnail_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        links: [
          {
            id: '1-1-1',
            platform: 'WatchDT',
            url: 'https://example.com/aot-ep1',
            quality: '1080p',
            file_size: '500MB',
            subtitles: [
              {
                id: '1-1-1-1',
                language: 'English',
                url: 'https://example.com/aot-ep1-en.srt',
                file_path: null,
                file_name: null
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: '2',
    title: 'Demon Slayer',
    description: 'Tanjiro becomes a demon slayer to save his sister',
    synopsis: 'Tanjiro Kamado becomes a demon slayer to save his sister Nezuko, who has been turned into a demon. A tale of family, determination, and supernatural battles.',
    release_year: 2019,
    episode_count: 2,
    studio_id: null,
    studio_name: 'Ufotable',
    rating: 8.7,
    status: 'ongoing',
    thumbnail_url: 'https://images.pexels.com/photos/1040160/pexels-photo-1040160.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    added_by: null,
    is_archived: false,
    genres: ['Action', 'Supernatural', 'Historical'],
    episodes: [
      {
        id: '2-1',
        anime_id: '2',
        episode_number: 1,
        title: 'Cruelty',
        description: 'The beginning of Tanjiro\'s journey',
        duration: '24:00',
        thumbnail_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        links: [
          {
            id: '2-1-1',
            platform: 'WatchDT',
            url: 'https://example.com/ds-ep1',
            quality: '1080p',
            file_size: '480MB',
            subtitles: []
          }
        ]
      }
    ]
  }
];

function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

export function useAnime() {
  const { user } = useAuth();
  const [anime, setAnime] = useState<AnimeWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAnime = async () => {
    if (!user) {
      setAnime([]);
      setLoading(false);
      return;
    }

    try {
      // Get user's anime from localStorage
      const userAnimeKey = `anime_data_${user.id}`;
      const savedAnime = localStorage.getItem(userAnimeKey);
      
      let userAnime: AnimeWithDetails[] = [];
      if (savedAnime) {
        userAnime = JSON.parse(savedAnime);
      } else {
        // Initialize with sample data for new users
        userAnime = SAMPLE_ANIME.map(anime => ({
          ...anime,
          id: generateId(),
          added_by: user.id,
          episodes: anime.episodes.map(ep => ({
            ...ep,
            id: generateId(),
            anime_id: anime.id,
            links: ep.links.map(link => ({
              ...link,
              id: generateId(),
              subtitles: link.subtitles.map(sub => ({
                ...sub,
                id: generateId()
              }))
            }))
          }))
        }));
        localStorage.setItem(userAnimeKey, JSON.stringify(userAnime));
      }
      
      setAnime(userAnime);
    } catch (error) {
      console.error('Error fetching anime:', error);
      setAnime([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnime();
  }, [user]);

  const saveAnime = (animeList: AnimeWithDetails[]) => {
    if (user) {
      const userAnimeKey = `anime_data_${user.id}`;
      localStorage.setItem(userAnimeKey, JSON.stringify(animeList));
    }
  };

  const addAnime = async (animeData: {
    title: string;
    description?: string;
    synopsis?: string;
    thumbnail_url?: string;
    rating: number;
    release_year: number;
    status: 'ongoing' | 'completed' | 'upcoming';
    episode_count?: number;
    studio_name?: string;
    genres: string[];
    episodes: Array<{
      episode_number: number;
      title?: string;
      description?: string;
      duration?: string;
      thumbnail_url?: string;
      links: Array<{
        platform: string;
        url: string;
        quality?: string;
        file_size?: string;
        subtitles?: Array<{
          language: string;
          url?: string;
          file_path?: string;
          file_name?: string;
        }>;
      }>;
    }>;
  }) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const newAnime: AnimeWithDetails = {
        id: generateId(),
        title: animeData.title,
        description: animeData.description || '',
        synopsis: animeData.synopsis || animeData.description || '',
        release_year: animeData.release_year,
        episode_count: animeData.episode_count || animeData.episodes.length,
        studio_id: null,
        studio_name: animeData.studio_name || null,
        rating: animeData.rating,
        status: animeData.status,
        thumbnail_url: animeData.thumbnail_url || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        added_by: user.id,
        is_archived: false,
        genres: animeData.genres,
        episodes: animeData.episodes.map(ep => ({
          id: generateId(),
          anime_id: '',
          episode_number: ep.episode_number,
          title: ep.title || null,
          description: ep.description || null,
          duration: ep.duration || null,
          thumbnail_url: ep.thumbnail_url || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          links: ep.links.map(link => ({
            id: generateId(),
            platform: link.platform,
            url: link.url,
            quality: link.quality || null,
            file_size: link.file_size || null,
            subtitles: (link.subtitles || []).map(sub => ({
              id: generateId(),
              language: sub.language,
              url: sub.url || null,
              file_path: sub.file_path || null,
              file_name: sub.file_name || null
            }))
          }))
        }))
      };

      // Update episode anime_id references
      newAnime.episodes.forEach(ep => {
        ep.anime_id = newAnime.id;
      });

      const updatedAnime = [...anime, newAnime];
      setAnime(updatedAnime);
      saveAnime(updatedAnime);

      return newAnime;
    } catch (error) {
      console.error('Error adding anime:', error);
      throw error;
    }
  };

  const updateAnime = async (id: string, updates: Partial<AnimeWithDetails>) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const updatedAnime = anime.map(item => 
        item.id === id 
          ? { ...item, ...updates, updated_at: new Date().toISOString() }
          : item
      );
      
      setAnime(updatedAnime);
      saveAnime(updatedAnime);
    } catch (error) {
      console.error('Error updating anime:', error);
      throw error;
    }
  };

  const deleteAnime = async (id: string) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const updatedAnime = anime.filter(item => item.id !== id);
      setAnime(updatedAnime);
      saveAnime(updatedAnime);
    } catch (error) {
      console.error('Error deleting anime:', error);
      throw error;
    }
  };

  const addLinksToEpisode = async (
    episodeId: string,
    links: Array<{
      platform: string;
      url: string;
      quality?: string;
      file_size?: string;
      subtitles?: Array<{
        language: string;
        url?: string;
        file_path?: string;
        file_name?: string;
      }>;
    }>
  ) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const updatedAnime = anime.map(animeItem => ({
        ...animeItem,
        episodes: animeItem.episodes.map(ep => {
          if (ep.id === episodeId) {
            const newLinks = links.map(link => ({
              id: generateId(),
              platform: link.platform,
              url: link.url,
              quality: link.quality || null,
              file_size: link.file_size || null,
              subtitles: (link.subtitles || []).map(sub => ({
                id: generateId(),
                language: sub.language,
                url: sub.url || null,
                file_path: sub.file_path || null,
                file_name: sub.file_name || null
              }))
            }));
            return {
              ...ep,
              links: [...ep.links, ...newLinks],
              updated_at: new Date().toISOString()
            };
          }
          return ep;
        }),
        updated_at: new Date().toISOString()
      }));

      setAnime(updatedAnime);
      saveAnime(updatedAnime);
    } catch (error) {
      console.error('Error adding links to episode:', error);
      throw error;
    }
  };

  const addLinksToAnime = async (animeId: string, links: any[]) => {
    // Add links to the first episode
    const animeItem = anime.find(a => a.id === animeId);
    if (animeItem && animeItem.episodes.length > 0) {
      await addLinksToEpisode(animeItem.episodes[0].id, links);
    }
  };

  return {
    anime,
    loading,
    addAnime,
    updateAnime,
    deleteAnime,
    addLinksToAnime,
    addLinksToEpisode,
    refetch: fetchAnime,
  };
}
