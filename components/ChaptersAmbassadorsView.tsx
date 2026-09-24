'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  MessageCircle,
  Sparkles,
  MapPin,
  CheckCircle2,
  X,
  UserCheck,
  ShieldCheck,
  Building2,
  ExternalLink,
  ChevronRight,
  Send,
  Loader2
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { INITIAL_CHAPTERS } from '@/lib/chaptersData';

export interface Chapter {
  id: string;
  name: string;
  city: string;
  lead_name: string;
  whatsapp_link: string;
  members_count: number;
  badge?: string;
  created_at?: string;
}

export interface Ambassador {
  id: string;
  name: string;
  email: string;
  phone: string;
  university: string;
  chapter_id: string;
  chapter_name: string;
  status: 'Active' | 'Pending' | 'Lead';
  created_at?: string;
}

export const ChaptersAmbassadorsView: React.FC = () => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);

  // Ambassador registration form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [university, setUniversity] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

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
      console.warn('LocalStorage save warning:', err);
    }
  };

  const getLocalAmbassadors = (): Ambassador[] => {
    try {
      const saved = localStorage.getItem('cortexa_ambassadors_list');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  };

  const saveLocalAmbassadors = (list: Ambassador[]) => {
    try {
      localStorage.setItem('cortexa_ambassadors_list', JSON.stringify(list));
      window.dispatchEvent(new Event('cortexa_ambassadors_updated'));
    } catch (err) {
      console.warn('LocalStorage save warning:', err);
    }
  };

  const loadChapters = async () => {
    const local = getLocalChapters();
    try {
      const { data } = await supabase.from('chapters').select('*').order('created_at', { ascending: false });
      if (data && data.length > 0) {
        setChapters(data as Chapter[]);
      } else {
        setChapters(local);
      }
    } catch {
      setChapters(local);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadChapters();
    const handleUpdate = () => loadChapters();
    window.addEventListener('cortexa_chapters_updated', handleUpdate);
    return () => window.removeEventListener('cortexa_chapters_updated', handleUpdate);
  }, []);

  const handleOpenJoinModal = (chapter: Chapter) => {
    setSelectedChapter(chapter);
    setName('');
    setEmail('');
    setPhone('');
    setUniversity('');
    setSuccessMsg(false);
  };

  const handleRegisterAndJoin = async () => {
    if (!selectedChapter || !name.trim() || !phone.trim()) return;
    setSubmitting(true);

    const newAmbassador: Ambassador = {
      id: 'amb_' + Date.now(),
      name: name.trim(),
      email: email.trim() || 'ambassador@cortexa.ai',
      phone: phone.trim(),
      university: university.trim() || 'University',
      chapter_id: selectedChapter.id,
      chapter_name: selectedChapter.name,
      status: 'Active',
      created_at: new Date().toISOString()
    };

    // 1. Save locally
    const existingAmbassadors = getLocalAmbassadors();
    const updatedAmbassadors = [newAmbassador, ...existingAmbassadors];
    saveLocalAmbassadors(updatedAmbassadors);

    // 2. Increment members count locally
    const updatedChapters = chapters.map(c => 
      c.id === selectedChapter.id ? { ...c, members_count: (c.members_count || 0) + 1 } : c
    );
    setChapters(updatedChapters);
    saveLocalChapters(updatedChapters);

    // 3. Save to Supabase asynchronously
    try {
      await supabase.from('ambassadors').insert([{
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        university: university.trim(),
        chapter_id: selectedChapter.id,
        chapter_name: selectedChapter.name,
        status: 'Active'
      }]);

      await supabase.from('chapters')
        .update({ members_count: (selectedChapter.members_count || 0) + 1 })
        .eq('id', selectedChapter.id);
    } catch (err) {
      console.log('Supabase sync skipped:', err);
    }

    setSubmitting(false);
    setSuccessMsg(true);

    // 4. Automatically open WhatsApp link after 1 second
    setTimeout(() => {
      if (selectedChapter.whatsapp_link) {
        window.open(selectedChapter.whatsapp_link, '_blank');
      }
      setSelectedChapter(null);
    }, 1200);
  };

  const filteredChapters = chapters.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.lead_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-16 font-sans">
      
      {/* Hero Banner */}
      <div className="relative rounded-3xl p-8 sm:p-10 overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold tracking-wide uppercase">
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span>Official Ambassadors Network</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Campus Ambassadors & <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">Chapters Network</span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Represent Cortexa AI on your campus! Select your university or city chapter, register as an ambassador, and join your official chapter WhatsApp group for live mentorship and updates.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-slate-400 font-semibold">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verified Chapter Access</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Direct WhatsApp Groups</span>
            </div>
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>Ambassador Perks & Certificates</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by chapter name, university, or city..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all font-medium"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="text-xs text-slate-500 font-bold flex items-center gap-2">
          <span>Total Chapters:</span>
          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">{filteredChapters.length} Chapters</span>
        </div>
      </div>

      {/* Chapter Cards Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-24 bg-white rounded-3xl border border-slate-200">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChapters.map((chapter) => (
            <div
              key={chapter.id}
              className="bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-500/50 p-6 flex flex-col justify-between shadow-xs hover:shadow-xl transition-all duration-300 group"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center font-extrabold shadow-md shrink-0">
                    <Building2 className="w-6 h-6" />
                  </div>
                  {chapter.badge && (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold uppercase tracking-wide">
                      {chapter.badge}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-tight group-hover:text-emerald-700 transition-colors">
                    {chapter.name}
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{chapter.city}</span>
                  </p>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-semibold">Chapter Lead:</span>
                    <span className="font-bold text-slate-800">{chapter.lead_name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-semibold">Ambassadors Joined:</span>
                    <span className="font-extrabold text-emerald-700">{chapter.members_count} Members</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleOpenJoinModal(chapter)}
                className="mt-6 w-full py-3 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-xs font-extrabold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400 group-hover:text-white" />
                <span>Join Chapter WhatsApp</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Registration Modal */}
      {selectedChapter && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 animate-[fadeSlideIn_0.2s_ease-out]">
            
            <div className="flex items-start justify-between border-b pb-4">
              <div>
                <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Ambassador Registration
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">{selectedChapter.name}</h3>
              </div>
              <button onClick={() => setSelectedChapter(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {successMsg ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Registration Successful!</h4>
                <p className="text-xs text-slate-500">Opening your Chapter WhatsApp group link...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Enter your details to register as an Ambassador for <strong className="text-slate-900">{selectedChapter.name}</strong> and get instant access to the WhatsApp group.
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Full Name *</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Zainab Fatima"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">WhatsApp Phone Number *</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +92 300 1234567"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">University / Institute Name</label>
                    <input
                      type="text"
                      value={university}
                      onChange={(e) => setUniversity(e.target.value)}
                      placeholder="e.g. FAST NUCES Lahore"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. ambassador@gmail.com"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedChapter(null)}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleRegisterAndJoin}
                    disabled={submitting || !name.trim() || !phone.trim()}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-extrabold rounded-xl flex items-center gap-2 shadow-md cursor-pointer"
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    <span>Confirm & Join Group</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
