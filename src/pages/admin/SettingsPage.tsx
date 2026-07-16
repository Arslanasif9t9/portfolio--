import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { requireSupabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

type FmtConfig = Record<string, boolean>;

const FLAGS: { key: string; label: string; hint: string }[] = [
  { key: 'enabled', label: 'Markdown rendering', hint: 'Master switch for all formatting' },
  { key: 'bold', label: 'Bold', hint: '**text**' },
  { key: 'italic', label: 'Italic', hint: '*text*' },
  { key: 'inline_code', label: 'Inline code', hint: '`code`' },
  { key: 'code', label: 'Code blocks', hint: '``` blocks ```' },
  { key: 'headings', label: 'Headings', hint: '# ## ###' },
  { key: 'bullets', label: 'Bullet lists', hint: '- item' },
  { key: 'numbered', label: 'Numbered lists', hint: '1. item' },
  { key: 'copy_button', label: 'Copy button', hint: 'On code blocks' },
];

async function fetchProfile() {
  const { data, error } = await requireSupabase()
    .from('admin_profile').select('id, formatting_config').limit(1).single();
  if (error) throw error;
  return data as { id: string; formatting_config: FmtConfig };
}

const SettingsPage = () => {
  const qc = useQueryClient();
  const { data: profile, isLoading } = useQuery({ queryKey: ['admin-settings'], queryFn: fetchProfile });
  const [cfg, setCfg] = useState<FmtConfig>({});

  useEffect(() => {
    if (profile?.formatting_config) setCfg(profile.formatting_config);
  }, [profile]);

  const saveMut = useMutation({
    mutationFn: async (next: FmtConfig) => {
      const { error } = await requireSupabase()
        .from('admin_profile')
        .update({ formatting_config: next, updated_at: new Date().toISOString() })
        .eq('id', profile!.id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-settings'] });
      toast.success('Settings saved');
    },
    onError: () => toast.error('Save failed'),
  });

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-display font-bold gradient-text">Settings</h1>
      <p className="text-xs text-muted-foreground -mt-4">
        Controls how the AI's replies are formatted in the chat widget.
      </p>

      <div className="glass-card rounded-xl p-5 grid sm:grid-cols-2 gap-3">
        {FLAGS.map(({ key, label, hint }) => (
          <button
            key={key}
            onClick={() => setCfg((c) => ({ ...c, [key]: !c[key] }))}
            className={cn(
              'flex items-center justify-between px-4 py-3 rounded-lg border text-left transition-colors',
              cfg[key]
                ? 'border-primary/50 bg-primary/10'
                : 'border-border bg-muted/20 opacity-70'
            )}
          >
            <div>
              <p className="text-sm font-medium text-foreground">{label}</p>
              <p className="text-[11px] text-muted-foreground font-mono">{hint}</p>
            </div>
            <span
              className={cn(
                'w-10 h-5 rounded-full relative transition-colors shrink-0',
                cfg[key] ? 'bg-primary' : 'bg-muted'
              )}
            >
              <span
                className={cn(
                  'absolute top-0.5 w-4 h-4 rounded-full bg-background transition-all',
                  cfg[key] ? 'left-5' : 'left-0.5'
                )}
              />
            </span>
          </button>
        ))}
      </div>

      <button
        onClick={() => saveMut.mutate(cfg)}
        disabled={saveMut.isPending}
        className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-primary to-secondary text-primary-foreground text-sm font-medium disabled:opacity-60"
      >
        Save Settings
      </button>
    </div>
  );
};

export default SettingsPage;
