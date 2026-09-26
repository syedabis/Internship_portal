'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Plus,
  Trash2,
  Edit3,
  X,
  Save,
  Briefcase,
  Loader2,
  Sparkles,
  Search,
  Filter,
  Layers,
  Award
} from 'lucide-react';

export type Project = {
  id: string;
  title: string;
  description: string;
  domain: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  teamSize: string;
  techStack: string[];
  learningOutcomes: string[];
  points: number;
  popularity: number;
  created_at?: string;
};

const DOMAINS = [
  { id: 'ai', label: 'Artificial Intelligence (AI)' },
  { id: 'swe', label: 'Software Engineering' },
  { id: 'cybersecurity', label: 'Cybersecurity & InfoSec' },
  { id: 'hr', label: 'Human Resources (HR)' },
  { id: 'sales', label: 'Sales & Business Dev' },
  { id: 'marketing', label: 'Digital Marketing & Growth' },
  { id: 'finance', label: 'Finance & Accounting' },
  { id: 'operations', label: 'Operations & Logistics' },
  { id: 'customersuccess', label: 'Customer Success & Support' },
  { id: 'product', label: 'Product & Strategy' },
  { id: 'design', label: 'Graphic Design & Branding' },
];

const INITIAL_PROJECTS: Project[] = [
  {
    id: 'p1',
    title: 'HR Talent Acquisition & Onboarding Workflow',
    description: 'Design and implement a structured talent pipeline, 30-60-90 day employee onboarding journey, automated check-ins, and performance feedback frameworks for a remote workforce.',
    domain: 'hr',
    difficulty: 'Intermediate',
    duration: '4 weeks',
    teamSize: '1–2',
    techStack: ['HRIS Frameworks', 'Notion', 'Excel / Sheets', 'LMS Tools', 'Process Mapping'],
    learningOutcomes: ['End-to-end recruitment funnel', 'Onboarding SLA design', 'Employee retention strategies', 'HR metrics & analytics'],
    points: 350,
    popularity: 94,
  },
  {
    id: 'p2',
    title: 'B2B Sales Pipeline & Lead Scoring Engine',
    description: 'Build an outbound sales pipeline strategy, define ideal customer profiles (ICPs), create a quantitative lead scoring model, and design automated email follow-up workflows.',
    domain: 'sales',
    difficulty: 'Intermediate',
    duration: '4 weeks',
    teamSize: '1–2',
    techStack: ['HubSpot CRM', 'Salesforce Logic', 'LinkedIn Sales Navigator', 'Excel Financials', 'Email Automation'],
    learningOutcomes: ['B2B prospecting methodology', 'CRM pipeline optimization', 'Lead scoring algorithms', 'Sales conversion tracking'],
    points: 380,
    popularity: 91,
  },
  {
    id: 'p3',
    title: 'Multi-Channel Growth Marketing Campaign',
    description: 'Create an integrated growth marketing campaign targeting B2B SaaS users. Set up SEO keyword trees, ad creative copy, A/B landing page tests, and ROI attribution models.',
    domain: 'marketing',
    difficulty: 'Beginner',
    duration: '3 weeks',
    teamSize: '1–3',
    techStack: ['Google Analytics 4', 'Meta Ads Manager', 'SEO Tools', 'Canva', 'Copywriting'],
    learningOutcomes: ['Customer acquisition cost (CAC) analysis', 'Ad conversion optimization', 'Content calendar planning', 'Campaign ROI tracking'],
    points: 300,
    popularity: 96,
  },
  {
    id: 'p4',
    title: 'Financial Valuation & Unit Economics Model',
    description: 'Develop a dynamic 3-statement financial model for an early-stage startup. Calculate DCF valuation, customer lifetime value (LTV), burn rate, and runway projections under 3 growth scenarios.',
    domain: 'finance',
    difficulty: 'Advanced',
    duration: '5 weeks',
    teamSize: '1–2',
    techStack: ['Advanced Excel', 'Financial Modeling', 'DCF Analysis', 'Power BI', 'Cap Table Logic'],
    learningOutcomes: ['3-Statement financial forecasting', 'DCF & WACC calculations', 'LTV:CAC ratio modeling', 'Investor pitch deck financials'],
    points: 450,
    popularity: 88,
  }
];

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [domainFilter, setDomainFilter] = useState('all');

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [domain, setDomain] = useState('sales');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [duration, setDuration] = useState('4 weeks');
  const [teamSize, setTeamSize] = useState('1-2');
  const [techStackText, setTechStackText] = useState('');
  const [outcomesText, setOutcomesText] = useState('');
  const [points, setPoints] = useState('350');
  const [popularity, setPopularity] = useState('90');

  const getLocalProjects = (): Project[] => {
    try {
      const saved = localStorage.getItem('cortexa_projects_list');
      return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
    } catch {
      return INITIAL_PROJECTS;
    }
  };

  const saveLocalProjects = (list: Project[]) => {
    try {
      localStorage.setItem('cortexa_projects_list', JSON.stringify(list));
      window.dispatchEvent(new Event('cortexa_projects_updated'));
    } catch (err) {
      console.warn('LocalStorage save error:', err);
    }
  };

  const fetchProjects = async () => {
    const localProjects = getLocalProjects();

    try {
      const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
      if (data && data.length > 0) {
        setProjects(data as Project[]);
      } else {
        setProjects(localProjects);
      }
    } catch {
      setProjects(localProjects);
    }
    setLoading(false);
  };

  useEffect(() => { fetchProjects(); }, []);

  const resetForm = () => {
    setTitle(''); setDescription(''); setDomain('sales'); setDifficulty('Intermediate');
    setDuration('4 weeks'); setTeamSize('1-2'); setTechStackText(''); setOutcomesText('');
    setPoints('350'); setPopularity('90'); setEditingId(null); setShowForm(false);
  };

  const handleSave = async () => {
    if (!title.trim() || !description.trim()) return;
    setSaving(true);

    const techStack = techStackText.split('\n').map(t => t.trim()).filter(Boolean);
    const learningOutcomes = outcomesText.split('\n').map(o => o.trim()).filter(Boolean);
    const targetId = editingId || 'proj_' + Date.now();

    const updatedProject: Project = {
      id: targetId,
      title: title.trim(),
      description: description.trim(),
      domain,
      difficulty,
      duration: duration.trim(),
      teamSize: teamSize.trim(),
      techStack,
      learningOutcomes,
      points: parseInt(points) || 350,
      popularity: parseInt(popularity) || 90,
      created_at: new Date().toISOString()
    };

    let newList: Project[];
    if (editingId) {
      newList = projects.map(p => p.id === editingId || p.title.toLowerCase() === title.trim().toLowerCase() ? updatedProject : p);
    } else {
      newList = [updatedProject, ...projects];
    }

    setProjects(newList);
    saveLocalProjects(newList);

    // Sync with Supabase asynchronously
    try {
      const dbPayload = {
        title: title.trim(),
        description: description.trim(),
        domain,
        difficulty,
        duration: duration.trim(),
        team_size: teamSize.trim(),
        tech_stack: techStack,
        learning_outcomes: learningOutcomes,
        points: parseInt(points) || 350,
        popularity: parseInt(popularity) || 90
      };

      if (editingId && !editingId.startsWith('proj_') && !editingId.startsWith('p')) {
        await supabase.from('projects').update(dbPayload).eq('id', editingId);
      } else {
        await supabase.from('projects').insert([dbPayload]);
      }
    } catch (err) {
      console.log('Supabase sync skipped:', err);
    }

    setSaving(false);
    resetForm();
  };

  const handleDelete = async (e: React.MouseEvent, id: string, projTitle: string) => {
    e.preventDefault();
    e.stopPropagation();

    const newList = projects.filter(p => p.id !== id && p.title.toLowerCase() !== projTitle.toLowerCase());
    setProjects(newList);
    saveLocalProjects(newList);

    try {
      if (id && !id.startsWith('proj_') && !id.startsWith('p')) {
        await supabase.from('projects').delete().eq('id', id);
      }
      await supabase.from('projects').delete().eq('title', projTitle);
    } catch (err) {
      console.warn('Supabase delete warning:', err);
    }
  };

  const handleEdit = (p: Project) => {
    setEditingId(p.id);
    setTitle(p.title);
    setDescription(p.description);
    setDomain(p.domain || 'sales');
    setDifficulty(p.difficulty || 'Intermediate');
    setDuration(p.duration || '4 weeks');
    setTeamSize(p.teamSize || '1-2');
    setTechStackText(Array.isArray(p.techStack) ? p.techStack.join('\n') : '');
    setOutcomesText(Array.isArray(p.learningOutcomes) ? p.learningOutcomes.join('\n') : '');
    setPoints(String(p.points || 350));
    setPopularity(String(p.popularity || 90));
    setShowForm(true);
  };

  const filteredProjects = projects.filter(p => {
    const matchesDomain = domainFilter === 'all' || p.domain === domainFilter;
    const matchesQuery = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDomain && matchesQuery;
  });

  return (
    <div className="space-y-6 pb-16 font-sans max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 flex items-center justify-center shrink-0">
            <Briefcase className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Internship Projects & Tasks</h1>
            <p className="text-xs text-slate-500 mt-0.5">Manage domain project assignments, difficulty levels, tech stacks, and point rewards.</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => { resetForm(); setShowForm(true); }}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-xs shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-emerald-400" />
          <span>Add Project</span>
        </button>
      </div>

      {/* Controls Bar: Search + Domain Filter */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by title or description..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-emerald-500"
          />
          {searchQuery && (
            <button type="button" onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <select
          value={domainFilter}
          onChange={(e) => setDomainFilter(e.target.value)}
          className="w-full sm:w-64 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-500"
        >
          <option value="all">All Domains</option>
          {DOMAINS.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
        </select>
      </div>

      {/* Form Card */}
      {showForm && (
        <div className="bg-white border border-emerald-500/40 rounded-2xl p-6 shadow-xl space-y-4 ring-2 ring-emerald-500/10">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>{editingId ? 'Edit Project' : 'Add New Internship Project'}</span>
            </h3>
            <button type="button" onClick={resetForm} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Project Title (e.g. B2B Sales Pipeline Strategy)"
              className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-emerald-500"
            />
            
            <select
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-emerald-500"
            >
              {DOMAINS.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as any)}
              className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-emerald-500"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>

            <input
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="Duration (e.g. 4 weeks)"
              className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-emerald-500"
            />

            <input
              value={teamSize}
              onChange={(e) => setTeamSize(e.target.value)}
              placeholder="Team Size (e.g. 1-2)"
              className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-emerald-500"
            />

            <div className="flex items-center gap-2">
              <input
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                placeholder="Points"
                type="number"
                className="w-1/2 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-emerald-500"
              />
              <input
                value={popularity}
                onChange={(e) => setPopularity(e.target.value)}
                placeholder="Popularity %"
                type="number"
                className="w-1/2 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detailed project scope & objectives..."
            rows={3}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-normal text-slate-800 focus:outline-none focus:border-emerald-500"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1 block">
                Tech Stack / Tools (one per line)
              </label>
              <textarea
                value={techStackText}
                onChange={(e) => setTechStackText(e.target.value)}
                placeholder="HubSpot CRM&#10;Excel / Google Sheets&#10;LinkedIn Sales Navigator"
                rows={3}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1 block">
                Learning Outcomes (one per line)
              </label>
              <textarea
                value={outcomesText}
                onChange={(e) => setOutcomesText(e.target.value)}
                placeholder="B2B prospecting methodology&#10;CRM pipeline optimization&#10;Lead scoring algorithms"
                rows={3}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="flex justify-end border-t border-slate-100 pt-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !title.trim() || !description.trim()}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>{editingId ? 'Update Project' : 'Add Project'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Project List */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 flex justify-center items-center">
          <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-500">
          No internship projects found. Click "Add Project" to add your first domain task.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredProjects.map((p) => {
            const domainLabel = DOMAINS.find(d => d.id === p.domain)?.label || p.domain;

            return (
              <div
                key={p.id}
                className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:border-emerald-500/40 transition-all"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-extrabold rounded-full uppercase">
                      {domainLabel}
                    </span>
                    <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-bold rounded-full">
                      {p.difficulty}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      ⏱ {p.duration} · 👥 {p.teamSize} team · 🏆 {p.points} pts
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm">{p.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-2">{p.description}</p>
                </div>

                <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity self-end md:self-center">
                  <button
                    type="button"
                    onClick={() => handleEdit(p)}
                    className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                    title="Edit"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleDelete(e, p.id, p.title)}
                    className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
