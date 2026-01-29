import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ArrowRight, X, Download, FileText } from 'lucide-react';

interface BlogCardProps {
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readTime: string;
  link: string; // This will be the URL to your PDF file
  img: string;
}

const BlogCard = ({ title, excerpt, date, category, readTime, link, img }: BlogCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        whileHover={{ y: -5 }}
        className="group cursor-pointer"
      >
        <div className="glass-card rounded-xl overflow-hidden h-full transition-all duration-300
                        hover:border-primary/50 hover:shadow-[0_0_30px_hsl(var(--primary)/0.2)] flex flex-col">
          
          {/* 1. Small Height Image at Top */}
          <div className="h-32 w-full overflow-hidden">
            <img 
              src={img} 
              alt={title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
            />
          </div>

          <div className="p-6 flex flex-col flex-grow">
            <div className="flex items-center gap-4 mb-4">
              <span className="px-3 py-1 text-xs font-mono bg-secondary/20 text-secondary rounded-full border border-secondary/30">
                {category}
              </span>
              <span className="text-xs text-muted-foreground font-mono">{readTime}</span>
            </div>
            
            <h3 className="text-lg font-display font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300 line-clamp-2">
              {title}
            </h3>
            
            <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
              {excerpt}
            </p>
            
            <div className="mt-auto flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar size={14} />
                <span>{date}</span>
              </div>
              
              {/* 2. Read More Button */}
              <button 
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-1 text-sm font-medium text-primary hover:underline group/btn"
              >
                Read More
                <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 3. Modal / PDF Box */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" style={{zIndex: 99}}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-background border border-border w-full max-w-4xl h-[80vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-4 border-b border-border flex justify-between items-center bg-card">
                <div className="flex items-center gap-3">
                  <FileText className="text-primary" />
                  <h3 className="font-bold truncate max-w-[200px] md:max-w-md">{title}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <a 
                    href={link} 
                    download 
                    className="p-2 hover:bg-secondary rounded-full transition-colors text-primary"
                    title="Download PDF"
                  >
                    <Download size={20} />
                  </a>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-secondary rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* PDF Viewer (Iframe) */}
              <div className="flex-grow bg-muted">
                <iframe
                  src={`${link}#toolbar=0`}
                  className="w-full h-full"
                  title="PDF Viewer"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BlogCard;