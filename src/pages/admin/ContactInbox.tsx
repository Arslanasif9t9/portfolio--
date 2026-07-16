import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Mail, MailOpen, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { requireSupabase } from '@/lib/supabase';
import { timeAgo } from '@/lib/adminApi';
import { cn } from '@/lib/utils';

interface ContactMsg {
  id: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

async function fetchContacts(): Promise<ContactMsg[]> {
  const { data, error } = await requireSupabase()
    .from('contact_messages').select('*')
    .order('created_at', { ascending: false }).limit(200);
  if (error) throw error;
  return data as ContactMsg[];
}

const ContactInbox = () => {
  const qc = useQueryClient();
  const { data: msgs, isLoading } = useQuery({ queryKey: ['contact-messages'], queryFn: fetchContacts });

  const markRead = useMutation({
    mutationFn: async ({ id, read }: { id: string; read: boolean }) => {
      const { error } = await requireSupabase()
        .from('contact_messages').update({ is_read: read }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['contact-messages'] }),
    onError: () => toast.error('Update failed'),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await requireSupabase().from('contact_messages').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['contact-messages'] });
      toast.success('Message deleted');
    },
    onError: () => toast.error('Delete failed'),
  });

  const unread = (msgs ?? []).filter((m) => !m.is_read).length;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold gradient-text">Contact Inbox</h1>
        {unread > 0 && (
          <span className="px-3 py-1 rounded-full text-xs bg-primary/15 text-primary font-medium">
            {unread} unread
          </span>
        )}
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : (msgs ?? []).length === 0 ? (
        <div className="glass-card rounded-xl p-8 text-center text-muted-foreground text-sm">
          No contact messages yet.
        </div>
      ) : (
        <div className="space-y-3">
          {msgs!.map((m) => (
            <div
              key={m.id}
              className={cn(
                'glass-card rounded-xl p-4',
                !m.is_read && 'border border-primary/40'
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium text-foreground">
                    {m.name}{' '}
                    <a href={`mailto:${m.email}`} className="text-primary text-xs hover:underline">
                      {m.email}
                    </a>
                  </p>
                  <p className="text-[11px] text-muted-foreground mb-2">{timeAgo(m.created_at)}</p>
                  <p className="text-sm text-foreground/90 whitespace-pre-wrap break-words">{m.message}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => markRead.mutate({ id: m.id, read: !m.is_read })}
                    aria-label={m.is_read ? 'Mark unread' : 'Mark read'}
                    className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10"
                  >
                    {m.is_read ? <Mail size={16} /> : <MailOpen size={16} />}
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Delete this message permanently?')) del.mutate(m.id);
                    }}
                    aria-label="Delete"
                    className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactInbox;
