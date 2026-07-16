import { useEffect, useState } from 'react';
import { Bot, BookOpen, FolderKanban, Home, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileBottomNavProps {
  onOpenChat: () => void;
}

const SECTIONS = ['home', 'projects', 'blog', 'contact'] as const;

const MobileBottomNav = ({ onOpenChat }: MobileBottomNavProps) => {
  const [active, setActive] = useState<string>('home');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: '-40% 0px -50% 0px' }
    );
    SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const item = (id: string, icon: React.ReactNode, label: string) => (
    <a
      href={`#${id}`}
      aria-label={label}
      className={cn(
        'flex flex-col items-center justify-center gap-0.5 flex-1 py-1.5 text-[10px] font-medium transition-colors',
        active === id ? 'text-primary' : 'text-muted-foreground'
      )}
    >
      {icon}
      <span>{label}</span>
    </a>
  );

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-[80] border-t border-primary/20
                 bg-background/90 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]"
      aria-label="Mobile navigation"
    >
      <div className="flex items-end justify-around px-2">
        {item('home', <Home size={20} />, 'Home')}
        {item('projects', <FolderKanban size={20} />, 'Projects')}

        {/* Center AI button — elevated + glowing */}
        <div className="flex-1 flex justify-center">
          <button
            onClick={onOpenChat}
            aria-label="Open AI chat"
            className="relative -translate-y-4 w-14 h-14 rounded-full flex items-center justify-center
                       bg-gradient-to-br from-primary to-secondary text-primary-foreground
                       shadow-[0_0_25px_hsl(var(--primary)/0.55)] active:scale-95 transition-transform"
          >
            <Bot size={26} />
            <span className="absolute inset-0 rounded-full bg-primary/40 animate-ping [animation-duration:3s]" />
          </button>
        </div>

        {item('blog', <BookOpen size={20} />, 'Blog')}
        {item('contact', <Mail size={20} />, 'Contact')}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
