'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { HelpCircle, Loader2, CheckCircle2, Clock, Send, X, MessageSquare } from 'lucide-react';

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
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-emerald-400" />
            Support Inbox
            {openCount > 0 && (
              <span className="px-2 py-0.5 bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold rounded-full ml-2">
                {openCount} open
              </span>
            )}
          </h1>
          <p className="text-slate-400 text-sm mt-1">Read and reply to intern support requests</p>
        </div>

        <div className="flex items-center bg-slate-800 p-1 rounded-xl">
          {(['all', 'open', 'resolved'] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all capitalize ${
                filter === f ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Message List */}
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 text-emerald-400 animate-spin" /></div>
      ) : messages.length === 0 ? (
        <div className="text-center py-16 text-slate-500 text-sm">
          {filter === 'all' ? 'No support messages yet.' : `No ${filter} tickets.`}
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <div key={m.id}
              onClick={() => { setSelectedMessage(m); setReplyText(m.admin_reply || ''); }}
              className={`bg-slate-800/60 border rounded-xl p-5 cursor-pointer hover:border-slate-600 transition-all ${
                m.status === 'open' ? 'border-amber-500/30' : 'border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {m.status === 'open' ? (
                      <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    )}
                    <h3 className="font-semibold text-white text-sm truncate">{m.subject}</h3>
                    <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${
                      m.status === 'open' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {m.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1">{m.message}</p>
                  <p className="text-[10px] text-slate-500 mt-2">
                    From: {m.user_name || m.user_email} · {new Date(m.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                  {m.admin_reply && (
                    <div className="mt-2 p-2 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
                      <p className="text-[10px] text-emerald-400 font-bold mb-0.5">YOUR REPLY:</p>
                      <p className="text-[11px] text-emerald-200 line-clamp-1">{m.admin_reply}</p>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Support Ticket</h3>
              <button onClick={() => setSelectedMessage(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase mb-0.5">From</p>
                <p className="text-xs text-white">{selectedMessage.user_name || 'Unknown'} ({selectedMessage.user_email})</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase mb-0.5">Subject</p>
                <p className="text-sm text-white font-semibold">{selectedMessage.subject}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase mb-0.5">Message</p>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-800 p-3 rounded-xl border border-slate-700">
                  {selectedMessage.message}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase mb-0.5">Received</p>
                <p className="text-xs text-slate-400">
                  {new Date(selectedMessage.created_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-700 space-y-3">
              <label className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Your Reply (visible to intern)</label>
              <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write your reply to the intern..."
                rows={4}
                className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500" />

              <div className="flex items-center gap-3 justify-between">
                {selectedMessage.status === 'resolved' && (
                  <button onClick={() => { handleMarkOpen(selectedMessage.id); setSelectedMessage(null); }}
                    className="px-4 py-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-xl text-xs font-bold hover:bg-amber-500/20 transition-all">
                    Re-open Ticket
                  </button>
                )}
                <div className="flex-1" />
                <button onClick={handleReply} disabled={sending || !replyText.trim()}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all">
                  {sending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  Reply & Resolve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
