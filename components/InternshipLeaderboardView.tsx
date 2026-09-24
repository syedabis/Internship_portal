'use client';

import React, { useState, useRef } from 'react';
import {
  Trophy,
  HelpCircle,
  TrendingUp,
  Award,
  Sparkles,
  CheckCircle2,
  Target,
  BookOpen,
  Flame,
  Star,
  Zap,
  Calendar,
  Clock,
  ArrowRight,
  ChevronDown,
  Gift,
  Camera,
} from 'lucide-react';
import { PfpCropModal } from './PfpCropModal';
import { supabase } from '../lib/supabase';

// ── Personal milestone tiers (non-competitive, self-paced) ──────────────
interface MilestoneTier {
  name: string;
  minPoints: number;
  maxPoints: number;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  perks: string[];
}

const TIERS: MilestoneTier[] = [
  { name: 'Explorer', minPoints: 0, maxPoints: 299, icon: '🌱', color: 'text-slate-700', bgColor: 'bg-slate-100', borderColor: 'border-slate-200', perks: ['Access portal resources', 'Join community channels'] },
  { name: 'Builder', minPoints: 300, maxPoints: 799, icon: '🔧', color: 'text-blue-700', bgColor: 'bg-blue-50', borderColor: 'border-blue-200', perks: ['Unlock project templates', 'Peer collaboration access'] },
  { name: 'Achiever', minPoints: 800, maxPoints: 1499, icon: '⚡', color: 'text-amber-700', bgColor: 'bg-amber-50', borderColor: 'border-amber-200', perks: ['Priority mentor matching', 'Certificate of participation'] },
  { name: 'Specialist', minPoints: 1500, maxPoints: 2099, icon: '🎯', color: 'text-purple-700', bgColor: 'bg-purple-50', borderColor: 'border-purple-200', perks: ['Recommendation letter eligibility', 'Featured portfolio slot'] },
  { name: 'Leader', minPoints: 2100, maxPoints: 2400, icon: '🏆', color: 'text-emerald-700', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200', perks: ['Full recommendation letter', 'Alumni network access', 'Leadership badge'] },
];

// ── Achievement badges (personal, not comparative) ──────────────────────
interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: string;
  category: 'learning' | 'contribution' | 'consistency' | 'skill';
}

const ACHIEVEMENTS: Achievement[] = [
  { id: 'a1', title: 'First Steps', description: 'Complete your profile and onboarding', icon: '👋', earned: true, earnedDate: '2026-08-01', category: 'learning' },
  { id: 'a2', title: 'Quick Learner', description: 'Complete 3 learning modules', icon: '📚', earned: true, earnedDate: '2026-08-05', category: 'learning' },
  { id: 'a3', title: 'CV Polished', description: 'Score 70+ on your CV audit', icon: '📄', earned: false, category: 'skill' },
  { id: 'a4', title: 'LinkedIn Ready', description: 'Score 70+ on your LinkedIn audit', icon: '💼', earned: false, category: 'skill' },
  { id: 'a5', title: 'First Submission', description: 'Submit your first project work', icon: '🚀', earned: true, earnedDate: '2026-08-10', category: 'contribution' },
  { id: 'a6', title: 'Consistency Streak', description: 'Log activity for 7 consecutive days', icon: '🔥', earned: false, category: 'consistency' },
  { id: 'a7', title: 'Community Voice', description: 'Participate in 3 community discussions', icon: '💬', earned: true, earnedDate: '2026-08-12', category: 'contribution' },
  { id: 'a8', title: 'Deep Diver', description: 'Complete 10 learning modules', icon: '🧠', earned: false, category: 'learning' },
  { id: 'a9', title: 'Project Pioneer', description: 'Complete a full project with plan', icon: '🏗️', earned: false, category: 'contribution' },
  { id: 'a10', title: 'Week Warrior', description: 'Log activity for 30 consecutive days', icon: '⚔️', earned: false, category: 'consistency' },
  { id: 'a11', title: 'Skill Stacker', description: 'Earn points in all 7 categories', icon: '📊', earned: false, category: 'skill' },
  { id: 'a12', title: 'Portfolio Ready', description: 'Reach 1500+ points — Specialist tier', icon: '✨', earned: false, category: 'skill' },
];

