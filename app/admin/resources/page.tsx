'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, Edit3, X, Save, BookOpen, Loader2, Sparkles } from 'lucide-react';

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
    <div className="space-y-6 pb-16 font-sans max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-700 flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Learning & Masterclasses</h1>
            <p className="text-xs text-slate-500 mt-0.5">Manage educational videos, tutorials, notebook templates, and documentation.</p>
          </div>
        </div>

        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4 text-emerald-400" />
          <span>Add Resource</span>
        </button>
      </div>

      {/* Form Card */}
      {showForm && (
        <div className="bg-white border border-emerald-500/40 rounded-2xl p-6 shadow-xl space-y-4 ring-2 ring-emerald-500/10">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>{editingId ? 'Edit Resource' : 'Add New Resource'}</span>
            </h3>
            <button onClick={resetForm} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title (e.g. Building LLMs with QLoRA)"
              className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-emerald-500"
            />
            <input
              value={instructor}
              onChange={(e) => setInstructor(e.target.value)}
              placeholder="Instructor Name (e.g. Dr. Aris Thorne)"
              className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Role (e.g. Head of AI @ Cortexa)"
              className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-emerald-500"
            />
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Category (e.g. Generative AI)"
              className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-emerald-500"
            />
            <div className="flex gap-2">
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-1/2 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-emerald-500"
              >
                {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
              <input
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Duration (e.g. 2h 15m)"
                className="w-1/2 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Course overview description..."
            rows={2}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-normal text-slate-800 focus:outline-none focus:border-emerald-500"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
              placeholder="Thumbnail Image URL"
              className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-emerald-500"
            />
            <input
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="Instructor Avatar URL"
              className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-emerald-500"
            />
            <input
              value={youtubeId}
              onChange={(e) => setYoutubeId(e.target.value)}
              placeholder="YouTube Video ID (optional)"
              className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1 block">
              Downloadable Attachments (format: Title | type | url)
            </label>
            <textarea
              value={linksText}
              onChange={(e) => setLinksText(e.target.value)}
              placeholder="PyTorch QLoRA Notebook | code | https://...&#10;Architecture Slides | pdf | https://..."
              rows={3}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center justify-end pt-2 border-t border-slate-100">
            <button
              onClick={handleSave}
              disabled={saving || !title.trim() || !instructor.trim()}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-xs"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>{editingId ? 'Update Resource' : 'Add Resource'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Resource List */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 flex justify-center items-center">
          <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
        </div>
      ) : resources.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-500">
          No resources listed yet. Click "Add Resource" to create your first tutorial.
        </div>
      ) : (
        <div className="space-y-3">
          {resources.map((r) => (
            <div
              key={r.id}
              className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex items-center justify-between gap-4 group hover:border-emerald-500/40 transition-all"
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                {r.thumbnail_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={r.thumbnail_url} alt={r.title} className="w-16 h-12 rounded-xl object-cover shrink-0 border border-slate-200" />
                ) : (
                  <div className="w-16 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 font-bold text-xs border border-purple-100">
                    <BookOpen className="w-5 h-5" />
                  </div>
                )}

                <div className="min-w-0 space-y-0.5">
                  <h3 className="font-bold text-slate-900 text-sm truncate">{r.title}</h3>
                  <p className="text-xs text-slate-500">
                    Instructor: <span className="font-semibold text-slate-700">{r.instructor}</span> ({r.role}) · <span className="font-semibold text-emerald-700">{r.level}</span> · {r.duration}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEdit(r)}
                  className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors"
                  title="Edit"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(r.id)}
                  className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-rose-600 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
