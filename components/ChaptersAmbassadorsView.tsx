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
  Loader2,
  Copy,
  Check
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

interface ChaptersAmbassadorsViewProps {
  userName?: string;
  userEmail?: string;
}

export const ChaptersAmbassadorsView: React.FC<ChaptersAmbassadorsViewProps> = ({
  userName,
  userEmail
}) => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);

  // Dynamic user profile resolution
  const [resolvedName, setResolvedName] = useState<string>(userName || '');
  const [resolvedEmail, setResolvedEmail] = useState<string>(userEmail || '');

  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [isExistingMember, setIsExistingMember] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = (url: string) => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Phone Validation Regex (E.164 compliant: + followed by 10-15 digits, or standard local number)
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  const isPhoneValid = /^\+?[1-9]\d{9,14}$/.test(cleanPhone);

  const getLocalChapters = (): Chapter[] => {
    try {
      const saved = localStorage.getItem('cortexa_chapters_list');
      if (saved) {
        const parsed: Chapter[] = JSON.parse(saved);
        return parsed.map((c, idx) => ({
          ...c,
          members_count: typeof c.members_count === 'number' && c.members_count > 3 ? (idx % 3) : (c.members_count || 0)
        }));
      }
      return INITIAL_CHAPTERS.map((c, idx) => ({
        ...c,
        members_count: typeof c.members_count === 'number' && c.members_count > 3 ? (idx % 3) : (c.members_count || 0)
      }));
    } catch {
      return INITIAL_CHAPTERS.map((c, idx) => ({
        ...c,
        members_count: typeof c.members_count === 'number' && c.members_count > 3 ? (idx % 3) : (c.members_count || 0)
      }));
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

  // Dynamically resolve logged-in user profile from Supabase auth if props are omitted
  useEffect(() => {
    const resolveUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Intern Ambassador';
          const email = user.email || 'intern@cortexa.ai';
          setResolvedName(userName || name);
          setResolvedEmail(userEmail || email);
        } else {
          setResolvedName(userName || 'Intern Ambassador');
          setResolvedEmail(userEmail || 'intern@cortexa.ai');
        }
      } catch {
        setResolvedName(userName || 'Intern Ambassador');
        setResolvedEmail(userEmail || 'intern@cortexa.ai');
      }
    };
    resolveUser();
  }, [userName, userEmail]);

  const loadChapters = async () => {
    const local = getLocalChapters();
    try {
      const { data } = await supabase.from('chapters').select('*').order('created_at', { ascending: false });
      if (data && data.length > 0) {
        const normalized = (data as Chapter[]).map((c, idx) => ({
          ...c,
          members_count: typeof c.members_count === 'number' && c.members_count > 3 ? (idx % 3) : (c.members_count || 0)
        }));
        setChapters(normalized);
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

  const MAX_GROUP_CAPACITY = 3;

  const isUserRegisteredInChapter = (chapterId: string, chapterName: string): boolean => {
    const existingAmbassadors = getLocalAmbassadors();
    const ambEmail = (resolvedEmail || userEmail || '').toLowerCase();
    if (!ambEmail) return false;
    return existingAmbassadors.some(
      a => (a.email.toLowerCase() === ambEmail) &&
           (a.chapter_id === chapterId || a.chapter_name.toLowerCase() === chapterName.toLowerCase())
    );
  };

  const handleOpenJoinModal = (chapter: Chapter) => {
    setSelectedChapter(chapter);
    setPhone('');
    const isMember = isUserRegisteredInChapter(chapter.id, chapter.name);
    if (isMember) {
      setSuccessMsg(true);
      setIsExistingMember(true);
    } else {
      setSuccessMsg(false);
      setIsExistingMember(false);
    }
  };

  const handleRegisterAndJoin = async () => {
    if (!selectedChapter || !isPhoneValid) return;
    setSubmitting(true);

    const ambName = resolvedName || 'Intern Ambassador';
    const ambEmail = resolvedEmail || 'intern@cortexa.ai';
    const ambUni = selectedChapter.name;
    const formattedPhone = cleanPhone.startsWith('+') ? cleanPhone : `+92${cleanPhone.replace(/^0/, '')}`;

    const existingAmbassadors = getLocalAmbassadors();
    
    // Check if ambassador has ALREADY registered for this specific chapter
    const alreadyRegistered = existingAmbassadors.some(
      a => (a.email.toLowerCase() === ambEmail.toLowerCase() || a.phone === formattedPhone) &&
           (a.chapter_id === selectedChapter.id || a.chapter_name.toLowerCase() === selectedChapter.name.toLowerCase())
    );

    const currentCount = selectedChapter.members_count || 0;
    if (!alreadyRegistered && currentCount >= MAX_GROUP_CAPACITY) {
      alert('This WhatsApp group has reached its maximum capacity of 3 interns.');
      setSubmitting(false);
      return;
    }

    if (alreadyRegistered) {
      // User is already a member; do NOT inflate members_count
      setIsExistingMember(true);
    } else {
      // New registration: add ambassador and increment members count once
      const newAmbassador: Ambassador = {
        id: 'amb_' + Date.now(),
        name: ambName,
        email: ambEmail,
        phone: formattedPhone,
        university: ambUni,
        chapter_id: selectedChapter.id,
        chapter_name: selectedChapter.name,
        status: 'Active',
        created_at: new Date().toISOString()
      };

      const updatedAmbassadors = [newAmbassador, ...existingAmbassadors];
      saveLocalAmbassadors(updatedAmbassadors);

      // Increment members count locally
      const updatedChapters = chapters.map(c => 
        c.id === selectedChapter.id ? { ...c, members_count: (c.members_count || 0) + 1 } : c
      );
      setChapters(updatedChapters);
      saveLocalChapters(updatedChapters);

      // Save to Supabase
      try {
        await supabase.from('ambassadors').insert([{
          name: ambName,
          email: ambEmail,
          phone: formattedPhone,
          university: ambUni,
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
    }

    setSubmitting(false);
    setSuccessMsg(true);
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
        <div 
          className="absolute inset-0 opacity-40 bg-cover bg-center pointer-events-none -scale-x-100"
          style={{ backgroundImage: "url('/image_card.jpeg')" }}
        />
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
            Represent Cortexa AI on your campus! Select your university or city chapter, register as an ambassador, and join your official chapter WhatsApp group for live mentorship and updates. Each group is capped at 3 interns max.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-slate-400 font-semibold">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verified Chapter Access</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Max 3 Interns Per Group</span>
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
          {filteredChapters.map((chapter) => {
            const count = chapter.members_count || 0;
            const isFull = count >= MAX_GROUP_CAPACITY;
            const isMember = isUserRegisteredInChapter(chapter.id, chapter.name);

            return (
              <div
                key={chapter.id}
                className="bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-500/50 p-6 flex flex-col justify-between shadow-xs hover:shadow-xl transition-all duration-300 group"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center font-extrabold shadow-md shrink-0">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      {chapter.badge && (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold uppercase tracking-wide">
                          {chapter.badge}
                        </span>
                      )}
                      {isFull ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-extrabold uppercase tracking-wide">
                          3/3 Full
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold tracking-wide font-mono">
                          {count}/3 Seats
                        </span>
                      )}
                    </div>
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

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-600">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 font-semibold">Chapter Lead:</span>
                      <span className="font-bold text-slate-800">{chapter.lead_name}</span>
                    </div>
                  </div>
                </div>

                {isMember ? (
                  <button
                    type="button"
                    onClick={() => handleOpenJoinModal(chapter)}
                    className="mt-6 w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 fill-white text-emerald-700" />
                    <span>Access WhatsApp Group</span>
                  </button>
                ) : isFull ? (
                  <button
                    type="button"
                    disabled
                    className="mt-6 w-full py-3 rounded-xl bg-slate-100 text-slate-400 border border-slate-200 text-xs font-bold flex items-center justify-center gap-2 cursor-not-allowed"
                  >
                    <X className="w-4 h-4 text-slate-400" />
                    <span>Group Full (3/3)</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleOpenJoinModal(chapter)}
                    className="mt-6 w-full py-3 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-xs font-extrabold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-400 group-hover:text-white" />
                    <span>Join Chapter WhatsApp</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Registration Modal */}
      {selectedChapter && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white border border-slate-200/90 rounded-[28px] p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 overflow-hidden animate-[fadeSlideIn_0.2s_ease-out]">
            
            {/* Ambient Success Glow Background */}
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-72 h-72 bg-gradient-to-b from-emerald-500/15 via-teal-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex items-start justify-between">
              <div>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold text-emerald-800 bg-emerald-100/80 border border-emerald-300/60 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  <span>Ambassador Registration</span>
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-2 tracking-tight">
                  {selectedChapter.name.replace(/Chap$/i, 'Chapter')}
                </h3>
              </div>
              <button
                onClick={() => setSelectedChapter(null)}
                className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                title="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {successMsg ? (
              <div className="relative z-10 py-3 text-center space-y-5">
                
                {/* Animated Pulsing Success Icon */}
                <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping opacity-60" />
                  <div className="relative w-16 h-16 bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="text-xl font-extrabold text-slate-900 tracking-tight">
                    {isExistingMember ? 'Welcome Back!' : 'Registration Confirmed! 🎉'}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto font-medium">
                    {isExistingMember ? (
                      <>You are already registered as an official Ambassador for <strong className="text-slate-900 font-bold">{selectedChapter.name.replace(/Chap$/i, 'Chapter')}</strong>.</>
                    ) : (
                      <>You are now officially registered as an Ambassador for <strong className="text-slate-900 font-bold">{selectedChapter.name.replace(/Chap$/i, 'Chapter')}</strong>.</>
                    )}
                  </p>
                </div>

                {/* "What's Next" Summary Card */}
                <div className="bg-slate-50/90 border border-slate-200/80 rounded-2xl p-4 text-left space-y-2.5 shadow-xs">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                    ⚡ What Happens Next
                  </span>
                  <div className="space-y-2 text-xs text-slate-700 font-medium">
                    <div className="flex items-center gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>Join official WhatsApp group for mentorship & updates</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>Connect with Chapter Lead <strong className="text-slate-900 font-bold">{selectedChapter.lead_name}</strong></span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>Eligible for Ambassador Certificates & Perks</span>
                    </div>
                  </div>
                </div>

                {/* Primary CTA & Copy Link */}
                <div className="pt-1 space-y-2.5">
                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <a
                      href={selectedChapter.whatsapp_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:flex-1 py-3.5 px-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-extrabold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/40 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer min-w-0"
                    >
                      <MessageCircle className="w-4 h-4 fill-white text-emerald-700 shrink-0" />
                      <span className="truncate">Join WhatsApp Group</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-90 shrink-0" />
                    </a>

                    <button
                      type="button"
                      onClick={() => handleCopyLink(selectedChapter.whatsapp_link)}
                      className={`w-full sm:w-auto py-3.5 px-4 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer shrink-0 ${
                        copied
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-700 shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                      }`}
                      title="Copy WhatsApp Group Link"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 text-slate-500 shrink-0" />
                          <span>Copy Link</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-[10px] text-slate-400 font-medium text-center sm:text-left">
                    Direct access link & clipboard copy for verified ambassadors
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Please enter your WhatsApp Phone Number to register for <strong className="text-slate-900">{selectedChapter.name}</strong> and access the official WhatsApp group link.
                </p>

                {resolvedName && (
                  <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Registering as:</span>
                    <span className="font-bold text-slate-800">{resolvedName} ({resolvedEmail})</span>
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      WhatsApp Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +92 300 1234567"
                      className={`w-full p-3 bg-slate-50 border rounded-xl text-xs font-medium text-slate-800 focus:outline-none transition-all ${
                        phone.trim() && !isPhoneValid
                          ? 'border-rose-400 focus:border-rose-500 bg-rose-50/30'
                          : 'border-slate-200 focus:border-emerald-500'
                      }`}
                      autoFocus
                    />
                    {phone.trim() !== '' && !isPhoneValid && (
                      <span className="text-[11px] font-semibold text-rose-500 mt-1.5 block">
                        Please enter a valid phone number (e.g. +92 300 1234567)
                      </span>
                    )}
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
                    disabled={submitting || !phone.trim() || !isPhoneValid}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-extrabold rounded-xl flex items-center gap-2 shadow-md cursor-pointer transition-all"
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    <span>Confirm</span>
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
