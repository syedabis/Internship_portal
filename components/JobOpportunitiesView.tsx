'use client';

import React, { useState } from 'react';
import { Briefcase, MapPin, DollarSign, Clock, Search, Filter, Sparkles, Building2, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface InternshipJob {
  id: string;
  title: string;
  company: string;
  logo: string;
  location: string;
  type: string; // e.g. "Remote", "Hybrid", "On-site"
  stipend: string;
  postedDate: string;
  track: string;
  skills: string[];
  description: string;
  requirements: string[];
}

const JOBS: InternshipJob[] = [
  {
    id: 'job-1',
    title: 'Machine Learning Engineering Intern',
    company: 'DataCrumb AI',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
    location: 'Remote',
    type: 'Full-time Intern',
    stipend: '$1,200 / mo',
    postedDate: '2 days ago',
    track: 'Machine Learning',
    skills: ['Python', 'PyTorch', 'Transformers', 'FastAPI'],
    description: 'Work alongside senior AI research engineers building LLM fine-tuning pipelines, dataset curation, and retrieval-augmented generation systems.',
    requirements: [
      'Strong proficiency in Python & data structures',
      'Familiarity with HuggingFace, PyTorch, or TensorFlow',
      'Solid foundation in linear algebra & probability'
    ]
  },
  {
    id: 'job-2',
    title: 'Backend AI Systems Intern',
    company: 'Cortexa Lab',
    logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&auto=format&fit=crop&q=80',
    location: 'Remote (US/EU/Asia)',
    type: 'Part-time / Full-time',
    stipend: '$1,500 / mo',
    postedDate: '1 day ago',
    track: 'Backend AI Engineering',
    skills: ['Node.js', 'Next.js', 'PostgreSQL', 'Docker', 'Redis'],
    description: 'Architect scale backend microservices for candidate scoring engines, automated code auditing, and real-time websockets leaderboard updates.',
    requirements: [
      'Experience with TypeScript & relational databases (Prisma / PostgreSQL)',
      'Understanding of REST APIs and web security',
      'Git workflow proficiency'
    ]
  },
  {
    id: 'job-3',
    title: 'Full-Stack Developer Intern',
    company: 'Nexus Digital',
    logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=100&auto=format&fit=crop&q=80',
    location: 'Hybrid (London / Remote)',
    type: 'Full-time Intern',
    stipend: '£1,400 / mo',
    postedDate: '3 days ago',
    track: 'Full Stack Web',
    skills: ['React', 'TypeScript', 'TailwindCSS', 'Supabase'],
    description: 'Build sleek modern user interfaces and real-time dashboard analytics for global technology clients.',
    requirements: [
      'Proficiency in modern React (Next.js experience a plus)',
      'Eye for design and user experience polish',
      'Self-driven learner'
    ]
  },
  {
    id: 'job-4',
    title: 'Data Science & Analytics Intern',
    company: 'Vanguard Analytics',
    logo: 'https://images.unsplash.com/photo-1542744094-3a3172720449?w=100&auto=format&fit=crop&q=80',
    location: 'Remote',
    type: 'Part-time Intern',
    stipend: '$1,000 / mo',
    postedDate: '4 days ago',
    track: 'Data Science',
    skills: ['Python', 'Pandas', 'SQL', 'Tableau'],
    description: 'Analyze intern performance metrics, cohort retention data, and build automated reporting dashboards.',
    requirements: [
      'Strong SQL querying skills',
      'Python data analysis stack (Pandas, NumPy, Matplotlib)',
      'Great communication skills'
    ]
  }
];

export const JobOpportunitiesView: React.FC = () => {
  const [selectedTrack, setSelectedTrack] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState<InternshipJob | null>(null);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);

  const filteredJobs = JOBS.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTrack = selectedTrack === 'All' || job.track === selectedTrack;
    return matchesSearch && matchesTrack;
  });

  const handleApply = (jobId: string) => {
    if (!appliedJobs.includes(jobId)) {
      setAppliedJobs([...appliedJobs, jobId]);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-[#0d2621] to-emerald-950 text-white rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Internship Opportunities</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Apply to Top Vetted Tech Internships
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed font-normal">
            Your points on the leaderboard grant direct referral priority. High-scoring interns receive guaranteed fast-track interview responses.
          </p>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search roles, skills, companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedTrack}
            onChange={(e) => setSelectedTrack(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          >
            <option value="All">All Tracks</option>
            <option value="Machine Learning">Machine Learning</option>
            <option value="Backend AI Engineering">Backend AI Engineering</option>
            <option value="Full Stack Web">Full Stack Web</option>
            <option value="Data Science">Data Science</option>
          </select>
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredJobs.map((job) => {
          const hasApplied = appliedJobs.includes(job.id);
          return (
            <div
              key={job.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-emerald-500/40 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={job.logo}
                      alt={job.company}
                      className="w-11 h-11 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm hover:text-emerald-700 cursor-pointer">
                        {job.title}
                      </h3>
                      <div className="text-xs text-slate-500 font-medium flex items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-slate-400" />
                          {job.company}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {job.location}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {job.description}
                </p>

                {/* Skills chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {job.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded-md text-[10px] font-semibold text-slate-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer */}
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
                <div className="text-xs font-bold font-mono text-emerald-800">
                  {job.stipend}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedJob(job)}
                    className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => handleApply(job.id)}
                    disabled={hasApplied}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-2xs ${
                      hasApplied
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200 cursor-default'
                        : 'bg-emerald-700 hover:bg-emerald-600 text-white'
                    }`}
                  >
                    {hasApplied ? 'Applied ✓' : 'Quick Apply'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for Details */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={selectedJob.logo} alt="" className="w-12 h-12 rounded-xl object-cover border" />
                <div>
                  <h2 className="font-bold text-slate-900 text-base">{selectedJob.title}</h2>
                  <p className="text-xs text-slate-500">{selectedJob.company} • {selectedJob.location}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div>
                <h4 className="font-bold text-slate-900 mb-1">About the Role</h4>
                <p className="leading-relaxed text-slate-600">{selectedJob.description}</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">Key Requirements</h4>
                <ul className="list-disc pl-4 space-y-1 text-slate-600">
                  {selectedJob.requirements.map((req, idx) => (
                    <li key={idx}>{req}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button
                onClick={() => setSelectedJob(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleApply(selectedJob.id);
                  setSelectedJob(null);
                }}
                className="px-5 py-2 text-xs font-bold bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl shadow-xs"
              >
                Submit Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
