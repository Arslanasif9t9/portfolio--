import { motion } from 'framer-motion';
import { Calendar, ArrowRight } from 'lucide-react';

interface BlogCardProps {
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readTime: string;
  link: string;
}

const BlogCard = ({ title, excerpt, date, category, readTime, link }: BlogCardProps) => {
  return (
    <motion.a
      // href={link}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="group block"
    >
      <div className="glass-card rounded-xl p-6 h-full transition-all duration-300
                      hover:border-primary/50 hover:shadow-[0_0_30px_hsl(var(--primary)/0.2)]">
        <div className="flex items-center gap-4 mb-4">
          <span className="px-3 py-1 text-xs font-mono bg-secondary/20 text-secondary rounded-full
                          border border-secondary/30">
            {category}
          </span>
          <span className="text-xs text-muted-foreground font-mono">{readTime}</span>
        </div>
        
        <h3 className="text-lg font-display font-bold text-foreground mb-3 
                      group-hover:text-primary transition-colors duration-300 line-clamp-2">
          {title}
        </h3>
        
        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
          {excerpt}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar size={14} />
            <span>{date}</span>
          </div>
          
          {/* <div className="flex items-center gap-1 text-sm text-primary opacity-0 
                         group-hover:opacity-100 transition-opacity duration-300">
            <span>Read More</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </div> */}
        </div>
      </div>
    </motion.a>
  );
};

export default BlogCard;
