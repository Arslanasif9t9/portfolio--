import { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { ArrowLeft, Bot, Search, Send } from 'lucide-react';
import { toast } from 'sonner';
import { requireSupabase } from '@/lib/supabase';
import { timeAgo } from '@/lib/adminApi';
import { cn } from '@/lib/utils';

interface Session {
  id: string;
  guest_id: string;
  is_blocked: boolean;
  ai_enabled: boolean;
  last_active: string;
  total_messages: number;
}
interface Msg {
  id: string;
  role: 'user' | 'assistant' | 'admin';
  content: string;
  created_at: string;
}

async function fetchSessions(): Promise<Session[]> {
  const { data, error } = await requireSupabase()
    .from('chat_sessions').select('*')
    .order('last_active', { ascending: false }).limit(200);
  if (error) throw error;
  return data as Session[];
}

async function fetchMessages(sessionId: string): Promise<Msg[]> {
  const { data, error } = await requireSupabase()
    .from('messages').select('id, role, content, created_at')
    .eq('session_id', sessionId).order('created_at', { ascending: true });
  if (error) throw error;
  return data as Msg[];
}

const Bubble = ({ m }: { m: Msg }) => (
  <div className={cn('flex', m.role === 'user' ? 'justify-start' : 'justify-end')}>
    <div
      className={cn(
        'max-w-[80%] rounded-2xl px-4 py-2 text-sm break-words',
        m.role === 'user' && 'glass-card rounded-bl-sm',
        m.role === 'assistant' && 'bg-secondary/15 text-foreground rounded-br-sm',
        m.role === 'admin' && 'bg-amber-500/15 border border-amber-500/30 text-foreground rounded-br-sm'
      )}
    >
      {m.role !== 'user' && (
        <p className="text-[10px] font-medium mb-0.5 opacity-70">
          {m.role === 'admin' ? 'You (Admin)' : 'AI Assistant'}
        </p>
      )}
      <p className="whitespace-pre-wrap">{m.content}</p>
    </div>
  </div>
);

const MessagesPage = () => {
  const qc = useQueryClient();
  const [params, setParams] = useSearchParams();
  const selectedId = params.get('session');
  const [search, setSearch] = useState('');
  const [draft, setDraft] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: sessions } = useQuery({
    queryKey: ['sessions'],
    queryFn: fetchSessions,
    refetchInterval: 15000,
  });
  const selected = (sessions ?? []).find((s) => s.id === selectedId) ?? null;

  const { data: messages } = useQuery({
    queryKey: ['session-messages', selectedId],
    queryFn: () => fetchMessages(selectedId!),
    enabled: Boolean(selectedId),
  });

  // Realtime: new messages in the open conversation
  useEffect(() => {
    if (!selectedId) return;
    const supabase = requireSupabase();
    const channel = supabase
      .channel(`dm-${selectedId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `session_id=eq.${selectedId}` },
        () => qc.invalidateQueries({ queryKey: ['session-messages', selectedId] })
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedId, qc]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const replyMut = useMutation({
    mutationFn: async (content: string) => {
      const supabase = requireSupabase();
      const { error } = await supabase
        .from('messages').insert({ session_id: selectedId, role: 'admin', content });
      if (error) throw error;
      await supabase
        .from('chat_sessions').update({ last_active: new Date().toISOString() }).eq('id', selectedId);
    },
    onSuccess: () => {
      setDraft('');
      qc.invalidateQueries({ queryKey: ['session-messages', selectedId] });
    },
    onError: () => toast.error('Send failed'),
  });

  const aiToggleMut = useMutation({
    mutationFn: async (enabled: boolean) => {
      const { error } = await requireSupabase()
        .from('chat_sessions').update({ ai_enabled: enabled }).eq('id', selectedId);
      if (error) throw error;
    },
    onSuccess: (_d, enabled) => {
      qc.invalidateQueries({ queryKey: ['sessions'] });
      toast.success(enabled ? 'AI re-enabled' : 'AI paused — you have taken over');
    },
  });

  const filtered = (sessions ?? []).filter((s) =>
    s.guest_id.toLowerCase().includes(search.toLowerCase())
  );

  const sendReply = () => {
    const text = draft.trim();
    if (text && selectedId) replyMut.mutate(text);
  };

  return (
    <div className="h-[calc(100vh-8rem)] md:h-[calc(100vh-6rem)] max-w-6xl flex glass-card rounded-xl overflow-hidden">
      {/* Session list */}
      <div className={cn('w-full md:w-72 border-r border-border flex flex-col', selectedId && 'hidden md:flex')}>
        <div className="p-3 border-b border-border">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search guests…"
              className="w-full bg-muted/40 border border-border rounded-lg pl-8 pr-3 py-2 text-sm
                         focus:outline-none focus:border-primary/60"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.map((s) => (
            <button
              key={s.id}
              onClick={() => setParams({ session: s.id })}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-3 text-left border-b border-border/40 hover:bg-primary/5',
                s.id === selectedId && 'bg-primary/10'
              )}
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/60 to-secondary/60 flex items-center justify-center text-xs font-bold text-primary-foreground shrink-0">
                {s.guest_id.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{s.guest_id}</p>
                <p className="text-[11px] text-muted-foreground truncate">
                  {timeAgo(s.last_active)} · {s.total_messages} msgs
                  {s.is_blocked && ' · blocked'}
                  {!s.ai_enabled && ' · AI off'}
                </p>
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="p-4 text-sm text-muted-foreground">No conversations.</p>
          )}
        </div>
      </div>

      {/* Conversation */}
      <div className={cn('flex-1 flex-col min-w-0', selectedId ? 'flex' : 'hidden md:flex')}>
        {!selected ? (
          <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
            Select a conversation
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
              <button
                onClick={() => setParams({})}
                className="md:hidden p-1 text-muted-foreground"
                aria-label="Back"
              >
                <ArrowLeft size={18} />
              </button>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-foreground truncate">{selected.guest_id}</p>
                <p className="text-[11px] text-muted-foreground">{timeAgo(selected.last_active)}</p>
              </div>
              <button
                onClick={() => aiToggleMut.mutate(!selected.ai_enabled)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
                  selected.ai_enabled
                    ? 'bg-green-500/15 text-green-400'
                    : 'bg-amber-500/15 text-amber-400'
                )}
              >
                <Bot size={14} />
                {selected.ai_enabled ? 'AI On' : 'AI Off'}
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {(messages ?? []).map((m) => (
                <Bubble key={m.id} m={m} />
              ))}
            </div>

            <div className="p-3 border-t border-border">
              <div className="flex items-end gap-2">
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendReply();
                    }
                  }}
                  rows={1}
                  placeholder="Message as arslan9t9… (Enter to send)"
                  className="flex-1 bg-muted/40 border border-border rounded-xl px-4 py-2.5 text-sm resize-none
                             focus:outline-none focus:border-primary/60"
                />
                <button
                  onClick={sendReply}
                  disabled={!draft.trim() || replyMut.isPending}
                  className="p-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-primary-foreground disabled:opacity-50"
                  aria-label="Send reply"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
