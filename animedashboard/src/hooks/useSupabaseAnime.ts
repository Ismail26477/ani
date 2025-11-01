import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useSupabaseAuth } from './useSupabaseAuth';

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
  added_by: string;
  is_archived: boolean;
  genres: string[];
  episodes: Episode[];
}

export function useSupabaseAnime() {
  const { user } = useSupabaseAuth();
  const [anime, setAnime] = useState<AnimeWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAnime();
    } else {
      setAnime([]);
      setLoading(false);
    }
  }, [user]);

  const fetchAnime = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch anime with episodes and their links
      const { data: animeData, error: animeError } = await supabase
        .from('anime')
        .select(`
          *,
          episodes (
            *,
            episode_links (
              *,
              subtitles (*)
            )
          )
        `)
        .eq('added_by', user.id)
        .eq('is_archived', false)
        .order('created_at', { ascending: false });

      if (animeError) {
        console.error('Error fetching anime:', animeError);
        return;
      }

      // Transform data to match our interface
      const transformedAnime: AnimeWithDetails[] = (animeData || []).map((anime: any) => ({
        ...anime,
        episodes: (anime.episodes || []).map((episode: any) => ({
          ...episode,
          links: (episode.episode_links || []).map((link: any) => ({
            ...link,
            subtitles: link.subtitles || []
          }))
        }))
      }));

      setAnime(transformedAnime);
    } catch (error) {
      console.error('Error in fetchAnime:', error);
    } finally {
      setLoading(false);
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
      // Insert anime
      const { data: newAnime, error: animeError } = await supabase
        .from('anime')
        .insert({
          title: animeData.title,
          description: animeData.description || '',
          synopsis: animeData.synopsis || animeData.description || '',
          release_year: animeData.release_year,
          episode_count: animeData.episode_count || animeData.episodes.length,
          studio_name: animeData.studio_name || null,
          rating: animeData.rating,
          status: animeData.status,
          thumbnail_url: animeData.thumbnail_url || null,
          added_by: user.id,
          genres: animeData.genres,
        })
        .select()
        .single();

      if (animeError) {
        console.error('Error inserting anime:', animeError);
        throw new Error('Failed to add anime');
      }

      // Insert episodes
      for (const episodeData of animeData.episodes) {
        const { data: newEpisode, error: episodeError } = await supabase
          .from('episodes')
          .insert({
            anime_id: newAnime.id,
            episode_number: episodeData.episode_number,
            title: episodeData.title || null,
            description: episodeData.description || null,
            duration: episodeData.duration || null,
            thumbnail_url: episodeData.thumbnail_url || null,
          })
          .select()
          .single();

        if (episodeError) {
          console.error('Error inserting episode:', episodeError);
          continue;
        }

        // Insert episode links
        for (const linkData of episodeData.links) {
          const { data: newLink, error: linkError } = await supabase
            .from('episode_links')
            .insert({
              episode_id: newEpisode.id,
              platform: linkData.platform,
              url: linkData.url,
              quality: linkData.quality || null,
              file_size: linkData.file_size || null,
            })
            .select()
            .single();

          if (linkError) {
            console.error('Error inserting episode link:', linkError);
            continue;
          }

          // Insert subtitles
          if (linkData.subtitles) {
            for (const subtitleData of linkData.subtitles) {
              if (subtitleData.language && (subtitleData.url || subtitleData.file_path)) {
                const { error: subtitleError } = await supabase
                  .from('subtitles')
                  .insert({
                    link_id: newLink.id,
                    language: subtitleData.language,
                    url: subtitleData.url || null,
                    file_path: subtitleData.file_path || null,
                    file_name: subtitleData.file_name || null,
                  });

                if (subtitleError) {
                  console.error('Error inserting subtitle:', subtitleError);
                }
              }
            }
          }
        }
      }

      // Refresh anime list
      await fetchAnime();

      return newAnime;
    } catch (error) {
      console.error('Error in addAnime:', error);
      throw error;
    }
  };

  const updateAnime = async (id: string, updates: Partial<AnimeWithDetails>) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const { error } = await supabase
        .from('anime')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('added_by', user.id);

      if (error) {
        console.error('Error updating anime:', error);
        throw new Error('Failed to update anime');
      }

      // Refresh anime list
      await fetchAnime();
    } catch (error) {
      console.error('Error in updateAnime:', error);
      throw error;
    }
  };

  const deleteAnime = async (id: string) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const { error } = await supabase
        .from('anime')
        .delete()
        .eq('id', id)
        .eq('added_by', user.id);

      if (error) {
        console.error('Error deleting anime:', error);
        throw new Error('Failed to delete anime');
      }

      // Refresh anime list
      await fetchAnime();
    } catch (error) {
      console.error('Error in deleteAnime:', error);
      throw error;
    }
  };

  const addLinksToAnime = async (animeId: string, episodeNumber: number, links: Array<{
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
  }>) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      // Find the episode
      const { data: episode, error: episodeError } = await supabase
        .from('episodes')
        .select('id')
        .eq('anime_id', animeId)
        .eq('episode_number', episodeNumber)
        .single();

      if (episodeError || !episode) {
        throw new Error('Episode not found');
      }

      // Add links to the episode
      for (const linkData of links) {
        const { data: newLink, error: linkError } = await supabase
          .from('episode_links')
          .insert({
            episode_id: episode.id,
            platform: linkData.platform,
            url: linkData.url,
            quality: linkData.quality || null,
            file_size: linkData.file_size || null,
          })
          .select()
          .single();

        if (linkError) {
          console.error('Error inserting link:', linkError);
          continue;
        }

        // Add subtitles
        if (linkData.subtitles) {
          for (const subtitleData of linkData.subtitles) {
            if (subtitleData.language && (subtitleData.url || subtitleData.file_path)) {
              const { error: subtitleError } = await supabase
                .from('subtitles')
                .insert({
                  link_id: newLink.id,
                  language: subtitleData.language,
                  url: subtitleData.url || null,
                  file_path: subtitleData.file_path || null,
                  file_name: subtitleData.file_name || null,
                });

              if (subtitleError) {
                console.error('Error inserting subtitle:', subtitleError);
              }
            }
          }
        }
      }

      // Refresh anime list
      await fetchAnime();
    } catch (error) {
      console.error('Error in addLinksToAnime:', error);
      throw error;
    }
  };

  return {
    anime,
    loading,
    addAnime,
    updateAnime,
    deleteAnime,
    addLinksToAnime,
    refetch: fetchAnime,
  };
}
