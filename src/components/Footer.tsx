import { motion } from 'framer-motion';
import { Heart, Code2 } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative py-8 px-4 border-t border-border/50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <a href="#" className="font-display font-bold text-xl gradient-text">
            {'<Arslan.Dev />'}
          </a>

          <p className="text-sm text-muted-foreground flex items-center gap-2">
            Built 
            <Code2 size={14} className="text-primary" /> using React & FastAPI
          </p>

          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} All rights reserved
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
