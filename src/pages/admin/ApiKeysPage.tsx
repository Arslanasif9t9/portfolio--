import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ChevronUp, FlaskConical, Plus, Power, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import { requireSupabase } from '@/lib/supabase';
import { testProvider } from '@/lib/adminApi';
import { cn } from '@/lib/utils';

interface Provider {
  id: string;
  display_name: string;
  provider_type: string;
  model_name: string;
  endpoint_url: string;
  priority_order: number;
  is_active: boolean;
  last_used_at: string | null;
  last_status: string | null;
}

const TEMPLATES: Record<string, { endpoint: string; model: string }> = {
  gemini: {
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent',
    model: 'gemini-flash-latest',
  },
  groq: {
    endpoint: 'https://api.groq.com/openai/v1/chat/completions',
    model: 'llama-3.3-70b-versatile',
  },
  nvidia: {
    endpoint: 'https://integrate.api.nvidia.com/v1/chat/completions',
    model: 'meta/llama-3.1-70b-instruct',
  },
  openai: {
    endpoint: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-4o-mini',
  },
  custom: { endpoint: '', model: '' },
};

// api_key intentionally never selected — write-only from this UI
const PROVIDER_COLUMNS =
  'id, display_name, provider_type, model_name, endpoint_url, priority_order, is_active, last_used_at, last_status';

async function fetchProviders(): Promise<Provider[]> {
  const { data, error } = await requireSupabase()
    .from('api_providers').select(PROVIDER_COLUMNS)
    .order('priority_order', { ascending: true });
  if (error) throw error;
  return data as Provider[];
}

interface FormState {
  display_name: string;
  provider_type: string;
  api_key: string;
  model_name: string;
  endpoint_url: string;
  priority_order: number;
}

const EMPTY_FORM: FormState = {
  display_name: '',
  provider_type: 'gemini',
  api_key: '',
  model_name: TEMPLATES.gemini.model,
  endpoint_url: TEMPLATES.gemini.endpoint,
  priority_order: 1,
};

