import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import AnimeCard from "./AnimeCard";
import { Button } from "@/components/ui/button";

interface Anime {
  id: string;
  title: string;
  image: string;
  badge?: string;
}

interface AnimeRowProps {
  title: string;
  animes: Anime[];
}

const AnimeRow = ({ title, animes }: AnimeRowProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.offsetWidth * 0.8;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="space-y-3 md:space-y-4 px-4 md:px-8">
      <h2 className="text-lg md:text-2xl font-bold">{title}</h2>
      
      <div className="relative group">
        <div
          ref={scrollRef}
          className="flex gap-2 md:gap-3 overflow-x-auto scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {animes.map((anime) => (
            <div key={anime.id} className="flex-none w-[45%] sm:w-[30%] md:w-[23%] lg:w-[18%]">
              <AnimeCard {...anime} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnimeRow;
