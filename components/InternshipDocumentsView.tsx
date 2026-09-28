'use client';

import React from 'react';
import { Download, CheckCircle } from 'lucide-react';

export const InternshipDocumentsView: React.FC = () => {
  const documents = [
    {
      title: 'Internship Certificate',
      status: 'Verified',
      icon: '/Icons/Medal Green.png',
      description:
        'Official tamper-proof credential certifying successful completion of the internship program cohort and verified milestone deliverables.',
    },
    {
      title: 'Internship Experience Letter',
      status: 'Verified',
      icon: '/Icons/Degree Scroll Green.png',
      description:
        'Formal record detailing tenure duration, role responsibilities, project contributions, and overall performance rating.',
    },
    {
      title: 'Recommendation Letter',
      status: 'Signed',
      icon: '/Icons/Graduation Certificate Green.png',
      description:
        'Signed endorsement from the lead mentor highlighting leadership, problem-solving skills, and domain mastery.',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Internship Documents & Records</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Access verified certificates, official experience letters, and signed recommendation letters.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {documents.map((doc, idx) => (
          <div
            key={idx}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:shadow-sm hover:border-slate-300 transition-all duration-200 group"
          >
            <div className="space-y-4">
              {/* Header: Icon on left, Heading to its right, Status badge on right */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center shrink-0 p-1.5 shadow-2xs group-hover:scale-105 transition-transform duration-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={doc.icon} alt={doc.title} className="w-8 h-8 object-contain" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm tracking-tight leading-snug">
                    {doc.title}
                  </h3>
                </div>

                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold rounded-md flex items-center gap-1 shrink-0">
                  <CheckCircle className="w-3 h-3 text-emerald-600" />
                  {doc.status}
                </span>
              </div>

              {/* Description below */}
              <p className="text-xs text-slate-600 font-normal leading-relaxed">
                {doc.description}
              </p>
            </div>

            {/* Action Button (Disabled for now) */}
            <div className="pt-4">
              <button
                type="button"
                disabled
                aria-disabled="true"
                className="w-full py-2.5 bg-slate-900/60 text-white/70 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-2xs cursor-not-allowed select-none"
              >
                <Download className="w-3.5 h-3.5 text-white/60" />
                Download Official PDF
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
