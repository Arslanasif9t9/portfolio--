import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bot, Loader2, Lock, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { requireSupabase } from '@/lib/supabase';
import { checkAdminExists, bootstrapAdmin } from '@/lib/adminApi';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'loading' | 'login' | 'setup'>('loading');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    const supabase = requireSupabase();
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        navigate('/admin9t9/dashboard', { replace: true });
        return;
      }
      try {
        const { adminExists } = await checkAdminExists();
        setMode(adminExists ? 'login' : 'setup');
      } catch {
        setMode('login');
      }
    })();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    const supabase = requireSupabase();
    try {
      if (mode === 'setup') {
        if (password.length < 8) {
          toast.error('Password must be at least 8 characters');
          setBusy(false);
          return;
        }
        const res = await bootstrapAdmin(email, password);
        if (!res.ok) throw new Error(res.error ?? 'Setup failed');
        toast.success('Admin account created!');
      }
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate('/admin9t9/dashboard', { replace: true });
    } catch {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      toast.error(mode === 'setup' ? 'Setup failed' : 'Invalid credentials');
    } finally {
      setBusy(false);
    }
  };

  if (mode === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.form
        onSubmit={handleSubmit}
        animate={shake ? { x: [0, -10, 10, -8, 8, -4, 4, 0] } : {}}
        transition={{ duration: 0.45 }}
        className="glass-card rounded-2xl p-8 w-full max-w-sm space-y-5 border border-primary/20"
      >
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground">
            <Bot size={28} />
          </div>
          <h1 className="text-xl font-display font-bold gradient-text">
            {mode === 'setup' ? 'Create Admin Account' : 'Admin Login'}
          </h1>
          {mode === 'setup' && (
            <p className="text-xs text-muted-foreground">
              No admin exists yet — this first account becomes the admin.
            </p>
          )}
        </div>

        <div className="relative">
          <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-muted/40 border border-border rounded-lg pl-9 pr-3 py-2.5 text-sm text-foreground
                       focus:outline-none focus:border-primary/60"
          />
        </div>
        <div className="relative">
          <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-muted/40 border border-border rounded-lg pl-9 pr-3 py-2.5 text-sm text-foreground
                       focus:outline-none focus:border-primary/60"
          />
        </div>

        <button
          type="submit"
          disabled={busy}
          className="w-full py-2.5 rounded-lg bg-gradient-to-r from-primary to-secondary text-primary-foreground
                     font-medium flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {busy && <Loader2 size={16} className="animate-spin" />}
          {mode === 'setup' ? 'Create & Sign In' : 'Sign In'}
        </button>
      </motion.form>
    </div>
  );
};

export default AdminLogin;
