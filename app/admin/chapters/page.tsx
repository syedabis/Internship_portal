'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Users,
  Plus,
  Trash2,
  Edit3,
  X,
  Save,
  Download,
  Loader2,
  Sparkles,
  Building2,
  Search,
  MessageCircle,
  Phone,
  Mail,
  GraduationCap
} from 'lucide-react';
import { Chapter, Ambassador } from '@/components/ChaptersAmbassadorsView';
import { INITIAL_CHAPTERS, INITIAL_AMBASSADORS } from '@/lib/chaptersData';

export default function AdminChaptersPage() {
  const [activeTab, setActiveTab] = useState<'chapters' | 'ambassadors'>('chapters');
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [ambassadors, setAmbassadors] = useState<Ambassador[]>([]);
  const [loading, setLoading] = useState(true);

  // Chapter form state
  const [showChapterForm, setShowChapterForm] = useState(false);
  const [editingChapterId, setEditingChapterId] = useState<string | null>(null);
  const [savingChapter, setSavingChapter] = useState(false);
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [leadName, setLeadName] = useState('');
  const [whatsappLink, setWhatsappLink] = useState('');
  const [badge, setBadge] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const getLocalChapters = (): Chapter[] => {
    try {
      const saved = localStorage.getItem('cortexa_chapters_list');
      return saved ? JSON.parse(saved) : INITIAL_CHAPTERS;
    } catch {
      return INITIAL_CHAPTERS;
    }
  };

  const saveLocalChapters = (list: Chapter[]) => {
    try {
      localStorage.setItem('cortexa_chapters_list', JSON.stringify(list));
      window.dispatchEvent(new Event('cortexa_chapters_updated'));
    } catch (err) {
      console.warn('LocalStorage save error:', err);
    }
  };

  const getLocalAmbassadors = (): Ambassador[] => {
    try {
      const saved = localStorage.getItem('cortexa_ambassadors_list');
      return saved ? JSON.parse(saved) : (INITIAL_AMBASSADORS as Ambassador[]);
    } catch {
      return INITIAL_AMBASSADORS as Ambassador[];
    }
  };

  const saveLocalAmbassadors = (list: Ambassador[]) => {
    try {
      localStorage.setItem('cortexa_ambassadors_list', JSON.stringify(list));
      window.dispatchEvent(new Event('cortexa_ambassadors_updated'));
    } catch (err) {
      console.warn('LocalStorage save error:', err);
    }
  };

  const fetchData = async () => {
    const localC = getLocalChapters();
    const localA = getLocalAmbassadors();

    try {
      const { data: cData } = await supabase.from('chapters').select('*').order('created_at', { ascending: false });
      if (cData && cData.length > 0) setChapters(cData as Chapter[]);
      else setChapters(localC);

      const { data: aData } = await supabase.from('ambassadors').select('*').order('created_at', { ascending: false });
      if (aData && aData.length > 0) setAmbassadors(aData as Ambassador[]);
      else setAmbassadors(localA);
    } catch {
      setChapters(localC);
      setAmbassadors(localA);
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const resetChapterForm = () => {
    setName(''); setCity(''); setLeadName(''); setWhatsappLink(''); setBadge('');
    setEditingChapterId(null); setShowChapterForm(false);
  };

  const handleSaveChapter = async () => {
    if (!name.trim() || !whatsappLink.trim()) return;
    setSavingChapter(true);

    const targetId = editingChapterId || 'c_' + Date.now();
    const updatedChapter: Chapter = {
      id: targetId,
      name: name.trim(),
      city: city.trim() || 'City',
      lead_name: leadName.trim() || 'Chapter Lead',
      whatsapp_link: whatsappLink.trim(),
      members_count: 0,
      badge: badge.trim(),
      created_at: new Date().toISOString()
    };

    let newList: Chapter[];
    if (editingChapterId) {
      newList = chapters.map(c => c.id === editingChapterId || c.name.toLowerCase() === name.trim().toLowerCase() ? { ...updatedChapter, members_count: c.members_count } : c);
    } else {
      newList = [updatedChapter, ...chapters];
    }

    setChapters(newList);
    saveLocalChapters(newList);

    try {
      const payload = {
        name: name.trim(),
        city: city.trim() || 'City',
        lead_name: leadName.trim() || 'Chapter Lead',
        whatsapp_link: whatsappLink.trim(),
        badge: badge.trim()
      };

      if (editingChapterId && !editingChapterId.startsWith('c_') && !editingChapterId.startsWith('c1')) {
        await supabase.from('chapters').update(payload).eq('id', editingChapterId);
      } else {
        await supabase.from('chapters').insert([payload]);
      }
    } catch (err) {
      console.log('Supabase sync skipped:', err);
    }

    setSavingChapter(false);
    resetChapterForm();
  };

  const handleDeleteChapter = async (e: React.MouseEvent, id: string, chapName: string) => {
    e.preventDefault();
    e.stopPropagation();

    const newList = chapters.filter(c => c.id !== id && c.name.toLowerCase() !== chapName.toLowerCase());
    setChapters(newList);
    saveLocalChapters(newList);

    try {
      if (id && !id.startsWith('c_') && !id.startsWith('c1')) {
        await supabase.from('chapters').delete().eq('id', id);
      }
      await supabase.from('chapters').delete().eq('name', chapName);
    } catch (err) {
      console.warn('Supabase delete warning:', err);
    }
  };

  const handleDeleteAmbassador = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();

    const newList = ambassadors.filter(a => a.id !== id);
    setAmbassadors(newList);
    saveLocalAmbassadors(newList);

    try {
      await supabase.from('ambassadors').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase delete warning:', err);
    }
  };

  const handleEditChapter = (c: Chapter) => {
    setEditingChapterId(c.id);
    setName(c.name);
    setCity(c.city);
    setLeadName(c.lead_name);
    setWhatsappLink(c.whatsapp_link);
    setBadge(c.badge || '');
    setShowChapterForm(true);
  };

  const exportAmbassadorsCSV = () => {
    if (ambassadors.length === 0) {
      alert('No registered ambassadors to export.');
      return;
    }

    const headers = ['ID', 'Full Name', 'WhatsApp Phone', 'Email', 'University', 'Chapter Name', 'Status', 'Date Joined'];
    const rows = ambassadors.map(a => [
      `"${a.id}"`,
      `"${a.name}"`,
      `"${a.phone}"`,
      `"${a.email}"`,
      `"${a.university}"`,
      `"${a.chapter_name}"`,
      `"${a.status}"`,
      `"${a.created_at || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Cortexa_Ambassadors_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredChapters = chapters.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAmbassadors = ambassadors.filter(a =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.university.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.chapter_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-16 font-sans max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Chapters & Ambassadors Roster</h1>
            <p className="text-xs text-slate-500 mt-0.5">Manage university chapters, WhatsApp invite links, and registered ambassadors.</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={exportAmbassadorsCSV}
            className="px-4 py-2.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Export Roster CSV</span>
          </button>

          <button
            type="button"
            onClick={() => { resetChapterForm(); setShowChapterForm(true); }}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Add Chapter</span>
          </button>
        </div>
      </div>

      {/* Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveTab('chapters')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'chapters' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Chapters ({chapters.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ambassadors')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'ambassadors' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Registered Ambassadors ({ambassadors.length})
          </button>
        </div>

        <div className="relative flex-1 w-full max-w-xs">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search chapters or ambassadors..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-emerald-500"
          />
          {searchQuery && (
            <button type="button" onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Add / Edit Chapter Form */}
      {showChapterForm && (
        <div className="bg-white border border-emerald-500/40 rounded-2xl p-6 shadow-xl space-y-4 ring-2 ring-emerald-500/10">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>{editingChapterId ? 'Edit Chapter' : 'Add New Chapter'}</span>
            </h3>
            <button type="button" onClick={resetChapterForm} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Chapter Name (e.g. FAST NUCES Chapter)"
              className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-emerald-500"
            />
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City / Region (e.g. Lahore & Islamabad)"
              className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              value={leadName}
              onChange={(e) => setLeadName(e.target.value)}
              placeholder="Chapter Lead Name"
              className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-emerald-500"
            />
            <input
              value={whatsappLink}
              onChange={(e) => setWhatsappLink(e.target.value)}
              placeholder="WhatsApp Group Link (https://chat.whatsapp.com/...)"
              className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-emerald-500 font-mono"
            />
            <input
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              placeholder="Badge (e.g. Top Active, Official)"
              className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex justify-end border-t border-slate-100 pt-3">
            <button
              type="button"
              onClick={handleSaveChapter}
              disabled={savingChapter || !name.trim() || !whatsappLink.trim()}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer"
            >
              {savingChapter ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>{editingChapterId ? 'Update Chapter' : 'Save Chapter'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Chapters Tab */}
      {activeTab === 'chapters' && (
        <div className="space-y-3">
          {filteredChapters.map((c) => (
            <div
              key={c.id}
              className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex items-center justify-between gap-4 group hover:border-emerald-500/40 transition-all"
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 flex items-center justify-center font-bold shrink-0">
                  <Building2 className="w-6 h-6" />
                </div>
                <div className="min-w-0 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-sm truncate">{c.name}</h3>
                    {c.badge && (
                      <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-extrabold rounded-full uppercase">
                        {c.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">
                    City: <span className="font-semibold text-slate-700">{c.city}</span> · Lead: <span className="font-semibold text-slate-700">{c.lead_name}</span> · {c.members_count} Members
                  </p>
                  <p className="text-[11px] text-emerald-600 font-mono truncate">{c.whatsapp_link}</p>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => handleEditChapter(c)}
                  className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                  title="Edit"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={(e) => handleDeleteChapter(e, c.id, c.name)}
                  className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Ambassadors Tab */}
      {activeTab === 'ambassadors' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
          {filteredAmbassadors.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-500">
              No registered ambassadors yet. When interns sign up on the portal, their records will appear here!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Ambassador</th>
                    <th className="p-4">WhatsApp Phone</th>
                    <th className="p-4">University</th>
                    <th className="p-4">Chapter</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredAmbassadors.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-slate-900">{a.name}</div>
                        <div className="text-[11px] text-slate-400">{a.email}</div>
                      </td>
                      <td className="p-4 font-mono font-semibold text-emerald-700">
                        {a.phone}
                      </td>
                      <td className="p-4">
                        <span className="flex items-center gap-1.5 text-slate-700">
                          <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{a.university}</span>
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-800 rounded-lg text-[11px] font-bold">
                          {a.chapter_name}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold rounded-full">
                          {a.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          type="button"
                          onClick={(e) => handleDeleteAmbassador(e, a.id)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Delete Ambassador"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
