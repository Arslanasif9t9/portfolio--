import { motion } from 'framer-motion';

interface SkillBadgeProps {
  name: string;
  icon: React.ReactNode;
  delay?: number;
}

const SkillBadge = ({ name, icon, delay = 0 }: SkillBadgeProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
      whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.5, 
        delay,
        type: 'spring',
        stiffness: 200
      }}
      whileHover={{ 
        scale: 1.1, 
        rotate: 5,
        transition: { duration: 0.2 }
      }}
      className="group relative"
    >
      <div className="glass-card p-4 rounded-xl flex flex-col items-center gap-3 cursor-pointer
                      hover:border-primary/60 transition-all duration-300
                      hover:shadow-[0_0_30px_hsl(var(--primary)/0.3)]">
        <motion.div
          className="text-3xl text-primary group-hover:text-secondary transition-colors duration-300"
          animate={{
            y: [0, -5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: delay * 2,
          }}
        >
          {icon}
        </motion.div>
        <span className="font-mono text-sm text-foreground/80 group-hover:text-foreground 
                        transition-colors duration-300 whitespace-nowrap">
          {name}
        </span>
        
        {/* Glow effect on hover */}
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 
                        transition-opacity duration-300 pointer-events-none
                        bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5" />
      </div>
    </motion.div>
  );
};

export default SkillBadge;
