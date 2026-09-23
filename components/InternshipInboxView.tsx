'use client';

import React, { useState } from 'react';
import { Mail, Search, Star, Archive, Trash2, CheckCircle2, ChevronRight, ArrowLeft, Paperclip, Sparkles, User, Reply, Clock, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface EmailMessage {
  id: string;
  senderName: string;
  senderEmail: string;
  senderRole: string;
  senderAvatar: string;
  subject: string;
  preview: string;
  date: string;
  timestamp: string;
  isUnread: boolean;
  isStarred: boolean;
  category: 'Task Evaluation' | 'Mentor Review' | 'System Alert' | 'Offer Letter' | 'General';
  pointsAwarded?: number;
  content: string;
  attachments?: { name: string; size: string; type: string }[];
}

const SAMPLE_EMAILS: EmailMessage[] = [
  {
    id: 'email-1',
    senderName: 'Dr. Aris Thorne',
    senderEmail: 'aris.thorne@cortexa.ai',
    senderRole: 'Head of AI Research',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    subject: 'Task #4 PyTorch Fine-Tuning Approved (+240 pts)',
    preview: 'Great work on your QLoRA submission! Automated benchmark scores passed with 98% accuracy...',
    date: 'Aug 21',
    timestamp: '2 hours ago',
    isUnread: true,
    isStarred: true,
    category: 'Task Evaluation',
    pointsAwarded: 240,
    content: `
<p>Hi Nmesoma,</p>
<p>Congratulations! Your project task submission for <strong>Task #4: Multi-Agent QLoRA Fine-Tuning Pipeline</strong> has been reviewed and officially approved by the Cortexa evaluation committee.</p>
<div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:12px; padding:16px; margin:16px 0;">
  <h4 style="margin:0 0 8px 0; color:#14532d; font-size:13px; font-weight:700;">Task Benchmark Scorecard</h4>
  <ul style="margin:0; padding-left:20px; color:#166534; font-size:12px; line-height:1.6;">
    <li><strong>Model Accuracy:</strong> 98.4% on validation set</li>
    <li><strong>Memory Efficiency:</strong> 7.8GB VRAM peak (Passes 8GB constraint)</li>
    <li><strong>Code Quality & Cleanliness:</strong> 10/10</li>
    <li><strong>Leaderboard Points Credited:</strong> <span style="background:#15803d; color:#fff; padding:2px 6px; border-radius:4px; font-weight:700;">+240 pts</span></li>
  </ul>
</div>
<p><strong>Mentor Feedback:</strong> "Your implementation of memory-efficient gradient checkpointing in PyTorch was crisp. Keep up the high standard as we prepare for Cohort #4 final rankings!"</p>
<p>Best regards,<br/><strong>Dr. Aris Thorne</strong><br/><em>Head of AI Research @ Cortexa</em></p>
    `,
    attachments: [
      { name: 'Evaluation_Benchmark_Report.pdf', size: '1.2 MB', type: 'PDF' },
      { name: 'Submission_Feedback_Notes.txt', size: '14 KB', type: 'TXT' },
    ],
  },
  {
    id: 'email-2',
    senderName: 'Sarah Lin',
    senderEmail: 'sarah.lin@cortexa.ai',
    senderRole: 'Talent Acquisition Lead',
    senderAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    subject: 'Interview Invitation: Backend AI Systems Intern @ Cortexa Lab',
    preview: 'We reviewed your high leaderboard standing (#4) and CV audit score. We would love to invite you for a 30-min technical call...',
    date: 'Aug 20',
    timestamp: '1 day ago',
    isUnread: true,
    isStarred: true,
    category: 'Offer Letter',
    content: `
<p>Hello Nmesoma,</p>
<p>Based on your outstanding performance in the <strong>Cortexa AI Internship Program</strong> and your current rank of <strong>#4 overall</strong> in the Machine Learning track, our recruitment team would love to invite you to an introductory interview for the <em>Backend AI Systems Intern</em> position.</p>
<p>This role offers mentorship from senior systems engineers, real-world LLM deployment projects, and a monthly stipend of <strong>$1,800/mo</strong>.</p>
<p>Please click the link below to select a 30-minute interview slot that suits your schedule:</p>
<p style="margin:20px 0;"><a href="#" style="background:#047857; color:#ffffff; padding:10px 20px; border-radius:10px; font-weight:bold; text-decoration:none; display:inline-block;">Schedule Interview Slot →</a></p>
<p>Looking forward to speaking with you!</p>
<p>Best regards,<br/><strong>Sarah Lin</strong><br/><em>Talent Acquisition Lead</em></p>
    `,
  },
  {
    id: 'email-3',
    senderName: 'Cortexa AI Career Audit',
    senderEmail: 'audit-bot@cortexa.ai',
    senderRole: 'Automated Career System',
    senderAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    subject: 'Your ATS Resume Audit Report is Ready (Score: 92/100)',
    preview: 'Your uploaded CV was analyzed by our ATS parser. High impact keywords detected: PyTorch, Multi-Agent, FastAPI...',
    date: 'Aug 19',
    timestamp: '2 days ago',
    isUnread: true,
    isStarred: false,
    category: 'System Alert',
    content: `
<p>Hi Nmesoma,</p>
<p>Your latest ATS Resume Audit report has been generated successfully.</p>
<div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:16px; margin:16px 0;">
  <div style="font-size:24px; font-weight:800; color:#0f172a;">ATS Match Score: 92 / 100</div>
  <p style="margin:8px 0 0 0; color:#475569; font-size:12px;">Strong formatting detected. Recommended addition: Quantify your recent PyTorch memory reduction benchmark results in the projects section.</p>
</div>
<p>You can view full detailed breakdown in your CV Audit tab.</p>
    `,
  },
  {
    id: 'email-4',
    senderName: 'Marcus Vance',
    senderEmail: 'marcus.vance@cortexa.ai',
    senderRole: 'Principal Systems Architect',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    subject: 'Mentor Review: Feedback on Redis Caching Architecture',
    preview: 'Here are a few suggestions on optimizing vector indexing query latencies under 50ms...',
    date: 'Aug 18',
    timestamp: '3 days ago',
    isUnread: false,
    isStarred: false,
    category: 'Mentor Review',
    content: `
<p>Hey Nmesoma,</p>
<p>I reviewed your architectural proposal for vector caching in Redis. Your choice of HNSW indexing strategy was solid.</p>
<p>To reduce latency under high concurrent load, consider implementing connection pooling with HSET pipelining. Feel free to ping me if you have any questions before submitted Task #5.</p>
<p>Cheers,<br/><strong>Marcus Vance</strong></p>
    `,
  },
  {
    id: 'email-5',
    senderName: 'Cortexa Admin System',
    senderEmail: 'notifications@cortexa.ai',
    senderRole: 'System Bot',
    senderAvatar: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=150&auto=format&fit=crop&q=80',
    subject: 'Leaderboard Weekly Update: You moved up 2 ranks (#4)',
    preview: 'Weekly snapshot recalculation completed. Total points pool increased to 1,480 pts...',
    date: 'Aug 17',
    timestamp: '4 days ago',
    isUnread: false,
    isStarred: false,
    category: 'System Alert',
    content: `
<p>Hello Nmesoma,</p>
<p>The weekly leaderboard rankings for <strong>Cohort #4</strong> have been updated. You have moved up 2 positions to <strong>Rank #4</strong> out of 1,240 active participants.</p>
<p>Keep up the great work on task submissions to maintain your top standings!</p>
    `,
  },
];

export const InternshipInboxView: React.FC = () => {
  const [emails, setEmails] = useState<EmailMessage[]>(SAMPLE_EMAILS);
  const [selectedEmailId, setSelectedEmailId] = useState<string>(SAMPLE_EMAILS[0].id);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Unread' | 'Starred' | 'Task Evaluation' | 'Offer Letter'>('All');
  const [isMobileDetailOpen, setIsMobileDetailOpen] = useState<boolean>(false);

  const toggleStar = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setEmails((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isStarred: !item.isStarred } : item))
    );
  };

  const markAsRead = (id: string) => {
    setEmails((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isUnread: false } : item))
    );
  };

  const handleSelectEmail = (email: EmailMessage) => {
    setSelectedEmailId(email.id);
    markAsRead(email.id);
    setIsMobileDetailOpen(true);
  };

  const filteredEmails = emails.filter((email) => {
    const matchesFilter =
      selectedFilter === 'All' ||
      (selectedFilter === 'Unread' && email.isUnread) ||
      (selectedFilter === 'Starred' && email.isStarred) ||
      (selectedFilter === 'Task Evaluation' && email.category === 'Task Evaluation') ||
      (selectedFilter === 'Offer Letter' && email.category === 'Offer Letter');

    const matchesSearch =
      email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.preview.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const activeEmail = emails.find((e) => e.id === selectedEmailId) || emails[0];
  const unreadCount = emails.filter((e) => e.isUnread).length;

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 shrink-0">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">E-Mail Inbox</h1>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold">
                  {unreadCount} new
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Direct notifications regarding task evaluation, score updates, mentor reviews, and career offers.
            </p>
          </div>
        </div>
      </div>

      {/* Main Dual-Pane Inbox Window */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden min-h-[600px] flex flex-col md:flex-row">
        
        {/* LEFT PANE: Email List */}
        <div
          className={`w-full md:w-5/12 lg:w-4/12 border-r border-slate-200 flex flex-col ${
            isMobileDetailOpen ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Search & Filter Top Bar */}
          <div className="p-4 border-b border-slate-200 space-y-3 bg-slate-50/50">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search emails..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1">
              {(['All', 'Unread', 'Starred', 'Task Evaluation', 'Offer Letter'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors ${
                    selectedFilter === filter
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Email Item Rows */}
          <div className="divide-y divide-slate-100 overflow-y-auto flex-1 max-h-[550px]">
            {filteredEmails.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">No emails match your filter.</div>
            ) : (
              filteredEmails.map((email) => {
                const isSelected = email.id === selectedEmailId;
                return (
                  <div
                    key={email.id}
                    onClick={() => handleSelectEmail(email)}
                    className={`p-4 transition-colors cursor-pointer relative flex gap-3 items-start ${
                      isSelected
                        ? 'bg-emerald-50/60 border-l-4 border-emerald-600'
                        : email.isUnread
                        ? 'bg-white font-semibold hover:bg-slate-50'
                        : 'bg-slate-50/30 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    {/* Unread indicator dot */}
                    {email.isUnread && (
                      <span className="w-2 h-2 rounded-full bg-emerald-600 absolute top-4 left-2" />
                    )}

                    {/* Sender Avatar */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={email.senderAvatar}
                      alt={email.senderName}
                      className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-200 mt-0.5 ml-1"
                    />

                    {/* Email Content Summary */}
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className={`text-xs truncate ${email.isUnread ? 'font-bold text-slate-900' : 'text-slate-700'}`}>
                          {email.senderName}
                        </span>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap shrink-0">{email.date}</span>
                      </div>

                      <div className={`text-xs leading-snug truncate ${email.isUnread ? 'font-bold text-slate-900' : 'font-medium text-slate-800'}`}>
                        {email.subject}
                      </div>

                      <div className="text-[11px] text-slate-500 line-clamp-1 leading-normal">
                        {email.preview}
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span
                          className={`text-[9px] px-2 py-0.5 rounded font-bold ${
                            email.category === 'Task Evaluation'
                              ? 'bg-emerald-100 text-emerald-800'
                              : email.category === 'Offer Letter'
                              ? 'bg-purple-100 text-purple-800'
                              : email.category === 'Mentor Review'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {email.category}
                        </span>

                        <button
                          onClick={(e) => toggleStar(e, email.id)}
                          className="p-1 hover:text-amber-500 transition-colors"
                        >
                          <Star
                            className={`w-3.5 h-3.5 ${
                              email.isStarred ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT PANE: Email Reader Detail */}
        <div
          className={`w-full md:w-7/12 lg:w-8/12 flex-col bg-white ${
            isMobileDetailOpen ? 'flex' : 'hidden md:flex'
          }`}
        >
          {activeEmail ? (
            <div className="flex flex-col h-full">
              
              {/* Reader Header Controls */}
              <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMobileDetailOpen(false)}
                    className="md:hidden p-1 text-slate-500 hover:text-slate-800 rounded-lg"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{activeEmail.category}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => toggleStar(e, activeEmail.id)}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-medium flex items-center gap-1"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        activeEmail.isStarred ? 'fill-amber-400 text-amber-400' : 'text-slate-400'
                      }`}
                    />
                    <span className="hidden sm:inline">{activeEmail.isStarred ? 'Starred' : 'Star'}</span>
                  </button>

                  <button className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors">
                    <Reply className="w-3.5 h-3.5" />
                    <span>Reply</span>
                  </button>
                </div>
              </div>

              {/* Email Detail Main Body */}
              <div className="p-6 overflow-y-auto flex-1 space-y-6">
                
                {/* Subject Title */}
                <div>
                  <h2 className="text-xl font-bold text-slate-900 leading-snug">{activeEmail.subject}</h2>
                  <div className="flex items-center gap-2 mt-2">
                    {activeEmail.pointsAwarded && (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold">
                        +{activeEmail.pointsAwarded} Leaderboard Points
                      </span>
                    )}
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{activeEmail.timestamp}</span>
                    </span>
                  </div>
                </div>

                {/* Sender Card Header */}
                <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={activeEmail.senderAvatar}
                      alt={activeEmail.senderName}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-2xs"
                    />
                    <div>
                      <div className="font-bold text-sm text-slate-900">{activeEmail.senderName}</div>
                      <div className="text-xs text-slate-500">{activeEmail.senderRole} &lt;{activeEmail.senderEmail}&gt;</div>
                    </div>
                  </div>

                  <div className="text-right text-[11px] text-slate-400">
                    To: <span className="font-semibold text-slate-700">Nmesoma Anita &lt;nmesoanita@gmail.com&gt;</span>
                  </div>
                </div>

                {/* HTML Body */}
                <div
                  className="prose prose-slate max-w-none text-xs text-slate-700 leading-relaxed space-y-3 border-t border-slate-100 pt-4"
                  dangerouslySetInnerHTML={{ __html: activeEmail.content }}
                />

                {/* Attachments Section */}
                {activeEmail.attachments && activeEmail.attachments.length > 0 && (
                  <div className="pt-4 border-t border-slate-200 space-y-3">
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Paperclip className="w-4 h-4 text-emerald-600" />
                      <span>Attachments ({activeEmail.attachments.length})</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {activeEmail.attachments.map((att, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl hover:border-emerald-500/40 transition-colors"
                        >
                          <div className="min-w-0 pr-2">
                            <div className="font-semibold text-xs text-slate-800 truncate">{att.name}</div>
                            <div className="text-[10px] text-slate-400">{att.size} • {att.type}</div>
                          </div>
                          <button className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[10px] font-bold shrink-0">
                            Download
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Bottom Quick Reply Footer */}
              <div className="p-4 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
                <span>Direct notification from Cortexa AI Intern System</span>
                <button className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-colors">
                  Quick Reply
                </button>
              </div>

            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-slate-400 text-xs">
              Select an email from the inbox list to read.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
