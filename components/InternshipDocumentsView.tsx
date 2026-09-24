'use client';

import React from 'react';
import { FileText, Download, Award, ShieldCheck, ExternalLink, CheckCircle } from 'lucide-react';

export const InternshipDocumentsView: React.FC = () => {
  const documents = [
    {
      title: 'Internship Certificate',
      issuer: 'Cortexa AI Cohort #4',
      date: 'Aug 2026',
      status: 'Verified',
      icon: '/Icons/Medal Green.png',
    },
    {
      title: 'Internship Experience Letter',
      issuer: 'Cortexa AI Program Office',
      date: 'Aug 2026',
      status: 'Verified',
      icon: '/Icons/Degree Scroll Green.png',
    },
    {
      title: 'Recommendation Letter',
      issuer: 'Lead Mentor - Dr. Aris Thorne',
      date: 'Jul 2026',
      status: 'Signed',
      icon: '/Icons/Graduation Certificate Green.png',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Internship Documents & Records</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">Access verified certificates, official experience letters, and signed recommendation letters.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {documents.map((doc, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={doc.icon} alt={doc.title} className="w-8 h-8 object-contain" />
                </div>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  {doc.status}
                </span>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm tracking-tight">{doc.title}</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">{doc.issuer} • {doc.date}</p>
              </div>
            </div>

            <button className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-2xs transition-colors">
              <Download className="w-3.5 h-3.5" />
              Download Official PDF
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
