import { createClient } from '@supabase/supabase-js'

// Vite environment variables - make sure your .env file has these variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database tables
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          created_at?: string
          updated_at?: string
        }
      }
      anime: {
        Row: {
          id: string
          title: string
          description: string
          synopsis: string
          release_year: number
          episode_count: number
          studio_id: string | null
          studio_name: string | null
          rating: number
          status: 'ongoing' | 'completed' | 'upcoming'
          thumbnail_url: string | null
          created_at: string
          updated_at: string
          added_by: string
          is_archived: boolean
          genres: string[]
        }
        Insert: {
          id?: string
          title: string
          description?: string
          synopsis?: string
          release_year: number
          episode_count: number
          studio_id?: string | null
          studio_name?: string | null
          rating: number
          status: 'ongoing' | 'completed' | 'upcoming'
          thumbnail_url?: string | null
          created_at?: string
          updated_at?: string
          added_by: string
          is_archived?: boolean
          genres: string[]
        }
        Update: {
          id?: string
          title?: string
          description?: string
          synopsis?: string
          release_year?: number
          episode_count?: number
          studio_id?: string | null
          studio_name?: string | null
          rating?: number
          status?: 'ongoing' | 'completed' | 'upcoming'
          thumbnail_url?: string | null
          created_at?: string
          updated_at?: string
          added_by?: string
          is_archived?: boolean
          genres?: string[]
        }
      }
      episodes: {
        Row: {
          id: string
          anime_id: string
          episode_number: number
          title: string | null
          description: string | null
          duration: string | null
          thumbnail_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          anime_id: string
          episode_number: number
          title?: string | null
          description?: string | null
          duration?: string | null
          thumbnail_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          anime_id?: string
          episode_number?: number
          title?: string | null
          description?: string | null
          duration?: string | null
          thumbnail_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      episode_links: {
        Row: {
          id: string
          episode_id: string
          platform: string
          url: string
          quality: string | null
          file_size: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          episode_id: string
          platform: string
          url: string
          quality?: string | null
          file_size?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          episode_id?: string
          platform?: string
          url?: string
          quality?: string | null
          file_size?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      subtitles: {
        Row: {
          id: string
          link_id: string
          language: string
          url: string | null
          file_path: string | null
          file_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          link_id: string
          language: string
          url?: string | null
          file_path?: string | null
          file_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          link_id?: string
          language?: string
          url?: string | null
          file_path?: string | null
          file_name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
