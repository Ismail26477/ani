import { Link } from "react-router-dom";
import { Play } from "lucide-react";

interface AnimeCardProps {
  id: string;
  title: string;
  image: string;
  badge?: string;
}

const AnimeCard = ({ id, title, image, badge }: AnimeCardProps) => {
  return (
    <Link to={`/anime/${id}`} className="group relative block">
      <div className="relative aspect-video rounded-md overflow-hidden bg-muted">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-foreground/90 flex items-center justify-center">
            <Play className="h-5 w-5 md:h-6 md:w-6 text-background fill-current ml-0.5" />
          </div>
        </div>

        {/* Badge */}
        {badge && (
          <div className="absolute top-2 left-2 bg-primary px-2 py-1 text-xs font-semibold rounded">
            {badge}
          </div>
        )}

        {/* Title at bottom left */}
        <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
          <h3 className="text-sm md:text-base font-semibold line-clamp-2 drop-shadow-lg">
            {title}
          </h3>
        </div>
      </div>
    </Link>
  );
};

export default AnimeCard;
