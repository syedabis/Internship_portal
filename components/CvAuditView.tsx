'use client';

import React, { useState } from 'react';
import { FileSearch, Sparkles, CheckCircle2, AlertTriangle, ArrowUpRight, Upload, RefreshCw, Award, FileText } from 'lucide-react';

export const CvAuditView: React.FC = () => {
  const [atsScore, setAtsScore] = useState(78);
  const [isAuditing, setIsAuditing] = useState(false);
  const [cvText, setCvText] = useState(`Nmesoma Anita - Machine Learning Intern
Email: nmesoanita@gmail.com | Location: Nigeria

SUMMARY:
Passionate Machine Learning student researcher with hands-on experience building computer vision and NLP models in PyTorch. 

EXPERIENCE:
AI Research Intern - DataLab (2025 - Present)
- Trained ResNet and ViT classification models achieving 94% top-1 accuracy.
- Fine-tuned Llama-3 8B models on domain-specific datasets using QLoRA.
- Built interactive Streamlit dashboards for real-time inference visualizer.

SKILLS:
Python, PyTorch, TensorFlow, OpenCV, HuggingFace, FastAPI, Git, Docker`);

  const handleReAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      setIsAuditing(false);
      setAtsScore(Math.min(96, atsScore + Math.floor(Math.random() * 8) + 2));
    }, 1200);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold">
              AI Audit Engine V2
            </span>
            <h1 className="text-xl font-bold text-slate-900">
              CV & Resume Audit Report
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Auditing your resume against ATS criteria, action-verbs, quantified achievements, and track keywords.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-emerald-50 border border-emerald-200 p-4 rounded-xl shrink-0">
          <div className="text-center">
            <div className="text-3xl font-black text-emerald-900 font-mono">
              {atsScore} <span className="text-xs text-emerald-700">/ 100</span>
            </div>
            <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider mt-0.5">
              ATS SCORE
            </div>
          </div>
          <button
            onClick={handleReAudit}
            disabled={isAuditing}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-2xs transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
            <span>Re-Analyze</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Interactive Input & Content */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-700" />
              CV Content Input
            </h3>
            <button className="text-xs font-semibold text-emerald-800 hover:underline flex items-center gap-1">
              <Upload className="w-3.5 h-3.5" />
              Upload PDF
            </button>
          </div>

          <textarea
            rows={14}
            value={cvText}
            onChange={(e) => setCvText(e.target.value)}
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 leading-relaxed"
          />

          <div className="flex justify-between items-center text-xs text-slate-500 pt-1">
            <span>Points boost for auditing: <strong>+51 pts earned</strong></span>
            <span>Word count: {cvText.split(/\s+/).filter(Boolean).length} words</span>
          </div>
        </div>

        {/* Right: Detailed Audit Breakdown */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Actionable Feedback Breakdown</h3>

            <div className="space-y-3 text-xs">
              
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  Strong Quantified Metrics (+15 pts)
                </div>
                <p className="text-emerald-800/90 text-[11px]">
                  Includes clear metrics like "94% top-1 accuracy" and "Llama-3 8B fine-tuning".
                </p>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
                <div className="font-bold text-amber-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-700" />
                  Expand Project Bullet Details
                </div>
                <p className="text-amber-800/90 text-[11px]">
                  Add 2 more bullet points elaborating on data preprocessing pipeline performance.
                </p>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  High Technical Skill Density
                </div>
                <p className="text-emerald-800/90 text-[11px]">
                  PyTorch, FastAPI, OpenCV, and Docker keywords detected by Machine Learning recruiters.
                </p>
              </div>

            </div>
          </div>

          <div className="p-5 bg-gradient-to-br from-emerald-900 to-slate-900 text-white rounded-2xl shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs">
              <Sparkles className="w-4 h-4" />
              <span>AI Resume Polish</span>
            </div>
            <p className="text-xs text-slate-300">
              Generate ATS-optimized phrasing for your resume bullets with one click.
            </p>
            <button
              onClick={handleReAudit}
              className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all text-center"
            >
              Auto-Enhance Bullet Points
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
