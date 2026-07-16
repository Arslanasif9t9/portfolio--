import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Ban, CheckCircle2, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { requireSupabase } from '@/lib/supabase';
import { timeAgo } from '@/lib/adminApi';
import { cn } from '@/lib/utils';

interface Session {
  id: string;
  guest_id: string;
  is_blocked: boolean;
  ai_enabled: boolean;
  first_seen: string;
  last_active: string;
  total_messages: number;
}

async function fetchSessions(): Promise<Session[]> {
  const { data, error } = await requireSupabase()
    .from('chat_sessions').select('*')
    .order('last_active', { ascending: false }).limit(200);
  if (error) throw error;
  return data as Session[];
}

const UsersPage = () => {
  const qc = useQueryClient();
  const { data: sessions, isLoading } = useQuery({ queryKey: ['sessions'], queryFn: fetchSessions });

  const blockMut = useMutation({
    mutationFn: async ({ id, blocked }: { id: string; blocked: boolean }) => {
      const { error } = await requireSupabase()
        .from('chat_sessions').update({ is_blocked: blocked }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: (_d, v) => {
      qc.invalidateQueries({ queryKey: ['sessions'] });
      toast.success(v.blocked ? 'User blocked' : 'User unblocked');
    },
    onError: () => toast.error('Update failed'),
  });

  return (
    <div className="space-y-6 max-w-5xl">
      <h1 className="text-2xl font-display font-bold gradient-text">Users</h1>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : (
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Guest</th>
                  <th className="px-4 py-3 font-medium">Messages</th>
                  <th className="px-4 py-3 font-medium hidden md:table-cell">First seen</th>
                  <th className="px-4 py-3 font-medium">Last active</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(sessions ?? []).map((s) => (
                  <tr key={s.id} className="border-b border-border/50 hover:bg-primary/5">
                    <td className="px-4 py-3 font-medium text-foreground">{s.guest_id}</td>
                    <td className="px-4 py-3 text-muted-foreground">{s.total_messages}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                      {new Date(s.first_seen).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{timeAgo(s.last_active)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          'px-2 py-0.5 rounded-full text-[11px] font-medium',
                          s.is_blocked ? 'bg-destructive/15 text-destructive' : 'bg-green-500/15 text-green-400'
                        )}
                      >
                        {s.is_blocked ? 'Blocked' : 'Active'}
                      </span>
                      {!s.ai_enabled && (
                        <span className="ml-1 px-2 py-0.5 rounded-full text-[11px] bg-amber-500/15 text-amber-400">
                          AI off
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/admin9t9/messages?session=${s.id}`}
                          className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10"
                          aria-label="View chat"
                        >
                          <MessageSquare size={16} />
                        </Link>
                        <button
                          onClick={() => {
                            if (window.confirm(s.is_blocked ? 'Unblock this user?' : 'Block this user?')) {
                              blockMut.mutate({ id: s.id, blocked: !s.is_blocked });
                            }
                          }}
                          className={cn(
                            'p-2 rounded-lg hover:bg-primary/10',
                            s.is_blocked ? 'text-green-400' : 'text-destructive'
                          )}
                          aria-label={s.is_blocked ? 'Unblock' : 'Block'}
                        >
                          {s.is_blocked ? <CheckCircle2 size={16} /> : <Ban size={16} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {(sessions ?? []).length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                      No conversations yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
