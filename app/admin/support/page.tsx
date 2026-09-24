'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { HelpCircle, Loader2, CheckCircle2, Clock, Send, X, MessageSquare, Sparkles } from 'lucide-react';

type SupportMessage = {
  id: string;
  user_email: string;
  user_name: string;
  subject: string;
  message: string;
  status: 'open' | 'resolved';
  admin_reply: string | null;
  created_at: string;
};

export default function AdminSupportPage() {
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'open' | 'resolved'>('all');
  const [selectedMessage, setSelectedMessage] = useState<SupportMessage | null>(null);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);

  const fetchMessages = async () => {
    let query = supabase.from('support_messages').select('*').order('created_at', { ascending: false });
    if (filter === 'open') query = query.eq('status', 'open');
    if (filter === 'resolved') query = query.eq('status', 'resolved');
    const { data } = await query;
    setMessages(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchMessages(); }, [filter]);

  const handleReply = async () => {
    if (!selectedMessage || !replyText.trim()) return;
    setSending(true);
    await supabase.from('support_messages')
      .update({ admin_reply: replyText, status: 'resolved' })
      .eq('id', selectedMessage.id);
    setSending(false);
    setReplyText('');
    setSelectedMessage(null);
    fetchMessages();
  };

  const handleMarkOpen = async (id: string) => {
    await supabase.from('support_messages').update({ status: 'open', admin_reply: null }).eq('id', id);
    fetchMessages();
  };

  const openCount = messages.filter(m => m.status === 'open').length;

  return (
    <div className="space-y-6 pb-16 font-sans max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 flex items-center justify-center shrink-0">
            <HelpCircle className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">Support Request Inbox</h1>
              {openCount > 0 && (
                <span className="px-2.5 py-0.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-extrabold rounded-full">
                  {openCount} Pending
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Read technical issues & project submission queries submitted by interns.</p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
          {(['all', 'open', 'resolved'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all capitalize ${
                filter === f ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Messages List */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 flex justify-center items-center">
          <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
        </div>
      ) : messages.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-500">
          {filter === 'all' ? 'No support messages received yet.' : `No ${filter} tickets.`}
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <div
              key={m.id}
              onClick={() => { setSelectedMessage(m); setReplyText(m.admin_reply || ''); }}
              className={`bg-white border rounded-2xl p-5 shadow-xs cursor-pointer hover:shadow-md transition-all ${
                m.status === 'open' ? 'border-amber-400/80 ring-2 ring-amber-500/10' : 'border-slate-200/90'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    {m.status === 'open' ? (
                      <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    )}
                    <h3 className="font-bold text-slate-900 text-sm truncate">{m.subject}</h3>
                    <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full ${
                      m.status === 'open' ? 'bg-amber-50 border border-amber-200 text-amber-700' : 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                    }`}>
                      {m.status.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-1">{m.message}</p>

                  <div className="text-[10px] text-slate-400 font-medium">
                    From: <span className="font-bold text-slate-700">{m.user_name || 'Intern'}</span> ({m.user_email}) · {new Date(m.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>

                  {m.admin_reply && (
                    <div className="mt-2 p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1">
                      <div className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider">YOUR TEAM REPLY:</div>
                      <p className="text-xs text-emerald-900 font-medium line-clamp-1">{m.admin_reply}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reply Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-emerald-600" />
                <span>Intern Support Ticket</span>
              </h3>
              <button onClick={() => setSelectedMessage(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">From</span>
                <span className="font-bold text-slate-800">{selectedMessage.user_name || 'Intern'}</span> ({selectedMessage.user_email})
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Subject</span>
                <span className="font-bold text-slate-900 text-sm">{selectedMessage.subject}</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Intern Message</span>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 leading-relaxed">
                  {selectedMessage.message}
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Received</span>
                <span className="text-slate-500 font-medium">
                  {new Date(selectedMessage.created_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-3">
              <label className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider block">
                Your Reply (will be visible directly in intern's portal)
              </label>

              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write your response to the intern..."
                rows={4}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-emerald-500"
              />

              <div className="flex items-center gap-3 justify-between">
                {selectedMessage.status === 'resolved' && (
                  <button
                    onClick={() => { handleMarkOpen(selectedMessage.id); setSelectedMessage(null); }}
                    className="px-3.5 py-2 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl text-xs font-bold hover:bg-amber-100 transition-all"
                  >
                    Re-open Ticket
                  </button>
                )}

                <div className="flex-1" />

                <button
                  onClick={handleReply}
                  disabled={sending || !replyText.trim()}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-xs"
                >
                  {sending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5 text-emerald-400" />}
                  <span>Reply & Mark Resolved</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
