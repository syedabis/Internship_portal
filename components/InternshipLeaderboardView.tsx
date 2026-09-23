'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';

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
  onNavigateToTab?: (tab: string) => void;
}

export const InternshipLeaderboardView: React.FC<InternshipLeaderboardViewProps> = ({
  userName = 'Nmesoma Anita',
  userEmail = 'nmesoanita@gmail.com',
  onNavigateToTab,
}) => {
  const [achievementFilter, setAchievementFilter] = useState<'all' | 'earned' | 'locked'>('all');
  const [expandedTier, setExpandedTier] = useState<string | null>(null);

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
      <div className="p-4 rounded-xl bg-slate-100/90 border border-slate-200/80 text-slate-700 text-xs leading-relaxed font-normal shadow-2xs">
        Your progress dashboard tracks your personal growth throughout the internship. Earn points by completing modules, submitting work, and participating — there are no rankings or competition. Focus on your own learning journey. Points refresh every six hours. Last updated 2026-08-16 18:15 UTC.
      </div>

      {/* Top Cards Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* Left: Your Progress Card */}
        <div className="lg:col-span-7 bg-gradient-to-br from-[#e6f7ec] to-[#d4f0de] border border-[#caedd4] rounded-2xl p-6 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-400/5 rounded-full blur-3xl" />
          <div className="relative">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-xs shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
                    alt={userName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-[11px] font-bold tracking-wider text-emerald-800 uppercase">
                    YOUR PROGRESS
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 tracking-tight mt-0.5">
                    {userName}
                  </h2>
                  <div className="text-xs text-emerald-800/90 font-medium flex items-center gap-1.5 mt-0.5">
                    <span>Machine Learning</span>
                    <span>•</span>
                    <span>🇳🇬 Nigeria</span>
                  </div>
                </div>
              </div>

              <div className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 ${currentTier.bgColor} ${currentTier.color} ${currentTier.borderColor}`}>
                <span>{currentTier.icon}</span>
                <span>{currentTier.name} Tier</span>
              </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-3 gap-4 my-6 pt-4 border-t border-emerald-200/60">
              <div>
                <div className="text-[10px] font-bold tracking-wider text-emerald-800/80 uppercase">
                  TOTAL POINTS
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 tracking-tight">
                  {totalPoints.toLocaleString()}
                </div>
                <div className="text-[11px] text-emerald-900/80 font-medium">
                  of {scoringCap.toLocaleString()} possible
                </div>
              </div>

              <div>
                <div className="text-[10px] font-bold tracking-wider text-emerald-800/80 uppercase">
                  ACHIEVEMENTS
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 tracking-tight">
                  {earnedCount}/{ACHIEVEMENTS.length}
                </div>
                <div className="text-[11px] text-emerald-900/80 font-medium">
                  badges earned
                </div>
              </div>

              <div>
                <div className="text-[10px] font-bold tracking-wider text-emerald-800/80 uppercase">
                  STREAK
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 tracking-tight flex items-center gap-1.5">
                  {currentStreak}
                  <Flame className="w-5 h-5 text-orange-500" />
                </div>
                <div className="text-[11px] text-emerald-900/80 font-medium">
                  active days
                </div>
              </div>
            </div>

            {/* Next Tier Progress */}
            {nextTier && (
              <div className="pt-4 border-t border-emerald-200/60">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-[11px] font-bold text-emerald-800/80 uppercase tracking-wider flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5" />
                    Next: {nextTier.icon} {nextTier.name} Tier
                  </div>
                  <span className="text-xs font-bold text-slate-900">{pointsToNextTier} pts away</span>
                </div>
                <div className="w-full h-3 bg-white/80 rounded-full overflow-hidden border border-emerald-200/60">
                  <div
                    className="h-full bg-emerald-600 rounded-full transition-all duration-500"
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
              <div className="text-[11px] font-bold tracking-wider text-slate-500 uppercase flex items-center gap-1.5">
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
              className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all text-left group"
            >
              <Zap className="w-5 h-5 text-amber-500 mb-2" />
              <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-800">Start a Project</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Earn up to 550 pts</div>
            </button>
            <button
              onClick={() => onNavigateToTab?.('resources')}
              className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all text-left group"
            >
              <BookOpen className="w-5 h-5 text-blue-500 mb-2" />
              <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-800">Learn More</div>
              <div className="text-[10px] text-slate-500 mt-0.5">+500 pts available</div>
            </button>
          </div>
        </div>
      </div>

      {/* Points Breakdown Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-1">
          <div>
            <div className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
              YOUR POINT BREAKDOWN
            </div>
            <div className="text-2xl font-black text-slate-900 mt-1 tracking-tight">
              {totalPoints} points
            </div>
            <div className="text-xs text-slate-500 font-medium mt-0.5 flex items-center gap-3">
              <span>Scoring cap: {scoringCap.toLocaleString()} points</span>
              <span>•</span>
              <span>{overallProgress}% complete</span>
            </div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-emerald-600" />
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

      {/* Milestone Tiers Roadmap */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-5">
          <Award className="w-5 h-5 text-amber-500" />
          <h2 className="text-base font-extrabold text-slate-900">Your Growth Roadmap</h2>
        </div>
        <p className="text-xs text-slate-500 mb-5 -mt-2">
          Progress through tiers by earning points. Each tier unlocks new perks and opportunities — no competition, just your personal growth.
        </p>

        <div className="space-y-2.5">
          {TIERS.map((tier, idx) => {
            const isCurrentTier = tier.name === currentTier.name;
            const isCompleted = totalPoints > tier.maxPoints;
            const isLocked = totalPoints < tier.minPoints;
            const isExpanded = expandedTier === tier.name;

            return (
              <div
                key={tier.name}
                className={`rounded-xl border transition-all ${
                  isCurrentTier
                    ? 'border-emerald-300 bg-emerald-50/50 shadow-xs'
                    : isCompleted
                    ? 'border-slate-200 bg-slate-50/50'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <button
                  onClick={() => setExpandedTier(isExpanded ? null : tier.name)}
                  className="w-full flex items-center justify-between px-4 py-3.5 text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-9 h-9 rounded-xl flex items-center justify-center text-base ${
                      isCompleted ? 'bg-emerald-100 border border-emerald-200' :
                      isCurrentTier ? `${tier.bgColor} border ${tier.borderColor}` :
                      'bg-slate-100 border border-slate-200'
                    }`}>
                      {isCompleted ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : tier.icon}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${isLocked ? 'text-slate-400' : 'text-slate-900'}`}>
                          {tier.name}
                        </span>
                        {isCurrentTier && (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-bold">
                            Current
                          </span>
                        )}
                        {isCompleted && (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                            Completed
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {tier.minPoints.toLocaleString()} – {tier.maxPoints.toLocaleString()} points
                      </span>
                    </div>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform shrink-0 ${isExpanded ? 'rotate-180' : ''}`} />
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 animate-[fadeSlideIn_0.15s_ease-out]">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                      <Gift className="w-3.5 h-3.5 text-purple-500" />
                      Perks Unlocked
                    </div>
                    <ul className="space-y-1.5">
                      {tier.perks.map((perk, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-slate-700">
                          <Star className={`w-3.5 h-3.5 shrink-0 ${isLocked ? 'text-slate-300' : 'text-amber-500'}`} />
                          <span className={isLocked ? 'text-slate-400' : ''}>{perk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-extrabold text-slate-900">Achievements</h2>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-bold">
              {earnedCount} / {ACHIEVEMENTS.length}
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200/80">
            {(['all', 'earned', 'locked'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setAchievementFilter(filter)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all capitalize ${
                  achievementFilter === filter
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filteredAchievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`rounded-xl border p-4 transition-all ${
                achievement.earned
                  ? 'bg-white border-emerald-200 shadow-xs hover:shadow-md'
                  : 'bg-slate-50/50 border-slate-200 opacity-60'
              }`}
            >
              <div className="text-2xl mb-2">{achievement.icon}</div>
              <div className={`text-xs font-bold leading-snug ${achievement.earned ? 'text-slate-900' : 'text-slate-500'}`}>
                {achievement.title}
              </div>
              <div className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                {achievement.description}
              </div>
              {achievement.earned && achievement.earnedDate && (
                <div className="mt-2 flex items-center gap-1 text-[10px] font-semibold text-emerald-700">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Earned {achievement.earnedDate}</span>
                </div>
              )}
              {!achievement.earned && (
                <div className="mt-2 flex items-center gap-1 text-[10px] font-semibold text-slate-400">
                  <Clock className="w-3 h-3" />
                  <span>Not yet earned</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
