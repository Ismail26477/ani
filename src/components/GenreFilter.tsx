import { Button } from "@/components/ui/button";

const GENRES = [
  "All",
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Fantasy",
  "Horror",
  "Romance",
  "Sci-Fi",
  "Sports",
  "Supernatural",
];

interface GenreFilterProps {
  selectedGenre: string;
  onGenreChange: (genre: string) => void;
}

const GenreFilter = ({ selectedGenre, onGenreChange }: GenreFilterProps) => {
  return (
    <div className="px-4 md:px-8 py-4">
      <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {GENRES.map((genre) => (
          <Button
            key={genre}
            variant={selectedGenre === genre ? "default" : "outline"}
            size="sm"
            onClick={() => onGenreChange(genre)}
            className="whitespace-nowrap flex-shrink-0"
          >
            {genre}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default GenreFilter;
