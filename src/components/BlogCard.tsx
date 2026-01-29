import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ArrowRight, X, Download, FileText } from 'lucide-react';

interface BlogCardProps {
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readTime: string;
  link: string; // The URL to your PDF
  img: string;
}

const BlogCard = ({ title, excerpt, date, category, readTime, link, img }: BlogCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* Blog Card UI */}
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
          
          {/* Image at Top with small height */}
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
              
              {/* Read More Button */}
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-tight"
              >
                Read More
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Modal - Based on your CV design */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Background Overlay */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Box */}
            <AnimatePresence>
              {isModalOpen && (
                /* CHANGED: Increased z-index to 9999 to ensure it covers the navbar */
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                  
                  {/* Background Overlay */}
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    onClick={() => setIsModalOpen(false)}
                    /* Ensure backdrop is also high z-index via the parent */
                    className="absolute inset-0 bg-black/80 backdrop-blur-md"
                  />

                  {/* Modal Box */}
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }} 
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col"
                  >
                    {/* Modal Header */}
                    <div className="p-4 border-b flex justify-between items-center bg-white sticky top-0 z-[10000]">
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-gray-800 uppercase tracking-tight hidden md:block text-sm">
                          {title}
                        </span>
                        <a
                          href={link}
                          download
                          className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                        >
                          <Download size={16} />
                          Download PDF
                        </a>
                      </div>

                      <button 
                        onClick={() => setIsModalOpen(false)} 
                        className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <X size={24} />
                      </button>
                    </div>

                    {/* Modal Body - CV Style Scrollable Area */}
                    <div className="overflow-y-auto p-4 md:p-8 bg-gray-100 flex-grow">
                      <div className="mx-auto max-w-3xl shadow-xl bg-white min-h-[1100px]">
                        <iframe
                            src={`${link}#toolbar=0&navpanes=0`}
                            className="w-full h-[1100px] border-none"
                            title="Blog Content"
                        />
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BlogCard;