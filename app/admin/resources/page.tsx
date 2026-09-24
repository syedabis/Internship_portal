'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, Edit3, X, Save, BookOpen, Loader2 } from 'lucide-react';

type Resource = {
  id: string;
  title: string;
  instructor: string;
  role: string;
  duration: string;
  level: string;
  category: string;
  description: string;
  youtube_id: string;
  thumbnail_url: string;
  avatar_url: string;
  resource_links: { name: string; type: string; url: string }[];
  rating: number;
  enrolled_count: number;
  created_at: string;
};

const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

export default function AdminResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Form fields
  const [title, setTitle] = useState('');
  const [instructor, setInstructor] = useState('');
  const [role, setRole] = useState('');
  const [duration, setDuration] = useState('');
  const [level, setLevel] = useState('Beginner');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [youtubeId, setYoutubeId] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [linksText, setLinksText] = useState('');
  const [rating, setRating] = useState('4.5');
  const [enrolledCount, setEnrolledCount] = useState('0');

  const fetchResources = async () => {
    const { data } = await supabase.from('resources').select('*').order('created_at', { ascending: false });
    setResources(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchResources(); }, []);

  const resetForm = () => {
    setTitle(''); setInstructor(''); setRole(''); setDuration('');
    setLevel('Beginner'); setCategory(''); setDescription('');
    setYoutubeId(''); setThumbnailUrl(''); setAvatarUrl('');
    setLinksText(''); setRating('4.5'); setEnrolledCount('0');
    setEditingId(null); setShowForm(false);
  };

  const parseLinks = (text: string) => {
    return text.split('\n').filter(Boolean).map(line => {
      const parts = line.split('|').map(s => s.trim());
      return { name: parts[0] || '', type: parts[1] || 'link', url: parts[2] || '#' };
    });
  };

  const formatLinks = (links: { name: string; type: string; url: string }[]) => {
    return links.map(l => `${l.name} | ${l.type} | ${l.url}`).join('\n');
  };

  const handleSave = async () => {
    if (!title.trim() || !instructor.trim()) return;
    setSaving(true);

    const payload = {
      title, instructor, role, duration, level, category, description,
      youtube_id: youtubeId, thumbnail_url: thumbnailUrl, avatar_url: avatarUrl,
      resource_links: parseLinks(linksText),
      rating: parseFloat(rating) || 4.5,
      enrolled_count: parseInt(enrolledCount) || 0,
    };

    if (editingId) {
      await supabase.from('resources').update(payload).eq('id', editingId);
    } else {
      await supabase.from('resources').insert(payload);
    }

    setSaving(false);
    resetForm();
    fetchResources();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this resource?')) return;
    await supabase.from('resources').delete().eq('id', id);
    fetchResources();
  };

  const handleEdit = (r: Resource) => {
    setEditingId(r.id);
    setTitle(r.title); setInstructor(r.instructor); setRole(r.role || '');
    setDuration(r.duration || ''); setLevel(r.level || 'Beginner');
    setCategory(r.category || ''); setDescription(r.description || '');
    setYoutubeId(r.youtube_id || ''); setThumbnailUrl(r.thumbnail_url || '');
    setAvatarUrl(r.avatar_url || '');
    setLinksText(formatLinks(Array.isArray(r.resource_links) ? r.resource_links : []));
    setRating(String(r.rating)); setEnrolledCount(String(r.enrolled_count));
    setShowForm(true);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-emerald-400" />
            Learning Resources
          </h1>
          <p className="text-slate-400 text-sm mt-1">Manage masterclasses and tutorials visible to interns</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all">
          <Plus className="w-4 h-4" /> Add Resource
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="mb-8 bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">{editingId ? 'Edit Resource' : 'Add New Resource'}</h3>
            <button onClick={resetForm} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title (e.g., Building LLMs with QLoRA)"
              className="p-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500" />
            <input value={instructor} onChange={(e) => setInstructor(e.target.value)} placeholder="Instructor Name"
              className="p-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Role (e.g., AI Lead @ Cortexa)"
              className="p-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500" />
            <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category (e.g., Generative AI)"
              className="p-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500" />
            <div className="flex gap-3">
              <select value={level} onChange={(e) => setLevel(e.target.value)}
                className="flex-1 p-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500">
                {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
              <input value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="Duration"
                className="w-28 p-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500" />
            </div>
          </div>

          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description..." rows={2}
            className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} placeholder="Thumbnail Image URL"
              className="p-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500" />
            <input value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} placeholder="Instructor Avatar URL"
              className="p-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500" />
            <input value={youtubeId} onChange={(e) => setYoutubeId(e.target.value)} placeholder="YouTube Video ID (optional)"
              className="p-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500" />
          </div>

          <div>
            <label className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1 block">
              Resource Links (format: Name | type | url, one per line)
            </label>
            <textarea value={linksText} onChange={(e) => setLinksText(e.target.value)}
              placeholder="PyTorch Notebook | code | https://...&#10;Slides PDF | pdf | https://..." rows={3}
              className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input value={rating} onChange={(e) => setRating(e.target.value)} placeholder="Rating" type="number" step="0.01" min="0" max="5"
              className="p-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500" />
            <input value={enrolledCount} onChange={(e) => setEnrolledCount(e.target.value)} placeholder="Enrolled Count" type="number"
              className="p-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500" />
          </div>

          <div className="flex justify-end">
            <button onClick={handleSave} disabled={saving || !title.trim() || !instructor.trim()}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all">
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              {editingId ? 'Update' : 'Add Resource'}
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 text-emerald-400 animate-spin" /></div>
      ) : resources.length === 0 ? (
        <div className="text-center py-16 text-slate-500 text-sm">No resources yet.</div>
      ) : (
        <div className="space-y-3">
          {resources.map((r) => (
            <div key={r.id} className="bg-slate-800/60 border border-slate-700 rounded-xl p-5 flex items-center justify-between gap-4 group hover:border-slate-600 transition-all">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                {r.thumbnail_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={r.thumbnail_url} alt={r.title} className="w-16 h-10 rounded-lg object-cover shrink-0" />
                )}
                <div className="min-w-0">
                  <h3 className="font-semibold text-white text-sm truncate">{r.title}</h3>
                  <p className="text-[11px] text-slate-500">{r.instructor} · {r.level} · {r.category} · {r.duration}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(r)} className="w-8 h-8 rounded-lg hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-blue-400 transition-colors" title="Edit">
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => handleDelete(r.id)} className="w-8 h-8 rounded-lg hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-red-400 transition-colors" title="Delete">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
