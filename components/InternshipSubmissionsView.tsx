'use client';

import React from 'react';
import { UploadCloud, CheckCircle2, Clock, Award, Code, ExternalLink } from 'lucide-react';

export const InternshipSubmissionsView: React.FC = () => {
  const submissions = [
    {
      task: 'Task #4: Fine-tune Llama 3 8B with QLoRA on Custom Corpus',
      submittedDate: 'Aug 14, 2026',
      status: 'Approved',
      points: '+240 pts',
      repo: 'github.com/nmeso/llama3-qlora-finetune',
    },
    {
      task: 'Task #3: Implement FastApi Inference Server & Dockerize',
      submittedDate: 'Aug 08, 2026',
      status: 'Approved',
      points: '+180 pts',
      repo: 'github.com/nmeso/fastapi-ml-docker',
    },
    {
      task: 'Task #2: Exploratory Data Analysis & Feature Engineering',
      submittedDate: 'Jul 29, 2026',
      status: 'Approved',
      points: '+120 pts',
      repo: 'github.com/nmeso/eda-feature-pipeline',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Project Work Submissions</h1>
          <p className="text-xs text-slate-500 mt-1">Track code submissions, task evaluation status, and points awarded.</p>
        </div>

        <button className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-2xs">
          <UploadCloud className="w-4 h-4" />
          Submit New Task
        </button>
      </div>

      <div className="space-y-3">
        {submissions.map((sub, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {sub.status}
                </span>
                <span className="text-xs text-slate-400 font-mono">{sub.submittedDate}</span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm">{sub.task}</h3>
              <a href={`https://${sub.repo}`} target="_blank" rel="noreferrer" className="text-xs text-emerald-700 hover:underline flex items-center gap-1 font-mono">
                <Code className="w-3.5 h-3.5 text-emerald-600" />
                {sub.repo}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="text-right shrink-0">
              <div className="text-lg font-black text-emerald-900 font-mono">{sub.points}</div>
              <div className="text-[10px] text-slate-500 uppercase font-bold">Earned Points</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
