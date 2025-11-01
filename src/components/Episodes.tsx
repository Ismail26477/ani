import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

interface Episode {
  number: number;
  title: string;
  thumbnail: string;
  duration: number;
}

interface EpisodesProps {
  episodes: Episode[];
  animeThumbnail?: string;
}

const Episodes = ({ episodes, animeThumbnail }: EpisodesProps) => {
  const [language, setLanguage] = useState("english");

  return (
    <div className="space-y-6">
      {/* Language Selector */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-sm text-muted-foreground">Language:</span>
        <div className="flex gap-2">
          <Button
            variant={language === "hindi" ? "default" : "outline"}
            size="sm"
            onClick={() => setLanguage("hindi")}
            className="text-xs"
          >
            Hindi
          </Button>
          <Button
            variant={language === "english" ? "default" : "outline"}
            size="sm"
            onClick={() => setLanguage("english")}
            className="text-xs"
          >
            English
          </Button>
          <Button
            variant={language === "japanese" ? "default" : "outline"}
            size="sm"
            onClick={() => setLanguage("japanese")}
            className="text-xs"
          >
            Japanese
          </Button>
        </div>
      </div>

      {/* Header with Season Selector */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-xl md:text-2xl font-bold">Episodes</h2>
        
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Season:</span>
          <Select defaultValue="1">
            <SelectTrigger className="w-[120px] border-foreground/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Season 1</SelectItem>
              <SelectItem value="2">Season 2</SelectItem>
              <SelectItem value="3">Season 3</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-3">
        {episodes.map((episode) => (
          <div
            key={episode.number}
            className="flex gap-4 bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
          >
            {/* Thumbnail */}
            <div className="flex-shrink-0 w-32 md:w-40 lg:w-48 aspect-video bg-muted">
              <img
                src={episode.thumbnail}
                alt={`Episode ${episode.number}`}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Episode Details */}
            <div className="flex-1 py-3 pr-4 flex flex-col justify-between min-w-0">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="font-semibold">Episode {episode.number}</span>
                  <span>•</span>
                  <span>{episode.duration} min</span>
                </div>
                <h3 className="font-semibold text-foreground line-clamp-1">
                  {episode.title}
                </h3>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs border-foreground/50 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-colors"
                >
                  WatchMultQuality
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs border-foreground/50 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-colors"
                >
                  WatchBeta
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs border-foreground/50 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-colors"
                >
                  Mega
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Episodes;
