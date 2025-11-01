import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Play, Plus, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import AnimeRow from "@/components/AnimeRow";
import Comments from "@/components/Comments";
import Episodes from "@/components/Episodes";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const AnimeDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [anime, setAnime] = useState<any>(null);
  const [relatedAnime, setRelatedAnime] = useState<any[]>([]);

  useEffect(() => {
    const fetchAnime = async () => {
      if (!id) return;

      const { data, error } = await supabase
        .from("anime")
        .select("*")
        .eq("id", id)
        .single();

      if (!error && data) {
        setAnime(data);

        const { data: related } = await supabase
          .from("anime")
          .select("*")
          .neq("id", id)
          .limit(6);

        if (related) {
          setRelatedAnime(related);
        }
      }
    };

    fetchAnime();
  }, [id]);

  const handlePlay = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to watch anime",
        variant: "destructive",
      });
      return;
    }

    await supabase.from("watch_history").upsert({
      user_id: user.id,
      anime_id: id,
      episode_number: 1,
      progress_seconds: 0,
      last_watched_at: new Date().toISOString(),
    });

    toast({
      title: "Starting playback",
      description: "Enjoy watching!",
    });
  };

  if (!anime) return <div className="min-h-screen bg-background"><Navigation /></div>;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <div className="relative h-[60vh] md:h-[80vh] w-full">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${anime.image_url})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
        </div>

        <div className="relative h-full flex items-end pb-12 md:pb-20 px-4 md:px-8">
          <div className="max-w-3xl space-y-4 md:space-y-6">
            <h1 className="text-3xl md:text-6xl font-bold leading-tight animate-fade-in">
              {anime.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-3 text-sm md:text-base">
              <span>{anime.year}</span>
              <span>{anime.seasons} {anime.seasons > 1 ? 'Seasons' : 'Season'}</span>
              <span className="px-2 py-0.5 border border-muted-foreground/50 text-xs">{anime.rating}</span>
              <span className="px-2 py-0.5 border border-muted-foreground/50 text-xs">HD</span>
            </div>

            <p className="text-sm md:text-lg text-foreground/90 max-w-2xl">
              {anime.description}
            </p>

            <div className="flex flex-wrap gap-3">
              <Button 
                size="lg" 
                className="bg-foreground text-background hover:bg-foreground/90 gap-2 px-6 md:px-10"
                onClick={handlePlay}
              >
                <Play className="h-5 w-5 fill-current" />
                Play
              </Button>
              <Button size="lg" variant="outline" className="gap-2 bg-background/20 backdrop-blur-sm border-foreground/20 hover:bg-background/30">
                <Plus className="h-5 w-5" />
                My List
              </Button>
              <Button size="lg" variant="outline" className="hidden md:flex gap-2 bg-background/20 backdrop-blur-sm border-foreground/20 hover:bg-background/30">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="px-4 md:px-8 py-8 md:py-12 space-y-8 max-w-6xl">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="text-muted-foreground">Genres:</span>
            <span>{anime.genres?.join(", ")}</span>
          </div>
        </div>

        {/* Episodes Section */}
        <Episodes
          episodes={[
            {
              number: 1,
              title: "Pilot Episode - The Beginning",
              thumbnail: anime.image_url,
              duration: 24
            },
            {
              number: 2,
              title: "The Journey Continues",
              thumbnail: anime.image_url,
              duration: 24
            },
            {
              number: 3,
              title: "New Challenges Arise",
              thumbnail: anime.image_url,
              duration: 24
            }
          ]}
        />

        {/* Comments Section */}
        <Comments animeId={id!} />
      </div>

      {/* Related Anime */}
      <div className="pb-12 md:pb-20">
        <AnimeRow 
          title="More Like This" 
          animes={relatedAnime.map((a) => ({
            id: a.id,
            title: a.title,
            image: a.image_url || "",
          }))} 
        />
      </div>
    </div>
  );
};

export default AnimeDetail;
