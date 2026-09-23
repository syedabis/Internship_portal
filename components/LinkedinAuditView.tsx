'use client';

import React, { useState } from 'react';
import { Sparkles, CheckCircle2, AlertCircle, RefreshCw, ExternalLink } from 'lucide-react';
import { LinkedinIcon } from './icons';

export const LinkedinAuditView: React.FC = () => {
  const [score, setScore] = useState(46);
  const [isAuditing, setIsAuditing] = useState(false);

  const handleAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      setIsAuditing(false);
      setScore(88);
    }, 1000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Banner Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 border border-blue-200 text-blue-800 text-xs font-bold">
              LinkedIn Recruiter Index
            </span>
            <h1 className="text-xl font-bold text-slate-900">
              LinkedIn Profile Audit
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Analyzing headline strength, featured section, recommendations, and searchability keywords.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-blue-50 border border-blue-200 p-4 rounded-xl shrink-0">
          <div className="text-center">
            <div className="text-3xl font-black text-blue-900 font-mono">
              {score} <span className="text-xs text-blue-700">/ 100</span>
            </div>
            <div className="text-[10px] font-bold text-blue-800 uppercase tracking-wider mt-0.5">
              PROFILE SCORE
            </div>
          </div>
          <button
            onClick={handleAudit}
            disabled={isAuditing}
            className="px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-2xs transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
            <span>Run Audit</span>
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Headline Audit Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="font-bold text-slate-900 text-sm">Headline Strength</h3>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Needs Improvement
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="font-semibold text-slate-500">Current Headline:</div>
            <div className="p-3 bg-slate-50 border rounded-xl font-medium text-slate-800">
              "Machine Learning Student | Intern at DataLab"
            </div>

            <div className="font-semibold text-slate-500 pt-2">Recommended Headline:</div>
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl font-medium text-emerald-900">
              "Machine Learning Intern @ Cortexa | Computer Vision & PyTorch | Building LLM Agents & Fine-Tuning Systems"
            </div>
          </div>
        </div>

        {/* Featured Content & Banner Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="font-bold text-slate-900 text-sm">Background Banner & Media</h3>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Good
            </span>
          </div>

          <div className="space-y-3 text-xs text-slate-600">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Custom technical banner installed.</span>
            </div>
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>Missing link to project GitHub repository in Featured Section.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Open To Work status enabled for recruiters.</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
