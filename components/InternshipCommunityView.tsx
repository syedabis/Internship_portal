'use client';

import React from 'react';
import { Bell, Mail, Users, Trophy, HelpCircle, BookOpen, Sparkles, CheckCircle2, MessageSquare } from 'lucide-react';

interface InternshipCommunityViewProps {
  type: 'announcements' | 'inbox' | 'community' | 'bosniachallenge' | 'support' | 'resources' | 'freetier' | 'questions' | 'myapplication';
}

export const InternshipCommunityView: React.FC<InternshipCommunityViewProps> = ({ type }) => {
  const getHeader = () => {
    switch (type) {
      case 'announcements':
        return {
          title: 'Official Announcements',
          subtitle: 'Latest updates from Cortexa AI Intern leads & program coordinators.',
          icon: Bell,
        };
      case 'inbox':
        return {
          title: 'E-Mail Inbox',
          subtitle: 'Direct notifications regarding task evaluation, score updates, and mentor reviews.',
          icon: Mail,
        };
      case 'community':
        return {
          title: 'Intern Community Hub',
          subtitle: 'Connect, collaborate, and share progress with 6,000+ global interns.',
          icon: Users,
        };
      case 'bosniachallenge':
        return {
          title: 'Bosnia AI Challenge 2026',
          subtitle: 'Participate in the flagship international machine learning competition for extra leaderboard points.',
          icon: Trophy,
        };
      case 'support':
        return {
          title: 'Help & Technical Support',
          subtitle: 'Need help with project submissions or platform scoring? Contact support.',
          icon: HelpCircle,
        };
      case 'resources':
        return {
          title: 'Learning & Resource Library',
          subtitle: 'Tutorials, model weights, code templates, and dataset repositories.',
          icon: BookOpen,
        };
      case 'freetier':
        return {
          title: 'Free Tier Benefits',
          subtitle: 'Features included in your free intern account tier.',
          icon: Sparkles,
        };
      default:
        return {
          title: 'Intern Portal Record',
          subtitle: 'Track your application status and queries.',
          icon: MessageSquare,
        };
    }
  };

  const header = getHeader();
  const Icon = header.icon;

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex items-center gap-4">
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 shrink-0">
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">{header.title}</h1>
          <p className="text-xs text-slate-500 mt-1">{header.subtitle}</p>
        </div>
      </div>

      {type === 'bosniachallenge' && (
        <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white rounded-2xl p-6 space-y-3 shadow-md">
          <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold rounded-full">
            Flagship Hackathon • Live Now
          </span>
          <h2 className="text-2xl font-black">Bosnia AI Challenge 2026</h2>
          <p className="text-xs text-slate-300 max-w-xl">
            Build an end-to-end multi-agent AI system. Top 3 teams win $5,000 cash prizes and direct interviews for full-time AI roles.
          </p>
          <button className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-all">
            Join Challenge
          </button>
        </div>
      )}

      {type === 'announcements' && (
        <div className="space-y-3">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-emerald-800">Weekly Scoring Refresh Policy</span>
              <span className="text-slate-400">Aug 16, 2026</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Scoring algorithms now refresh every 6 hours using a weekly baseline snapshot. Check your standing card on the leaderboard tab!
            </p>
          </div>
        </div>
      )}

      {type === 'inbox' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs text-xs space-y-4">
          <div className="font-bold text-slate-900">Unread Messages (9)</div>
          <div className="space-y-2 divide-y">
            <div className="pt-2 flex justify-between items-center">
              <div>
                <div className="font-semibold text-slate-800">Task #4 Submission Approved (+240 pts)</div>
                <div className="text-slate-500 text-[11px]">Your PyTorch fine-tuning notebook passed automated evaluation tests.</div>
              </div>
              <span className="text-[10px] text-slate-400">2h ago</span>
            </div>
            <div className="pt-2 flex justify-between items-center">
              <div>
                <div className="font-semibold text-slate-800">Welcome to Cohort #4 Leaderboard</div>
                <div className="text-slate-500 text-[11px]">Your profile completion score is 60/60 points.</div>
              </div>
              <span className="text-[10px] text-slate-400">1d ago</span>
            </div>
          </div>
        </div>
      )}

      {type === 'support' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4 max-w-lg">
          <h3 className="font-bold text-slate-900 text-sm">Contact Portal Support</h3>
          <input
            type="text"
            placeholder="Subject..."
            className="w-full p-3 bg-slate-50 border rounded-xl text-xs focus:outline-none"
          />
          <textarea
            rows={4}
            placeholder="Describe your issue or feedback..."
            className="w-full p-3 bg-slate-50 border rounded-xl text-xs focus:outline-none"
          />
          <button className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold">
            Send Message
          </button>
        </div>
      )}

      {['resources', 'freetier', 'community', 'questions', 'myapplication'].includes(type) && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs text-xs text-slate-600">
          <p className="leading-relaxed">
            Welcome to the Cortexa AI Intern Portal. Use the sidebar menu to navigate between your leaderboard standing, job opportunities, CV audit reports, and submitted project tasks.
          </p>
        </div>
      )}
    </div>
  );
};
