import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  Bell, Bot, Inbox, Key, LayoutDashboard, Loader2, LogOut, Send, Settings,
  ThumbsUp, User, Users,
} from 'lucide-react';
import { requireSupabase } from '@/lib/supabase';
import { isAdmin } from '@/lib/adminApi';
import { cn } from '@/lib/utils';

const NAV = [
  { to: '/admin9t9/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin9t9/messages', label: 'Messages', icon: Send },
  { to: '/admin9t9/users', label: 'Users', icon: Users },
  { to: '/admin9t9/contact', label: 'Contact Inbox', icon: Inbox },
  { to: '/admin9t9/feedback', label: 'Feedback', icon: ThumbsUp },
  { to: '/admin9t9/api-keys', label: 'API Keys', icon: Key },
  { to: '/admin9t9/notifications', label: 'Notifications', icon: Bell },
  { to: '/admin9t9/profile', label: 'My Profile', icon: User },
  { to: '/admin9t9/settings', label: 'Settings', icon: Settings },
];

const AdminShell = () => {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const supabase = requireSupabase();
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        navigate('/admin9t9/login/1257', { replace: true });
        return;
      }
      if (!(await isAdmin())) {
        await supabase.auth.signOut();
        navigate('/admin9t9/login/1257', { replace: true });
        return;
      }
      setReady(true);
    })();
  }, [navigate]);

  const signOut = async () => {
    await requireSupabase().auth.signOut();
    navigate('/admin9t9/login/1257', { replace: true });
  };

  if (!ready) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex text-foreground">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-60 shrink-0 border-r border-border glass-card rounded-none">
        <div className="flex items-center gap-3 px-5 py-5 border-b border-border">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground">
            <Bot size={20} />
          </div>
          <div>
            <p className="font-display font-bold leading-tight gradient-text">arslan9t9</p>
            <p className="text-[11px] text-muted-foreground">Admin Panel</p>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                  isActive
                    ? 'bg-gradient-to-r from-primary to-secondary text-primary-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground hover:bg-primary/10'
                )
              }
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>
        <button
          onClick={signOut}
          className="flex items-center gap-3 px-6 py-4 text-sm text-muted-foreground hover:text-destructive border-t border-border transition-colors"
        >
          <LogOut size={17} />
          Sign out
        </button>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-background/90 backdrop-blur sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground">
              <Bot size={17} />
            </div>
            <span className="font-display font-bold gradient-text">Admin</span>
          </div>
          <button onClick={signOut} aria-label="Sign out" className="p-2 text-muted-foreground">
            <LogOut size={18} />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
          <Outlet />
        </main>

        {/* Mobile bottom nav */}
        <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 flex overflow-x-auto border-t border-border bg-background/95 backdrop-blur pb-[env(safe-area-inset-bottom)]">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-0.5 px-3 py-2 text-[10px] whitespace-nowrap shrink-0',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )
              }
            >
              <Icon size={18} />
              {label.split(' ')[0]}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default AdminShell;
