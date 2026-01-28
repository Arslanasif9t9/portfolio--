import { motion } from 'framer-motion';
import { Github, ExternalLink, ArrowRight } from 'lucide-react';
import { useState, useRef } from 'react';

interface ProjectCardProps {
  title: string;
  description: string;
  tech: string[];
  image: string;
  github?: string;
  live?: string;
  category: string;
}

const ProjectCard = ({ title, description, tech, image, github, live, category }: ProjectCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const linksRef = useRef<HTMLDivElement>(null);

  const handleFlip = () => setIsFlipped((prev) => !prev);

  const handleBackClick = (e: React.MouseEvent) => {
    // Don't flip back if clicking on links
    if (linksRef.current?.contains(e.target as Node)) {
      return;
    }
    handleFlip();
  };

  return (
    <motion.div
      className="relative h-96 w-full cursorpointer perspective-1000"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="relative w-full h-full"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 100, damping: 20 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* FRONT SIDE */}
        <div
          className="absolute inset-0 w-full h-full glass-card rounded-xl overflow-hidden shadow-xl"
          style={{ 
            backfaceVisibility: 'hidden', 
            WebkitBackfaceVisibility: 'hidden' 
          }}
        >
          {/* Full-Height Background Image */}
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${image})` }}
          >
            {/* Darker Gradient Overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            
            {/* Text Overlay (Positioned exactly like previous version) */}
            <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col items-start">
              <span className="text-[10px] font-mono text-primary uppercase tracking-widest bg-primary/20 px-2 py-0.5 rounded mb-2">
                {category}
              </span>
              <h3 className="text-xl font-display font-bold text-white line-clamp-1">
                {title}
              </h3>
              
              {/* Description: Forced to 2 lines on top of the image */}
              <p className="text-gray-300 text-xs mt-2 line-clamp-2 leading-relaxed max-w-[90%]">
                {description}
              </p>

              {/* Read More Trigger */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleFlip();
                }}
                className="mt-4 flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest group"
              >
                Read More 
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* BACK SIDE */}
        <div
          className="absolute inset-0 w-full h-full glass-card rounded-xl p-6 flex flex-col justify-between cursor-pointer"
          style={{ 
            backfaceVisibility: 'hidden', 
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)' 
          }}
          onClick={handleBackClick}
        >
          <div>
            <div className="mb-4">
              <h3 className="text-xl font-display font-bold gradient-text">{title}</h3>
              <p className="text-xs text-muted-foreground mt-1">Click anywhere to go back</p>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {description}
            </p>
          </div>
          
          <div ref={linksRef}>
            <div className="flex flex-wrap gap-2 mb-4">
              {tech.map((t) => (
                <span
                  key={t}
                  className="px-2 py-1 text-[10px] font-mono bg-primary/10 text-primary rounded border border-primary/30"
                >
                  {t}
                </span>
              ))}
            </div>
            
            <div className="flex gap-4 border-t border-white/10 pt-4">
              {github && (
                <a 
                  href={github} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Github size={18} />
                  <span>Code</span>
                </a>
              )}
              {live && (
                <a 
                  href={live} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-secondary transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink size={18} />
                  <span>Live</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProjectCard;