'use client';

import React, { useState } from 'react';
import { Play, Sparkles, Clock, BookOpen, User, Star, Download, Search, Filter, CheckCircle2, ArrowUpRight, Video, FileCode } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Masterclass {
  id: string;
  title: string;
  instructor: string;
  role: string;
  avatar: string;
  thumbnail: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  rating: number;
  enrolledCount: number;
  description: string;
  youtubeId?: string;
  resources: { name: string; type: 'code' | 'pdf' | 'link'; url: string }[];
}

const MASTERCLASSES: Masterclass[] = [
  {
    id: 'mc-1',
    title: 'Building & Fine-Tuning Multi-Agent LLMs with QLoRA',
    instructor: 'Dr. Aris Thorne',
    role: 'Head of AI Research @ Cortexa',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    duration: '2h 15m',
    level: 'Advanced',
    category: 'Generative AI & LLMs',
    rating: 4.9,
    enrolledCount: 1420,
    description: 'Learn how to fine-tune open-source models like Llama 3 and Mistral using QLoRA techniques. We build an automated multi-agent collaboration framework from scratch.',
    resources: [
      { name: 'PyTorch QLoRA Fine-tuning Notebook', type: 'code', url: '#' },
      { name: 'Multi-Agent System Architecture Slides (PDF)', type: 'pdf', url: '#' },
    ],
  },
  {
    id: 'mc-2',
    title: 'Production Computer Vision: ResNet to Vision Transformers',
    instructor: 'Elena Rostova',
    role: 'Senior Vision Engineer @ DataLab',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
    duration: '1h 45m',
    level: 'Intermediate',
    category: 'Computer Vision',
    rating: 4.8,
    enrolledCount: 980,
    description: 'Deep dive into computer vision pipelines. Transfer learning, data augmentation strategies, and deploying ViT models with TensorRT.',
    resources: [
      { name: 'OpenCV & PyTorch Vision Repo', type: 'code', url: '#' },
      { name: 'Data Augmentation Cheat Sheet', type: 'pdf', url: '#' },
    ],
  },
  {
    id: 'mc-3',
    title: 'High-Throughput Backend AI Systems with FastAPI & Redis',
    instructor: 'Marcus Vance',
    role: 'Principal Systems Architect',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
    duration: '2h 00m',
    level: 'Intermediate',
    category: 'System Design & Backend',
    rating: 4.9,
    enrolledCount: 1650,
    description: 'Architecting scalable API backends capable of streaming LLM tokens, queuing asynchronous inference jobs, and caching vectors with Redis.',
    resources: [
      { name: 'FastAPI Microservice Template', type: 'code', url: '#' },
      { name: 'Redis Vector Caching Guide', type: 'pdf', url: '#' },
    ],
  },
  {
    id: 'mc-4',
    title: 'Cracking the AI Resume & Technical Interview',
    instructor: 'Sarah Lin',
    role: 'Tech Recruiter & Ex-FAANG Interviewer',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=600&auto=format&fit=crop&q=80',
    duration: '1h 30m',
    level: 'Beginner',
    category: 'Career & Interview Prep',
    rating: 5.0,
    enrolledCount: 2310,
    description: 'Step-by-step masterclass on optimizing technical CV bullets, quantifying achievements, and answering system design interview questions for ML roles.',
    resources: [
      { name: 'ATS Resume Keyword Checklist', type: 'pdf', url: '#' },
      { name: 'Mock Technical Interview Questions', type: 'pdf', url: '#' },
    ],
  },
  {
    id: 'mc-5',
    title: 'Enterprise RAG: Vector DBs, Hybrid Search & Graph RAG',
    instructor: 'Dr. Aris Thorne',
    role: 'Head of AI Research @ Cortexa',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=600&auto=format&fit=crop&q=80',
    duration: '2h 40m',
    level: 'Advanced',
    category: 'Generative AI & LLMs',
    rating: 4.9,
    enrolledCount: 1890,
    description: 'Overcome naive RAG hallucinations using hybrid keyword/dense embeddings, metadata filtering, chunk reranking, and Knowledge Graph integration.',
    resources: [
      { name: 'LangChain & Qdrant Implementation', type: 'code', url: '#' },
      { name: 'Graph RAG Architecture Whitepaper', type: 'pdf', url: '#' },
    ],
  },
  {
    id: 'mc-6',
    title: 'MLOps BootCamp: Docker, Kubernetes & Model Monitoring',
    instructor: 'David Kim',
    role: 'Lead MLOps Engineer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1542744094-3a3172720449?w=600&auto=format&fit=crop&q=80',
    duration: '2h 10m',
    level: 'Intermediate',
    category: 'System Design & Backend',
    rating: 4.8,
    enrolledCount: 1120,
    description: 'Containerizing ML models with Docker, managing deployment pipelines with GitHub Actions, and setting up Prometheus & Grafana drift alerts.',
    resources: [
      { name: 'Docker & K8s Config Templates', type: 'code', url: '#' },
    ],
  },
];

export const InternshipResourcesView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeMasterclass, setActiveMasterclass] = useState<Masterclass | null>(null);

  const categories = [
    'All',
    'Generative AI & LLMs',
    'Computer Vision',
    'System Design & Backend',
    'Career & Interview Prep',
  ];

  const filteredMasterclasses = MASTERCLASSES.filter((mc) => {
    const matchesCategory = selectedCategory === 'All' || mc.category === selectedCategory;
    const matchesSearch =
      mc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mc.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mc.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featured = MASTERCLASSES[0];

  return (
    <div className="space-y-8 pb-16">
      
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-[#0d2621] to-emerald-950 text-white rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Cortexa Intern Academy</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Exclusive AI Masterclasses & Technical Resources
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed font-normal">
            Accelerate your technical rank. Watch hands-on masterclasses led by industry research engineers and download production code templates.
          </p>
        </div>
      </div>

      {/* Featured Masterclass Spotlight */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs overflow-hidden flex flex-col lg:flex-row gap-6 items-center">
        <div className="w-full lg:w-1/2 relative rounded-xl overflow-hidden aspect-video group cursor-pointer" onClick={() => setActiveMasterclass(featured)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={featured.thumbnail} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/30 transition-colors flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center shadow-xl transition-all scale-100 group-hover:scale-110">
              <Play className="w-6 h-6 fill-slate-950 ml-1" />
            </div>
          </div>
          <span className="absolute top-3 left-3 px-2.5 py-1 bg-emerald-950/80 backdrop-blur-xs text-emerald-300 text-[10px] font-bold rounded-md border border-emerald-500/30">
            Featured Masterclass
          </span>
          <span className="absolute bottom-3 right-3 px-2 py-0.5 bg-slate-950/80 backdrop-blur-xs text-white text-[10px] font-mono font-bold rounded">
            {featured.duration}
          </span>
        </div>

        <div className="w-full lg:w-1/2 space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full border border-emerald-200">
              {featured.category}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-semibold">{featured.level} Level</span>
          </div>

          <h2 className="text-xl font-bold text-slate-900 leading-snug cursor-pointer hover:text-emerald-700" onClick={() => setActiveMasterclass(featured)}>
            {featured.title}
          </h2>

          <p className="text-xs text-slate-600 leading-relaxed">
            {featured.description}
          </p>

          <div className="flex items-center gap-3 pt-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={featured.avatar} alt="" className="w-9 h-9 rounded-full object-cover border border-slate-200" />
            <div>
              <div className="font-bold text-xs text-slate-900">{featured.instructor}</div>
              <div className="text-[10px] text-slate-500">{featured.role}</div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => setActiveMasterclass(featured)}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-2xs transition-all flex items-center gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Watch Masterclass</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Controls & Search */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search masterclasses, topics, instructors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Masterclass Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMasterclasses.map((mc) => (
          <div
            key={mc.id}
            className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-emerald-500/40 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Thumbnail Header */}
              <div className="relative aspect-video group cursor-pointer" onClick={() => setActiveMasterclass(mc)}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={mc.thumbnail} alt={mc.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-slate-950/30 group-hover:bg-slate-950/20 transition-colors flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-4 h-4 fill-slate-950 ml-0.5" />
                  </div>
                </div>
                <span className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-slate-950/80 text-white text-[10px] font-mono font-bold rounded">
                  {mc.duration}
                </span>
                <span className="absolute top-2 left-2 px-2 py-0.5 bg-slate-900/80 backdrop-blur-xs text-emerald-300 text-[10px] font-semibold rounded">
                  {mc.level}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                  <span className="text-emerald-700 font-bold">{mc.category}</span>
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>{mc.rating}</span>
                  </div>
                </div>

                <h3
                  onClick={() => setActiveMasterclass(mc)}
                  className="font-bold text-slate-900 text-sm hover:text-emerald-700 cursor-pointer line-clamp-2 leading-snug"
                >
                  {mc.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {mc.description}
                </p>

                {/* Instructor */}
                <div className="flex items-center gap-2.5 pt-2 border-t border-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={mc.avatar} alt="" className="w-7 h-7 rounded-full object-cover border border-slate-200" />
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-xs text-slate-900 truncate">{mc.instructor}</div>
                    <div className="text-[10px] text-slate-400 truncate">{mc.role}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Action */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-medium">
                {mc.enrolledCount.toLocaleString()} interns watched
              </span>
              <button
                onClick={() => setActiveMasterclass(mc)}
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Video className="w-3.5 h-3.5" />
                <span>Watch</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Masterclass Detail Modal */}
      {activeMasterclass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 space-y-5 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start">
              <div>
                <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                  {activeMasterclass.category}
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-1">{activeMasterclass.title}</h2>
              </div>
              <button
                onClick={() => setActiveMasterclass(null)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Video Player Preview Container */}
            <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-950 flex items-center justify-center border border-slate-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={activeMasterclass.thumbnail} alt="" className="w-full h-full object-cover opacity-60" />
              <div className="absolute flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center shadow-2xl cursor-pointer transition-transform hover:scale-110">
                  <Play className="w-7 h-7 fill-slate-950 ml-1" />
                </div>
                <span className="text-white text-xs font-bold bg-slate-900/80 px-3 py-1 rounded-full">
                  Playing Masterclass • {activeMasterclass.duration}
                </span>
              </div>
            </div>

            {/* Description & Resources */}
            <div className="space-y-4 text-xs text-slate-700">
              <div>
                <h4 className="font-bold text-slate-900 mb-1">About this Session</h4>
                <p className="leading-relaxed text-slate-600">{activeMasterclass.description}</p>
              </div>

              {activeMasterclass.resources.length > 0 && (
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Included Resources & Starter Code</h4>
                  <div className="space-y-2">
                    {activeMasterclass.resources.map((res, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                        <div className="flex items-center gap-2 font-semibold text-slate-800">
                          <FileCode className="w-4 h-4 text-emerald-600" />
                          <span>{res.name}</span>
                        </div>
                        <a
                          href={res.url}
                          download
                          className="px-3 py-1 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-[11px] rounded-lg flex items-center gap-1 transition-colors"
                        >
                          <Download className="w-3 h-3" />
                          <span>Download</span>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-3 border-t">
              <button
                onClick={() => setActiveMasterclass(null)}
                className="px-5 py-2 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl"
              >
                Close Session
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
