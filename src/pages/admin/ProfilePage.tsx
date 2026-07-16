import { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Camera, Loader2, Plus, Trash2, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { requireSupabase } from '@/lib/supabase';

interface AdminProfile {
  id: string;
  name: string;
  brand_name: string;
  profession: string | null;
  skills: string[];
  bio: string | null;
  location: string | null;
  email: string | null;
  website: string | null;
  github: string | null;
  linkedin: string | null;
  profile_picture_url: string | null;
  elevenlabs_api_key: string | null;
}

interface GalleryItem {
  id: string;
  url: string;
  size_bytes: number | null;
}

async function fetchProfile(): Promise<AdminProfile> {
  const { data, error } = await requireSupabase().from('admin_profile').select('*').limit(1).single();
  if (error) throw error;
  return { ...data, skills: Array.isArray(data.skills) ? data.skills : [] } as AdminProfile;
}

async function fetchGallery(): Promise<GalleryItem[]> {
  const { data, error } = await requireSupabase()
    .from('admin_gallery').select('id, url, size_bytes').order('created_at', { ascending: false });
  if (error) throw error;
  return data as GalleryItem[];
}

async function uploadImage(file: File, folder: string): Promise<{ url: string; size: number }> {
  const supabase = requireSupabase();
  const ext = file.name.split('.').pop() || 'jpg';
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from('profile-pictures').upload(path, file);
  if (error) throw error;
  const { data } = supabase.storage.from('profile-pictures').getPublicUrl(path);
  return { url: data.publicUrl, size: file.size };
}

const inputCls =
  'w-full bg-muted/40 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/60';

const ProfilePage = () => {
  const qc = useQueryClient();
  const { data: profile, isLoading } = useQuery({ queryKey: ['admin-profile'], queryFn: fetchProfile });
  const { data: gallery } = useQuery({ queryKey: ['admin-gallery'], queryFn: fetchGallery });
  const [form, setForm] = useState<AdminProfile | null>(null);
  const [newSkill, setNewSkill] = useState('');
  const [uploading, setUploading] = useState(false);
  const picInput = useRef<HTMLInputElement>(null);
  const galleryInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile) setForm(profile);
  }, [profile]);

  const saveMut = useMutation({
    mutationFn: async (p: AdminProfile) => {
      const { id, ...rest } = p;
      const { error } = await requireSupabase()
        .from('admin_profile').update({ ...rest, updated_at: new Date().toISOString() }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-profile'] });
      toast.success('Profile saved');
    },
    onError: () => toast.error('Save failed'),
  });

  const handlePicUpload = async (file: File) => {
    setUploading(true);
    try {
      const { url } = await uploadImage(file, 'admin');
      setForm((f) => (f ? { ...f, profile_picture_url: url } : f));
      toast.success('Picture uploaded — remember to Save');
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleGalleryUpload = async (files: FileList) => {
    setUploading(true);
    const supabase = requireSupabase();
    try {
      for (const file of Array.from(files)) {
        const { url, size } = await uploadImage(file, 'gallery');
        const { error } = await supabase.from('admin_gallery').insert({ url, size_bytes: size });
        if (error) throw error;
      }
      qc.invalidateQueries({ queryKey: ['admin-gallery'] });
      toast.success('Photo(s) added to gallery');
    } catch {
      toast.error('Gallery upload failed');
    } finally {
      setUploading(false);
    }
  };

  const deletePhoto = async (item: GalleryItem) => {
    if (!window.confirm('Delete this photo?')) return;
    const supabase = requireSupabase();
    const { error } = await supabase.from('admin_gallery').delete().eq('id', item.id);
    if (error) {
      toast.error('Delete failed');
      return;
    }
    const marker = '/profile-pictures/';
    const idx = item.url.indexOf(marker);
    if (idx !== -1) {
      await supabase.storage.from('profile-pictures').remove([item.url.slice(idx + marker.length)]);
    }
    qc.invalidateQueries({ queryKey: ['admin-gallery'] });
    toast.success('Photo deleted');
  };

  const usedMb = ((gallery ?? []).reduce((a, g) => a + (g.size_bytes ?? 0), 0) / (1024 * 1024)).toFixed(1);

  if (isLoading || !form) return <p className="text-sm text-muted-foreground">Loading…</p>;

  const set = <K extends keyof AdminProfile>(k: K, v: AdminProfile[K]) =>
    setForm((f) => (f ? { ...f, [k]: v } : f));

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-display font-bold gradient-text">My Profile</h1>
      <p className="text-xs text-muted-foreground -mt-4">
        This is the persona the AI assistant uses when talking to visitors.
      </p>

      {/* Picture + basics */}
      <div className="glass-card rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-muted/40 border border-border flex items-center justify-center">
              {form.profile_picture_url ? (
                <img src={form.profile_picture_url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <Camera size={24} className="text-muted-foreground" />
              )}
            </div>
            <button
              onClick={() => picInput.current?.click()}
              disabled={uploading}
              className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-gradient-to-r from-primary to-secondary text-primary-foreground"
              aria-label="Upload picture"
            >
              {uploading ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
            </button>
            <input
              ref={picInput}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => e.target.files?.[0] && handlePicUpload(e.target.files[0])}
            />
          </div>
          <div className="flex-1 grid sm:grid-cols-2 gap-3">
            <input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Name" className={inputCls} />
            <input value={form.brand_name} onChange={(e) => set('brand_name', e.target.value)} placeholder="Brand name" className={inputCls} />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <input value={form.profession ?? ''} onChange={(e) => set('profession', e.target.value)} placeholder="Profession" className={inputCls} />
          <input value={form.location ?? ''} onChange={(e) => set('location', e.target.value)} placeholder="Location" className={inputCls} />
          <input value={form.email ?? ''} onChange={(e) => set('email', e.target.value)} placeholder="Email" className={inputCls} />
          <input value={form.website ?? ''} onChange={(e) => set('website', e.target.value)} placeholder="Website" className={inputCls} />
          <input value={form.github ?? ''} onChange={(e) => set('github', e.target.value)} placeholder="GitHub URL" className={inputCls} />
          <input value={form.linkedin ?? ''} onChange={(e) => set('linkedin', e.target.value)} placeholder="LinkedIn URL" className={inputCls} />
        </div>

        {/* Skills */}
        <div>
          <p className="text-xs text-muted-foreground mb-2">Skills</p>
          <div className="flex flex-wrap gap-2">
            {form.skills.map((s) => (
              <span key={s} className="flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs">
                {s}
                <button
                  onClick={() => set('skills', form.skills.filter((x) => x !== s))}
                  aria-label={`Remove ${s}`}
                >
                  <X size={12} />
                </button>
              </span>
            ))}
            <div className="flex items-center gap-1">
              <input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (newSkill.trim()) {
                      set('skills', [...form.skills, newSkill.trim()]);
                      setNewSkill('');
                    }
                  }
                }}
                placeholder="Add skill…"
                className="bg-muted/40 border border-border rounded-full px-3 py-1 text-xs w-28 focus:outline-none focus:border-primary/60"
              />
              <button
                onClick={() => {
                  if (newSkill.trim()) {
                    set('skills', [...form.skills, newSkill.trim()]);
                    setNewSkill('');
                  }
                }}
                className="p-1 rounded-full bg-primary/10 text-primary"
                aria-label="Add skill"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
        </div>

        <textarea
          value={form.bio ?? ''}
          onChange={(e) => set('bio', e.target.value)}
          placeholder="Bio (the AI uses this to describe you)"
          rows={4}
          className={inputCls + ' resize-none'}
        />
      </div>

      {/* Voice */}
      <div className="glass-card rounded-xl p-5 space-y-2">
        <h2 className="font-display font-bold text-foreground">Voice (ElevenLabs)</h2>
        <p className="text-xs text-muted-foreground">
          Optional — powers voice replies later. Leave empty to use browser voice.
        </p>
        <input
          type="password"
          value={form.elevenlabs_api_key ?? ''}
          onChange={(e) => set('elevenlabs_api_key', e.target.value)}
          placeholder="ElevenLabs API key"
          className={inputCls}
        />
      </div>

      {/* Gallery */}
      <div className="glass-card rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="font-display font-bold text-foreground">Photo Gallery</h2>
            <p className="text-xs text-muted-foreground">
              When visitors ask the AI for your photo, it picks one of these. {gallery?.length ?? 0} photos · {usedMb} MB used (free tier: 1 GB)
            </p>
          </div>
          <button
            onClick={() => galleryInput.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-primary-foreground text-sm font-medium disabled:opacity-60"
          >
            {uploading ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
            Upload
          </button>
          <input
            ref={galleryInput}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(e) => e.target.files?.length && handleGalleryUpload(e.target.files)}
          />
        </div>
        {(gallery ?? []).length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {gallery!.map((g) => (
              <div key={g.id} className="relative group aspect-square rounded-lg overflow-hidden border border-border">
                <img src={g.url} alt="" className="w-full h-full object-cover" />
                <button
                  onClick={() => deletePhoto(g)}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-destructive transition-opacity"
                  aria-label="Delete photo"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={() => saveMut.mutate(form)}
        disabled={saveMut.isPending}
        className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-primary to-secondary text-primary-foreground text-sm font-medium disabled:opacity-60"
      >
        {saveMut.isPending ? 'Saving…' : 'Save Profile'}
      </button>
    </div>
  );
};

export default ProfilePage;
