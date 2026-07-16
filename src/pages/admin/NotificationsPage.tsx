import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Copy, Pause, Pencil, Play, Plus, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import { requireSupabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

interface Notif {
  id: string;
  title: string;
  message: string;
  icon: string;
  style: string;
  delay_seconds: number;
  frequency: string;
  target_guest: string | null;
  auto_dismiss: boolean;
  auto_dismiss_seconds: number;
  is_active: boolean;
  created_at: string;
}

type NotifInput = Omit<Notif, 'id' | 'created_at'>;

const EMPTY: NotifInput = {
  title: '',
  message: '',
  icon: '📣',
  style: 'glass',
  delay_seconds: 2,
  frequency: 'every_visit',
  target_guest: null,
  auto_dismiss: false,
  auto_dismiss_seconds: 5,
  is_active: true,
};

const ICONS = ['📣', '🎉', '🚀', '💡', '⚡', '🔥', '✨', '👋', '💬', '🎁', '⭐', '❤️', '🛠️', '📢'];
const STYLES = ['glass', 'purple', 'amber', 'red'];
const FREQUENCIES: Record<string, string> = {
  every_visit: 'Every visit',
  once_session: 'Once per session',
  once_day: 'Once per day',
  once_ever: 'Only once ever',
};

async function fetchNotifications(): Promise<Notif[]> {
  const { data, error } = await requireSupabase()
    .from('app_notifications').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data as Notif[];
}

const NotificationsPage = () => {
  const qc = useQueryClient();
  const { data: notifs, isLoading } = useQuery({ queryKey: ['notifications'], queryFn: fetchNotifications });
  const [editing, setEditing] = useState<{ id: string | null; form: NotifInput } | null>(null);

  const invalidate = () => qc.invalidateQueries({ queryKey: ['notifications'] });

  const saveMut = useMutation({
    mutationFn: async ({ id, form }: { id: string | null; form: NotifInput }) => {
      const supabase = requireSupabase();
      if (id) {
        const { error } = await supabase
          .from('app_notifications').update({ ...form, updated_at: new Date().toISOString() }).eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('app_notifications').insert(form);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      invalidate();
      setEditing(null);
      toast.success('Notification saved');
    },
    onError: () => toast.error('Save failed'),
  });

  const updateMut = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<Notif> }) => {
      const { error } = await requireSupabase().from('app_notifications').update(patch).eq('id', id);
      if (error) throw error;
    },
    onSuccess: invalidate,
    onError: () => toast.error('Update failed'),
  });

  const deleteMut = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await requireSupabase().from('app_notifications').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      toast.success('Deleted');
    },
    onError: () => toast.error('Delete failed'),
  });

  const duplicate = (n: Notif) => {
    const { id: _id, created_at: _c, ...rest } = n;
    saveMut.mutate({ id: null, form: { ...rest, title: `${n.title} (copy)` } });
  };

  const f = editing?.form;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold gradient-text">Notifications</h1>
        <button
          onClick={() => setEditing({ id: null, form: EMPTY })}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-primary-foreground text-sm font-medium"
        >
          <Plus size={16} /> New
        </button>
      </div>
      <p className="text-xs text-muted-foreground -mt-4">
        In-app popups shown to visitors after they open the site (not push notifications).
      </p>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : (
        <div className="space-y-3">
          {(notifs ?? []).map((n) => (
            <div key={n.id} className="glass-card rounded-xl p-4 flex items-start gap-4 flex-wrap">
              <span className="text-2xl">{n.icon}</span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-foreground">{n.title}</p>
                  <span
                    className={cn(
                      'px-2 py-0.5 rounded-full text-[10px] font-medium',
                      n.is_active ? 'bg-green-500/15 text-green-400' : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {n.is_active ? 'Active' : 'Paused'}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{n.message}</p>
                <p className="text-[11px] text-muted-foreground mt-1">
                  {n.style} · {FREQUENCIES[n.frequency] ?? n.frequency} · {n.delay_seconds}s delay ·{' '}
                  {n.target_guest || 'all visitors'}
                  {n.auto_dismiss && ` · auto-dismiss ${n.auto_dismiss_seconds}s`}
                </p>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => updateMut.mutate({ id: n.id, patch: { is_active: !n.is_active } })}
                  className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10"
                  aria-label={n.is_active ? 'Pause' : 'Resume'}
                >
                  {n.is_active ? <Pause size={16} /> : <Play size={16} />}
                </button>
                <button
                  onClick={() => setEditing({ id: n.id, form: { ...n } })}
                  className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10"
                  aria-label="Edit"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => duplicate(n)}
                  className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10"
                  aria-label="Duplicate"
                >
                  <Copy size={16} />
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`Delete "${n.title}"?`)) deleteMut.mutate(n.id);
                  }}
                  className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  aria-label="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {(notifs ?? []).length === 0 && (
            <div className="glass-card rounded-xl p-8 text-center text-sm text-muted-foreground">
              No notifications yet.
            </div>
          )}
        </div>
      )}

      {/* Edit modal */}
      {editing && f && (
        <div className="fixed inset-0 z-[95] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setEditing(null)} />
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveMut.mutate(editing);
            }}
            className="relative glass-card bg-background/95 rounded-2xl p-6 w-full max-w-lg space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold gradient-text">
                {editing.id ? 'Edit Notification' : 'New Notification'}
              </h2>
              <button type="button" onClick={() => setEditing(null)} aria-label="Close">
                <X size={18} className="text-muted-foreground" />
              </button>
            </div>

            <label className="text-xs text-muted-foreground space-y-1 block">
              Title
              <input
                required
                maxLength={120}
                value={f.title}
                onChange={(e) => setEditing({ ...editing, form: { ...f, title: e.target.value } })}
                className="w-full bg-muted/40 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/60"
              />
            </label>
            <label className="text-xs text-muted-foreground space-y-1 block">
              Message
              <textarea
                required
                maxLength={1000}
                rows={3}
                value={f.message}
                onChange={(e) => setEditing({ ...editing, form: { ...f, message: e.target.value } })}
                className="w-full bg-muted/40 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/60 resize-none"
              />
            </label>

            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Icon</p>
              <div className="flex flex-wrap gap-1.5">
                {ICONS.map((ic) => (
                  <button
                    key={ic}
                    type="button"
                    onClick={() => setEditing({ ...editing, form: { ...f, icon: ic } })}
                    className={cn(
                      'w-9 h-9 rounded-lg text-lg flex items-center justify-center',
                      f.icon === ic ? 'bg-primary/20 ring-1 ring-primary' : 'bg-muted/40'
                    )}
                  >
                    {ic}
                  </button>
                ))}
                <input
                  maxLength={4}
                  value={f.icon}
                  onChange={(e) => setEditing({ ...editing, form: { ...f, icon: e.target.value } })}
                  className="w-16 bg-muted/40 border border-border rounded-lg px-2 text-center text-sm"
                  aria-label="Custom icon"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <label className="text-xs text-muted-foreground space-y-1 block">
                Style
                <select
                  value={f.style}
                  onChange={(e) => setEditing({ ...editing, form: { ...f, style: e.target.value } })}
                  className="w-full bg-muted/40 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none"
                >
                  {STYLES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </label>
              <label className="text-xs text-muted-foreground space-y-1 block">
                Frequency
                <select
                  value={f.frequency}
                  onChange={(e) => setEditing({ ...editing, form: { ...f, frequency: e.target.value } })}
                  className="w-full bg-muted/40 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none"
                >
                  {Object.entries(FREQUENCIES).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </label>
            </div>

            <label className="text-xs text-muted-foreground space-y-1 block">
              Delay: {f.delay_seconds}s
              <input
                type="range"
                min={0}
                max={30}
                value={f.delay_seconds}
                onChange={(e) =>
                  setEditing({ ...editing, form: { ...f, delay_seconds: Number(e.target.value) } })
                }
                className="w-full accent-[hsl(var(--primary))]"
              />
            </label>

            <label className="text-xs text-muted-foreground space-y-1 block">
              Target guest ID (blank = all visitors)
              <input
                value={f.target_guest ?? ''}
                onChange={(e) =>
                  setEditing({ ...editing, form: { ...f, target_guest: e.target.value || null } })
                }
                className="w-full bg-muted/40 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/60"
              />
            </label>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-xs text-muted-foreground">
                <input
                  type="checkbox"
                  checked={f.auto_dismiss}
                  onChange={(e) =>
                    setEditing({ ...editing, form: { ...f, auto_dismiss: e.target.checked } })
                  }
                  className="accent-[hsl(var(--primary))]"
                />
                Auto-dismiss
              </label>
              {f.auto_dismiss && (
                <label className="flex-1 text-xs text-muted-foreground">
                  after {f.auto_dismiss_seconds}s
                  <input
                    type="range"
                    min={2}
                    max={60}
                    value={f.auto_dismiss_seconds}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        form: { ...f, auto_dismiss_seconds: Number(e.target.value) },
                      })
                    }
                    className="w-full accent-[hsl(var(--primary))]"
                  />
                </label>
              )}
              <label className="flex items-center gap-2 text-xs text-muted-foreground">
                <input
                  type="checkbox"
                  checked={f.is_active}
                  onChange={(e) =>
                    setEditing({ ...editing, form: { ...f, is_active: e.target.checked } })
                  }
                  className="accent-[hsl(var(--primary))]"
                />
                Active
              </label>
            </div>

            <button
              type="submit"
              disabled={saveMut.isPending}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-primary to-secondary text-primary-foreground text-sm font-medium disabled:opacity-60"
            >
              Save Notification
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
