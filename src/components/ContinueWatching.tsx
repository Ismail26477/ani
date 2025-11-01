import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import AnimeCard from "./AnimeCard";

interface WatchHistoryItem {
  anime_id: string;
  episode_number: number;
  progress_seconds: number;
  anime: {
    id: string;
    title: string;
    image_url: string;
  };
}

const ContinueWatching = () => {
  const { user } = useAuth();
  const [watchHistory, setWatchHistory] = useState<WatchHistoryItem[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchWatchHistory = async () => {
      const { data, error } = await supabase
        .from("watch_history")
        .select(`
          anime_id,
          episode_number,
          progress_seconds,
          anime:anime_id (
            id,
            title,
            image_url
          )
        `)
        .eq("user_id", user.id)
        .order("last_watched_at", { ascending: false })
        .limit(6);

      if (!error && data) {
        setWatchHistory(data as any);
      }
    };

    fetchWatchHistory();
  }, [user]);

  if (!user || watchHistory.length === 0) return null;

  return (
    <div className="-mt-20 md:-mt-32 px-4 md:px-8 space-y-4">
      <h2 className="text-xl md:text-2xl font-bold">Continue Watching</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
        {watchHistory.map((item) => (
          <AnimeCard
            key={item.anime_id}
            id={item.anime_id}
            title={item.anime.title}
            image={item.anime.image_url}
            badge={`Ep ${item.episode_number}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ContinueWatching;
