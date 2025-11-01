import { useState, useEffect } from "react";
import { Play, Plus, Info, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const heroAnime = [
  {
    id: 1,
    title: "Demon Slayer: Kimetsu no Yaiba",
    description: "A family is attacked by demons and only two members survive - Tanjiro and his sister Nezuko, who is turning into a demon slowly. Tanjiro sets out to become a demon slayer to avenge his family and cure his sister.",
    image: "/hero1.jpg",
    rating: "98% match"
  },
  {
    id: 2,
    title: "Attack on Titan",
    description: "Humanity lives inside cities surrounded by enormous walls as a defense against the Titans, gigantic humanoid creatures. The story follows Eren Yeager and his friends as they fight for humanity's survival.",
    image: "/hero2.jpg",
    rating: "95% match"
  },
  {
    id: 3,
    title: "Jujutsu Kaisen",
    description: "A high school student joins a secret organization of Jujutsu Sorcerers to kill a powerful Curse and protect humanity from malevolent forces born from human negativity.",
    image: "/hero3.jpg",
    rating: "96% match"
  }
];

const HeroSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroAnime.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const current = heroAnime[currentIndex];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % heroAnime.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + heroAnime.length) % heroAnime.length);
  };

  return (
    <div className="relative h-[70vh] md:h-[85vh] w-full overflow-hidden">
      {heroAnime.map((anime, index) => (
        <div
          key={anime.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${anime.image})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-transparent" />
          </div>
        </div>
      ))}

      <div className="relative h-full flex items-end pb-16 md:pb-24 px-4 md:px-8">
        <div className="max-w-2xl space-y-4 md:space-y-6 animate-fade-in">
          <h1 className="text-3xl md:text-6xl font-bold leading-tight">
            {current.title}
          </h1>
          
          <div className="flex items-center gap-3 text-sm md:text-base">
            <span className="text-primary font-semibold">{current.rating}</span>
            <span className="text-muted-foreground">2024</span>
            <span className="px-2 py-0.5 border border-muted-foreground/50 text-xs">HD</span>
          </div>

          <p className="text-sm md:text-base text-foreground/90 line-clamp-3 md:line-clamp-none">
            {current.description}
          </p>

          <div className="flex flex-wrap gap-3">
            <Link to={`/anime/${current.id}`}>
              <Button 
                size="lg" 
                className="bg-foreground text-background hover:bg-foreground/90 gap-2 text-sm md:text-base px-4 md:px-8"
              >
                <Play className="h-4 w-4 md:h-5 md:w-5 fill-current" />
                Play
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              className="gap-2 bg-background/20 backdrop-blur-sm border-foreground/20 hover:bg-background/30 text-sm md:text-base px-4 md:px-6"
            >
              <Info className="h-4 w-4 md:h-5 md:w-5" />
              More Info
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {heroAnime.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-1 rounded-full transition-all ${
              index === currentIndex ? "w-8 bg-primary" : "w-1 bg-foreground/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSection;
