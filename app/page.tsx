'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useUser } from '@clerk/nextjs';
import { Menu, UserCheck } from 'lucide-react';
import { InternshipSidebar, InternshipTab } from '../components/InternshipSidebar';

// ── Lazy-load all tab views so Turbopack only compiles what's needed ──
const InternshipLeaderboardView = dynamic(() => import('../components/InternshipLeaderboardView').then(m => ({ default: m.InternshipLeaderboardView })), { ssr: false });
const JobOpportunitiesView = dynamic(() => import('../components/JobOpportunitiesView').then(m => ({ default: m.JobOpportunitiesView })), { ssr: false });
const CvAuditView = dynamic(() => import('../components/CvAuditView').then(m => ({ default: m.CvAuditView })), { ssr: false });
const LinkedinAuditView = dynamic(() => import('../components/LinkedinAuditView').then(m => ({ default: m.LinkedinAuditView })), { ssr: false });
const InternshipDocumentsView = dynamic(() => import('../components/InternshipDocumentsView').then(m => ({ default: m.InternshipDocumentsView })), { ssr: false });
const InternshipSubmissionsView = dynamic(() => import('../components/InternshipSubmissionsView').then(m => ({ default: m.InternshipSubmissionsView })), { ssr: false });
const InternshipCommunityView = dynamic(() => import('../components/InternshipCommunityView').then(m => ({ default: m.InternshipCommunityView })), { ssr: false });
const InternshipResourcesView = dynamic(() => import('../components/InternshipResourcesView').then(m => ({ default: m.InternshipResourcesView })), { ssr: false });
const InternshipInboxView = dynamic(() => import('../components/InternshipInboxView').then(m => ({ default: m.InternshipInboxView })), { ssr: false });
const InternshipProjectsView = dynamic(() => import('../components/InternshipProjectsView').then(m => ({ default: m.InternshipProjectsView })), { ssr: false });
const AuthModal = dynamic(() => import('../components/AuthModal').then(m => ({ default: m.AuthModal })), { ssr: false });

export default function Home() {
  const mainContentRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState<InternshipTab>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('internship_portal_active_tab');
      if (saved) return saved as InternshipTab;
    }
    return 'leaderboard';
  });

  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const { user, isLoaded } = useUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress || 'nmesoanita@gmail.com';
  const userName = user?.fullName || user?.firstName || 'Nmesoma Anita';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('internship_portal_active_tab', activeTab);
    }
  }, [activeTab]);



  return (
    <div className="min-h-screen flex bg-[#f5f9f7] text-slate-900 font-sans">
      
      {/* Dark Sidebar Navigation */}
      <InternshipSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={() => setIsAuthOpen(true)}
        isMobileOpen={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
      />

      {/* Main Content Workspace */}
      <div ref={mainContentRef} className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        
        {/* Top Mobile Bar */}
        <div className="md:hidden flex items-center justify-between p-3.5 bg-[#091715] text-white border-b border-[#163a34] sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileNavOpen(true)}
              className="p-1.5 rounded-lg hover:bg-[#132d28] text-emerald-300"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="font-black text-base tracking-tight flex items-center gap-1.5">
              <span>Cortexa</span>
              <span className="text-emerald-400 text-xs font-mono">AI Intern</span>
            </div>
          </div>

          <button
            onClick={() => setIsAuthOpen(true)}
            className="px-3 py-1.5 rounded-full bg-[#163a34] border border-[#23534b] text-emerald-300 text-xs font-bold flex items-center gap-1.5"
          >
            <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Account</span>
          </button>
        </div>

        {/* Dynamic Portal View Container */}
        <div className="p-4 sm:p-8 max-w-7xl w-full mx-auto flex-1">
          <div
              key={activeTab}
              className="animate-[fadeSlideIn_0.18s_ease-out]"
            >
              {activeTab === 'leaderboard' && (
                <InternshipLeaderboardView
                  userName={userName}
                  userEmail={userEmail}
                  onNavigateToTab={(tab) => setActiveTab(tab as InternshipTab)}
                />
              )}

              {activeTab === 'jobopportunities' && <JobOpportunitiesView />}

              {activeTab === 'projects' && <InternshipProjectsView />}

              {activeTab === 'cvaudit' && <CvAuditView />}

              {activeTab === 'linkedinaudit' && <LinkedinAuditView />}

              {activeTab === 'documents' && <InternshipDocumentsView />}

              {activeTab === 'submissions' && <InternshipSubmissionsView />}

              {activeTab === 'resources' && <InternshipResourcesView />}

              {activeTab === 'inbox' && <InternshipInboxView />}

              {['announcements', 'support', 'freetier', 'questions', 'myapplication'].includes(activeTab) && (
                <InternshipCommunityView type={activeTab as any} />
              )}
            </div>
        </div>
      </div>

      {/* Auth Modal */}
      {isAuthOpen && <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />}
    </div>
  );
}
