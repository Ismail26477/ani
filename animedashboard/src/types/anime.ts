export interface Anime {
  id: string;
  title: string;
  thumbnail: string;
  genres: string[];
  rating: number;
  year: number;
  status: 'ongoing' | 'completed' | 'upcoming';
  description: string;
  episodes: number;
  links: Array<{
    platform: string;
    url: string;
    subtitles?: Array<{
      language: string;
      url: string;
      file?: File;
    }>;
  }>;
}

export interface AnimeData {
  anime: Anime[];
}

export const SUPPORTED_PLATFORMS = [
  'WatchDT',
  'Mega',
  'Mediafire',
  'Google Drive',
  'Direct Download'
];

export const SUBTITLE_LANGUAGES = [
  'English',
  'Hindi',
  'Japanese',
  'Korean',
  'Chinese (Simplified)',
  'Chinese (Traditional)',
  'Spanish',
  'French',
  'German',
  'Portuguese',
  'Russian',
  'Arabic'
];

export const SUBTITLE_FORMATS = [
  'SRT',
  'VTT',
  'ASS',
  'SSA',
  'SUB'
];

export const ANIME_GENRES = [
  'Action',
  'Adventure',
  'Comedy',
  'Drama',
  'Fantasy',
  'Horror',
  'Romance',
  'Sci-Fi',
  'Slice of Life',
  'Sports',
  'Supernatural',
  'Thriller',
  'Mystery',
  'Historical',
  'Mecha',
  'School',
  'Military',
  'Music',
  'Psychological',
  'Ecchi',
  'Shounen',
  'Shoujo',
  'Seinen',
  'Josei',
  'Isekai',
  'Harem',
  'Reverse Harem',
  'Yaoi',
  'Yuri'
];