// ── Weekly activity data (personal streaks) ─────────────────────────────
const WEEKLY_ACTIVITY = [
  { day: 'Mon', active: true, points: 45 },
  { day: 'Tue', active: true, points: 30 },
  { day: 'Wed', active: true, points: 60 },
  { day: 'Thu', active: false, points: 0 },
  { day: 'Fri', active: true, points: 25 },
  { day: 'Sat', active: false, points: 0 },
  { day: 'Sun', active: true, points: 40 },
];

// ── Point categories for the progress breakdown ─────────────────────────
interface PointCategory {
  label: string;
  earned: number;
  max: number;
  color: string;
  linkTab?: string;
  linkLabel?: string;
}

interface InternshipLeaderboardViewProps {
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  onNavigateToTab?: (tab: string) => void;
  onUpdateAvatar?: (avatarUrl: string) => void;
}

export const InternshipLeaderboardView: React.FC<InternshipLeaderboardViewProps> = ({
  userName = 'Nmesoma Anita',
  userEmail = 'nmesoanita@gmail.com',
  userAvatar,
  onNavigateToTab,
  onUpdateAvatar,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string>(() => {
    if (userAvatar) return userAvatar;
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('user_avatar_url');
      if (stored) return stored;
    }
    return '/profile_image.png';
  });

  const [achievementFilter, setAchievementFilter] = useState<'all' | 'earned' | 'locked'>('all');
  const [expandedTier, setExpandedTier] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirmCrop = async (croppedDataUrl: string) => {
    setSelectedImage(null);
    setAvatar(croppedDataUrl);
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_avatar_url', croppedDataUrl);
    }
    onUpdateAvatar?.(croppedDataUrl);

    try {
      await supabase.auth.updateUser({
        data: { avatar_url: croppedDataUrl }
      });
    } catch {
      // offline / demo fallback
    }
  };

  const totalPoints = 997;
  const scoringCap = 2400;
  const overallProgress = Math.round((totalPoints / scoringCap) * 100);

  // Determine current tier
  const currentTier = TIERS.find(t => totalPoints >= t.minPoints && totalPoints <= t.maxPoints) || TIERS[0];
  const currentTierIndex = TIERS.indexOf(currentTier);
  const nextTier = TIERS[currentTierIndex + 1];
  const pointsToNextTier = nextTier ? nextTier.minPoints - totalPoints : 0;
  const tierProgress = nextTier
    ? Math.round(((totalPoints - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100)
    : 100;

  const earnedCount = ACHIEVEMENTS.filter(a => a.earned).length;
  const currentStreak = 3; // days
  const weeklyPoints = WEEKLY_ACTIVITY.reduce((sum, d) => sum + d.points, 0);

  const pointCategories: PointCategory[] = [
    { label: 'Profile Completion', earned: 60, max: 60, color: 'bg-emerald-600' },
    { label: 'Onboarding', earned: 40, max: 40, color: 'bg-emerald-600' },
    { label: 'Learning Modules', earned: 240, max: 500, color: 'bg-blue-600' },
    { label: 'Work Submissions', earned: 80, max: 1000, color: 'bg-purple-600' },
    { label: 'Participation', earned: 480, max: 600, color: 'bg-amber-600' },
    { label: 'CV Audit Score', earned: 51, max: 100, color: 'bg-teal-600', linkTab: 'cvaudit', linkLabel: 'View report' },
    { label: 'LinkedIn Audit Score', earned: 46, max: 100, color: 'bg-indigo-600', linkTab: 'linkedinaudit', linkLabel: 'View report' },
  ];

  const filteredAchievements = ACHIEVEMENTS.filter(a => {
    if (achievementFilter === 'earned') return a.earned;
    if (achievementFilter === 'locked') return !a.earned;
    return true;
  });

  return (
    <div className="space-y-6 pb-12">

      {/* Top Banner */}
      <div className="p-4 rounded-xl bg-slate-100/90 border border-slate-200/80 text-slate-600 text-xs sm:text-sm leading-relaxed font-normal shadow-2xs">
        Your progress dashboard tracks your personal growth throughout the internship. Earn points by completing modules, submitting work, and participating — there are no rankings or competition. Focus on your own learning journey. Points refresh every six hours. Last updated 2026-08-16 18:15 UTC.
      </div>

      {/* Top Cards Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* Left: Your Progress Card */}
        <div 
          className="lg:col-span-7 border border-emerald-900/50 rounded-2xl p-6 shadow-lg relative overflow-hidden bg-cover bg-center"
          style={{ backgroundImage: "url('/progress_card_bg.jpeg')" }}
        >
          {/* Subtle dark backdrop filter for high legibility */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />

          <div className="relative z-10 text-white">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-emerald-400/60 shadow-md shrink-0 cursor-pointer group"
                  title="Click to change profile picture"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={avatar}
                    alt={userName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-4 h-4 text-white" />
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <div>
                  <div className="text-[11px] font-bold tracking-wider text-emerald-300 uppercase">
                    YOUR PROGRESS
                  </div>
                  <h2 className="text-xl font-extrabold text-white tracking-tight mt-0.5">
                    {userName}
                  </h2>
                  <div className="text-xs text-emerald-100/90 font-medium flex items-center gap-1.5 mt-0.5">
                    <span>Machine Learning</span>
                    <span>•</span>
                    <span>🇳🇬 Nigeria</span>
                  </div>
                </div>
              </div>

              <div className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 shadow-sm ${currentTier.bgColor} ${currentTier.color} ${currentTier.borderColor}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/Icons/Thunder.png" alt="Achiever Tier" className="w-4 h-4 object-contain" />
                <span>{currentTier.name} Tier</span>
              </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-3 gap-4 my-6 pt-4 border-t border-emerald-500/20">
              <div>
                <div className="text-[10px] font-bold tracking-wider text-emerald-300/90 uppercase">
                  TOTAL POINTS
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white mt-1 tracking-tight">
                  {totalPoints.toLocaleString()}
                </div>
                <div className="text-[11px] text-emerald-100/80 font-medium">
                  of {scoringCap.toLocaleString()} possible
                </div>
              </div>

              <div>
                <div className="text-[10px] font-bold tracking-wider text-emerald-300/90 uppercase">
                  ACHIEVEMENTS
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white mt-1 tracking-tight">
                  {earnedCount}/{ACHIEVEMENTS.length}
                </div>
                <div className="text-[11px] text-emerald-100/80 font-medium">
                  badges earned
                </div>
              </div>

              <div>
                <div className="text-[10px] font-bold tracking-wider text-emerald-300/90 uppercase">
                  STREAK
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white mt-1 tracking-tight flex items-center gap-1.5">
                  {currentStreak}
                  <Flame className="w-5 h-5 text-orange-400 fill-orange-400/20" />
                </div>
                <div className="text-[11px] text-emerald-100/80 font-medium">
                  active days
                </div>
              </div>
            </div>

            {/* Next Tier Progress */}
            {nextTier && (
              <div className="pt-4 border-t border-emerald-500/20">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-[11px] font-bold text-emerald-300/90 uppercase tracking-wider flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-emerald-400" />
                    Next: {nextTier.icon} {nextTier.name} Tier
                  </div>
                  <span className="text-xs font-bold text-white">{pointsToNextTier} pts away</span>
                </div>
                <div className="w-full h-3 bg-slate-900/60 rounded-full overflow-hidden border border-emerald-500/30">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500 shadow-xs"
                    style={{ width: `${tierProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Weekly Activity & Quick Stats */}
        <div className="lg:col-span-5 space-y-5">
          {/* Activity Heatmap */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                This Week&apos;s Activity
              </div>
              <span className="text-xs font-bold text-slate-900">{weeklyPoints} pts earned</span>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {WEEKLY_ACTIVITY.map((day) => (
                <div key={day.day} className="flex flex-col items-center gap-1.5">
                  <div
                    className={`w-full aspect-square rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                      day.active
                        ? 'bg-emerald-100 border border-emerald-300 text-emerald-800'
                        : 'bg-slate-50 border border-slate-150 text-slate-300'
                    }`}
                  >
                    {day.active ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : '—'}
                  </div>
                  <span className="text-[10px] font-bold text-slate-500">{day.day}</span>
                  {day.active && (
                    <span className="text-[10px] font-bold text-emerald-700">+{day.points}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Action Cards */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onNavigateToTab?.('projects')}
              className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all text-left group flex items-center gap-3.5"
            >
              <div className="p-2 rounded-xl bg-amber-50/80 border border-amber-200/60 flex items-center justify-center shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/Icons/Mechanic.png" alt="Start a Project" className="w-9 h-9 object-contain" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-800 tracking-tight leading-tight">Start a Project</div>
                <div className="text-[10px] font-medium text-slate-500 mt-1">Earn up to 550 pts</div>
              </div>
            </button>

            <button
              onClick={() => onNavigateToTab?.('resources')}
              className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all text-left group flex items-center gap-3.5"
            >
              <div className="p-2 rounded-xl bg-blue-50/80 border border-blue-200/60 flex items-center justify-center shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/Icons/brain, learning, intelligence, study, knowledge.png" alt="Learn More" className="w-9 h-9 object-contain" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-800 tracking-tight leading-tight">Learn More</div>
                <div className="text-[10px] font-medium text-slate-500 mt-1">+500 pts available</div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Points Breakdown Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-1">
          <div>
            <div className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
              YOUR POINT BREAKDOWN
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">
              {totalPoints} points
            </div>
            <div className="text-xs text-slate-500 font-medium mt-0.5 flex items-center gap-3">
              <span>Scoring cap: {scoringCap.toLocaleString()} points</span>
              <span>•</span>
              <span>{overallProgress}% complete</span>
            </div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/Icons/Chart.png" alt="Point Breakdown" className="w-10 h-10 object-contain" />
          </div>
        </div>

        {/* Overall progress bar */}
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mt-4 mb-6">
          <div className="h-full bg-emerald-600 rounded-full transition-all duration-500" style={{ width: `${overallProgress}%` }} />
        </div>

        <div className="space-y-3.5">
          {pointCategories.map((cat) => {
            const pct = Math.round((cat.earned / cat.max) * 100);
            return (
              <div key={cat.label}>
                <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1">
                  <span className="flex items-center gap-1">
                    {cat.label} <HelpCircle className="w-3 h-3 text-slate-400" />
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-900 font-bold">{cat.earned} / {cat.max}</span>
                    {cat.linkTab && (
                      <button
                        onClick={() => onNavigateToTab?.(cat.linkTab!)}
                        className="text-[11px] font-semibold text-emerald-800 hover:underline flex items-center gap-0.5"
                      >
                        {cat.linkLabel}
                      </button>
                    )}
                  </div>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${cat.color} rounded-full transition-all duration-500`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-5 pt-3 border-t border-slate-100 text-[11px] text-slate-500 leading-snug">
          Points reflect your personal internship activity across categories. There is no competition — focus on completing as many learning areas as you can at your own pace.
        </div>
      </div>
      {/* Photo Cropper Modal */}
      {selectedImage && (
        <PfpCropModal
          key={selectedImage}
          imageUrl={selectedImage}
          onCancel={() => setSelectedImage(null)}
          onConfirm={handleConfirmCrop}
          onChangePhoto={(file) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              if (e.target?.result) setSelectedImage(e.target.result as string);
            };
            reader.readAsDataURL(file);
          }}
        />
      )}
    </div>
  );
};
