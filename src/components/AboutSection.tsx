import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Layout, Database, Cloud, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import video from "../../public/video.mp4";
import { useRef, useState, useEffect } from 'react';

const AboutSection = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false); // Default to muted for better autoplay support
  const [showControls, setShowControls] = useState(false);
  const [wasPausedManually, setWasPausedManually] = useState(true);
  
  const videoRef = useRef<HTMLVideoElement>(null);

  // Intersection Observer for Auto-play/pause on scroll
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Only auto-play if the user hasn't explicitly paused it
            if (!wasPausedManually) {
              videoElement.play().catch((err) => console.log("Autoplay prevented:", err));
              setIsPlaying(true);
            }
          } else {
            // Pause when out of view to save CPU/Battery
            videoElement.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.6 } // Play when 60% of the video is visible
    );

    observer.observe(videoElement);
    return () => observer.unobserve(videoElement);
  }, [wasPausedManually]);

  const handlePlayPause = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
        setWasPausedManually(true); // Remember user manual pause
        setShowControls(true);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
        setWasPausedManually(false); // Reset manual pause
      }
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Hide controls automatically when playing
  useEffect(() => {
    if (isPlaying) {
      const timer = setTimeout(() => setShowControls(false), 2000);
      return () => clearTimeout(timer);
    } else {
      setShowControls(true);
    }
  }, [isPlaying]);

  const highlights = [
    { icon: <Layout size={24} />, label: 'Frontend Dev', desc: 'React, Next & Modern CSS' },
    { icon: <Terminal size={24} />, label: 'Backend Dev', desc: 'Laravel, Node.js, Express & APIs' },
    { icon: <Database size={24} />, label: 'Database', desc: 'MySQL & MongoDB' },
    { icon: <Cloud size={24} />, label: 'Tools', desc: 'AI, git & github' },
  ];

  return (
    <section id="about" className="py-20 px-4 relative group overflow-hidden">
      {/* Hover Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            <span className="gradient-text">About Me</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left - Video Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative w-full aspect-square max-w-md mx-auto group/video">
              <div 
                className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-black border-2 border-primary/30 shadow-2xl shadow-primary/10 h-full cursor-pointer"
                onClick={() => handlePlayPause()}
              >
                <video
                  ref={videoRef}
                  loop
                  playsInline
                  muted={isMuted}
                  className="w-full h-full object-cover"
                >
                  <source src={video} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                
                {/* Subtle Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-secondary/10 pointer-events-none" />
                
                {/* Controls Overlay */}
                <AnimatePresence>
                  {showControls && (
                    <motion.div
                      className="absolute bottom-4 left-4 flex items-center gap-3 z-30"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                    >
                      <button
                        onClick={handlePlayPause}
                        className="p-2 rounded-lg glass-card bg-black/40 backdrop-blur-md hover:bg-primary/20 transition-colors border border-white/10"
                      >
                        {isPlaying ? <Pause size={18} className="text-white" /> : <Play size={18} className="text-white" />}
                      </button>
                      
                      <button
                        onClick={toggleMute}
                        className="p-2 rounded-lg glass-card bg-black/40 backdrop-blur-md hover:bg-primary/20 transition-colors border border-white/10"
                      >
                        {isMuted ? <VolumeX size={18} className="text-white" /> : <Volume2 size={18} className="text-white" />}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Floating Animated Badges */}
              <motion.div
                className="absolute -top-4 -right-4 glass-card p-3 rounded-lg z-20"
                animate={{ y: [0, -8, 0], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <div className="bg-gradient-to-br from-primary to-secondary p-2 rounded-lg shadow-lg shadow-primary/20">
                  <Terminal className="text-white" size={20} />
                </div>
              </motion.div>
              
              <motion.div
                className="absolute -bottom-4 -left-4 glass-card p-3 rounded-lg z-20"
                animate={{ y: [0, 8, 0], rotate: [0, -5, 5, 0] }}
                transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
              >
                <div className="bg-gradient-to-br from-secondary to-primary p-2 rounded-lg shadow-lg shadow-secondary/20">
                  <Database className="text-white" size={20} />
                </div>
              </motion.div>

              {/* Play/Pause Label Button */}
              <motion.button 
                onClick={handlePlayPause}
                className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 glass-card px-4 py-2 rounded-full border border-primary/30 hover:border-primary hover:bg-primary/10 transition-all duration-300 active:scale-95 flex items-center gap-2 z-30 shadow-xl"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
              >
                {isPlaying ? (
                  <>
                    <Pause size={14} className="text-primary fill-primary" />
                    <span className="text-sm font-medium text-foreground whitespace-nowrap">Pause Video</span>
                  </>
                ) : (
                  <>
                    <Play size={14} className="text-primary fill-primary" />
                    <span className="text-sm font-medium text-foreground whitespace-nowrap">Resume Video</span>
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>

          {/* Right - Content Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-display font-bold text-foreground mb-4">
              Passionate Full-Stack Web Developer
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              With a deep passion for web development and creating exceptional user experiences, 
              I specialize in building modern, scalable web applications. My expertise spans 
              from crafting beautiful responsive frontends to designing robust backend architectures.
            </p>

            {/* Highlights Grid */}
            <div className="grid grid-cols-2 gap-4">
              {highlights.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card p-4 rounded-xl hover:border-primary/50 transition-colors group/highlight border border-white/5 bg-white/[0.02]"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="text-primary mb-2 group-hover/highlight:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <h4 className="font-display font-semibold text-foreground">{item.label}</h4>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;