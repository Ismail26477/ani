-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create profiles table (extends auth.users)
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text unique not null,
  name text not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Create anime table
create table if not exists public.anime (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text default '',
  synopsis text default '',
  release_year integer not null,
  episode_count integer not null,
  studio_id uuid,
  studio_name text,
  rating numeric(3,1) not null check (rating >= 0 and rating <= 10),
  status text not null check (status in ('ongoing', 'completed', 'upcoming')),
  thumbnail_url text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  added_by uuid references auth.users(id) on delete cascade not null,
  is_archived boolean default false not null,
  genres text[] not null default '{}'
);

-- Create episodes table
create table if not exists public.episodes (
  id uuid default uuid_generate_v4() primary key,
  anime_id uuid references public.anime(id) on delete cascade not null,
  episode_number integer not null,
  title text,
  description text,
  duration text,
  thumbnail_url text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  unique(anime_id, episode_number)
);

-- Create episode_links table
create table if not exists public.episode_links (
  id uuid default uuid_generate_v4() primary key,
  episode_id uuid references public.episodes(id) on delete cascade not null,
  platform text not null,
  url text not null,
  quality text,
  file_size text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Create subtitles table
create table if not exists public.subtitles (
  id uuid default uuid_generate_v4() primary key,
  link_id uuid references public.episode_links(id) on delete cascade not null,
  language text not null,
  url text,
  file_path text,
  file_name text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Create indexes for better performance
create index if not exists idx_anime_added_by on public.anime(added_by);
create index if not exists idx_anime_status on public.anime(status);
create index if not exists idx_anime_genres on public.anime using gin(genres);
create index if not exists idx_episodes_anime_id on public.episodes(anime_id);
create index if not exists idx_episode_links_episode_id on public.episode_links(episode_id);
create index if not exists idx_subtitles_link_id on public.subtitles(link_id);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.anime enable row level security;
alter table public.episodes enable row level security;
alter table public.episode_links enable row level security;
alter table public.subtitles enable row level security;

-- Create RLS policies

-- Profiles policies
create policy "Users can view their own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Users can insert their own profile" on public.profiles
  for insert with check (auth.uid() = id);

-- Anime policies
create policy "Users can view their own anime" on public.anime
  for select using (auth.uid() = added_by);

create policy "Users can insert their own anime" on public.anime
  for insert with check (auth.uid() = added_by);

create policy "Users can update their own anime" on public.anime
  for update using (auth.uid() = added_by);

create policy "Users can delete their own anime" on public.anime
  for delete using (auth.uid() = added_by);

-- Episodes policies
create policy "Users can view episodes of their anime" on public.episodes
  for select using (
    exists (
      select 1 from public.anime 
      where anime.id = episodes.anime_id 
      and anime.added_by = auth.uid()
    )
  );

create policy "Users can insert episodes for their anime" on public.episodes
  for insert with check (
    exists (
      select 1 from public.anime 
      where anime.id = episodes.anime_id 
      and anime.added_by = auth.uid()
    )
  );

create policy "Users can update episodes of their anime" on public.episodes
  for update using (
    exists (
      select 1 from public.anime 
      where anime.id = episodes.anime_id 
      and anime.added_by = auth.uid()
    )
  );

create policy "Users can delete episodes of their anime" on public.episodes
  for delete using (
    exists (
      select 1 from public.anime 
      where anime.id = episodes.anime_id 
      and anime.added_by = auth.uid()
    )
  );

-- Episode links policies
create policy "Users can view links of their episodes" on public.episode_links
  for select using (
    exists (
      select 1 from public.episodes 
      join public.anime on anime.id = episodes.anime_id
      where episodes.id = episode_links.episode_id 
      and anime.added_by = auth.uid()
    )
  );

create policy "Users can insert links for their episodes" on public.episode_links
  for insert with check (
    exists (
      select 1 from public.episodes 
      join public.anime on anime.id = episodes.anime_id
      where episodes.id = episode_links.episode_id 
      and anime.added_by = auth.uid()
    )
  );

create policy "Users can update links of their episodes" on public.episode_links
  for update using (
    exists (
      select 1 from public.episodes 
      join public.anime on anime.id = episodes.anime_id
      where episodes.id = episode_links.episode_id 
      and anime.added_by = auth.uid()
    )
  );

create policy "Users can delete links of their episodes" on public.episode_links
  for delete using (
    exists (
      select 1 from public.episodes 
      join public.anime on anime.id = episodes.anime_id
      where episodes.id = episode_links.episode_id 
      and anime.added_by = auth.uid()
    )
  );

-- Subtitles policies
create policy "Users can view subtitles of their links" on public.subtitles
  for select using (
    exists (
      select 1 from public.episode_links 
      join public.episodes on episodes.id = episode_links.episode_id
      join public.anime on anime.id = episodes.anime_id
      where episode_links.id = subtitles.link_id 
      and anime.added_by = auth.uid()
    )
  );

create policy "Users can insert subtitles for their links" on public.subtitles
  for insert with check (
    exists (
      select 1 from public.episode_links 
      join public.episodes on episodes.id = episode_links.episode_id
      join public.anime on anime.id = episodes.anime_id
      where episode_links.id = subtitles.link_id 
      and anime.added_by = auth.uid()
    )
  );

create policy "Users can update subtitles of their links" on public.subtitles
  for update using (
    exists (
      select 1 from public.episode_links 
      join public.episodes on episodes.id = episode_links.episode_id
      join public.anime on anime.id = episodes.anime_id
      where episode_links.id = subtitles.link_id 
      and anime.added_by = auth.uid()
    )
  );

create policy "Users can delete subtitles of their links" on public.subtitles
  for delete using (
    exists (
      select 1 from public.episode_links 
      join public.episodes on episodes.id = episode_links.episode_id
      join public.anime on anime.id = episodes.anime_id
      where episode_links.id = subtitles.link_id 
      and anime.added_by = auth.uid()
    )
  );

-- Function to automatically create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)));
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on user signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to automatically update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Triggers for updated_at
create trigger handle_updated_at before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.anime
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.episodes
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.episode_links
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.subtitles
  for each row execute procedure public.handle_updated_at();
