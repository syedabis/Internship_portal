'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Mail, Users, Trophy, HelpCircle, BookOpen, Sparkles, CheckCircle2, MessageSquare, Send, Loader2, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface InternshipCommunityViewProps {
  type: 'announcements' | 'inbox' | 'community' | 'bosniachallenge' | 'support' | 'resources' | 'freetier' | 'questions' | 'myapplication';
}

type Announcement = {
  id: string;
  title: string;
  body: string;
  author_email: string;
  pinned: boolean;
  created_at: string;
};

type SupportTicket = {
  id: string;
  subject: string;
  message: string;
  status: 'open' | 'resolved';
  admin_reply: string | null;
  created_at: string;
};

export const InternshipCommunityView: React.FC<InternshipCommunityViewProps> = ({ type }) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);

  // Support form state
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [myTickets, setMyTickets] = useState<SupportTicket[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(true);

  // Fetch announcements from Supabase
  useEffect(() => {
    if (type === 'announcements') {
      supabase
        .from('announcements')
        .select('*')
        .order('pinned', { ascending: false })
        .order('created_at', { ascending: false })
        .then(({ data }) => {
          setAnnouncements(data || []);
          setLoadingAnnouncements(false);
        });
    }
  }, [type]);

  // Fetch user's own support tickets
  useEffect(() => {
    if (type === 'support') {
      const fetchTickets = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.email) {
          const { data } = await supabase
            .from('support_messages')
            .select('*')
            .eq('user_email', user.email)
            .order('created_at', { ascending: false });
          setMyTickets(data || []);
        }
        setLoadingTickets(false);
      };
      fetchTickets();
    }
  }, [type, sent]);

  const handleSendSupport = async () => {
    if (!subject.trim() || !message.trim()) return;
    setSending(true);

    const { data: { user } } = await supabase.auth.getUser();
    const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Unknown';

    await supabase.from('support_messages').insert({
      user_email: user?.email || 'unknown',
      user_name: userName,
      subject,
      message,
    });

    setSending(false);
    setSent(true);
    setSubject('');
    setMessage('');
    setTimeout(() => setSent(false), 3000);
  };

  const getHeader = () => {
    switch (type) {
      case 'announcements':
        return { title: 'Official Announcements', subtitle: 'Latest updates from Cortexa AI Intern leads & program coordinators.', icon: Bell };
      case 'support':
        return { title: 'Help & Technical Support', subtitle: 'Need help with project submissions or platform scoring? Contact support.', icon: HelpCircle };
      default:
        return { title: 'Intern Portal Record', subtitle: 'Track your application status and queries.', icon: MessageSquare };
    }
  };

  const header = getHeader();
  const Icon = header.icon;

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex items-center gap-4">
        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 shrink-0 flex items-center justify-center">
          {type === 'announcements' ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src="/Icons/Notification.png" alt="Notification" className="w-7 h-7 object-contain" />
          ) : type === 'support' ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src="/Icons/8.png" alt="Support" className="w-7 h-7 object-contain" />
          ) : (
            <Icon className="w-6 h-6" />
          )}
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">{header.title}</h1>
          <p className="text-xs text-slate-500 mt-1">{header.subtitle}</p>
        </div>
      </div>

      {/* Announcements - Live from Supabase */}
      {type === 'announcements' && (
        <div className="space-y-3">
          {loadingAnnouncements ? (
            <div className="flex justify-center py-12"><Loader2 className="w-5 h-5 text-emerald-600 animate-spin" /></div>
          ) : announcements.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs text-center text-sm text-slate-500">
              No announcements yet. Check back soon!
            </div>
          ) : (
            announcements.map((a) => (
              <div key={a.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    {a.pinned && (
                      <span className="px-1.5 py-0.5 bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-bold rounded">
                        PINNED
                      </span>
                    )}
                    <span className="font-bold text-emerald-800">{a.title}</span>
                  </div>
                  <span className="text-slate-400">
                    {new Date(a.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{a.body}</p>
              </div>
            ))
          )}
        </div>
      )}

      {/* Support - Form + My Tickets */}
      {type === 'support' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Submit Form */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Contact Portal Support</h3>

            {sent && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Message sent! Our team will reply shortly.
              </div>
            )}

            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject..."
              className="w-full p-3 bg-slate-50 border rounded-xl text-xs focus:outline-none focus:border-emerald-500"
            />
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your issue or feedback..."
              className="w-full p-3 bg-slate-50 border rounded-xl text-xs focus:outline-none focus:border-emerald-500"
            />
            <button
              onClick={handleSendSupport}
              disabled={sending || !subject.trim() || !message.trim()}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all"
            >
              {sending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              Send Message
            </button>
          </div>

          {/* My Tickets */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">My Support Tickets</h3>

            {loadingTickets ? (
              <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 text-emerald-600 animate-spin" /></div>
            ) : myTickets.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No tickets yet.</p>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {myTickets.map((t) => (
                  <div key={t.id} className={`p-3 border rounded-xl space-y-1.5 ${
                    t.status === 'open' ? 'border-amber-200 bg-amber-50/50' : 'border-emerald-200 bg-emerald-50/50'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-800">{t.subject}</span>
                      <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${
                        t.status === 'open' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {t.status === 'open' ? '⏳ Open' : '✅ Resolved'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2">{t.message}</p>
                    {t.admin_reply && (
                      <div className="mt-1.5 p-2.5 bg-white border border-emerald-200 rounded-lg">
                        <p className="text-[10px] text-emerald-700 font-bold mb-0.5">ADMIN REPLY:</p>
                        <p className="text-[11px] text-slate-700">{t.admin_reply}</p>
                      </div>
                    )}
                    <p className="text-[10px] text-slate-400">
                      {new Date(t.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
