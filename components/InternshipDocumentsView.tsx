'use client';

import React from 'react';
import { FileText, Download, Award, ShieldCheck, ExternalLink, CheckCircle } from 'lucide-react';

export const InternshipDocumentsView: React.FC = () => {
  const documents = [
    {
      title: 'Internship Verification Certificate',
      issuer: 'Cortexa AI Cohort #4',
      date: 'Aug 2026',
      status: 'Verified',
      type: 'Certificate',
    },
    {
      title: 'ATS Machine Learning Resume V3',
      issuer: 'Cortexa Resume Architect',
      date: 'Aug 2026',
      status: 'Active',
      type: 'Resume PDF',
    },
    {
      title: 'Official Recommendation Letter',
      issuer: 'Lead Mentor - Dr. Aris Thorne',
      date: 'Jul 2026',
      status: 'Signed',
      type: 'Letter',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Internship Documents & Records</h1>
          <p className="text-xs text-slate-500 mt-1">Access verified certificates, recommendation letters, and downloadable resume versions.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {documents.map((doc, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  {doc.status}
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm">{doc.title}</h3>
              <p className="text-xs text-slate-500">{doc.issuer} • {doc.date}</p>
            </div>

            <button className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-2xs transition-colors">
              <Download className="w-3.5 h-3.5" />
              Download Official PDF
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
