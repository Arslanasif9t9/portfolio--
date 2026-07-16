import { useQuery } from '@tanstack/react-query';
import { Activity, Bot, MessageSquare, Users } from 'lucide-react';
import { requireSupabase } from '@/lib/supabase';
import { timeAgo } from '@/lib/adminApi';

interface RecentMsg {
  content: string;
  role: string;
  created_at: string;
  chat_sessions: { guest_id: string } | null;
}

async function fetchStats() {
  const supabase = requireSupabase();
  const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const [sessions24, messages24, active24, provider, recent, contactUnread] = await Promise.all([
    supabase.from('chat_sessions').select('id', { count: 'exact', head: true }).gte('first_seen', dayAgo),
    supabase.from('messages').select('id', { count: 'exact', head: true }).gte('created_at', dayAgo),
    supabase.from('chat_sessions').select('id', { count: 'exact', head: true }).gte('last_active', dayAgo),
    supabase.from('api_providers').select('display_name').eq('is_active', true)
      .order('priority_order', { ascending: true }).limit(1).maybeSingle(),
    supabase.from('messages').select('content, role, created_at, chat_sessions(guest_id)')
      .order('created_at', { ascending: false }).limit(5),
    supabase.from('contact_messages').select('id', { count: 'exact', head: true }).eq('is_read', false),
  ]);

  return {
    newSessions: sessions24.count ?? 0,
    messages: messages24.count ?? 0,
    activeUsers: active24.count ?? 0,
    provider: provider.data?.display_name ?? '—',
    recent: (recent.data ?? []) as unknown as RecentMsg[],
    contactUnread: contactUnread.count ?? 0,
  };
}

const StatCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) => (
  <div className="glass-card rounded-xl p-5 flex items-center gap-4">
    <div className="p-3 rounded-lg bg-primary/10 text-primary">{icon}</div>
    <div className="min-w-0">
      <p className="text-2xl font-display font-bold text-foreground truncate">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const { data, isLoading } = useQuery({ queryKey: ['admin-stats'], queryFn: fetchStats });

  return (
    <div className="space-y-6 max-w-5xl">
      <h1 className="text-2xl font-display font-bold gradient-text">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Users size={20} />} label="New conversations (24h)" value={isLoading ? '…' : data!.newSessions} />
        <StatCard icon={<MessageSquare size={20} />} label="Messages (24h)" value={isLoading ? '…' : data!.messages} />
        <StatCard icon={<Activity size={20} />} label="Active users (24h)" value={isLoading ? '…' : data!.activeUsers} />
        <StatCard icon={<Bot size={20} />} label="Active AI provider" value={isLoading ? '…' : data!.provider} />
      </div>

      {!isLoading && data!.contactUnread > 0 && (
        <div className="glass-card rounded-xl p-4 border border-primary/30 text-sm">
          📬 <strong>{data!.contactUnread}</strong> unread contact message{data!.contactUnread > 1 ? 's' : ''} —
          check the Contact Inbox.
        </div>
      )}

      <div className="glass-card rounded-xl p-5">
        <h2 className="font-display font-bold mb-4 text-foreground">Recent messages</h2>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : data!.recent.length === 0 ? (
          <p className="text-sm text-muted-foreground">No messages yet.</p>
        ) : (
          <ul className="space-y-3">
            {data!.recent.map((m, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span
                  className={
                    'px-2 py-0.5 rounded-full text-[10px] font-medium shrink-0 ' +
                    (m.role === 'user'
                      ? 'bg-primary/15 text-primary'
                      : m.role === 'admin'
                        ? 'bg-amber-500/15 text-amber-400'
                        : 'bg-secondary/15 text-secondary')
                  }
                >
                  {m.role}
                </span>
                <div className="min-w-0">
                  <p className="text-foreground truncate">{m.content.slice(0, 120)}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {m.chat_sessions?.guest_id ?? 'unknown'} · {timeAgo(m.created_at)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