const ApiKeysPage = () => {
  const qc = useQueryClient();
  const { data: providers, isLoading } = useQuery({ queryKey: ['providers'], queryFn: fetchProviders });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [testing, setTesting] = useState<string | null>(null);

  const invalidate = () => qc.invalidateQueries({ queryKey: ['providers'] });

  const createMut = useMutation({
    mutationFn: async (f: FormState) => {
      const { error } = await requireSupabase().from('api_providers').insert({ ...f, is_active: true });
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      setShowForm(false);
      setForm(EMPTY_FORM);
      toast.success('Provider added');
    },
    onError: (e) => toast.error(`Add failed: ${e.message}`),
  });

  const updateMut = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<Provider> }) => {
      const { error } = await requireSupabase().from('api_providers').update(patch).eq('id', id);
      if (error) throw error;
    },
    onSuccess: invalidate,
    onError: () => toast.error('Update failed'),
  });

  const deleteMut = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await requireSupabase().from('api_providers').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      toast.success('Provider deleted');
    },
    onError: () => toast.error('Delete failed'),
  });

  const handleTest = async (id: string) => {
    setTesting(id);
    try {
      const res = await testProvider(id);
      if (res.ok) toast.success(`Provider OK: "${res.sample ?? ''}"`);
      else toast.error(`Test failed: ${res.error ?? 'unknown'}`);
    } catch (e) {
      toast.error(`Test failed: ${e instanceof Error ? e.message : 'error'}`);
    } finally {
      setTesting(null);
      invalidate();
    }
  };

  const moveUp = (index: number) => {
    const list = providers ?? [];
    if (index === 0) return;
    const a = list[index];
    const b = list[index - 1];
    updateMut.mutate({ id: a.id, patch: { priority_order: b.priority_order } });
    updateMut.mutate({ id: b.id, patch: { priority_order: a.priority_order } });
  };

  const setType = (type: string) => {
    const t = TEMPLATES[type] ?? TEMPLATES.custom;
    setForm((f) => ({ ...f, provider_type: type, endpoint_url: t.endpoint, model_name: t.model }));
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold gradient-text">API Keys</h1>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-primary-foreground text-sm font-medium"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? 'Cancel' : 'Add Provider'}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createMut.mutate(form);
          }}
          className="glass-card rounded-xl p-5 space-y-4"
        >
          <div className="grid md:grid-cols-2 gap-4">
            <label className="text-xs text-muted-foreground space-y-1 block">
              Provider type
              <select
                value={form.provider_type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-muted/40 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/60"
              >
                {Object.keys(TEMPLATES).map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </label>
            <label className="text-xs text-muted-foreground space-y-1 block">
              Display name
              <input
                required
                value={form.display_name}
                onChange={(e) => setForm({ ...form, display_name: e.target.value })}
                placeholder="e.g. Gemini Flash"
                className="w-full bg-muted/40 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/60"
              />
            </label>
            <label className="text-xs text-muted-foreground space-y-1 block">
              API key
              <input
                required
                type="password"
                value={form.api_key}
                onChange={(e) => setForm({ ...form, api_key: e.target.value })}
                placeholder="paste key"
                className="w-full bg-muted/40 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/60"
              />
            </label>
            <label className="text-xs text-muted-foreground space-y-1 block">
              Model name
              <input
                required
                value={form.model_name}
                onChange={(e) => setForm({ ...form, model_name: e.target.value })}
                className="w-full bg-muted/40 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/60"
              />
            </label>
            <label className="text-xs text-muted-foreground space-y-1 block md:col-span-2">
              Endpoint URL
              <input
                required
                type="url"
                value={form.endpoint_url}
                onChange={(e) => setForm({ ...form, endpoint_url: e.target.value })}
                className="w-full bg-muted/40 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/60"
              />
            </label>
            <label className="text-xs text-muted-foreground space-y-1 block">
              Priority (1 = first)
              <input
                type="number"
                min={1}
                max={999}
                value={form.priority_order}
                onChange={(e) => setForm({ ...form, priority_order: Number(e.target.value) })}
                className="w-full bg-muted/40 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/60"
              />
            </label>
          </div>
          <button
            type="submit"
            disabled={createMut.isPending}
            className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-primary to-secondary text-primary-foreground text-sm font-medium disabled:opacity-60"
          >
            Save Provider
          </button>
        </form>
      )}

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : (
        <div className="space-y-3">
          {(providers ?? []).map((p, i) => (
            <div key={p.id} className="glass-card rounded-xl p-4 flex items-center gap-4 flex-wrap">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-foreground">{p.display_name}</p>
                  <span
                    className={cn(
                      'px-2 py-0.5 rounded-full text-[10px] font-medium',
                      p.is_active ? 'bg-green-500/15 text-green-400' : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {p.is_active ? 'Active' : 'Off'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {p.provider_type} · {p.model_name} · Priority #{p.priority_order}
                </p>
                {p.last_status && (
                  <p
                    className={cn(
                      'text-[11px] mt-0.5',
                      p.last_status.startsWith('ok') ? 'text-green-400' : 'text-destructive'
                    )}
                  >
                    {p.last_status}
                  </p>
                )}
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => handleTest(p.id)}
                  disabled={testing === p.id}
                  className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 disabled:opacity-50"
                  aria-label="Test provider"
                >
                  <FlaskConical size={16} className={testing === p.id ? 'animate-pulse' : ''} />
                </button>
                <button
                  onClick={() => updateMut.mutate({ id: p.id, patch: { is_active: !p.is_active } })}
                  className={cn(
                    'p-2 rounded-lg hover:bg-primary/10',
                    p.is_active ? 'text-green-400' : 'text-muted-foreground'
                  )}
                  aria-label="Toggle active"
                >
                  <Power size={16} />
                </button>
                <button
                  onClick={() => moveUp(i)}
                  disabled={i === 0}
                  className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 disabled:opacity-30"
                  aria-label="Move up"
                >
                  <ChevronUp size={16} />
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`Delete provider "${p.display_name}"?`)) deleteMut.mutate(p.id);
                  }}
                  className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  aria-label="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {(providers ?? []).length === 0 && !showForm && (
            <div className="glass-card rounded-xl p-8 text-center text-sm text-muted-foreground">
              No providers yet — add one to power the AI chat.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ApiKeysPage;
