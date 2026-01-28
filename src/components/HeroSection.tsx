import img from "../../public/pro.jpeg"
import { motion } from 'framer-motion';
import Typewriter from './Typewriter';
import { ChevronDown, Sparkles, Code2, Layout, Eye } from 'lucide-react';

const HeroSection = ({ onViewCv }) => {
  const taglines = [
    'Building Modern Web Applications',
    'Full-Stack Web Developer',
    'Powered by React & laravel',
    'Crafting Seamless User Experiences',
  ];

  return (
    <section className="relative mt-24 min-h-screen flex items-center justify-center overflowhidden group">
      {/* Animated Grid */}
      <div className="absolute inset-0 grid-overlay opacity-30" />

      {/* Glowing Orbs - Enhanced on hover */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl 
                  transition-all duration-500 group-hover:bg-primary/40 group-hover:scale-110"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl
                  transition-all duration-500 group-hover:bg-secondary/40 group-hover:scale-110"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Floating Icons */}
        <motion.div
          className="absolute -top-20 left-10 text-primary/50"
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <Layout size={40} />
        </motion.div>
        <motion.div
          className="absolute -top-10 right-10 text-secondary/50"
          animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Code2 size={40} />
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Profile Picture */}
          <motion.div
            className="relative w-32 h-32 md:w-40 md:h-40 mx-auto mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-secondary animate-pulse-neon" />
            <div className="absolute inset-1 rounded-full bg-background" />
            <img
              src="/profile.jpg"
              alt="Arslan Ahmad"
              className="absolute inset-2 rounded-full object-cover w-[calc(100%-16px)] h-[calc(100%-16px)]"
              onError={(e) => {
                e.currentTarget.src = img;
              }}
            />
          </motion.div>

          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 mb-6 glass-card rounded-full"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Sparkles className="text-primary animate-pulse-neon" size={16} />
            <span className="text-sm font-mono text-muted-foreground">
              React • Laravel • MySQL
            </span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">
            <span className="block text-foreground">Hello, I'm</span>
            <span className="block gradient-text mt-2">Arslan Ahmad</span>
          </h1>

          <div className="text-xl md:text-2xl text-muted-foreground mb-8 h-8">
            <Typewriter texts={taglines} speed={80} deleteSpeed={40} pauseTime={2500} />
          </div>

          <p className="text-lg text-muted-foreground/80 max-w-2xl mx-auto mb-10">
            Crafting pixel-perfect, responsive web applications with modern technologies. 
            From stunning frontends to robust backends. Let's bring your vision to life.
          </p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.a
              href="#projects"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 font-medium rounded-full bg-gradient-to-r from-primary to-secondary
                        text-primary-foreground shadow-[0_0_30px_hsl(var(--primary)/0.4)]
                        hover:shadow-[0_0_50px_hsl(var(--primary)/0.6)] transition-shadow duration-300"
            >
              Explore My Work
            </motion.a>
            <motion.button
              onClick={onViewCv} // Trigger the modal
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-8 py-4 font-medium rounded-full border-2 border-primary/50
                        text-primary hover:bg-primary/10 transition-all duration-300 text-sm"
            >
              <Eye size={16} />
              View CV
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        {/* <motion.a
          href="#about"
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-muted-foreground
                    hover:text-primary transition-colors cursor-pointer"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown size={32} />
        </motion.a> */}
      </div>
    </section>
  );
};

export default HeroSection;
