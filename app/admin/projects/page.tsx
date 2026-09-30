'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { INITIAL_PROJECTS, Project, CaseStudyData, WeekPlanData } from '@/lib/projectsData';
import toast from '@/lib/toast';
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
  Award,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Target,
  Star,
  Zap,
  Calendar,
  FileCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  MessageSquare,
  AlertCircle,
  XCircle,
  Check,
  Lightbulb,
  Send,
} from 'lucide-react';

export type { Project };

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

export interface ProjectSubmission {
  id: string;
  user_email: string;
  user_name: string;
  project_id: string;
  project_title: string;
  week_number: number;
  deliverable_url: string;
  notes?: string;
  status: 'pending' | 'approved' | 'rejected';
  points_awarded: number;
  created_at: string;
  updated_at: string;
}

export default function AdminProjectsPage() {
  const [activeTab, setActiveTab] = useState<'projects' | 'submissions' | 'proposals'>('projects');

  // Projects State
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [domainFilter, setDomainFilter] = useState('all');

  // Basic Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [domain, setDomain] = useState('sales');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [duration, setDuration] = useState('4 weeks');
  const [teamSize, setTeamSize] = useState('1-2');
  const [techStackText, setTechStackText] = useState('');
  const [outcomesText, setOutcomesText] = useState('');
  const [points, setPoints] = useState('500');
  const [popularity, setPopularity] = useState('90');

  // Advanced Execution Plan Form state
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [caseStudyCompany, setCaseStudyCompany] = useState('');
  const [caseStudyScenario, setCaseStudyScenario] = useState('');
  const [caseStudyProblem, setCaseStudyProblem] = useState('');
  const [caseStudyBenchmark, setCaseStudyBenchmark] = useState('');
  const [finalDeliverableText, setFinalDeliverableText] = useState('');
  const [evaluationCriteriaText, setEvaluationCriteriaText] = useState('');
  const [weeklyPlanText, setWeeklyPlanText] = useState('');

  // Submissions Management State
  const [submissions, setSubmissions] = useState<ProjectSubmission[]>([]);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);
  const [submissionFilter, setSubmissionFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [submissionSearch, setSubmissionSearch] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Proposals State
  const [proposalFilter, setProposalFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [proposalSearch, setProposalSearch] = useState('');
  const [approvingProposal, setApprovingProposal] = useState<any | null>(null);
  const [assignedPoints, setAssignedPoints] = useState('500');
  const [assignedDifficulty, setAssignedDifficulty] = useState<'Beginner' | 'Intermediate'>('Intermediate');
  const [adminFeedback, setAdminFeedback] = useState('');
  const [isProcessingProposal, setIsProcessingProposal] = useState(false);
  const [rejectingProposal, setRejectingProposal] = useState<any | null>(null);
  const [rejectionFeedback, setRejectionFeedback] = useState('');

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
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (data && data.length > 0) {
        const mapped: Project[] = data.map((p: any) => ({
          id: p.id,
          title: p.title,
          description: p.description,
          domain: p.domain,
          difficulty: p.difficulty || 'Intermediate',
          duration: p.duration || '4 weeks',
          teamSize: p.team_size || p.teamSize || '1-2',
          techStack: p.tech_stack || p.techStack || [],
          learningOutcomes: p.learning_outcomes || p.learningOutcomes || [],
          points: p.points || 500,
          popularity: p.popularity || 90,
          caseStudy: p.case_study || undefined,
          weeklyPlan: p.weekly_plan || undefined,
          finalDeliverable: p.final_deliverable || undefined,
          evaluationCriteria: p.evaluation_criteria || undefined,
          created_at: p.created_at,
        }));
        setProjects(mapped);
        saveLocalProjects(mapped);
      } else {
        const local = getLocalProjects();
        setProjects(local);
      }
    } catch {
      setProjects(getLocalProjects());
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async () => {
    setSubmissionsLoading(true);
    try {
      const { data, error } = await supabase
        .from('project_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) {
        setSubmissions(data as ProjectSubmission[]);
      }
    } catch (err) {
      console.warn('Error fetching submissions:', err);
    } finally {
      setSubmissionsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchSubmissions();
  }, []);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDomain('sales');
    setDifficulty('Intermediate');
    setDuration('4 weeks');
    setTeamSize('1-2');
    setTechStackText('');
    setOutcomesText('');
    setPoints('500');
    setPopularity('90');
    setEditingId(null);
    setShowForm(false);
    setShowAdvanced(false);
    setCaseStudyCompany('');
    setCaseStudyScenario('');
    setCaseStudyProblem('');
    setCaseStudyBenchmark('');
    setFinalDeliverableText('');
    setEvaluationCriteriaText('');
    setWeeklyPlanText('');
  };

  const handleSave = async () => {
    if (!title.trim() || !description.trim()) {
      toast.error('Title and description are required.');
      return;
    }
    setSaving(true);

    const techStack = techStackText.split('\n').map(t => t.trim()).filter(Boolean);
    const learningOutcomes = outcomesText.split('\n').map(o => o.trim()).filter(Boolean);

    // Parse Case Study
    let caseStudyData: CaseStudyData | undefined = undefined;
    if (caseStudyCompany.trim() || caseStudyScenario.trim() || caseStudyProblem.trim() || caseStudyBenchmark.trim()) {
      caseStudyData = {
        company: caseStudyCompany.trim() || 'Example Enterprise Scenario',
        scenario: caseStudyScenario.trim() || '',
        targetProblem: caseStudyProblem.trim() || '',
        sampleBenchmark: caseStudyBenchmark.trim() || '',
      };
    }

    // Parse Weekly Plan
    let parsedWeeklyPlan: WeekPlanData[] | undefined = undefined;
    if (weeklyPlanText.trim()) {
      try {
        const parsed = JSON.parse(weeklyPlanText.trim());
        if (Array.isArray(parsed)) {
          parsedWeeklyPlan = parsed;
        }
      } catch {
        console.warn('Weekly plan JSON parse failed.');
      }
    }

    const evaluationCriteria = evaluationCriteriaText.split('\n').map(c => c.trim()).filter(Boolean);

    const dbPayload = {
      title: title.trim(),
      description: description.trim(),
      domain,
      difficulty,
      duration: duration.trim(),
      team_size: teamSize.trim(),
      tech_stack: techStack,
      learning_outcomes: learningOutcomes,
      points: parseInt(points) || 500,
      popularity: parseInt(popularity) || 90,
      case_study: caseStudyData || null,
      weekly_plan: parsedWeeklyPlan || null,
      final_deliverable: finalDeliverableText.trim() || null,
      evaluation_criteria: evaluationCriteria.length > 0 ? evaluationCriteria : null,
    };

    try {
      if (editingId) {
        const { error } = await supabase
          .from('projects')
          .update(dbPayload)
          .eq('id', editingId);

        if (error) {
          toast.error(`Update failed: ${error.message}`);
        } else {
          toast.success('Project updated successfully in Supabase!');
          await fetchProjects();
          resetForm();
        }
      } else {
        const { error } = await supabase
          .from('projects')
          .insert([dbPayload]);

        if (error) {
          toast.error(`Insert failed: ${error.message}`);
        } else {
          toast.success('Project added successfully to Supabase!');
          await fetchProjects();
          resetForm();
        }
      }
    } catch (err: any) {
      toast.error(`Save error: ${err?.message || 'Check network connection.'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string, projTitle: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm(`Are you sure you want to delete "${projTitle}"?`)) return;

    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) {
        toast.error(`Delete failed: ${error.message}`);
      } else {
        toast.success(`Deleted "${projTitle}" from database`);
        setProjects((prev) => prev.filter((p) => p.id !== id));
        saveLocalProjects(projects.filter((p) => p.id !== id));
      }
    } catch {
      toast.error('Delete failed');
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

    // Populate Advanced Fields
    setCaseStudyCompany(p.caseStudy?.company || '');
    setCaseStudyScenario(p.caseStudy?.scenario || '');
    setCaseStudyProblem(p.caseStudy?.targetProblem || '');
    setCaseStudyBenchmark(p.caseStudy?.sampleBenchmark || '');
    setFinalDeliverableText(p.finalDeliverable || '');
    setEvaluationCriteriaText(Array.isArray(p.evaluationCriteria) ? p.evaluationCriteria.join('\n') : '');

    if (p.weeklyPlan && Array.isArray(p.weeklyPlan)) {
      setWeeklyPlanText(JSON.stringify(p.weeklyPlan, null, 2));
    } else {
      setWeeklyPlanText('');
    }

    if (p.caseStudy || p.weeklyPlan || p.finalDeliverable || p.evaluationCriteria) {
      setShowAdvanced(true);
    } else {
      setShowAdvanced(false);
    }

    setShowForm(true);
  };

  const handleUpdateSubmissionStatus = async (
    subId: string,
    newStatus: 'pending' | 'approved' | 'rejected',
    points: number = 0
  ) => {
    setActionLoadingId(subId);
    try {
      const { error } = await supabase
        .from('project_submissions')
        .update({
          status: newStatus,
          points_awarded: points,
          updated_at: new Date().toISOString(),
        })
        .eq('id', subId);

      if (error) {
        toast.error(`Update failed: ${error.message}`);
      } else {
        toast.success(
          newStatus === 'approved'
            ? `Submission approved! (+${points} pts awarded)`
            : newStatus === 'rejected'
            ? 'Submission marked as rejected.'
            : 'Submission reset to pending.'
        );
        setSubmissions((prev) =>
          prev.map((s) => (s.id === subId ? { ...s, status: newStatus, points_awarded: points } : s))
        );
      }
    } catch {
      toast.error('Action failed. Check network connection.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const proposals = submissions.filter((s) => s.week_number === 0 || s.project_id?.startsWith('proposal_'));
  const milestoneSubmissions = submissions.filter((s) => s.week_number > 0 && !s.project_id?.startsWith('proposal_'));

  const pendingSubmissionsCount = milestoneSubmissions.filter((s) => s.status === 'pending').length;
  const pendingProposalsCount = proposals.filter((s) => s.status === 'pending').length;

  const filteredProjects = projects.filter(p => {
    const matchesDomain = domainFilter === 'all' || p.domain === domainFilter;
    const matchesQuery = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDomain && matchesQuery;
  });

  const filteredSubmissions = milestoneSubmissions.filter((sub) => {
    const matchesStatus = submissionFilter === 'all' || sub.status === submissionFilter;
    const matchesSearch =
      sub.user_name?.toLowerCase().includes(submissionSearch.toLowerCase()) ||
      sub.user_email?.toLowerCase().includes(submissionSearch.toLowerCase()) ||
      sub.project_title?.toLowerCase().includes(submissionSearch.toLowerCase()) ||
      sub.notes?.toLowerCase().includes(submissionSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const filteredProposals = proposals.filter((prop) => {
    const matchesStatus = proposalFilter === 'all' || prop.status === proposalFilter;
    const matchesSearch =
      prop.user_name?.toLowerCase().includes(proposalSearch.toLowerCase()) ||
      prop.user_email?.toLowerCase().includes(proposalSearch.toLowerCase()) ||
      prop.project_title?.toLowerCase().includes(proposalSearch.toLowerCase()) ||
      prop.notes?.toLowerCase().includes(proposalSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleOpenApproveProposal = (prop: any) => {
    let parsedNotes: any = {};
    try {
      parsedNotes = JSON.parse(prop.notes || '{}');
    } catch {}
    setApprovingProposal(prop);
    setAssignedPoints('500');
    setAssignedDifficulty(parsedNotes.difficulty === 'Beginner' ? 'Beginner' : 'Intermediate');
    setAdminFeedback('');
  };

  const handleConfirmApproveProposal = async () => {
    if (!approvingProposal) return;
    setIsProcessingProposal(true);
    let parsedNotes: any = {};
    try {
      parsedNotes = JSON.parse(approvingProposal.notes || '{}');
    } catch {
      parsedNotes = { problemStatement: approvingProposal.notes };
    }

    const pointsNum = parseInt(assignedPoints) || 500;
    const updatedNotes = {
      ...parsedNotes,
      adminFeedback: adminFeedback.trim() || 'Approved by program mentor. Enrolled in custom capstone.',
      approvedAt: new Date().toISOString(),
    };

    try {
      // 1. Update proposal status in project_submissions
      const { error: subErr } = await supabase
        .from('project_submissions')
        .update({
          status: 'approved',
          points_awarded: pointsNum,
          notes: JSON.stringify(updatedNotes),
          updated_at: new Date().toISOString(),
        })
        .eq('id', approvingProposal.id);

      if (subErr) {
        toast.error(`Could not update proposal: ${subErr.message}`);
        return;
      }

      // 2. Insert into live projects table so it's a real project in the catalog
      const newProjectPayload = {
        title: approvingProposal.project_title,
        description: parsedNotes.problemStatement || 'Custom student capstone project.',
        domain: parsedNotes.domain || 'swe',
        difficulty: assignedDifficulty,
        duration: parsedNotes.duration || (assignedDifficulty === 'Beginner' ? '3 weeks' : '4 weeks'),
        team_size: '1',
        tech_stack: Array.isArray(parsedNotes.techStack) && parsedNotes.techStack.length > 0 ? parsedNotes.techStack : ['Custom Stack'],
        learning_outcomes: [
          'Custom problem framing & domain execution',
          'End-to-end milestone delivery',
          'Executive portfolio presentation',
        ],
        points: pointsNum,
        popularity: 95,
        case_study: {
          company: `${approvingProposal.user_name || 'Intern'}'s Capstone Initiative`,
          scenario: parsedNotes.problemStatement || 'Custom student proposed project.',
          targetProblem: 'Custom real-world problem statement.',
          sampleBenchmark: parsedNotes.targetDeliverables || 'Comprehensive deliverable with functional prototype and documentation.',
        },
        final_deliverable: parsedNotes.targetDeliverables || 'A comprehensive working prototype, SOP wiki documentation, and video presentation.',
        evaluation_criteria: [
          'Strategic depth & problem-solving framework (25%)',
          'Execution completeness & template quality (25%)',
          'Data accuracy & analytical rigor (20%)',
          'Documentation & presentation clarity (15%)',
          'Tool mastery & automation efficiency (15%)',
        ],
      };

      const { error: projErr } = await supabase.from('projects').insert([newProjectPayload]);
      if (projErr) {
        console.warn('Notice adding project to table:', projErr.message);
      }

      toast.success(`Proposal approved! (+${pointsNum} pts awarded & published to portal)`);
      setApprovingProposal(null);
      await fetchSubmissions();
      await fetchProjects();
    } catch (err: any) {
      toast.error(`Approval failed: ${err?.message || 'Check network connection'}`);
    } finally {
      setIsProcessingProposal(false);
    }
  };

  const handleConfirmRejectProposal = async () => {
    if (!rejectingProposal) return;
    setIsProcessingProposal(true);
    let parsedNotes: any = {};
    try {
      parsedNotes = JSON.parse(rejectingProposal.notes || '{}');
    } catch {
      parsedNotes = { problemStatement: rejectingProposal.notes };
    }

    const updatedNotes = {
      ...parsedNotes,
      adminFeedback: rejectionFeedback.trim() || 'Revisions requested. Please clarify problem scope and tech stack.',
      reviewedAt: new Date().toISOString(),
    };

    try {
      const { error } = await supabase
        .from('project_submissions')
        .update({
          status: 'rejected',
          notes: JSON.stringify(updatedNotes),
          updated_at: new Date().toISOString(),
        })
        .eq('id', rejectingProposal.id);

      if (error) {
        toast.error(`Could not reject proposal: ${error.message}`);
      } else {
        toast.success('Feedback recorded & revisions requested from intern.');
        setRejectingProposal(null);
        setRejectionFeedback('');
        await fetchSubmissions();
      }
    } catch (err: any) {
      toast.error(`Action failed: ${err?.message || 'Check connection'}`);
    } finally {
      setIsProcessingProposal(false);
    }
  };

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
            <p className="text-xs text-slate-500 mt-0.5">Manage domain project assignments, execution plans, student deliverables, and custom proposals.</p>
          </div>
        </div>

        {activeTab === 'projects' && (
          <button
            type="button"
            onClick={() => { resetForm(); setShowForm(true); }}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-xs shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Add Project</span>
          </button>
        )}
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 flex-wrap">
        <button
          type="button"
          onClick={() => setActiveTab('projects')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'projects'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>All Domain Projects ({projects.length})</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('submissions');
            fetchSubmissions();
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'submissions'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileCheck className="w-4 h-4 text-emerald-400" />
          <span>Intern Deliverables ({milestoneSubmissions.length})</span>
          {pendingSubmissionsCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-black">
              {pendingSubmissionsCount} Pending
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('proposals');
            fetchSubmissions();
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'proposals'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Lightbulb className="w-4 h-4 text-purple-400" />
          <span>Student Proposals ({proposals.length})</span>
          {pendingProposalsCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-purple-600 text-white text-[10px] font-black">
              {pendingProposalsCount} Pending
            </span>
          )}
        </button>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* TAB 1: ALL PROJECTS CATALOG                                           */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'projects' && (
        <>
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
                <button type="button" onClick={resetForm} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer">
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

              {/* Advanced Execution Plan Settings */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold flex items-center justify-between transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Advanced Candidate Execution Plan Settings (Case Study, Weekly Breakdown & Rubric)</span>
                  </div>
                  {showAdvanced ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                </button>

                {showAdvanced && (
                  <div className="mt-3 p-4 bg-slate-900 text-white rounded-2xl space-y-4 border border-slate-800 animate-[fadeSlideIn_0.2s_ease-out]">
                    {/* 1. Real-World Case Study */}
                    <div className="space-y-2 border-b border-slate-800 pb-3">
                      <div className="text-xs font-extrabold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
                        <BookOpen className="w-3.5 h-3.5" /> Real-World Case Study & Benchmark Example
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          value={caseStudyCompany}
                          onChange={(e) => setCaseStudyCompany(e.target.value)}
                          placeholder="Example Company Name (e.g. Acme Tech Solutions)"
                          className="p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                        />
                        <input
                          value={caseStudyScenario}
                          onChange={(e) => setCaseStudyScenario(e.target.value)}
                          placeholder="Scenario Context (e.g. Scaling B2B outbound campaign)"
                          className="p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <textarea
                        value={caseStudyProblem}
                        onChange={(e) => setCaseStudyProblem(e.target.value)}
                        placeholder="Core Problem to Solve (e.g. High customer acquisition cost and unoptimized funnel)"
                        rows={2}
                        className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                      />
                      <textarea
                        value={caseStudyBenchmark}
                        onChange={(e) => setCaseStudyBenchmark(e.target.value)}
                        placeholder="Top Submission Benchmark Output (What high scoring submissions look like)"
                        rows={2}
                        className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    {/* 2. Weekly Execution Plan */}
                    <div className="space-y-2 border-b border-slate-800 pb-3">
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-extrabold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                          <Calendar className="w-3.5 h-3.5" /> Weekly Execution Plan & Deliverables (JSON Array)
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const samplePlan = [
                              {
                                week: 1,
                                title: "Architecture & Requirements Audit",
                                keyMetrics: "Completion of initial strategy blueprint",
                                objectives: ["Audit existing workflow", "Define KPIs and targets"],
                                deliverables: ["Strategy Architecture Document"]
                              },
                              {
                                week: 2,
                                title: "Implementation & Core Workflow Setup",
                                keyMetrics: "Functional setup and baseline testing",
                                objectives: ["Configure core tools", "Execute phase 1 testing"],
                                deliverables: ["Workflow Prototype & Config File"]
                              },
                              {
                                week: 3,
                                title: "Optimization & Quality Assurance",
                                keyMetrics: "Zero critical bugs and performance pass",
                                objectives: ["Conduct QA testing", "Optimize response times"],
                                deliverables: ["Test Report & Final SOP Guide"]
                              },
                              {
                                week: 4,
                                title: "Final Presentation & Video Walkthrough",
                                keyMetrics: "100% project completion",
                                objectives: ["Record video walkthrough", "Publish repository"],
                                deliverables: ["Final Executive Deck & Video Link"]
                              }
                            ];
                            setWeeklyPlanText(JSON.stringify(samplePlan, null, 2));
                          }}
                          className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-[10px] font-bold transition-colors cursor-pointer"
                        >
                          + Pre-fill Sample 4-Week Template
                        </button>
                      </div>
                      <textarea
                        value={weeklyPlanText}
                        onChange={(e) => setWeeklyPlanText(e.target.value)}
                        placeholder='JSON Array format: [{"week": 1, "title": "Setup", "keyMetrics": "SOP complete", "objectives": ["Goal 1"], "deliverables": ["Deliv 1"]}]'
                        rows={5}
                        className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs font-mono text-emerald-300 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    {/* 3. Final Deliverable & Evaluation Rubric */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1 block">
                          Custom Final Deliverable Description
                        </label>
                        <textarea
                          value={finalDeliverableText}
                          onChange={(e) => setFinalDeliverableText(e.target.value)}
                          placeholder="Comprehensive executive case study complete with live template..."
                          rows={3}
                          className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1 block">
                          Custom Evaluation Criteria (one per line)
                        </label>
                        <textarea
                          value={evaluationCriteriaText}
                          onChange={(e) => setEvaluationCriteriaText(e.target.value)}
                          placeholder="Strategic depth & problem solving (25%)&#10;Execution completeness (25%)&#10;Data accuracy (20%)"
                          rows={3}
                          className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>
                  </div>
                )}
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
                        title="Edit Project"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleDelete(e, p.id, p.title)}
                        className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Delete Project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* TAB 2: INTERN SUBMISSIONS & REVIEWS                                  */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'submissions' && (
        <div className="space-y-4 animate-[fadeSlideIn_0.2s_ease-out]">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={submissionSearch}
                onChange={(e) => setSubmissionSearch(e.target.value)}
                placeholder="Search by intern name, email, or project title..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-emerald-500"
              />
              {submissionSearch && (
                <button type="button" onClick={() => setSubmissionSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200 shrink-0">
              {(['all', 'pending', 'approved', 'rejected'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setSubmissionFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                    submissionFilter === st
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Submissions List */}
          {submissionsLoading ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 flex justify-center items-center">
              <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
            </div>
          ) : filteredSubmissions.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-500">
              No project submissions found matching the criteria.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredSubmissions.map((sub) => {
                const isActionLoading = actionLoadingId === sub.id;

                return (
                  <div
                    key={sub.id}
                    className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-start justify-between gap-4 hover:border-slate-300 transition-all"
                  >
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Status Badge */}
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide flex items-center gap-1 border ${
                          sub.status === 'approved'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : sub.status === 'rejected'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {sub.status === 'approved' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                          {sub.status === 'rejected' && <XCircle className="w-3 h-3 text-rose-600" />}
                          {sub.status === 'pending' && <Clock className="w-3 h-3 text-amber-600" />}
                          <span>{sub.status}</span>
                        </span>

                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold">
                          Week {sub.week_number}
                        </span>

                        {sub.points_awarded > 0 && (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
                            <Star className="w-2.5 h-2.5 fill-emerald-600 text-emerald-600" />
                            +{sub.points_awarded} pts
                          </span>
                        )}

                        <span className="text-[11px] text-slate-400 font-medium">
                          {new Date(sub.created_at).toLocaleDateString()} at {new Date(sub.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-900 text-sm tracking-tight">{sub.project_title}</h4>
                        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mt-0.5">
                          <span className="font-semibold text-slate-700">{sub.user_name || 'Intern'}</span>
                          <span>•</span>
                          <span>{sub.user_email}</span>
                        </div>
                      </div>

                      {/* Deliverable URL */}
                      <div className="pt-1">
                        <a
                          href={sub.deliverable_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-xs font-semibold transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                          <span className="truncate max-w-sm">{sub.deliverable_url}</span>
                        </a>
                      </div>

                      {/* Notes / Reflection */}
                      {sub.notes && (
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 leading-relaxed mt-2 flex items-start gap-2">
                          <MessageSquare className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-slate-700">Intern Notes: </span>
                            <span>{sub.notes}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Review Actions */}
                    <div className="flex items-center gap-2 shrink-0 self-end md:self-start pt-1">
                      {isActionLoading ? (
                        <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
                      ) : (
                        <>
                          {sub.status !== 'approved' && (
                            <button
                              type="button"
                              onClick={() => handleUpdateSubmissionStatus(sub.id, 'approved', 100)}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                              title="Approve deliverable and award 100 points"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Approve (+100 pts)</span>
                            </button>
                          )}

                          {sub.status !== 'rejected' && (
                            <button
                              type="button"
                              onClick={() => handleUpdateSubmissionStatus(sub.id, 'rejected', 0)}
                              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                              title="Reject submission"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          )}

                          {sub.status !== 'pending' && (
                            <button
                              type="button"
                              onClick={() => handleUpdateSubmissionStatus(sub.id, 'pending', 0)}
                              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-medium transition-colors cursor-pointer"
                              title="Reset status back to pending"
                            >
                              Reset
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* TAB 3: STUDENT PROJECT PROPOSALS                                       */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'proposals' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search proposals by student, title, or problem statement..."
                value={proposalSearch}
                onChange={(e) => setProposalSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setProposalFilter(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                    proposalFilter === status
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {status === 'all' ? 'All Proposals' : status}
                </button>
              ))}
            </div>
          </div>

          {/* Proposals List */}
          {submissionsLoading ? (
            <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 shadow-xs">
              <Loader2 className="w-8 h-8 text-purple-600 animate-spin mx-auto mb-2" />
              <p className="text-xs text-slate-500">Loading student project proposals...</p>
            </div>
          ) : filteredProposals.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <Lightbulb className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-700">No project proposals found</h3>
              <p className="text-xs text-slate-400">
                {proposalSearch || proposalFilter !== 'all'
                  ? 'No proposals matched your active search or filter.'
                  : 'Interns have not submitted any custom project proposals yet.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredProposals.map((prop) => {
                let parsedNotes: any = {};
                try {
                  parsedNotes = JSON.parse(prop.notes || '{}');
                } catch {
                  parsedNotes = { problemStatement: prop.notes };
                }

                const isPending = prop.status === 'pending';
                const isApproved = prop.status === 'approved';
                const isRejected = prop.status === 'rejected';

                return (
                  <div
                    key={prop.id}
                    className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-slate-300 transition-all space-y-4"
                  >
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-slate-900 text-sm">{prop.user_name || 'Student Intern'}</span>
                          <span className="text-xs text-slate-400">• {prop.user_email}</span>
                          <span className="text-xs text-slate-400">• {new Date(prop.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200">
                            {parsedNotes.domain?.toUpperCase() || 'CUSTOM DOMAIN'}
                          </span>
                          {parsedNotes.difficulty && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                              Target: {parsedNotes.difficulty} ({parsedNotes.duration || '4 weeks'})
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 border ${
                            isApproved
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                              : isRejected
                              ? 'bg-rose-50 text-rose-700 border-rose-300'
                              : 'bg-amber-50 text-amber-700 border-amber-300'
                          }`}
                        >
                          {isApproved && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                          {isPending && <Clock className="w-3.5 h-3.5 text-amber-600" />}
                          {isRejected && <AlertCircle className="w-3.5 h-3.5 text-rose-600" />}
                          <span>
                            {isApproved
                              ? `Approved (+${prop.points_awarded || 350} pts)`
                              : isRejected
                              ? 'Revisions Requested'
                              : 'Pending Review'}
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* Proposed Title & Problem */}
                    <div className="space-y-2">
                      <h3 className="text-base font-bold text-slate-900">{prop.project_title}</h3>
                      {parsedNotes.problemStatement && (
                        <div className="text-xs text-slate-700 leading-relaxed bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/70">
                          <span className="font-bold text-slate-900 block mb-1">Problem Statement & Scope:</span>
                          {parsedNotes.problemStatement}
                        </div>
                      )}
                    </div>

                    {/* Tech Stack & Deliverables */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {Array.isArray(parsedNotes.techStack) && parsedNotes.techStack.length > 0 && (
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1.5">
                          <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider block">
                            Key Tools & Tech Stack
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {parsedNotes.techStack.map((tech: string, i: number) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 text-[11px] font-medium"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {parsedNotes.targetDeliverables && (
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
                          <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider block">
                            Planned Deliverables
                          </span>
                          <p className="text-slate-600 text-[11px] leading-relaxed">
                            {parsedNotes.targetDeliverables}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Reference Link if provided */}
                    {prop.deliverable_url && prop.deliverable_url !== 'https://datacrumbs.org/proposal' && (
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-slate-500 font-semibold">Reference Link:</span>
                        <a
                          href={prop.deliverable_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-purple-700 hover:text-purple-900 font-bold hover:underline"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span className="truncate max-w-md">{prop.deliverable_url}</span>
                        </a>
                      </div>
                    )}

                    {/* Admin Feedback */}
                    {parsedNotes.adminFeedback && (
                      <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-200/80 text-xs text-purple-900 space-y-1">
                        <span className="font-bold block">Mentor Feedback / Review Notes:</span>
                        <p>{parsedNotes.adminFeedback}</p>
                      </div>
                    )}

                    {/* Review Actions */}
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 flex-wrap">
                      {isApproved ? (
                        <span className="text-xs text-emerald-700 font-bold flex items-center gap-1.5 py-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          Published to active project catalog
                        </span>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              setRejectingProposal(prop);
                              setRejectionFeedback(parsedNotes.adminFeedback || '');
                            }}
                            className="px-3.5 py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors cursor-pointer"
                          >
                            Request Revisions
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenApproveProposal(prop)}
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve & Add to Portal</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Proposal Approval Modal ── */}
      {approvingProposal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-[fadeIn_0.15s_ease-out]">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">Approve Custom Proposal</h3>
                  <p className="text-xs text-slate-500 font-medium">Publish as official project & award completion points</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setApprovingProposal(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 font-bold block text-[10px] uppercase tracking-wider mb-1">Proposal Title</span>
                <span className="text-slate-900 font-bold text-sm">{approvingProposal.project_title}</span>
                <span className="text-slate-500 block mt-0.5 font-medium">By {approvingProposal.user_name} ({approvingProposal.user_email})</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800">Assigned Difficulty</label>
                  <select
                    value={assignedDifficulty}
                    onChange={(e) => setAssignedDifficulty(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    <option value="Beginner">Beginner (3 weeks)</option>
                    <option value="Intermediate">Intermediate (4 weeks)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800">Completion Points</label>
                  <input
                    type="number"
                    value={assignedPoints}
                    onChange={(e) => setAssignedPoints(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                    placeholder="350"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-800">Mentor Approval Note (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Excellent scope. Focus on milestone 2 API validation."
                  value={adminFeedback}
                  onChange={(e) => setAdminFeedback(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setApprovingProposal(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isProcessingProposal}
                onClick={handleConfirmApproveProposal}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                {isProcessingProposal ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                <span>Confirm & Publish Project</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Proposal Revision / Reject Modal ── */}
      {rejectingProposal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-[fadeIn_0.15s_ease-out]">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center shrink-0 border border-rose-200">
                  <AlertCircle className="w-5 h-5 text-rose-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">Request Proposal Changes</h3>
                  <p className="text-xs text-slate-500 font-medium">Send mentor feedback to help the intern refine their scope</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setRejectingProposal(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-900 font-bold block">{rejectingProposal.project_title}</span>
                <span className="text-slate-500 font-medium">Intern: {rejectingProposal.user_name} ({rejectingProposal.user_email})</span>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-800">
                  Revision Guidance / Feedback <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Explain what needs to be changed (e.g., Narrow the scope down to 3 deliverables, clarify the database architecture, etc.)"
                  value={rejectionFeedback}
                  onChange={(e) => setRejectionFeedback(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setRejectingProposal(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isProcessingProposal || !rejectionFeedback.trim()}
                onClick={handleConfirmRejectProposal}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
              >
                {isProcessingProposal ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>Send Revision Request</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
