'use client';

import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import {
  BookOpen,
  Sparkles,
  Bell,
  Mail,
  Users,
  Trophy,
  HelpCircle,
  Briefcase,
  Award,
  FileText,
  FileSearch,
  UploadCloud,
  MessageSquare,
  UserCheck,
  Play,
  ChevronDown,
  LogOut,
  X,
  FolderKanban
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LinkedinIcon } from './icons';
import { isFeatureAllowedForUser } from '../lib/accessConfig';

export type InternshipTab = 
  | 'leaderboard'
  | 'resources'
  | 'freetier'
  | 'announcements'
  | 'inbox'
  | 'support'
  | 'jobopportunities'
  | 'projects'
  | 'chapters'
  | 'documents'
  | 'linkedinaudit'
  | 'cvaudit';

interface NavItem {
  id: InternshipTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

interface NavSection {
  title: string | null;
  items: NavItem[];
}

interface InternshipSidebarProps {
  activeTab: InternshipTab;
  setActiveTab: (tab: InternshipTab) => void;
  onOpenAuth?: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const InternshipSidebar: React.FC<InternshipSidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAuth,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const [user, setUser] = useState<any>(null);

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const isLoggedIn = !!user;
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Nmesoma Anita';
  const userEmail = user?.email || 'nmesoanita@gmail.com';
  const userAvatar = user?.user_metadata?.avatar_url || (typeof window !== 'undefined' && localStorage.getItem('user_avatar_url')) || '/profile_image.png';

  const navSections: NavSection[] = [
    {
      title: null,
      items: [
        { id: 'resources', label: 'Resources', icon: BookOpen },
        { id: 'freetier', label: 'Products & Perks', icon: Sparkles },
      ],
    },
    {
      title: 'CONNECT',
      items: [
        { id: 'chapters', label: 'Chapters & Ambassadors', icon: Users, badge: 'New' },
        { id: 'announcements', label: 'Announcements', icon: Bell, badge: '1' },
        { id: 'inbox', label: 'E-Mail Inbox', icon: Mail, badge: '9' },
        { id: 'support', label: 'Support', icon: HelpCircle },
      ],
    },
    {
      title: 'CAREER',
      items: [
        { id: 'jobopportunities', label: 'Job Opportunities', icon: Briefcase },
        { id: 'projects', label: 'Projects', icon: FolderKanban, badge: 'New' },
        { id: 'leaderboard', label: 'Leaderboard', icon: Award, badge: 'Beta' },
        { id: 'documents', label: 'Documents', icon: FileText, badge: 'Beta' },
        { id: 'linkedinaudit', label: 'LinkedIn Audit', icon: LinkedinIcon, badge: 'Beta' },
        { id: 'cvaudit', label: 'CV Audit', icon: FileSearch, badge: 'Beta' },
      ],
    },
  ];

  const renderNavContent = () => (
    <div className="flex flex-col h-full justify-between p-4 text-[#a8b8b5]">
      
      {/* Top Header Logo */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="font-black text-xl text-white tracking-tight flex items-center gap-1.5">
            <span>Cortexa</span>
            <span className="text-emerald-400 text-xs font-bold font-mono">AI</span>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="space-y-5 text-xs">
          {navSections
            .map((section) => ({
              ...section,
              items: section.items.filter((item) =>
                isFeatureAllowedForUser(userEmail, item.id)
              ),
            }))
            .filter((section) => section.items.length > 0)
            .map((section, idx) => (
            <div key={idx} className="space-y-1">
              {section.title && (
                <div className="text-[10px] font-bold tracking-widest text-[#5c736f] uppercase px-2 mb-2">
                  {section.title}
                </div>
              )}

              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      onCloseMobile?.();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#1b3d37] text-white font-bold shadow-xs border border-[#26554d]'
                        : 'text-[#9cb0ab] hover:text-white hover:bg-[#132d28]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-[#758e89]'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          item.badge === 'New'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : item.badge === 'Beta'
                            ? 'bg-[#183530] text-[#799892] border border-[#234b44]'
                            : 'bg-[#1a3f38] text-emerald-300 border border-[#275b51]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* User Footer Bar */}
      <div className="relative pt-4 border-t border-[#183631]">
        
        {isUserMenuOpen && (
          <div className="absolute bottom-full mb-2 left-0 right-0 bg-[#0e2420] border border-[#1e4841] rounded-xl p-2 shadow-2xl space-y-1 z-50 text-xs text-[#a8b8b5]">
            <div className="px-3 py-2 border-b border-[#183933]">
              <div className="font-bold text-white truncate">{userName}</div>
              <div className="text-[10px] text-[#6b8580] truncate">{userEmail}</div>
            </div>
            
            {isLoggedIn ? (
              <button
                onClick={async () => {
                  setIsUserMenuOpen(false);
                  await supabase.auth.signOut();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-rose-500/10 text-rose-400 font-semibold transition-colors text-left"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                <span>Log out</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsUserMenuOpen(false);
                  onOpenAuth?.();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-emerald-500/10 text-emerald-400 font-semibold transition-colors text-left"
              >
                <UserCheck className="w-4 h-4 shrink-0" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        )}

        <div
          onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          className="flex items-center justify-between p-2 rounded-xl bg-[#0d221f] hover:bg-[#132d28] border border-[#1b433c] cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={userAvatar}
              alt={userName}
              className="w-8 h-8 rounded-full object-cover shrink-0 border border-emerald-500/30"
            />
            <div className="truncate min-w-0">
              <div className="font-bold text-xs text-white truncate flex items-center gap-1.5">
                <span className="truncate">{userName}</span>
                <span className="px-1.5 py-0.2 rounded bg-[#183f38] text-[9px] text-emerald-300 shrink-0">
                  Intern
                </span>
              </div>
              <div className="text-[10px] text-[#6c8681] truncate">
                {userEmail}
              </div>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-[#6c8681] shrink-0" />
        </div>

      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Rail */}
      <aside className="w-64 shrink-0 hidden md:flex flex-col h-screen bg-[#091715] border-r border-[#15342e] select-none">
        {renderNavContent()}
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div key="mobile-sidebar" className="md:hidden fixed inset-0 z-[60] flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 38 }}
              className="relative w-64 h-full bg-[#091715] border-r border-[#15342e] shadow-2xl select-none overflow-y-auto"
            >
              <button
                onClick={onCloseMobile}
                className="absolute top-3 right-3 z-10 p-1.5 rounded-lg text-[#6c8681] hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              {renderNavContent()}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
