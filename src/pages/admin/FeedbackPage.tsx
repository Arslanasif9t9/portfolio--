import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ThumbsDown, ThumbsUp } from 'lucide-react';
import { requireSupabase } from '@/lib/supabase';
import { timeAgo } from '@/lib/adminApi';
import { cn } from '@/lib/utils';

interface FeedbackRow {
  id: string;
  is_positive: boolean;
  guest_id: string;
  created_at: string;
  messages: { content: string; session_id: string } | null;
}

async function fetchFeedback(): Promise<FeedbackRow[]> {
  const { data, error } = await requireSupabase()
    .from('message_feedback')
    .select('id, is_positive, guest_id, created_at, messages(content, session_id)')
    .order('created_at', { ascending: false })
    .limit(200);
  if (error) throw error;
  return data as unknown as FeedbackRow[];
}

const FeedbackPage = () => {
  const [filter, setFilter] = useState<'all' | 'positive' | 'negative'>('all');
  const { data: rows, isLoading } = useQuery({ queryKey: ['admin-feedback'], queryFn: fetchFeedback });

  const positive = (rows ?? []).filter((r) => r.is_positive).length;
  const negative = (rows ?? []).length - positive;
  const satisfaction = rows && rows.length > 0 ? Math.round((positive / rows.length) * 100) : 0;

  const visible = (rows ?? []).filter((r) =>
    filter === 'all' ? true : filter === 'positive' ? r.is_positive : !r.is_positive
  );

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-2xl font-display font-bold gradient-text">Feedback</h1>

      <div className="grid grid-cols-3 gap-4">
        <div className="glass-card rounded-xl p-4 text-center">
          <p className="text-2xl font-display font-bold text-green-400">{positive}</p>
          <p className="text-xs text-muted-foreground">Positive</p>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <p className="text-2xl font-display font-bold text-destructive">{negative}</p>
          <p className="text-xs text-muted-foreground">Negative</p>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <p className="text-2xl font-display font-bold gradient-text">{satisfaction}%</p>
          <p className="text-xs text-muted-foreground">Satisfaction</p>
        </div>
      </div>

      <div className="flex gap-2">
        {(['all', 'positive', 'negative'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'px-4 py-1.5 rounded-full text-xs font-medium capitalize transition-colors',
              filter === f
                ? 'bg-gradient-to-r from-primary to-secondary text-primary-foreground'
                : 'glass-card text-muted-foreground hover:text-foreground'
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : visible.length === 0 ? (
        <div className="glass-card rounded-xl p-8 text-center text-sm text-muted-foreground">
          No feedback yet.
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map((r) => (
            <div key={r.id} className="glass-card rounded-xl p-4 flex items-start gap-3">
              <div
                className={cn(
                  'p-2 rounded-lg shrink-0',
                  r.is_positive ? 'bg-green-500/15 text-green-400' : 'bg-destructive/15 text-destructive'
                )}
              >
                {r.is_positive ? <ThumbsUp size={16} /> : <ThumbsDown size={16} />}
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground mb-1">
                  {r.guest_id} · {timeAgo(r.created_at)}
                </p>
                <p className="text-sm text-foreground/90 line-clamp-2">
                  {r.messages?.content ?? '(message deleted)'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedbackPage;
