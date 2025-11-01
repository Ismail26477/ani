import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import AnimeRow from "@/components/AnimeRow";
import ContinueWatching from "@/components/ContinueWatching";
import GenreFilter from "@/components/GenreFilter";
import { supabase } from "@/integrations/supabase/client";

interface Anime {
  id: string;
  title: string;
  image_url: string;
  genres: string[] | null;
}

const Home = () => {
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [allAnime, setAllAnime] = useState<Anime[]>([]);

  useEffect(() => {
    const fetchAnime = async () => {
      const { data, error } = await supabase
        .from("anime")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setAllAnime(data);
      }
    };

    fetchAnime();
  }, []);

  const filterByGenre = (animes: Anime[]) => {
    if (selectedGenre === "All") return animes;
    return animes.filter((anime) => anime.genres?.includes(selectedGenre));
  };

  const popularAnime = filterByGenre(allAnime.slice(3, 9));
  const trendingAnime = filterByGenre(allAnime.slice(9, 15));
  const actionAnime = filterByGenre(allAnime.slice(15, 21));

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      
      <div className="space-y-8 md:space-y-12 pb-12 md:pb-20 relative z-10">
        <ContinueWatching />
        
        <GenreFilter selectedGenre={selectedGenre} onGenreChange={setSelectedGenre} />
        
        {popularAnime.length > 0 && (
          <AnimeRow
            title="Popular Now"
            animes={popularAnime.map((a) => ({
              id: a.id,
              title: a.title,
              image: a.image_url,
            }))}
          />
        )}
        
        {trendingAnime.length > 0 && (
          <AnimeRow
            title="Trending Anime"
            animes={trendingAnime.map((a) => ({
              id: a.id,
              title: a.title,
              image: a.image_url,
              badge: "Trending",
            }))}
          />
        )}
        
        {actionAnime.length > 0 && (
          <AnimeRow
            title="Action Packed"
            animes={actionAnime.map((a) => ({
              id: a.id,
              title: a.title,
              image: a.image_url,
            }))}
          />
        )}
      </div>
    </div>
  );
};

export default Home;
