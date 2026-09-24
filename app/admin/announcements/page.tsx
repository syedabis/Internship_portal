'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, Pin, PinOff, Edit3, X, Save, Bell, Loader2, Sparkles } from 'lucide-react';

type Announcement = {
  id: string;
  title: string;
  body: string;
  author_email: string;
  pinned: boolean;
  created_at: string;
};

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [pinned, setPinned] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchAnnouncements = async () => {
    const { data } = await supabase
      .from('announcements')
      .select('*')
      .order('pinned', { ascending: false })
      .order('created_at', { ascending: false });
    setAnnouncements(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchAnnouncements(); }, []);

  const resetForm = () => {
    setTitle('');
    setBody('');
    setPinned(false);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSave = async () => {
    if (!title.trim() || !body.trim()) return;
    setSaving(true);

    const { data: { user } } = await supabase.auth.getUser();

    if (editingId) {
      await supabase.from('announcements').update({ title, body, pinned }).eq('id', editingId);
    } else {
      await supabase.from('announcements').insert({ title, body, pinned, author_email: user?.email ?? '' });
    }

    setSaving(false);
    resetForm();
    fetchAnnouncements();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this announcement?')) return;
    await supabase.from('announcements').delete().eq('id', id);
    fetchAnnouncements();
  };

  const handleTogglePin = async (id: string, currentPinned: boolean) => {
    await supabase.from('announcements').update({ pinned: !currentPinned }).eq('id', id);
    fetchAnnouncements();
  };

  const handleEdit = (a: Announcement) => {
    setEditingId(a.id);
    setTitle(a.title);
    setBody(a.body);
    setPinned(a.pinned);
    setShowForm(true);
  };

  return (
    <div className="space-y-6 pb-16 font-sans max-w-5xl mx-auto">
      
      {/* Page Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 flex items-center justify-center shrink-0">
            <Bell className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Announcements Management</h1>
            <p className="text-xs text-slate-500 mt-0.5">Publish news updates visible to all intern dashboards in real-time.</p>
          </div>
        </div>

        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4 text-emerald-400" />
          <span>New Announcement</span>
        </button>
      </div>

      {/* Form Modal / Card */}
      {showForm && (
        <div className="bg-white border border-emerald-500/40 rounded-2xl p-6 shadow-xl space-y-4 ring-2 ring-emerald-500/10">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>{editingId ? 'Edit Announcement' : 'New Announcement'}</span>
            </h3>
            <button onClick={resetForm} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
              <X className="w-4 h-4" />
            </button>
          </div>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Announcement Title (e.g. Weekly Scoring Refresh Policy)"
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 font-medium"
          />

          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write announcement body message..."
            rows={4}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 leading-relaxed font-normal"
          />

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <label className="flex items-center gap-2 text-xs text-slate-700 font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={pinned}
                onChange={(e) => setPinned(e.target.checked)}
                className="accent-emerald-600 rounded"
              />
              <span>Pin to top of intern dashboard</span>
            </label>

            <button
              onClick={handleSave}
              disabled={saving || !title.trim() || !body.trim()}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-xs"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>{editingId ? 'Update Announcement' : 'Publish Announcement'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Announcements List */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 flex justify-center items-center">
          <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
        </div>
      ) : announcements.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-500">
          No announcements published yet. Click "New Announcement" to post your first update.
        </div>
      ) : (
        <div className="space-y-3">
          {announcements.map((a) => (
            <div
              key={a.id}
              className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex items-start justify-between gap-4 group hover:border-emerald-500/40 transition-all"
            >
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  {a.pinned && (
                    <span className="px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-extrabold rounded-full">
                      PINNED
                    </span>
                  )}
                  <h3 className="font-bold text-slate-900 text-sm truncate">{a.title}</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">{a.body}</p>
                <div className="text-[10px] text-slate-400 font-medium pt-1">
                  Posted {new Date(a.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  {a.author_email && ` · ${a.author_email}`}
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleTogglePin(a.id, a.pinned)}
                  className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-amber-600 transition-colors"
                  title={a.pinned ? 'Unpin' : 'Pin to top'}
                >
                  {a.pinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => handleEdit(a)}
                  className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors"
                  title="Edit"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(a.id)}
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
